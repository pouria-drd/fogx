import z from "zod";
import { User } from "./user.types";
import { hotRoomSchema, joinRoomSchema } from "@/lib/validations";

export type Room = {
	id: string;
	owner: User;
	participants: User[];
	maxParticipants: number;
	ttl: number;
	createdAt: number;
};

export type HostRoomData = z.infer<typeof hotRoomSchema>;
export type JoinRoomData = z.infer<typeof joinRoomSchema>;
