"use client";

import { useMutation } from "@tanstack/react-query";

import { roomsApi } from "@/lib/api";
import { ApiClientError } from "@/lib/api";

/**
 * Hook to create a new room.
 */
function useRoom() {
	const { mutate: createRoom } = useMutation({
		mutationFn: () =>
			roomsApi.createRoom({
				username: "test",
			}),

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
