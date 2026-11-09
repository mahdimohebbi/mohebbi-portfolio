// Shared helpers for the /admin panel's serverless functions.
// Files starting with "_" in /api are not deployed as functions by Vercel.
//
// Required environment variables (Vercel → Project → Settings → Environment Variables):
//   ADMIN_PASSWORD  the password for mohebbi.top/admin
//   GITHUB_TOKEN    fine-grained token with "Contents: Read and write" on this repo
// Optional:
//   GITHUB_REPO     owner/name, defaults to mahdimohebbi/mohebbi-portfolio
//   GITHUB_BRANCH   defaults to main

import { createHmac, timingSafeEqual } from "node:crypto";

export const FILES = { works: "src/data/works.json", site: "src/data/site.json" };
export const IMAGE_DIR = "public/assets/images";
export const DOC_DIR = "public/assets/files";

const COOKIE = "admin_session";
const SESSION_SECONDS = 60 * 60 * 12;

const env = (name, fallback) => {
  const value = process.env[name] ?? fallback;
  if (!value) throw new HttpError(500, `Missing ${name} environment variable on Vercel.`);
  return value;
};

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...headers },
  });

/** Wraps a handler so thrown HttpErrors become JSON responses. */
export const handle = (fn) => async (request) => {
  try {
    return await fn(request);
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    if (status === 500) console.error(error);
    return json({ error: error.message || "Something went wrong." }, status);
  }
};

// --- Sessions: a signed, expiring cookie. Changing ADMIN_PASSWORD signs everyone out. ---

// The signing key mixes in GITHUB_TOKEN (long and random), so a copied cookie can't
// be used to guess the password offline.
const sessionKey = () => createHmac("sha256", env("GITHUB_TOKEN")).update(`admin-session:${env("ADMIN_PASSWORD")}`).digest();

const sign = (value) => createHmac("sha256", sessionKey()).update(value).digest("base64url");

const safeEqual = (a, b) => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
};

export const checkPassword = (password) => typeof password === "string" && safeEqual(password, env("ADMIN_PASSWORD"));

export const sessionCookie = () => {
  const expires = String(Math.floor(Date.now() / 1000) + SESSION_SECONDS);
  return `${COOKIE}=${expires}.${sign(expires)}; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
};

export const clearCookie = () => `${COOKIE}=; Path=/api/admin; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export const requireSession = (request) => {
  const cookies = Object.fromEntries(
    (request.headers.get("cookie") ?? "").split(/;\s*/).filter(Boolean).map((part) => {
      const index = part.indexOf("=");
      return [part.slice(0, index), part.slice(index + 1)];
    }),
  );
  const [expires, signature] = (cookies[COOKIE] ?? "").split(".");
  const valid = expires && signature && safeEqual(signature, sign(expires)) && Number(expires) > Date.now() / 1000;
  if (!valid) throw new HttpError(401, "Please sign in again.");
};

// --- GitHub ---

const repo = () => env("GITHUB_REPO", "mahdimohebbi/mohebbi-portfolio");
export const branch = () => env("GITHUB_BRANCH", "main");

export async function github(path, init = {}) {
  const response = await fetch(`https://api.github.com/repos/${repo()}${path}`, {
    ...init,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${env("GITHUB_TOKEN")}`,
      "x-github-api-version": "2022-11-28",
      "user-agent": "mohebbi-portfolio-admin",
      ...(init.body ? { "content-type": "application/json" } : {}),
    },
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error(`GitHub ${init.method ?? "GET"} ${path} -> ${response.status}: ${detail}`);
    throw new HttpError(502, `GitHub refused the request (${response.status}). Check GITHUB_TOKEN on Vercel.`);
  }
  return response.json();
}

/** Read one of FILES from GitHub at a branch or commit. */
export async function readFile(key, ref = branch()) {
  const file = await github(`/contents/${FILES[key]}?ref=${encodeURIComponent(ref)}`);
  return { data: JSON.parse(Buffer.from(file.content, "base64").toString("utf8")), sha: file.sha };
}

/** Store bytes as a Git blob; it only ships once a save commits it. */
export async function createBlob(base64) {
  const blob = await github("/git/blobs", { method: "POST", body: JSON.stringify({ content: base64, encoding: "base64" }) });
  return blob.sha;
}
