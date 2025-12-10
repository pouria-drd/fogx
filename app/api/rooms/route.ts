import { redis } from "@/lib/db";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	const body = await req.json();

	const roomId = nanoid();
	const { username } = body;

	await redis.hset(`meta:${roomId}`, {
		connected: [],
		createdAt: Date.now(),
	});

	return NextResponse.json({
		success: true,
		message: "Room created",
		statusCode: 201,
		result: {
			roomId,
			username,
		},
	});
}

// if (!username || username.length < 3) {
// 	return NextResponse.json(
// 		{
// 			success: false,
// 			message: "Validation error",
// 			statusCode: 400,
// 			errors: {
// 				username: [
// 					{
// 						message: "Username must be at least 3 characters",
// 						code: "USERNAME_TOO_SHORT",
// 					},
// 				],
// 			},
// 		},
// 		{ status: 400 },
// 	);
// }
