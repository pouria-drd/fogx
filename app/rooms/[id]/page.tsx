"use client";

import { useParams } from "next/navigation";

import { GridShape } from "@/components/common";
import { RoomNavbar } from "@/components/room";

function ChatRoom() {
	const params = useParams();
	const roomId = params.id as string;

	return (
		<main className="flex flex-col h-dvh relative">
			<GridShape />

			<RoomNavbar roomId={roomId} />

			<div className=" p-4">
				ChatRoom
				<h1>Room ID: {roomId}</h1>
			</div>
		</main>
	);
}

export default ChatRoom;
