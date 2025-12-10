import { nanoid } from "nanoid";

import { redis } from "@/lib/db";
import { HostRoomData, Room } from "@/types";

export class RoomRepository {
	static async createRoom(data: HostRoomData): Promise<Room | null> {
		try {
			const { username, minutes, maxParticipants } = data;

			const roomId = nanoid();
			const userId = nanoid();
			const roomTTLSeconds = minutes * 60;

			const room: Room = {
				id: roomId,

				owner: {
					id: userId,
					username,
				},

				maxParticipants,
				participants: [],
				onlineParticipants: [],

				ttl: roomTTLSeconds,
				createdAt: Date.now(),
			};

			await redis.hset(`meta:${roomId}`, {
				room: JSON.stringify(room),
			});

			await redis.expire(`meta:${roomId}`, roomTTLSeconds);

			return room;
		} catch (error: unknown) {
			if (process.env.NODE_ENV === "development") {
				console.error("Room Repository Error:", error);
			}

			return null;
		}
	}
}
