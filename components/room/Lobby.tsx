"use client";

import { useState } from "react";
import { RefreshCwIcon } from "lucide-react";

import { useRoom, useUsername } from "@/hooks";
import { MinutesSelect } from "./MinutesSelect";
import { Button, Card, CardContent, CardFooter, Label } from "@/components/ui";

export default function Lobby() {
	const [minutes, setMinutes] = useState(10);

	const { hostRoom } = useRoom();
	const { username, regenerateUsername } = useUsername();

	function handleCreateRoom() {
		hostRoom({ username, minutes });
	}

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardContent className="flex flex-col gap-6">
				{/* Username Section */}
				<div className="flex flex-col gap-2">
					<Label>Your Identity</Label>
					<div className="flex items-center justify-between bg-accent-foreground rounded-md px-3 py-2">
						<span className="text-secondary font-mono truncate">
							{username}
						</span>
						<div className="flex items-center gap-2">
							<Button
								size="icon-sm"
								variant="outline"
								onClick={regenerateUsername}
								title="Regenerate username">
								<RefreshCwIcon size={16} />
							</Button>
						</div>
					</div>
				</div>

				{/* Minutes Selection */}
				<div className="flex flex-col gap-2">
					<Label>Room Expiration Time</Label>
					<MinutesSelect value={minutes} onChange={setMinutes} />
				</div>
			</CardContent>

			{/* Create Room Button */}
			<CardFooter>
				<Button
					variant="default"
					className="w-full py-3 font-semibold"
					onClick={handleCreateRoom}>
					CREATE SECURE ROOM
				</Button>
			</CardFooter>
		</Card>
	);
}
