import type { BackendErrors } from "@/types";

export class ApiClientError<TFields extends string = string> extends Error {
	statusCode: number;
	errors: BackendErrors<TFields>;

	constructor(
		message: string,
		statusCode: number,
		errors: BackendErrors<TFields>,
	) {
		super(message);
		this.statusCode = statusCode;
		this.errors = errors;
	}
}
