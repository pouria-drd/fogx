import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { redis } from "@/lib/db";
import type {
	ApiSuccess,
	ApiError,
	HostRoomResponse,
	HostRoomData,
} from "@/types";

export async function POST(req: Request) {
	try {
		const body = (await req.json()) as HostRoomData;
		const { username, minutes } = body;

		// Validation
		const errors: ApiError<"username" | "minutes">["errors"] = {};

		if (!username || username.trim().length === 0) {
			errors.username = [
				{ message: "Username is required", code: "REQUIRED" },
			];
		}

		if (!minutes || minutes < 5 || minutes > 60) {
			errors.minutes = [
				{
					message: "Minutes must be between 5 and 60",
					code: "INVALID_RANGE",
				},
			];
		}

		// Return validation errors
		if (Object.keys(errors).length > 0) {
			const errorResponse: ApiError<"username" | "minutes"> = {
				success: false,
				statusCode: 400,
				message: "Validation failed",
				errors,
			};
			return NextResponse.json(errorResponse, { status: 400 });
		}

		const roomId = nanoid();
		const userId = nanoid();
		const roomTTLSeconds = minutes * 60;

		await redis.hset(`meta:${roomId}`, {
			id: roomId,

			owner: JSON.stringify({
				id: userId,
				username,
			}),

			maxParticipants: "10",
			participants: JSON.stringify([]),
			onlineParticipants: JSON.stringify([]),

			ttl: roomTTLSeconds,
			createdAt: Date.now(),
		});

		await redis.expire(`meta:${roomId}`, roomTTLSeconds);

		// Success response
		const successResponse: ApiSuccess<HostRoomResponse> = {
			success: true,
			statusCode: 201,
			message: "Room created successfully",
			result: {
				roomId,
			},
		};

		return NextResponse.json(successResponse, { status: 201 });
	} catch (error) {
		// Handle unexpected errors
		const errorResponse: ApiError = {
			success: false,
			statusCode: 500,
			message: "Internal server error",
			errors: {
				form: [
					{
						message:
							error instanceof Error
								? error.message
								: "Unknown error",
						code: "INTERNAL_ERROR",
					},
				],
			},
		};
		return NextResponse.json(errorResponse, { status: 500 });
	}
}
