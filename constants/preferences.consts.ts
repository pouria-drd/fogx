import { Theme } from "@/types";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";

export const THEMES: Theme[] = [
	{
		value: "light",
		tKey: "light",
		icon: SunIcon,
	},
	{
		value: "dark",
		tKey: "dark",
		icon: MoonIcon,
	},
	{
		value: "system",
		tKey: "system",
		icon: LaptopIcon,
	},
];
