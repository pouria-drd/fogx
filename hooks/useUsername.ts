"use client";

import { useEffect, useState } from "react";
import { generateUsername } from "@/lib/utils/user.utils";
import { USERNAME_STORAGE_KEY } from "@/constants/user.consts";

/**
 * Hook to generate and store a username.
 */
function useUsername() {
	const [username, setUsername] = useState("");

	// Generate the username on mount
	useEffect(() => {
		const handleGenerate = () => {
			const stored = localStorage.getItem(USERNAME_STORAGE_KEY);
			if (stored) {
				setUsername(stored);
				return;
			}
			const generatedUsername = generateUsername();
			localStorage.setItem(USERNAME_STORAGE_KEY, generatedUsername);
			setUsername(generatedUsername);
		};

		handleGenerate();
	}, []);

	/**
	 * Regenerate the username and store it in localStorage.
	 */
	function regenerateUsername() {
		const generatedUsername = generateUsername();
		localStorage.setItem(USERNAME_STORAGE_KEY, generatedUsername);
		setUsername(generatedUsername);
	}

	/**
	 * Save the username to the clipboard.
	 */
	function saveToClipboard() {
		if (username && window.navigator.clipboard) {
			window.navigator.clipboard.writeText(username);
			alert("Username copied to clipboard");
			return;
		}
		alert("Failed to copy to clipboard");
	}

	return {
		username,
		saveToClipboard,
		regenerateUsername,
	};
}

export default useUsername;
