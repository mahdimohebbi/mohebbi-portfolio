import { HttpError, WORKS_PATH, branch, github, handle, json, readWorks, requireSession } from "../_lib.js";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE = /^\/assets\/images\/[A-Za-z0-9_-]+\.(webp|png|jpe?g)$/;
const BLOCK_TYPES = new Set(["h", "p", "quote", "outcome", "wide", "pair"]);

/** Load the current works from GitHub (the source of truth, newer than the deployed copy). */
export const GET = handle(async (request) => {
  requireSession(request);
  return json(await readWorks());
});

/**
 * Save works plus any newly uploaded images as one commit on the branch.
 * Body: { works, sha, uploads: [{ path, sha }] } — `sha` is the works.json version the editor loaded.
 */
export const PUT = handle(async (request) => {
  requireSession(request);
  const { works, sha, uploads = [] } = await request.json();
  validate(works);

  const current = await readWorks();
  if (current.sha !== sha) {
    throw new HttpError(409, "Featured work was changed somewhere else since you opened the panel. Reload to get the latest version.");
  }

  const ref = await github(`/git/ref/heads/${encodeURIComponent(branch())}`);
  const head = await github(`/git/commits/${ref.object.sha}`);
  const usedImages = new Set(JSON.stringify(works).match(/\/assets\/images\/[A-Za-z0-9_.-]+/g) ?? []);
  const tree = await github("/git/trees", {
    method: "POST",
    body: JSON.stringify({
      base_tree: head.tree.sha,
      tree: [
        { path: WORKS_PATH, mode: "100644", type: "blob", content: JSON.stringify(works, null, 2) + "\n" },
        // Only commit uploads that are still used (an image may have been replaced before saving).
        ...uploads
          .filter((upload) => usedImages.has(upload.path.replace(/^public/, "")))
          .map((upload) => ({ path: upload.path, mode: "100644", type: "blob", sha: upload.sha })),
      ],
    }),
  });
  const commit = await github("/git/commits", {
    method: "POST",
    body: JSON.stringify({ message: "Update featured work from the admin panel", tree: tree.sha, parents: [head.sha] }),
  });
  await github(`/git/refs/heads/${encodeURIComponent(branch())}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha }),
  });

  return json({ ok: true, commit: commit.sha, ...(await readWorksAfter(commit.sha)) });
});

async function readWorksAfter(commitSha) {
  const file = await github(`/contents/${WORKS_PATH}?ref=${commitSha}`);
  return { sha: file.sha };
}

function validate(works) {
  const fail = (message) => {
    throw new HttpError(400, message);
  };
  if (!Array.isArray(works) || works.length === 0) fail("Add at least one work.");
  const slugs = new Set();
  works.forEach((work, index) => {
    const name = work?.title ? `"${work.title}"` : `Work #${index + 1}`;
    for (const field of ["title", "summary", "company", "role", "duration", "year"]) {
      if (typeof work[field] !== "string" || !work[field].trim()) fail(`${name}: ${field} is required.`);
    }
    if (!SLUG.test(work.slug ?? "")) fail(`${name}: the URL name may only use lowercase letters, numbers and dashes.`);
    if (slugs.has(work.slug)) fail(`${name}: another work already uses the URL name "${work.slug}".`);
    slugs.add(work.slug);
    if (!IMAGE.test(work.cover ?? "")) fail(`${name}: add a cover image.`);
    if (!IMAGE.test(work.logo ?? "")) fail(`${name}: add a company logo.`);
    if (!["feature", "stack", "reverse"].includes(work.homeLayout)) fail(`${name}: pick a home page layout.`);
    if (typeof work.visible !== "boolean") fail(`${name}: visible must be true or false.`);
    const study = work.caseStudy;
    if (!study || typeof study !== "object") fail(`${name}: case study details are missing.`);
    if (!Array.isArray(study.tools) || !Array.isArray(study.related) || !Array.isArray(study.blocks)) {
      fail(`${name}: case study details are incomplete.`);
    }
    study.blocks.forEach((block, blockIndex) => {
      if (!BLOCK_TYPES.has(block?.type)) fail(`${name}: content block ${blockIndex + 1} has an unknown type.`);
      if (block.type === "wide" && !IMAGE.test(block.src ?? "")) fail(`${name}: image block ${blockIndex + 1} has no image.`);
      if (block.type === "pair" && !(Array.isArray(block.srcs) && block.srcs.length === 2 && block.srcs.every((src) => IMAGE.test(src)))) {
        fail(`${name}: two-image block ${blockIndex + 1} needs both images.`);
      }
    });
  });
}
