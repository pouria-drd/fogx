import { NextRequest, NextResponse } from "next/server";

import { RoomRepository } from "@/lib/server/repositories";

export async function proxy(req: NextRequest) {
	const pathname = req.nextUrl.pathname;

	// Match /rooms/:roomId
	const roomMatch = pathname.match(/^\/rooms\/([^/]+)$/);

	// If not a room route, ignore (or let other middleware handle it)
	if (!roomMatch) return NextResponse.redirect(new URL("/", req.url));

	const roomId = roomMatch[1];

	// Check if Room Exists
	const room = await RoomRepository.getRoom(roomId);
	if (!room) {
		const url = req.nextUrl.clone();
		url.pathname = "/";
		url.searchParams.set("error", "room-not-found");
		return NextResponse.redirect(url);
	}

	const existingToken = req.cookies.get("x-auth-token")?.value;

	// Check if user can join room
	if (existingToken) {
		const user = room.participants.find((p) => p.id === existingToken);
		// User is allowed to join room
		if (user) {
			return NextResponse.next();
		}
	}

	// User is not allowed to join room
	const url = req.nextUrl.clone();
	url.pathname = "/";
	url.searchParams.set("error", "room-not-allowed");

	return NextResponse.redirect(url);
}

export const config = {
	matcher: "/rooms/:path*",
};
