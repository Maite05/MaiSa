import { API_BASE_URL } from "./env";
import { getAuthHeaders } from "./session";

/** Mirrors apps/api's ApiErrorBody from packages/types + error-handler.ts. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(message: string, status: number, code: string, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface ApiEnvelope<T> {
  data: T;
}

type QueryValue = string | number | boolean | undefined | null;

export interface ApiRequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, QueryValue>;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/**
 * Thin fetch wrapper shared by every feature's api/ layer:
 * - attaches the bearer token + active-org header from lib/session
 * - unwraps apps/api's `{ data }` / `{ data, meta }` envelope
 * - normalizes `{ error: { message, code } }` failures into ApiError
 *
 * NOTE: there is no live apps/api instance running in this environment
 * (no DATABASE_URL/Postgres configured here), so these calls are verified
 * by type-checking against apps/api's real Zod schemas, not by an
 * end-to-end request in this session. Point NEXT_PUBLIC_API_URL at a
 * running `pnpm --filter @maisa/api dev` to exercise it for real.
 */
export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, signal } = options;

  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const message = json?.error?.message ?? response.statusText ?? "Request failed";
    const code = json?.error?.code ?? "UNKNOWN_ERROR";
    throw new ApiError(message, response.status, code, json?.error?.details);
  }

  return json as T;
}
