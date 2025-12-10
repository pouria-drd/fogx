"use client";

import { CopyIcon, RefreshCwIcon } from "lucide-react";

import { useRoom, useUsername } from "@/hooks";
import { Button, Card, CardContent, CardFooter, Label } from "@/components/ui";

function Lobby() {
	const { createRoom } = useRoom();
	const { username, saveToClipboard, regenerateUsername } = useUsername();

	function handleCreateRoom() {
		createRoom(username);
	}

	return (
		<Card className="w-full max-w-sm">
			<CardContent>
				<div className="flex flex-col gap-2">
					<Label>Your Identity</Label>

					<div className="bg-accent-foreground text-secondary px-1.5 py-1.5 flex items-center justify-between gap-2">
						<span>{username}</span>

						<div className="space-x-2">
							<Button
								variant="outline"
								size={"icon-sm"}
								onClick={regenerateUsername}>
								<RefreshCwIcon />
							</Button>
							<Button
								variant="outline"
								size={"icon-sm"}
								onClick={saveToClipboard}>
								<CopyIcon />
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex-col gap-2">
				<Button
					variant="outline"
					className="w-full"
					onClick={handleCreateRoom}>
					CREATE SECURE ROOM
				</Button>
			</CardFooter>
		</Card>
	);
}

export default Lobby;
