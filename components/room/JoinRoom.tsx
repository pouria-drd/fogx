import { useState } from "react";

import Username from "./Username";
import { useJoinRoom, useUsername } from "@/hooks";

import {
	Button,
	Card,
	CardContent,
	CardFooter,
	Input,
	Label,
} from "@/components/ui";

interface Props {
	urlRoomId?: string | null;
}

function JoinRoom({ urlRoomId }: Props) {
	const { username } = useUsername();
	const { joinRoom, isPending } = useJoinRoom();

	const [roomId, setRoomId] = useState(urlRoomId ?? "");

	function handleJoinRoom() {
		joinRoom({ roomId, username });
	}

	return (
		<Card className="w-full">
			<CardContent className="flex flex-col gap-6">
				{/* Username Section */}
				<Username />

				{/* Room Settings Section */}
				<div className="flex flex-col gap-2">
					<div className="flex flex-col  gap-2">
						<Label>Room ID</Label>
						<Input
							type="text"
							className="w-full"
							value={roomId}
							onChange={(e) => setRoomId(e.target.value)}
						/>
					</div>
				</div>
			</CardContent>

			{/* Create Room Button */}
			<CardFooter>
				<Button
					disabled={isPending}
					variant="default"
					className="w-full py-3 font-semibold"
					onClick={handleJoinRoom}>
					{isPending ? "Joining room..." : "JOIN SECURE ROOM"}
				</Button>
			</CardFooter>
		</Card>
	);
}

export default JoinRoom;
