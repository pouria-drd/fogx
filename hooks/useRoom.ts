"use client";

import { useMutation } from "@tanstack/react-query";

import { RoomService } from "@/services";
import { ApiClientError } from "@/lib/api";

/**
 * Hook to create a new room.
 */
function useRoom() {
	const { mutate: createRoom } = useMutation({
		mutationFn: (username: string) => RoomService.createRoom({ username }),

		onError: (err) => {
			if (err instanceof ApiClientError) {
				console.log("API Error:", err.message);
				console.log("Status:", err.statusCode);
				console.log("Fields:", err.errors);
			} else {
				console.log("Unknown error", err);
			}
		},

		onSuccess: (room) => {
			console.log("Created Room:", room);
		},
	});

	return {
		createRoom,
	};
}

export default useRoom;
