import { ApiClientConfig, ApiResponse } from "@/types";

export class ApiClient {
	private config: ApiClientConfig;

	constructor(config: ApiClientConfig) {
		this.config = config;
	}

	/**
	 * Core fetch wrapper
	 */
	private async request<T>(
		endpoint: string,
		init?: RequestInit,
	): Promise<ApiResponse<T>> {
		const url = `${this.config.baseURL}${endpoint}`;

		// Merge headers
		const headers: HeadersInit = {
			"Content-Type": "application/json",
			...this.config.headers,
			...init?.headers,
		};

		// Inject Auth Token if exists
		if (this.config.getToken) {
			const token = this.config.getToken();
			if (token) {
				(headers as Record<string, string>)[
					"Authorization"
				] = `Bearer ${token}`;
			}
		}

		try {
			const response = await fetch(url, {
				...init,
				headers,
			});

			// Handle empty bodies (e.g. 204 No Content)
			if (response.status === 204) {
				return {
					success: true,
					statusCode: 204,
					message: "No Content",
					data: {} as T,
				};
			}

			const data = await response.json();

			// IMPORTANT: Ensure the runtime object satisfies BaseApi
			// If the backend doesn't explicitly send 'statusCode' in the body, we inject it here.
			const result = {
				...data,
				statusCode: data.statusCode ?? response.status,
			};

			return result as ApiResponse<T>;
		} catch (error) {
			this.logError("request", error);

			const errorResponse: ApiResponse<T> = {
				success: false,
				statusCode: 500,
				message: "Internal server error!",
				errors: {
					formErrors: ["Failed to process request!"],
					fieldErrors: {},
				},
			};

			return errorResponse;
		}
	}

	// --- Public Methods ---

	public get<T>(path: string, init?: RequestInit) {
		return this.request<T>(path, { ...init, method: "GET" });
	}

	public post<T>(path: string, body: unknown, init?: RequestInit) {
		return this.request<T>(path, {
			...init,
			method: "POST",
			body: JSON.stringify(body),
		});
	}

	public put<T>(path: string, body: unknown, init?: RequestInit) {
		return this.request<T>(path, {
			...init,
			method: "PUT",
			body: JSON.stringify(body),
		});
	}

	public patch<T>(path: string, body: unknown, init?: RequestInit) {
		return this.request<T>(path, {
			...init,
			method: "PATCH",
			body: JSON.stringify(body),
		});
	}

	public delete<T>(path: string, init?: RequestInit) {
		return this.request<T>(path, { ...init, method: "DELETE" });
	}

	private logError(method: string, error: unknown) {
		if (process.env.NODE_ENV === "development") {
			console.error(`ApiClient.${method}:`, error);
		}
	}
}

/**
 * Type Guard to check if response is successful.
 * This helps TypeScript strict mode know that 'result' exists.
 */
export function isApiSuccess<T>(response: ApiResponse<T>) {
	return response.success === true;
}

export const apiClient = new ApiClient({
	baseURL: "/api",
});
