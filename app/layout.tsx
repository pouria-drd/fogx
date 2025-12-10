import "./globals.css";

import type { Metadata } from "next";
import { PropsWithChildren } from "react";
import { JetBrains_Mono } from "next/font/google";

import { Toaster } from "@/components/ui";
import { ReactQueryProvider, ThemeProvider } from "@/components/context";

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
				<ReactQueryProvider>
					<ThemeProvider attribute="class" defaultTheme="system">
						{children}
						<Toaster position="top-center" />
					</ThemeProvider>
				</ReactQueryProvider>
			</body>
		</html>
	);
}

export default RootLayout;
