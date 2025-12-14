"use client";

import { ChangeEvent, useState } from "react";
import { RefreshCwIcon } from "lucide-react";

import { useRoom, useUsername } from "@/hooks";
import { MinutesSelect } from "./MinutesSelect";
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	Input,
	Label,
} from "@/components/ui";

export default function Lobby() {
	const [ttlMinutes, setTTLMinutes] = useState(10);
	const [maxParticipants, setMaxParticipants] = useState(2);

	const { hostRoom, isPending } = useRoom();
	const { username, regenerateUsername } = useUsername();

	function handleCreateRoom() {
		hostRoom({ username, ttlMinutes, maxParticipants });
	}

	function handleMaxParticipantsChange(e: ChangeEvent<HTMLInputElement>) {
		setMaxParticipants(Math.max(2, Math.min(10, Number(e.target.value))));
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

				<div className="flex flex-col gap-4">
					<Label>Room Settings</Label>

					<div className="flex flex-col gap-2">
						{/* Max Participants Selection */}
						<div className="flex flex-row justify-between gap-2">
							<Label>Max Participants</Label>
							<Input
								min={2}
								max={10}
								step={1}
								type="number"
								placeholder="2"
								className="w-fit"
								value={maxParticipants}
								onChange={handleMaxParticipantsChange}
							/>
						</div>

						{/* Minutes Selection */}
						<div className="flex flex-row justify-between gap-2">
							<Label>Expiration Time</Label>
							<MinutesSelect
								value={ttlMinutes}
								onChange={setTTLMinutes}
							/>
						</div>
					</div>
				</div>
			</CardContent>

			{/* Create Room Button */}
			<CardFooter>
				<Button
					disabled={isPending}
					variant="default"
					className="w-full py-3 font-semibold"
					onClick={handleCreateRoom}>
					{isPending ? "Creating room..." : "CREATE SECURE ROOM"}
				</Button>
			</CardFooter>
		</Card>
	);
}
