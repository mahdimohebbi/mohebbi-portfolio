import { HttpError, handle, json, requireSession } from "../_lib.js";

const ID = /(?:youtu\.be\/|v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/;

/**
 * Look up a YouTube video's title and thumbnail. The panel resizes the thumbnail
 * and uploads it like any image, so the site never loads images from YouTube
 * (its image servers are blocked on some networks). Body: { url }.
 * Returns { id, title, image } where image is a base64 JPEG.
 */
export const POST = handle(async (request) => {
  requireSession(request);
  const { url } = await request.json();
  const id = (typeof url === "string" && (url.match(ID)?.[1] ?? (/^[A-Za-z0-9_-]{11}$/.test(url.trim()) ? url.trim() : null))) || null;
  if (!id) throw new HttpError(400, "That doesn't look like a YouTube link.");

  const info = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`);
  if (!info.ok) throw new HttpError(404, "YouTube couldn't find that video. Is it public?");
  const { title } = await info.json();

  let image;
  for (const size of ["maxresdefault", "sddefault", "hqdefault"]) {
    const response = await fetch(`https://i.ytimg.com/vi/${id}/${size}.jpg`);
    if (response.ok) {
      image = Buffer.from(await response.arrayBuffer());
      break;
    }
  }
  if (!image) throw new HttpError(502, "Couldn't download the video thumbnail.");

  return json({ id, title, image: image.toString("base64") });
});
