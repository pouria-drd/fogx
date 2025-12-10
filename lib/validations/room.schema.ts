import z from "zod";
import { ANIMALS } from "@/constants/user.consts";

export const roomSchema = () => {
	return z.object({
		username: z
			.string()
			.regex(
				new RegExp(`^anonymous-(${ANIMALS.join("|")})-[A-Za-z0-9]{6}$`),
				"Invalid username format",
			),

		minutes: z.number().min(1).max(60),
	});
};
