const DEFAULT_API = "http://localhost:8002/api";

function resolveApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (envUrl) return envUrl;
  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_API_URL must be set in production.");
  }
  return DEFAULT_API;
}

export const API_URL = resolveApiUrl();

export const ASSET_BASE = API_URL.replace(/\/api\/?$/, "");

export function assetUrl(path: string): string {
  if (!path) return path;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${ASSET_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}
