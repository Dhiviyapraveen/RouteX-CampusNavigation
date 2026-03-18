export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, opts: { status: number; body: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = opts.status;
    this.body = opts.body;
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    throw new ApiError(`Request failed: ${res.status}`, {
      status: res.status,
      body,
    });
  }

  return body as T;
}

