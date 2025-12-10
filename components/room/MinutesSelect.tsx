"use client";

import { useState } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui";

export interface Props {
	value?: number; // controlled value
	onChange?: (minutes: number) => void;
	defaultValue?: number; // default value if none provided
}

export const MinutesSelect = ({
	value,
	onChange,
	defaultValue = 5, // default to 5 min
}: Props) => {
	const options = Array.from({ length: 12 }, (_, i) => (i + 1) * 5);

	// Internal state only used if value is uncontrolled
	const [internalValue, setInternalValue] = useState<number>(defaultValue);

	const selectedValue = value ?? internalValue;

	const handleChange = (val: string) => {
		const minutes = parseInt(val, 10);
		if (!value) setInternalValue(minutes); // update internal state if uncontrolled
		onChange?.(minutes);
	};

	return (
		<Select value={selectedValue.toString()} onValueChange={handleChange}>
			<SelectTrigger>
				<SelectValue placeholder="Select minutes" />
			</SelectTrigger>
			<SelectContent>
				{options.map((min) => (
					<SelectItem key={min} value={min.toString()}>
						{min} min
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};
