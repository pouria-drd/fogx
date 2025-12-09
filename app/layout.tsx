import "./globals.css";

import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { JetBrains_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/preferences";

const jetBrainsMono = JetBrains_Mono({
	variable: "--font-jet-brains-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "FogX",
		template: "%s | FogX",
	},
	description: "A private, self-destructing chat room.",
};

function RootLayout({ children }: Readonly<PropsWithChildren>) {
	return (
		<html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
			<body className={`${jetBrainsMono.variable} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="system">
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}

export default RootLayout;
