import z from "zod";
import { User } from "./user.types";
import { roomSchema } from "@/lib/validations";

export type HostRoomData = z.infer<ReturnType<typeof roomSchema>>;

export interface HostRoomResponse {
	roomId: string;
}

export type Room = {
	id: string;

	owner: User;

	participants: User[];
	maxParticipants: number;
	onlineParticipants?: User[];

	ttl: number;
	createdAt: number;
};
