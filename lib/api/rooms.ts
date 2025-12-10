import { apiClient } from "./client";
import { CreateRoomInput, CreateRoomResponse } from "@/types";

export const roomsApi = {
	createRoom: (data: CreateRoomInput) =>
		apiClient.post<CreateRoomResponse, CreateRoomInput>("/rooms", data),
};
