"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { RoomService } from "@/lib/client/services";
import type { ApiError, HostRoomData, Room } from "@/types";

/**
 * Hook to create a new room.
 */
function useRoom() {
	const router = useRouter();

	const { mutate: hostRoom, isPending } = useMutation<
		Room,
		ApiError,
		HostRoomData
	>({
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
			if (process.env.NODE_ENV === "development") {
				console.error("Validation errors:", err.errors);
			}
		},

		onSuccess: (room) => {
			// log room data in development
			if (process.env.NODE_ENV === "development") {
				console.log("Room Data:", room);
			}

			// Show success toast message
			toast.success("Room created successfully!");

			// Navigate to the room page
			router.push(`/rooms/${room.id}` as "/");
		},
	});

	return {
		hostRoom,
		isPending,
	};
}

export default useRoom;
