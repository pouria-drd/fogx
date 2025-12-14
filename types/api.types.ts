import z from "zod";

/**
 * Configuration options for the API client
 */
export interface ApiClientConfig {
	baseURL: string;
	headers?: HeadersInit;
	/** Optional: Callback to retrieve dynamic tokens (e.g. from localStorage) */
	getToken?: () => string | null;
}

interface BaseApiResponse {
	message: string;
	statusCode: number;
}

export type ServerValidationSuccess<T> = {
	success: true;
	data: T;
};

export type ServerValidationError<T> = {
	success: false;
	errors: z.ZodFlattenedError<T>;
};

export type ServerResult<T> =
	| ServerValidationSuccess<T>
	| ServerValidationError<T>;

/**
 * Generic API response type
 */
export type ApiResponse<T> = BaseApiResponse & ServerResult<T>;
