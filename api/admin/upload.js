import { randomBytes } from "node:crypto";
import { DOC_DIR, HttpError, IMAGE_DIR, createBlob, handle, json, requireSession } from "../_lib.js";

const TYPES = {
  "image/webp": [IMAGE_DIR, "webp"],
  "image/png": [IMAGE_DIR, "png"],
  "image/jpeg": [IMAGE_DIR, "jpg"],
  "application/pdf": [DOC_DIR, "pdf"],
};
// Vercel limits request bodies to 4.5 MB, and base64 adds a third.
const MAX_BYTES = 3.2 * 1024 * 1024;

/**
 * Store one file as a Git blob. It only becomes part of the site when content is
 * saved (PUT /api/admin/content), so abandoned uploads never ship.
 * Body: { type, data } where data is base64. Images were already resized in the browser.
 */
export const POST = handle(async (request) => {
  requireSession(request);
  const { type, data } = await request.json();
  const target = TYPES[type];
  if (!target || typeof data !== "string") throw new HttpError(400, "Upload a PNG, JPG or WebP image, or a PDF.");
  if (Buffer.byteLength(data, "base64") > MAX_BYTES) throw new HttpError(413, "This file is too large (max 3 MB).");

  const sha = await createBlob(data);
  const path = `${target[0]}/${randomBytes(9).toString("base64url")}.${target[1]}`;
  return json({ path, url: path.replace(/^public/, ""), sha });
});
