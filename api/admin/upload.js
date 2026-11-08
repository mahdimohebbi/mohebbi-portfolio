import { randomBytes } from "node:crypto";
import { HttpError, IMAGE_DIR, github, handle, json, requireSession } from "../_lib.js";

const TYPES = { "image/webp": "webp", "image/png": "png", "image/jpeg": "jpg" };
const MAX_BYTES = 3 * 1024 * 1024;

/**
 * Store one image as a Git blob. It only becomes part of the site when the
 * works are saved (PUT /api/admin/works), so abandoned uploads never ship.
 * Body: { type, data } where data is base64. The browser already resized it.
 */
export const POST = handle(async (request) => {
  requireSession(request);
  const { type, data } = await request.json();
  const extension = TYPES[type];
  if (!extension || typeof data !== "string") throw new HttpError(400, "Upload a PNG, JPG or WebP image.");
  if (Buffer.byteLength(data, "base64") > MAX_BYTES) throw new HttpError(413, "Image is too large even after resizing (max 3 MB).");

  const blob = await github("/git/blobs", { method: "POST", body: JSON.stringify({ content: data, encoding: "base64" }) });
  const path = `${IMAGE_DIR}/${randomBytes(9).toString("base64url")}.${extension}`;
  return json({ path, url: path.replace(/^public/, ""), sha: blob.sha });
});
