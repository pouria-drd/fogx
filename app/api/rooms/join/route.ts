import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

import { SESSION_NAME } from "@/constants";
import { RoomService } from "@/lib/server/services";
import type { ApiResponse, JoinRoomData, Room, User } from "@/types";

export async function POST(req: NextRequest) {
	try {
		const data = (await req.json()) as JoinRoomData;

		const token = req.cookies.get(SESSION_NAME)?.value ?? nanoid();

		const user: User = {
			id: token,
			username: data.username,
		};

		const result = await RoomService.joinRoom(data.roomId, user);

		if (result.success) {
			// Success response
			const successResponse: ApiResponse<Room> = {
				success: true,
				statusCode: 200,
				message: "Room joined successfully",
				data: result.data,
			};

			const response = NextResponse.json(successResponse, {
				status: 200,
			});

			response.cookies.set(SESSION_NAME, token, {
				path: "/",
				httpOnly: true,
				sameSite: "strict",
				secure: process.env.NODE_ENV === "production",
			});

			return response;
		}

		// Error response
		const errorResponse: ApiResponse<Room> = {
			success: false,
			statusCode: 400,
			message: "Failed to join room!",
			errors: result.errors,
		};

		return NextResponse.json(errorResponse, { status: 400 });
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("API.joinRoom:", error);
		}

		// Handle unexpected errors
		const errorResponse: ApiResponse<Room> = {
			success: false,
			statusCode: 500,
			message: "Internal server error!",
			errors: {
				formErrors: ["Failed to create room!"],
				fieldErrors: {},
			},
		};
		return NextResponse.json(errorResponse, { status: 500 });
	}
}
