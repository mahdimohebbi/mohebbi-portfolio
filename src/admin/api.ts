import type { Work } from "../data/content";

export class Unauthorized extends Error {}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/admin/${path}`, {
    ...init,
    headers: init?.body ? { "content-type": "application/json" } : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && path !== "login") throw new Unauthorized(data.error);
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status}).`);
  return data as T;
}

export type Upload = { path: string; url: string; sha: string };

export const api = {
  login: (password: string) => request("login", { method: "POST", body: JSON.stringify({ password }) }),
  logout: () => request("login", { method: "DELETE" }),
  load: () => request<{ works: Work[]; sha: string }>("works"),
  save: (works: Work[], sha: string, uploads: Upload[]) =>
    request<{ sha: string }>("works", { method: "PUT", body: JSON.stringify({ works, sha, uploads }) }),
  upload: (type: string, data: string) => request<Upload>("upload", { method: "POST", body: JSON.stringify({ type, data }) }),
};

/** Resize in the browser and re-encode as WebP so uploads stay small and the site stays fast. */
export async function prepareImage(file: File, maxWidth: number): Promise<{ type: string; data: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const encode = (type: string, quality?: number) =>
    new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not read this image."))), type, quality),
    );
  let blob = await encode("image/webp", 0.82);
  // Browsers without WebP encoding fall back to PNG; JPEG is much smaller for large photos.
  if (blob.type !== "image/webp" && maxWidth > 400) blob = await encode("image/jpeg", 0.85);

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
  return { type: blob.type, data: dataUrl.slice(dataUrl.indexOf(",") + 1) };
}
