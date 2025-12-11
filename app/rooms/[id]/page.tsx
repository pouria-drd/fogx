"use client";

import { useParams } from "next/navigation";

import { GridShape } from "@/components/common";
import { MessageInput, RoomHeader } from "@/components/room";

function ChatRoom() {
	const params = useParams();
	const roomId = params.id as string;

	return (
		<main className="flex flex-col h-dvh relative">
			<GridShape />

			{/* Room Navbar */}
			<RoomHeader roomId={roomId} />

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin w-full"></div>

			{/* Message Input */}
			<MessageInput />
		</main>
	);
}

export default ChatRoom;
