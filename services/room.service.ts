import { apiClient } from "@/lib/api";
import type { CreateRoomResponse, CreateRoomData } from "@/types";

export class RoomService {
	static async createRoom(data: CreateRoomData): Promise<CreateRoomResponse> {
		return apiClient.post<CreateRoomResponse, CreateRoomData>(
			"/rooms",
			data,
		);
	}
}
