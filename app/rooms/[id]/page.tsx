"use client";

import { useParams } from "next/navigation";

import { GridShape } from "@/components/common";
import { RoomNavbar } from "@/components/room";
import { SendIcon } from "lucide-react";
import { Button, Input } from "@/components/ui";

function ChatRoom() {
	const params = useParams();
	const roomId = params.id as string;

	return (
		<main className="flex flex-col h-dvh relative">
			<GridShape />

			{/* Room Navbar */}
			<RoomNavbar roomId={roomId} />

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin w-full"></div>

			{/* Message Input */}
			<div className="border-t bg-card/50 backdrop-blur-xl p-4">
				<div className="flex gap-4">
					<div className="flex-1 relative">
						<span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary animate-pulse">
							{">"}
						</span>
						<Input
							autoFocus
							type="text"
							// value={input}
							// onKeyDown={(e) => {
							// 	if (e.key === "Enter" && input.trim()) {
							// 		sendMessage({ text: input });
							// 		inputRef.current?.focus();
							// 	}
							// }}
							placeholder="Type message..."
							className="px-8 placeholder:text-xs text-sm"
							// onChange={(e) => setInput(e.target.value)}
						/>
					</div>

					<Button
						variant={"outline"}
						// onClick={() => {
						// 	sendMessage({ text: input });
						// 	inputRef.current?.focus();
						// }}
						// disabled={!input.trim() || isPending}
					>
						<SendIcon size={1} scale={0.5} />
					</Button>
				</div>
			</div>
		</main>
	);
}

export default ChatRoom;
