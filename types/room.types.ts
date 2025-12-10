import z from "zod";
import { roomSchema } from "@/lib/validations";

export type CreateRoomData = z.infer<ReturnType<typeof roomSchema>>;

export interface CreateRoomResponse {
	roomId: string;
	username: string;
}
