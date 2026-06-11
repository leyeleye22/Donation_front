import { assetUrl } from "@/lib/config";

export function resolveImageUrl(path: string): string {
  return assetUrl(path);
}
