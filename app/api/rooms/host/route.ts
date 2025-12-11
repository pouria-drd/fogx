import { NextResponse } from "next/server";

import { RoomRepository } from "@/repositories";
import type { ApiSuccess, ApiError, HostRoomData, Room } from "@/types";

export async function POST(req: Request) {
	try {
		const data = (await req.json()) as HostRoomData;

		const room = await RoomRepository.createRoom(data);

		if (room) {
			const owner = room.owner;
			const token = owner.id;

			// Success response
			const successResponse: ApiSuccess<Room> = {
				success: true,
				statusCode: 201,
				message: "Room created successfully",
				result: room,
			};

			const response = NextResponse.json(successResponse, {
				status: 201,
			});

			response.cookies.set("x-auth-token", token, {
				path: "/",
				httpOnly: true,
				sameSite: "strict",
				secure: process.env.NODE_ENV === "production",
			});

			return response;
		}

		// Error response
		const errorResponse: ApiError = {
			success: false,
			statusCode: 500,
			message: "Internal server error",
			errors: {
				form: [
					{
						message:
							"Failed to create room. Please try again later.",
						code: "INTERNAL_ERROR",
					},
				],
			},
		};

		return NextResponse.json(errorResponse, { status: 500 });
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

// // Validation
// const errors: ApiError<"username" | "minutes">["errors"] = {};

// if (!username || username.trim().length === 0) {
// 	errors.username = [{ message: "Username is required", code: "REQUIRED" }];
// }

// if (!minutes || minutes < 5 || minutes > 60) {
// 	errors.minutes = [
// 		{
// 			message: "Minutes must be between 5 and 60",
// 			code: "INVALID_RANGE",
// 		},
// 	];
// }

// // Return validation errors
// if (Object.keys(errors).length > 0) {
// 	const errorResponse: ApiError<"username" | "minutes"> = {
// 		success: false,
// 		statusCode: 400,
// 		message: "Validation failed",
// 		errors,
// 	};
// 	return NextResponse.json(errorResponse, { status: 400 });
// }
