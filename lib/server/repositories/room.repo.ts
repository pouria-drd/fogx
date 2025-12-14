import { nanoid } from "nanoid";
import { redis } from "@/lib/server/db";
import type { HostRoomData, Room, User } from "@/types";

export class RoomRepository {
	/**
	 * Creates a new room and stores it in Redis with a TTL.
	 *
	 * @param data Room creation data
	 * @returns The created Room or null on failure
	 */
	static async createRoom(data: HostRoomData): Promise<Room | null> {
		try {
			const { username, ttlMinutes, maxParticipants } = data;

			const roomId = nanoid();
			const owner: User = {
				id: nanoid(),
				username,
			};

			const createdAt = Date.now();
			const ttlSeconds = ttlMinutes * 60;
			const key = this.redisKeys.room(roomId);

			const roomHash = {
				id: roomId,
				owner: this.json.stringify(owner),
				participants: this.json.stringify([owner]),
				maxParticipants,
				ttl: ttlSeconds,
				createdAt,
			};

			/**
			 * Use pipeline to:
			 * - Store room metadata
			 * - Set expiration
			 *
			 * This reduces network roundtrips
			 * and keeps operations logically grouped.
			 */
			const pipeline = redis.pipeline();
			pipeline.hset(key, roomHash);
			pipeline.expire(key, ttlSeconds);
			await pipeline.exec();

			return {
				id: roomId,
				owner,
				participants: [owner],
				maxParticipants,
				ttl: ttlSeconds,
				createdAt,
			};
		} catch (error) {
			this.logError("createRoom", error);
			return null;
		}
	}

	/**
	 * Retrieves a room with parsed owner and participants.
	 *
	 * @param roomId Room identifier
	 * @returns Room or null if not found
	 */
	static async getRoom(roomId: string): Promise<Room | null> {
		try {
			const rawRoom = await this.getRawRoom(roomId);
			if (!rawRoom) return null;

			const owner = this.json.parse<User>(rawRoom.owner, {
				id: "",
				username: "",
			});
			if (!owner) return null;

			return {
				id: rawRoom.id,
				owner,
				participants: this.json.parse<User[]>(rawRoom.participants, []),
				maxParticipants: Number(rawRoom.maxParticipants),
				ttl: Number(rawRoom.ttl),
				createdAt: Number(rawRoom.createdAt),
			};
		} catch (error) {
			this.logError("getRoom", error);
			return null;
		}
	}

	/**
	 * Adds a user to a room.
	 *
	 * ⚠️ NOTE:
	 * This implementation is NOT atomic and may have race conditions
	 * under high concurrency.
	 *
	 * Recommended future improvement:
	 * - Use Redis transactions with WATCH
	 * - Or store participants in a Redis SET
	 *
	 * @param roomId Room identifier
	 * @param user User joining the room
	 * @returns Updated Room or null if join failed
	 */
	static async joinRoom(roomId: string, user: User): Promise<Room | null> {
		try {
			const key = this.redisKeys.room(roomId);
			const rawRoom = await this.getRawRoom(roomId);
			if (!rawRoom) return null;

			const participants = this.json.parse<User[]>(
				rawRoom.participants,
				[],
			);

			// Prevent duplicates
			if (participants.some((p) => p.id === user.id)) {
				return null;
			}

			// Check if room is full
			const maxParticipants = Number(rawRoom.maxParticipants);
			if (participants.length >= maxParticipants) {
				return null;
			}

			// Add new user to participants and save back to Redis
			participants.push(user);
			await redis.hset(key, {
				participants: this.json.stringify(participants),
			});

			return await this.getRoom(roomId);
		} catch (error) {
			this.logError("joinRoom", error);
			return null;
		}
	}

	/**
	 * Checks if a room exists.
	 */
	static async exists(roomId: string): Promise<boolean> {
		try {
			return (await redis.exists(this.redisKeys.room(roomId))) === 1;
		} catch {
			return false;
		}
	}

	/**
	 * Fetches raw room data from Redis.
	 * Returns null if the room does not exist.
	 */
	private static async getRawRoom(
		roomId: string,
	): Promise<Record<string, string> | null> {
		const raw = await redis.hgetall(this.redisKeys.room(roomId));
		return raw && Object.keys(raw).length > 0 ? raw : null;
	}

	/**
	 * Centralized error logger.
	 * Avoids repeating NODE_ENV checks everywhere.
	 */
	private static logError(method: string, error: unknown) {
		if (process.env.NODE_ENV === "development") {
			console.error(`RoomRepository.${method}:`, error);
		}
	}

	/**
	 * Helper functions for safe JSON handling.
	 */
	private static json = {
		parse<T>(value: unknown, fallback: T): T {
			if (typeof value !== "string") return fallback;
			try {
				return JSON.parse(value) as T;
			} catch {
				return fallback;
			}
		},
		stringify(value: unknown): string {
			return JSON.stringify(value);
		},
	};

	/**
	 * Redis key factory.
	 * Keeps all key formats in one place.
	 */
	private static redisKeys = {
		room: (id: string) => `rooms:${id}`,
	};
}
