"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { isApiSuccess } from "@/lib/client/api";
import { RoomService } from "@/lib/client/services";
import type { ApiResponse, JoinRoomData, Room } from "@/types";

/**
 * Hook to join a room.
 */
function useJoinRoom() {
	const router = useRouter();

	const { mutate: joinRoom, isPending } = useMutation<
		ApiResponse<Room>, // success value
		ApiResponse<Room>, // error value (thrown)
		JoinRoomData // variables
	>({
		// Mutation function returns ApiResponse<Room>
		mutationFn: (data) => RoomService.joinRoom(data),

		onError: (response) => {
			if (process.env.NODE_ENV === "development") {
				console.error("useJoinRoom.onError:", response);
			}

			if (!isApiSuccess(response)) {
				toast.error(response.errors.formErrors[0] || "Failed to join!");
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

			// if (process.env.NODE_ENV === "development") {
			// 	console.log("Room Data:", room);
			// }

			toast.success("Room joined successfully!");

			router.push(`/rooms/${room.id}` as "/");
		},
	});

	return {
		joinRoom,
		isPending,
	};
}

export default useJoinRoom;
