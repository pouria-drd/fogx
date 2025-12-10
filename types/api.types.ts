/**
 * A single backend error item
 */
export interface BackendErrorItem {
	message: string;
	code?: string;
}

/**
 * Backend errors keyed by form field names
 */
export type BackendErrors<TFields extends string = string> = Partial<
	Record<"form" | TFields, BackendErrorItem[]>
>;

export type BackendErrorInput =
	| BackendErrorItem
	| BackendErrorItem[]
	| string
	| null
	| undefined;

interface BaseApi {
	statusCode: number;
}

/**
 * Successful API response
 */
export interface ApiSuccess<T> extends BaseApi {
	success: true;
	message: string;
	result: T;
}

/**
 * Failed API response
 */
export interface ApiError<TFields extends string = string> extends BaseApi {
	success: false;
	message: string;
	errors: BackendErrors<TFields>;
}

/**
 * Generic API response type
 */
export type ApiResponse<T, TFields extends string = string> =
	| ApiSuccess<T>
	| ApiError<TFields>;
