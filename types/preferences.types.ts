import { ComponentType } from "react";

export type Theme = {
	value: ThemeType;
	tKey: string;
	icon: ComponentType<{ className?: string }>;
};

export type ThemeType = "light" | "dark" | "system";
