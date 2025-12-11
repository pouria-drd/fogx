import { nanoid } from "nanoid";
import { redis } from "@/lib/db";
import type { HostRoomData, Room, User } from "@/types";

const keys = {
	room: (id: string) => `rooms:${id}`,
};

export class RoomRepository {
	/**
	 * Creates a room, sets the owner, and defines TTL.
	 */
	static async createRoom(data: HostRoomData): Promise<Room | null> {
		try {
			const { username, minutes, maxParticipants } = data;

			const roomId = nanoid();
			const ownerId = nanoid();

			const now = Date.now();
			const ttlSeconds = minutes * 60;

			const owner: User = { id: ownerId, username };

			// Prepare Room Metadata
			// IMPORTANT: Redis only stores strings (or numbers).
			// We must JSON.stringify arrays and objects.
			const roomMeta = {
				id: roomId,
				owner: JSON.stringify(owner),

				participants: JSON.stringify([owner]),
				maxParticipants: maxParticipants,

				ttl: ttlSeconds,
				createdAt: now,
			};

			const pipeline = redis.pipeline();

			//  Store Metadata
			pipeline.hset(keys.room(roomId), roomMeta);
			pipeline.expire(keys.room(roomId), ttlSeconds);

			await pipeline.exec();

			return {
				id: roomId,
				owner,
				maxParticipants,
				participants: [owner],
				ttl: ttlSeconds,
				createdAt: now,
			};
		} catch (error) {
			if (process.env.NODE_ENV === "development") {
				console.error("RoomRepository.createRoom:", error);
			}
			return null;
		}
	}

	/**
	 * Retrieves full room details with all participants.
	 */
	static async getRoom(roomId: string): Promise<Room | null> {
		try {
			const metaKey = keys.room(roomId);

			// Fetch Meta
			const rawMeta = await redis.hgetall(metaKey);

			if (!rawMeta || Object.keys(rawMeta).length === 0) {
				return null;
			}

			// Safe Parsing: Owner
			// We check if it's a string to avoid crashing if Redis driver behavior changes
			const owner =
				typeof rawMeta.owner === "string"
					? (JSON.parse(rawMeta.owner) as User)
					: (rawMeta.owner as unknown as User);

			// FIX: Safe Parsing: Participants
			// We must parse the JSON string back into a User[]
			const participants: User[] =
				typeof rawMeta.participants === "string"
					? (JSON.parse(rawMeta.participants) as User[])
					: [];

			return {
				id: rawMeta.id,
				owner,

				participants,

				maxParticipants: Number(rawMeta.maxParticipants),

				ttl: Number(rawMeta.ttl),
				createdAt: Number(rawMeta.createdAt),
			};
		} catch (error) {
			if (process.env.NODE_ENV === "development") {
				console.error("RoomRepository.getRoom:", error);
			}
			return null;
		}
	}

	/**
	 * Adds a participant to the room safely.
	 * Handles JSON parsing and prevents duplicates.
	 */
	static async joinRoom(roomId: string, user: User): Promise<void> {
		try {
			const key = keys.room(roomId);

			// Fetch current participants string
			const rawParticipants = await redis.hget(key, "participants");

			// Parse existing list (or start empty)
			let participants: User[] = [];
			if (rawParticipants && typeof rawParticipants === "string") {
				participants = JSON.parse(rawParticipants);
			}

			// Check if room is full
			const maxParticipants = await redis.hget(key, "maxParticipants");
			if (participants.length >= Number(maxParticipants)) {
				return;
			}

			// Check if user already exists (prevent duplicates on refresh)
			const exists = participants.some((p) => p.id === user.id);
			if (exists) return;

			// Add new user
			participants.push(user);

			// Save back to Redis
			// Note: In high traffic, this has race conditions.
			await redis.hset(key, {
				participants: JSON.stringify(participants),
			});
		} catch (error) {
			if (process.env.NODE_ENV === "development") {
				console.error("RoomRepository.addParticipant:", error);
			}
		}
	}

	static async exists(roomId: string): Promise<boolean> {
		try {
			return (await redis.exists(keys.room(roomId))) === 1;
		} catch {
			return false;
		}
	}
}
