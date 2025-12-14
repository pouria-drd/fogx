"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import HostRoom from "./HostRoom";
import JoinRoom from "./JoinRoom";
import { RoomMode } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui";

function Lobby() {
	const searchParams = useSearchParams();

	// Get mode and optional roomId from URL
	const urlMode = searchParams.get("mode") as RoomMode | null;
	const urlRoomId = searchParams.get("roomId");

	// Default to "host" if invalid
	const [mode, setMode] = useState<RoomMode>(urlMode ? urlMode : "host");

	return (
		<Tabs
			value={mode} // controlled value
			onValueChange={(val) => setMode(val as RoomMode)}
			className="items-center justify-center w-full max-w-sm mx-auto">
			<TabsList className="grid grid-cols-2 mb-3 w-full">
				<TabsTrigger value="host" className="bg-black/60">
					Host Room
				</TabsTrigger>
				<TabsTrigger value="join" className="bg-black/60">
					Join Room
				</TabsTrigger>
			</TabsList>

			<TabsContent value="host" className="w-full">
				<HostRoom />
			</TabsContent>

			<TabsContent value="join" className="w-full">
				{/* Pass roomId to JoinRoom if exists */}
				<JoinRoom urlRoomId={urlRoomId} />
			</TabsContent>
		</Tabs>
	);
}

export default Lobby;
