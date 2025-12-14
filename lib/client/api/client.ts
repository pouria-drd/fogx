import { ApiClientConfig, ApiResponse, ApiSuccess, ApiError } from "@/types";

export class ApiClient {
	private config: ApiClientConfig;

	constructor(config: ApiClientConfig) {
		this.config = config;
	}

	/**
	 * Core fetch wrapper
	 */
	private async request<T, E extends string = string>(
		endpoint: string,
		init?: RequestInit,
	): Promise<ApiResponse<T, E>> {
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
					result: {} as T,
				};
			}

			const data = await response.json();

			// IMPORTANT: Ensure the runtime object satisfies BaseApi
			// If the backend doesn't explicitly send 'statusCode' in the body, we inject it here.
			const result = {
				...data,
				statusCode: data.statusCode ?? response.status,
			};

			return result as ApiResponse<T, E>;
		} catch (error) {
			// Handle Network Errors (offline, CORS, etc)
			return {
				success: false,
				statusCode: 0, // 0 usually denotes network error
				message:
					error instanceof Error ? error.message : "Network Error",
				errors: {
					form: [{ message: "Unable to connect to server" }],
				},
			} as ApiError<E>;
		}
	}

	// --- Public Methods ---

	public get<T, E extends string = string>(path: string, init?: RequestInit) {
		return this.request<T, E>(path, { ...init, method: "GET" });
	}

	public post<T, E extends string = string>(
		path: string,
		body: unknown,
		init?: RequestInit,
	) {
		return this.request<T, E>(path, {
			...init,
			method: "POST",
			body: JSON.stringify(body),
		});
	}

	public put<T, E extends string = string>(
		path: string,
		body: unknown,
		init?: RequestInit,
	) {
		return this.request<T, E>(path, {
			...init,
			method: "PUT",
			body: JSON.stringify(body),
		});
	}

	public patch<T, E extends string = string>(
		path: string,
		body: unknown,
		init?: RequestInit,
	) {
		return this.request<T, E>(path, {
			...init,
			method: "PATCH",
			body: JSON.stringify(body),
		});
	}

	public delete<T, E extends string = string>(
		path: string,
		init?: RequestInit,
	) {
		return this.request<T, E>(path, { ...init, method: "DELETE" });
	}
}

/**
 * Type Guard to check if response is successful.
 * This helps TypeScript strict mode know that 'result' exists.
 */
export function isApiSuccess<T, E extends string>(
	response: ApiResponse<T, E>,
): response is ApiSuccess<T> {
	return response.success === true;
}

export const apiClient = new ApiClient({
	baseURL: "/api",
});
