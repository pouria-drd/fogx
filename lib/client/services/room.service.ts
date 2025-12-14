import { apiClient } from "@/lib/client/api";
import type { Room, HostRoomData, ApiResponse } from "@/types";

export class RoomService {
	/**
	 * Creates a host room.
	 *
	 * Returns ApiResponse<Room> on success
	 * Throws ApiResponse<Room> on failure
	 * (Required for React Query error handling)
	 */
	static async hostRoom(data: HostRoomData): Promise<ApiResponse<Room>> {
		const response = await apiClient.post<Room>("/rooms/host", data);

		if (response.success) {
			return response;
		}

		// IMPORTANT:
		// React Query detects errors ONLY via thrown values
		throw response;
	}
}
