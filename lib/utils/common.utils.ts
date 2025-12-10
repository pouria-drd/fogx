import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import packageJson from "../../package.json";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Get the current application version.
 * @returns The current application version.
 */
export function getAppVersion() {
	return packageJson.version || "0.1.0";
}

/**
 * Check if the current path is active for the given link
 * @param currentPath - The current path
 * @param linkPath - The path of the link
 * @returns true if the current path is active for the given link, false otherwise
 */
export function isLinkActive(currentPath: string, linkPath: string): boolean {
	const result: boolean =
		currentPath === linkPath ||
		(linkPath !== "/admin" && currentPath === `${linkPath}/`);

	return result;
}

/**
 * Format time remaining in seconds to mm:ss format
 * @param seconds - The number of seconds
 * @returns The formatted time remaining
 */
export function formatTimeRemaining(seconds: number) {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}
