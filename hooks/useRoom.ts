"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { RoomService } from "@/services";
import type { ApiError, HostRoomData, HostRoomResponse } from "@/types";

/**
 * Hook to create a new room.
 */
function useRoom() {
	const {
		mutate: hostRoom,
		isPending,
		error,
	} = useMutation<HostRoomResponse, ApiError, HostRoomData>({
		// Pass the data argument to the service
		mutationFn: (data) => RoomService.hostRoom(data),

		onError: (err) => {
			// 'err' is automatically typed as ApiError here

			// 1. Show main toast message
			toast.error(err.message || "Failed to create room");

			// 2. Handle detailed form errors (Optional)
			// If you have specific fields like 'name' or 'capacity'
			if (err.errors?.form) {
				err.errors.form.forEach((e) =>
					toast.error(`Form Error: ${e.message}`),
				);
			}

			// Example: Log specific validation errors
			console.error("Validation errors:", err.errors);
		},

		onSuccess: (room) => {
			// 'room' is typed as HostRoomResponse
			toast.success("Room created successfully!");
			console.log("Room ID:", room.roomId); // assuming room has an id
		},
	});

	return {
		hostRoom,
		isPending,
		error,
	};
}

export default useRoom;
