import z from "zod";
import { ANIMALS } from "@/constants/user.consts";

export const hotRoomSchema = () => {
	return z.object({
		username: z
			.string()
			.regex(
				new RegExp(`^anonymous-(${ANIMALS.join("|")})-[A-Za-z0-9]{6}$`),
				"Invalid username format",
			),

		minutes: z.number().min(1).max(60),
		maxParticipants: z.number().min(2).max(10),
	});
};

export const joinRoomSchema = () => {
	return z.object({
		roomId: z.string(),
		username: z
			.string()
			.regex(
				new RegExp(`^anonymous-(${ANIMALS.join("|")})-[A-Za-z0-9]{6}$`),
				"Invalid username format",
			),
	});
};
