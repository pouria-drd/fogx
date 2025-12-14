import z from "zod";
import { ANIMALS } from "@/constants/user.consts";

const usernameSchema = z
	.string()
	.regex(
		new RegExp(`^anonymous-(${ANIMALS.join("|")})-[A-Za-z0-9]{6}$`),
		"Invalid username format",
	);

export const hotRoomSchema = z.object({
	username: usernameSchema,

	ttlMinutes: z.number().min(1).max(60),
	maxParticipants: z.number().min(2).max(10),
});

export const joinRoomSchema = z.object({
	roomId: z.string(),
	username: usernameSchema,
});
