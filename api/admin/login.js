import { HttpError, checkPassword, clearCookie, handle, json, sessionCookie } from "../_lib.js";

export const POST = handle(async (request) => {
  const { password } = await request.json().catch(() => ({}));
  if (!checkPassword(password)) {
    // Slow down password guessing.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    throw new HttpError(401, "Wrong password.");
  }
  return json({ ok: true }, 200, { "set-cookie": sessionCookie() });
});

export const DELETE = handle(async () => json({ ok: true }, 200, { "set-cookie": clearCookie() }));
