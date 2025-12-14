"use client";

import { ChangeEvent, useState } from "react";

import Username from "./Username";
import { useHostRoom, useUsername } from "@/hooks";
import { MinutesSelect } from "./MinutesSelect";
import {
	Button,
	Card,
	CardContent,
	CardFooter,
	Input,
	Label,
} from "@/components/ui";

function HostRoom() {
	const { username } = useUsername();

	// Room Settings
	const [ttlMinutes, setTTLMinutes] = useState(10);
	const [maxParticipants, setMaxParticipants] = useState(2);

	const { hostRoom, isPending } = useHostRoom();

	function handleCreateRoom() {
		hostRoom({ username, ttlMinutes, maxParticipants });
	}

	function handleMaxParticipantsChange(e: ChangeEvent<HTMLInputElement>) {
		setMaxParticipants(Math.max(2, Math.min(10, Number(e.target.value))));
	}

	return (
		<Card className="w-full">
			<CardContent className="flex flex-col gap-6">
				{/* Username Section */}
				<Username />

				{/* Room Settings Section */}
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

export default HostRoom;
