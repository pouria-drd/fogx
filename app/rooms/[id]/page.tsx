"use client";

import { useParams } from "next/navigation";

function ChatRoom() {
	const params = useParams();
	const roomId = params.id as string;

	return (
		<div>
			ChatRoom
			<h1>Room ID: {roomId}</h1>
		</div>
	);
}

export default ChatRoom;
