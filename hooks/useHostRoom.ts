"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { isApiSuccess } from "@/lib/client/api";
import { RoomService } from "@/lib/client/services";
import type { ApiResponse, HostRoomData, Room } from "@/types";

/**
 * Hook to create a new room.
 */
function useHostRoom() {
	const router = useRouter();

	const { mutate: hostRoom, isPending } = useMutation<
		ApiResponse<Room>, // success value
		ApiResponse<Room>, // error value (thrown)
		HostRoomData // variables
	>({
		// Mutation function returns ApiResponse<Room>
		mutationFn: (data) => RoomService.hostRoom(data),

		onError: (response) => {
			if (process.env.NODE_ENV === "development") {
				console.error("useJoinRoom.onError:", response);
			}

			if (!isApiSuccess(response)) {
				toast.error(
					response.errors.formErrors[0] || "Failed to create room!",
				);
				return;
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

export default useHostRoom;
