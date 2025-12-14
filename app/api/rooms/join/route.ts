import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { RoomRepository } from "@/lib/server/repositories";
import type { ApiSuccess, ApiError, JoinRoomData, User } from "@/types";

export async function POST(req: Request) {
	try {
		const data = (await req.json()) as JoinRoomData;

		const room = await RoomRepository.getRoom(data.roomId);

		if (!room) {
			// Error response
			const errorResponse: ApiError = {
				success: false,
				statusCode: 404,
				message: "Room not found",
				errors: {
					form: [
						{
							message: "Room not found",
							code: "NOT_FOUND",
						},
					],
				},
			};

			return NextResponse.json(errorResponse, { status: 404 });
		}

		const user = {
			id: nanoid(),
			username: data.username,
		};

		// Check if room is full
		const maxParticipants = room.maxParticipants;
		if (room.participants.length >= maxParticipants) {
			// Error response
			const errorResponse: ApiError = {
				success: false,
				statusCode: 400,
				message: "Room is full",
				errors: {
					form: [
						{
							message: "Room is full",
							code: "ROOM_FULL",
						},
					],
				},
			};

			return NextResponse.json(errorResponse, { status: 403 });
		}

		await RoomRepository.joinRoom(room.id, user);

		// Success response
		const successResponse: ApiSuccess<User> = {
			success: true,
			statusCode: 200,
			message: "Room joined successfully",
			result: user,
		};

		return NextResponse.json(successResponse, { status: 200 });
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
