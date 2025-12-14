import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
	title: "Lobby",
	description: "A private, self-destructing chat room.",
};

function LobbyLayout({ children }: PropsWithChildren) {
	return children;
}

export default LobbyLayout;
