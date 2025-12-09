import { nanoid } from "nanoid";
import { ANIMALS } from "@/constants/user.consts";

/**
 * Generate a random username based on the animals in the ANIMALS array and a randomly generated ID.
 * @param idLength - The length of the generated ID.
 * @returns The generated username.
 */
export const generateUsername = (idLength = 6) => {
	// Get a random animal from the ANIMALS array
	const word = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
	// Generate a random ID using nanoid
	const id = nanoid(idLength);
	// Combine the animal and ID to create the username
	const username = `anonymous-${word}-${id}`;
	return username;
};
