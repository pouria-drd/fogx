import z from "zod";

import { hotRoomSchema } from "@/lib/validations";
import { RoomRepository } from "@/lib/server/repositories";
import type {
	HostRoomData,
	Room,
	ServerResult,
	ServerValidationError,
	ServerValidationSuccess,
	User,
} from "@/types";

export class RoomService {
	/**
	 * Creates a room after validating input.
	 *
	 * Responsibilities:
	 * - Validate incoming data (schema-level)
	 * - Delegate persistence to repository
	 * - Translate low-level failures into user-friendly errors
	 */
	static async createRoom(data: HostRoomData): Promise<ServerResult<Room>> {
		try {
			// Validate incoming payload
			const result = this.validate(hotRoomSchema, data);
			if (!result.success) {
				return {
					success: false,
					errors: result.errors,
				};
			}

			// Create room via repository
			const room = await RoomRepository.createRoom(data);

			// Check if room was created successfully (Redis error, pipeline failure, etc.)
			if (!room) {
				return {
					success: false,
					errors: {
						fieldErrors: {},
						formErrors: ["Failed to create room!"],
					},
				};
			}

			return {
				data: room,
				success: true,
			};
		} catch (error) {
			this.logError("createRoom", error);

			return {
				success: false,
				errors: {
					fieldErrors: {},
					formErrors: ["Failed to create room!"],
				},
			};
		}
	}

	/**
	 * Adds a user to an existing room.
	 *
	 * Responsibilities:
	 * - Validate room existence
	 * - Enforce business rules (capacity, duplicates)
	 * - Delegate mutation to repository
	 */
	static async joinRoom(
		roomId: string,
		user: User,
	): Promise<ServerResult<Room>> {
		try {
			// Fetch room
			const roomExists = await RoomRepository.getRoom(roomId);

			// Room not found or expired
			if (!roomExists) {
				return {
					success: false,
					errors: {
						fieldErrors: {},
						formErrors: ["Room not found!"],
					},
				};
			}

			// Prevent duplicate joins
			if (roomExists.participants.some((p) => p.id === user.id)) {
				return {
					success: false,
					errors: {
						fieldErrors: {},
						formErrors: ["You are already in this room!"],
					},
				};
			}

			// Enforce room capacity
			if (roomExists.participants.length >= roomExists.maxParticipants) {
				return {
					success: false,
					errors: {
						fieldErrors: {},
						formErrors: ["Room is full!"],
					},
				};
			}

			// Add user to room
			const room = await RoomRepository.joinRoom(roomId, user);

			// Check if room was joined successfully (Redis error, pipeline failure, etc.)
			if (!room) {
				return {
					success: false,
					errors: {
						fieldErrors: {},
						formErrors: ["Failed to join room!"],
					},
				};
			}

			return {
				data: room,
				success: true,
			};
		} catch (error) {
			this.logError("joinRoom", error);

			return {
				success: false,
				errors: {
					fieldErrors: {},
					formErrors: ["Failed to join room!"],
				},
			};
		}
	}

	/**
	 * Validates input data using Zod.
	 *
	 * Purpose:
	 * - Centralize schema validation logic
	 * - Normalize success / error shapes
	 * - Keep controllers thin
	 */
	private static validate<T extends z.ZodTypeAny>(
		schema: T,
		data: z.infer<T>,
	): ServerValidationSuccess<z.infer<T>> | ServerValidationError<z.infer<T>> {
		/**
		 * safeParse:
		 * - Never throws
		 * - Returns structured success/error result
		 */
		const result = schema.safeParse(data);

		// Validation failed → return flattened field/form errors
		if (!result.success) {
			return {
				success: false,
				errors: z.flattenError(result.error),
			};
		}

		// Validation passed → return parsed data
		return {
			success: true,
			data: result.data,
		};
	}

	/**
	 * Centralized error logger for service layer.
	 *
	 * Benefits:
	 * - No console noise in production
	 * - Consistent log format
	 * - Easy future replacement (Sentry, Datadog, etc.)
	 */
	private static logError(method: string, error: unknown) {
		if (process.env.NODE_ENV === "development") {
			console.error(`ServerRoomService.${method}:`, error);
		}
	}
}
