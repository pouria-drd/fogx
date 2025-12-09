import "./globals.css";

import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { JetBrains_Mono } from "next/font/google";

const jetBrainsMono = JetBrains_Mono({
	variable: "--font-jet-brains-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "FogX",
	description: "A high-security, real-time chat application.",
};

function RootLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<html lang="en">
			<body className={`${jetBrainsMono.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}

export default RootLayout;
