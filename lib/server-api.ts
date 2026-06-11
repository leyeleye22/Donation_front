import { API_URL } from "@/lib/config";

export async function fetchPublic<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch (e) {
    console.error(`fetchPublic ${path}:`, e);
    return null;
  }
}
