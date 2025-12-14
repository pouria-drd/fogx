import { apiClient } from "@/lib/client/api";
import type { Room, HostRoomData, ApiResponse, JoinRoomData } from "@/types";

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

	/**
	 * Joins a room.
	 *
	 * Returns ApiResponse<Room> on success
	 * Throws ApiResponse<Room> on failure
	 * (Required for React Query error handling)
	 */
	static async joinRoom(data: JoinRoomData): Promise<ApiResponse<Room>> {
		const response = await apiClient.post<Room>("/rooms/join", data);

		if (response.success) {
			return response;
		}

		// IMPORTANT:
		// React Query detects errors ONLY via thrown values
		throw response;
	}
}
