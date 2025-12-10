import { ApiClientError } from "./ApiClientError";
import type { ApiResponse, ApiSuccess, ApiError } from "@/types";

export class APIClient {
	constructor(private baseURL: string = "/api") {}

	private async parseJson<T>(res: Response): Promise<ApiResponse<T>> {
		try {
			return await res.json();
		} catch {
			throw new ApiClientError(
				"Invalid JSON response from server",
				res.status,
				{},
			);
		}
	}

	async request<T, TBody = undefined>(
		path: string,
		options?: {
			method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
			body?: TBody;
			headers?: Record<string, string>;
		},
	): Promise<T> {
		try {
			const res = await fetch(`${this.baseURL}${path}`, {
				method: options?.method ?? "GET",
				headers: {
					"Content-Type": "application/json",
					...(options?.headers || {}),
				},
				body: options?.body ? JSON.stringify(options.body) : undefined,
			});

			// Handle HTTP errors
			if (!res.ok) {
				let json: Partial<ApiError> | null = null;
				try {
					json = await res.json();
				} catch {
					// Ignore JSON parse errors
				}
				throw new ApiClientError(
					json?.message || res.statusText || "HTTP error",
					res.status,
					json?.errors || {},
				);
			}

			const json = await this.parseJson<T>(res);

			if (!json.success) {
				const err = json as ApiError;
				throw new ApiClientError(
					err.message,
					err.statusCode,
					err.errors,
				);
			}

			return (json as ApiSuccess<T>).result;
		} catch (err: unknown) {
			if (process.env.NODE_ENV === "development") {
				console.error("API Client Error:", err);
			}

			if (err instanceof ApiClientError) {
				throw err;
			}
			if (err instanceof Error) {
				// Network error or unexpected error
				throw new ApiClientError(err.message, 0, {});
			}
			throw new ApiClientError("Unknown error occurred", 0, {});
		}
	}

	get<T>(path: string) {
		return this.request<T>(path);
	}

	post<T, TBody>(path: string, body: TBody) {
		return this.request<T, TBody>(path, { method: "POST", body });
	}

	put<T, TBody>(path: string, body: TBody) {
		return this.request<T, TBody>(path, { method: "PUT", body });
	}

	patch<T, TBody>(path: string, body: TBody) {
		return this.request<T, TBody>(path, { method: "PATCH", body });
	}

	delete<T>(path: string) {
		return this.request<T>(path, { method: "DELETE" });
	}
}

export const apiClient = new APIClient("/api");
