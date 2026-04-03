export async function apiFetch<T>(
  path: string,
  options?: RequestInit & { jsonBody?: unknown },
) {
  const url = path.startsWith("/") ? path : `/${path}`;

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options?.headers ?? {}),
      ...(options?.jsonBody !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
    },
    body:
      options?.jsonBody !== undefined
        ? JSON.stringify(options.jsonBody)
        : options?.body,
  });

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    if (typeof payload === "object" && payload && "message" in payload) {
      const maybeMessage = (payload as { message?: unknown }).message;
      if (typeof maybeMessage === "string") message = maybeMessage;
    }
    throw new Error(message);
  }

  return payload as T;
}

