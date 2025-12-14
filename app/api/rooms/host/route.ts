import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

import { SESSION_NAME } from "@/constants";
import { RoomService } from "@/lib/server/services";
import type { ApiResponse, HostRoomData, Room } from "@/types";

export async function POST(req: NextRequest) {
	try {
		const token = req.cookies.get(SESSION_NAME)?.value ?? nanoid();

		const data = (await req.json()) as HostRoomData;

		const result = await RoomService.createRoom(data, token);

		if (result.success) {
			const room = result.data;

			// Success response
			const successResponse: ApiResponse<Room> = {
				success: true,
				statusCode: 201,
				message: "Room created successfully",
				data: room,
			};

			const response = NextResponse.json(successResponse, {
				status: 201,
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
			message: "Invalid data!",
			errors: result.errors,
		};

		return NextResponse.json(errorResponse, { status: 400 });
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("API.hostRoom:", error);
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
