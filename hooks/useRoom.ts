"use client";

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { isApiSuccess } from "@/lib/client/api";
import { RoomService } from "@/lib/client/services";
import type { ApiResponse, HostRoomData, Room } from "@/types";

/**
 * Hook to create a new room.
 */
function useRoom() {
	const router = useRouter();

	const { mutate: hostRoom, isPending } = useMutation<
		ApiResponse<Room>, // success value
		ApiResponse<Room>, // error value (thrown)
		HostRoomData // variables
	>({
		// Mutation function returns ApiResponse<Room>
		mutationFn: (data) => RoomService.hostRoom(data),

		onError: (err) => {
			toast.error(err.message || "Failed to create room");

			if (process.env.NODE_ENV === "development") {
				console.error("useRoom.onError:", err);
			}
		},

		onSuccess: (response) => {
			if (!isApiSuccess(response)) {
				toast.error(response.message);
				return;
			}

			// Extract room from API response
			const room = response.data;

			if (!room) {
				toast.error("Invalid room data received");
				return;
			}

			if (process.env.NODE_ENV === "development") {
				console.log("Room Data:", room);
			}

			toast.success("Room created successfully!");

			router.push(`/rooms/${room.id}` as "/");
		},
	});

	return {
		hostRoom,
		isPending,
	};
}

export default useRoom;
