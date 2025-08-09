"use client";

import { useSession } from "@clerk/nextjs";

export const useAuthFetch = () => {
  const { session } = useSession();

  const authFetch = async <T = unknown>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
    const url = `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

    const token = await session?.getToken();
    if (!token) throw new Error("No token found");

    const headers = new Headers(options.headers ?? {});
    headers.set("Authorization", `Bearer ${token}`);

    // Auto-set JSON header if body is plain object/string and not FormData
    const hasBody = options.body !== undefined && options.body !== null;
    const isFormData = hasBody && options.body instanceof FormData;
    const isString = hasBody && typeof options.body === "string";
    let body: BodyInit | undefined = options.body as BodyInit | undefined;
    if (hasBody && !isFormData && !isString) {
      if (!headers.has("Content-Type"))
        headers.set("Content-Type", "application/json");
      body = JSON.stringify(options.body);
    }

    const res = await fetch(url, { ...options, headers, body });
    if (!res.ok) {
      let detail: string | undefined;
      try {
        const err = await res.json();
        detail = err?.message || err?.error;
      } catch {
        try {
          detail = await res.text();
        } catch {
          // ignore
        }
      }
      throw new Error(detail || `HTTP ${res.status} ${res.statusText}`);
    }

    return (await res.json()) as T;
  };

  return authFetch;
};
