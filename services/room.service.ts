import { apiClient } from "@/lib/api";
import type { Room, HostRoomData } from "@/types";

export class RoomService {
	/**
	 * Creates a host room.
	 * Throws ApiError if the request fails.
	 */
	static async hostRoom(data: HostRoomData): Promise<Room> {
		// 1. Call the API
		// We can define specific error fields if known, e.g., 'title' | 'date'
		const response = await apiClient.post<
			Room,
			keyof HostRoomData // 'keyof' is used to extract the error fields
		>("/rooms/host", data);

		// 2. Handle the Result Pattern
		if (response.success) {
			return response.result;
		}

		// 3. IMPORTANT: Throw the error object so React Query detects the failure
		throw response;
	}
}
