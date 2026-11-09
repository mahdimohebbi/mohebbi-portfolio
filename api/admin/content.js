import { FILES, HttpError, branch, github, handle, json, readFile, requireSession } from "../_lib.js";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE = /^\/assets\/(images|videos|social)\/[A-Za-z0-9_.-]+\.(webp|png|jpe?g|svg)$/;
const BLOCK_TYPES = new Set(["h", "p", "quote", "outcome", "wide", "pair"]);
const SECTION_TYPES = new Set(["work", "experience", "services", "testimonials", "videos", "cards", "articles", "text"]);
// Uploads may only be new files where /api/admin/upload puts them (random 12-character names).
const UPLOAD_PATH = /^public\/assets\/(images\/[A-Za-z0-9_-]{12}\.(webp|png|jpg)|files\/[A-Za-z0-9_-]{12}\.pdf)$/;
const BLOB_SHA = /^[0-9a-f]{40}$/;
// Links on the site: web pages, email, or a page on this site.
const LINK = /^(https?:\/\/[^\s]+|mailto:[^\s]+|\/(?!\/)[^\s]*)$/i;
// Top-level paths the site already uses; a section page can't take them.
const RESERVED = new Set(["admin", "api", "assets", "case-study", "contact-me"]);

/** Load works and site content from GitHub (the source of truth, newer than the deployed copy). */
export const GET = handle(async (request) => {
  requireSession(request);
  const [works, site] = await Promise.all([readFile("works"), readFile("site")]);
  return json({ works: works.data, site: site.data, shas: { works: works.sha, site: site.sha } });
});

/**
 * Save works, site content and newly uploaded files as one commit on the branch.
 * Body: { works, site, shas: { works, site }, uploads: [{ path, sha }] }. `shas` are the
 * versions the editor loaded, so a save from a stale tab is refused instead of overwriting.
 */
export const PUT = handle(async (request) => {
  requireSession(request);
  const { works, site, shas = {}, uploads = [] } = await request.json();
  validateWorks(works);
  validateSite(site);
  if (!Array.isArray(uploads) || !uploads.every((upload) => UPLOAD_PATH.test(upload?.path ?? "") && BLOB_SHA.test(upload?.sha ?? ""))) {
    fail("An uploaded file has an invalid location. Reload the panel and upload it again.");
  }

  const [currentWorks, currentSite] = await Promise.all([readFile("works"), readFile("site")]);
  if (currentWorks.sha !== shas.works || currentSite.sha !== shas.site) {
    throw new HttpError(409, "The site was changed somewhere else since you opened the panel. Reload to get the latest version.");
  }

  const ref = await github(`/git/ref/heads/${encodeURIComponent(branch())}`);
  const head = await github(`/git/commits/${ref.object.sha}`);
  const used = JSON.stringify([works, site]);
  const tree = await github("/git/trees", {
    method: "POST",
    body: JSON.stringify({
      base_tree: head.tree.sha,
      tree: [
        { path: FILES.works, mode: "100644", type: "blob", content: JSON.stringify(works, null, 2) + "\n" },
        { path: FILES.site, mode: "100644", type: "blob", content: JSON.stringify(site, null, 2) + "\n" },
        // Only commit uploads that are still used (a file may have been replaced before saving).
        ...uploads
          .filter((upload) => used.includes(`"${upload.path.replace(/^public/, "")}"`))
          .map((upload) => ({ path: upload.path, mode: "100644", type: "blob", sha: upload.sha })),
      ],
    }),
  });
  if (tree.sha === head.tree.sha) throw new HttpError(400, "Nothing changed.");
  const commit = await github("/git/commits", {
    method: "POST",
    body: JSON.stringify({ message: "Update site content from the admin panel", tree: tree.sha, parents: [head.sha] }),
  });
  await github(`/git/refs/heads/${encodeURIComponent(branch())}`, { method: "PATCH", body: JSON.stringify({ sha: commit.sha }) });

  const [savedWorks, savedSite] = await Promise.all([readFile("works", commit.sha), readFile("site", commit.sha)]);
  return json({ ok: true, commit: commit.sha, shas: { works: savedWorks.sha, site: savedSite.sha } });
});

const fail = (message) => {
  throw new HttpError(400, message);
};
const isText = (value) => typeof value === "string";
const requireText = (value, message) => {
  if (!isText(value) || !value.trim()) fail(message);
};
const optionalImage = (value, message) => {
  if (!isText(value) || (value && !IMAGE.test(value))) fail(message);
};
const optionalLink = (value, message) => {
  if (!isText(value) || (value.trim() && !LINK.test(value.trim()))) fail(message);
};
const LINK_HINT = "Use a full link starting with https://, a mailto: address, or a page on this site starting with /.";

function validateWorks(works) {
  if (!Array.isArray(works)) fail("Featured works are missing.");
  const slugs = new Set();
  works.forEach((work, index) => {
    const name = work?.title ? `"${work.title}"` : `Work #${index + 1}`;
    for (const field of ["title", "summary", "company", "role", "duration", "year"]) {
      requireText(work[field], `Featured work ${name}: ${field} is required.`);
    }
    if (!SLUG.test(work.slug ?? "")) fail(`Featured work ${name}: the page address may only use lowercase letters, numbers and dashes.`);
    if (slugs.has(work.slug)) fail(`Featured work ${name}: another work already uses the page address "${work.slug}".`);
    slugs.add(work.slug);
    if (!IMAGE.test(work.cover ?? "")) fail(`Featured work ${name}: add a cover image.`);
    if (!IMAGE.test(work.logo ?? "")) fail(`Featured work ${name}: add a company logo.`);
    if (!["feature", "stack", "reverse"].includes(work.homeLayout)) fail(`Featured work ${name}: pick a home page layout.`);
    if (typeof work.visible !== "boolean") fail(`Featured work ${name}: visible must be true or false.`);
    const study = work.caseStudy;
    if (!study || !Array.isArray(study.tools) || !Array.isArray(study.related) || !Array.isArray(study.blocks)) {
      fail(`Featured work ${name}: case study details are incomplete.`);
    }
    study.blocks.forEach((block, i) => {
      if (!BLOCK_TYPES.has(block?.type)) fail(`Featured work ${name}: story block ${i + 1} has an unknown type.`);
      if (block.type === "wide" && !IMAGE.test(block.src ?? "")) fail(`Featured work ${name}: image block ${i + 1} has no image.`);
      if (block.type === "pair" && !(Array.isArray(block.srcs) && block.srcs.length === 2 && block.srcs.every((src) => IMAGE.test(src)))) {
        fail(`Featured work ${name}: two-image block ${i + 1} needs both images.`);
      }
    });
  });
}

function validateSite(site) {
  if (!site || typeof site !== "object") fail("Site content is missing.");
  const { profile, sections, contact, footer, socials } = site;
  if (!profile || !contact || !footer || !Array.isArray(sections) || !Array.isArray(socials)) fail("Site content is incomplete.");
  requireText(profile.name, "Profile: your name is required.");
  optionalImage(profile.avatar, "Profile: the photo must be an uploaded image.");
  optionalImage(profile.heroImage, "Profile: the image next to your headline must be an uploaded image.");
  if (!isText(profile.resume) || (profile.resume && !/^\/assets\/[A-Za-z0-9_./-]+\.pdf$/.test(profile.resume))) fail("Profile: the resume must be an uploaded PDF.");
  if (!Array.isArray(footer.lines)) fail("Footer: lines are missing.");
  socials.forEach((social, i) => {
    requireText(social.label, `Social link ${i + 1}: add a name.`);
    requireText(social.href, `Social link "${social.label}": add a link.`);
    optionalLink(social.href, `Social link "${social.label}": ${LINK_HINT}`);
    if (!IMAGE.test(social.icon ?? "")) fail(`Social link "${social.label}": add an icon.`);
  });

  const ids = new Set();
  const pages = new Set();
  sections.forEach((section, i) => {
    const name = section?.title ? `Section "${section.title}"` : `Section ${i + 1}`;
    if (!SECTION_TYPES.has(section?.type)) fail(`${name} has an unknown type.`);
    if (!SLUG.test(section.id ?? "") || ids.has(section.id)) fail(`${name}: its id must be unique.`);
    ids.add(section.id);
    if (typeof section.visible !== "boolean") fail(`${name}: visible must be true or false.`);
    requireText(section.title, `${name}: add a title.`);
    if (section.type === "text") optionalLink(section.buttonUrl ?? "", `${name}: the button link isn't valid. ${LINK_HINT}`);
    if (section.type === "work" || section.type === "text") return;
    if (!Array.isArray(section.items)) fail(`${name}: items are missing.`);
    if ("page" in section) {
      if (!Number.isInteger(section.homeLimit) || section.homeLimit < 1) fail(`${name}: items on the home page must be 1 or more.`);
      if (section.page.enabled) {
        const slug = section.page.slug ?? "";
        if (!SLUG.test(slug)) fail(`${name}: the page address may only use lowercase letters, numbers and dashes.`);
        if (RESERVED.has(slug)) fail(`${name}: the page address "${slug}" is already used by the site.`);
        if (pages.has(slug)) fail(`${name}: another section already uses the page address "${slug}".`);
        pages.add(slug);
      }
    }
    section.items.forEach((item, j) => {
      const label = `${name}, item ${j + 1}`;
      if (section.type === "services") return requireText(item, `${label}: add a service name.`);
      if (section.type === "videos") {
        if (!/^[A-Za-z0-9_-]{11}$/.test(item.id ?? "")) fail(`${label}: add a valid YouTube link.`);
        requireText(item.title, `${label}: add a title.`);
        return optionalImage(item.thumbnail, `${label}: the thumbnail must be an uploaded image.`);
      }
      if (section.type === "experience") {
        requireText(item.company, `${label}: add the company.`);
        requireText(item.title, `${label}: add your job title.`);
        return optionalImage(item.logo, `${label}: the logo must be an uploaded image.`);
      }
      if (section.type === "testimonials") {
        requireText(item.quote, `${label}: add the quote.`);
        requireText(item.name, `${label}: add the person's name.`);
        return optionalImage(item.photo, `${label}: the photo must be an uploaded image.`);
      }
      if (section.type === "cards") {
        requireText(item.title, `${label}: add a title.`);
        optionalLink(item.url, `${label}: the link isn't valid. ${LINK_HINT}`);
        return optionalImage(item.image, `${label}: the image must be an uploaded image.`);
      }
      if (section.type === "articles") {
        requireText(item.title, `${label}: add a title.`);
        requireText(item.url, `${label}: add the link to the article.`);
        optionalLink(item.url, `${label}: the link isn't valid. ${LINK_HINT}`);
        return optionalImage(item.image, `${label}: the image must be an uploaded image.`);
      }
    });
  });
  if (sections.filter((section) => section.type === "work").length > 1) fail("There can only be one Featured works section.");
}
