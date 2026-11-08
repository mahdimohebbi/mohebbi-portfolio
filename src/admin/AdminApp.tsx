import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { CaseBlock, ProjectLayout, Work } from "../data/content";
import { Unauthorized, api, prepareImage, type Upload } from "./api";
import "./admin.css";

type Status = { tone: "info" | "ok" | "error"; text: string } | null;

const LAYOUTS: { value: ProjectLayout; label: string; hint: string }[] = [
  { value: "feature", label: "Large", hint: "Big card at the top of Featured works" },
  { value: "stack", label: "Grid", hint: "Half-width card in the two-column grid" },
  { value: "reverse", label: "Wide", hint: "Full-width card below the grid" },
];

const BLOCKS: { type: CaseBlock["type"]; label: string }[] = [
  { type: "h", label: "Heading" },
  { type: "p", label: "Paragraph" },
  { type: "quote", label: "Quote" },
  { type: "outcome", label: "Outcome" },
  { type: "wide", label: "Image" },
  { type: "pair", label: "Two images" },
];

const emptyBlock = (type: CaseBlock["type"]): CaseBlock => {
  if (type === "wide") return { type, src: "", alt: "" };
  if (type === "pair") return { type, srcs: ["", ""], alt: "" };
  if (type === "p") return { type, text: "" };
  return { type, text: "" };
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const newWork = (taken: Set<string>): Work => {
  let slug = "new-work";
  for (let n = 2; taken.has(slug); n += 1) slug = `new-work-${n}`;
  return {
    slug,
    visible: true,
    title: "",
    summary: "",
    company: "",
    role: "",
    duration: "",
    year: String(new Date().getFullYear()),
    logo: "",
    cover: "",
    homeLayout: "stack",
    caseStudy: {
      title: "",
      documentTitle: "",
      description: "",
      organisation: "",
      role: "",
      duration: "",
      tools: [],
      related: [],
      blocks: [{ type: "wide", src: "", alt: "" }, { type: "h", text: "Problem" }, { type: "p", text: "" }],
    },
  };
};

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [works, setWorks] = useState<Work[]>([]);
  const [saved, setSaved] = useState("");
  const [sha, setSha] = useState("");
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState(0);
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);
  // Slugs of works created in this session whose URL name still follows the title.
  const autoSlug = useRef(new Set<string>());

  const dirty = authed === true && JSON.stringify(works) !== saved;

  useEffect(() => {
    document.title = "Admin · Featured work";
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const fail = useCallback((error: unknown) => {
    if (error instanceof Unauthorized) {
      setAuthed(false);
      setStatus({ tone: "error", text: "Your session ended. Sign in again; your edits are still here." });
      return;
    }
    setStatus({ tone: "error", text: error instanceof Error ? error.message : String(error) });
  }, []);

  const load = useCallback(async () => {
    try {
      const data = await api.load();
      setWorks(data.works);
      setSaved(JSON.stringify(data.works));
      setSha(data.sha);
      setUploads([]);
      setAuthed(true);
      setSelected((index) => Math.min(index, Math.max(0, data.works.length - 1)));
    } catch (error) {
      if (error instanceof Unauthorized) setAuthed(false);
      else fail(error);
    }
  }, [fail]);

  useEffect(() => {
    load();
  }, [load]);

  const update = (index: number, change: (work: Work) => Work) =>
    setWorks((list) => list.map((work, i) => (i === index ? change(work) : work)));

  const renameSlug = (index: number, slug: string) =>
    setWorks((list) => {
      const old = list[index].slug;
      return list.map((work, i) => {
        const next = i === index ? { ...work, slug } : work;
        return { ...next, caseStudy: { ...next.caseStudy, related: next.caseStudy.related.map((id) => (id === old ? slug : id)) } };
      });
    });

  const setLayout = (index: number, layout: ProjectLayout) =>
    setWorks((list) =>
      list.map((work, i) => {
        if (i === index) return { ...work, homeLayout: layout };
        // Only one Large and one Wide card fit on the home page.
        if (layout !== "stack" && work.homeLayout === layout) return { ...work, homeLayout: "stack" };
        return work;
      }),
    );

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= works.length) return;
    setWorks((list) => {
      const next = [...list];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setSelected(target);
  };

  const add = () => {
    const work = newWork(new Set(works.map((item) => item.slug)));
    autoSlug.current.add(work.slug);
    setWorks((list) => [...list, work]);
    setSelected(works.length);
  };

  const remove = (index: number) => {
    const work = works[index];
    if (!window.confirm(`Delete "${work.title || "this work"}"? It disappears from the site when you publish.`)) return;
    setWorks((list) =>
      list
        .filter((_, i) => i !== index)
        .map((item) => ({ ...item, caseStudy: { ...item.caseStudy, related: item.caseStudy.related.filter((id) => id !== work.slug) } })),
    );
    setSelected(Math.max(0, index - 1));
  };

  const uploadImage = async (file: File, maxWidth: number) => {
    const image = await prepareImage(file, maxWidth);
    const upload = await api.upload(image.type, image.data);
    setUploads((list) => [...list, upload]);
    setPreviews((map) => ({ ...map, [upload.url]: `data:${image.type};base64,${image.data}` }));
    return upload.url;
  };

  const publish = async () => {
    setBusy(true);
    setStatus({ tone: "info", text: "Publishing…" });
    try {
      const result = await api.save(works, sha, uploads);
      setSha(result.sha);
      setSaved(JSON.stringify(works));
      setUploads([]);
      autoSlug.current.clear();
      setStatus({ tone: "ok", text: "Published. mohebbi.top updates in about a minute." });
    } catch (error) {
      fail(error);
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    if (dirty && !window.confirm("You have unpublished changes. Sign out anyway?")) return;
    await api.logout().catch(() => undefined);
    setAuthed(false);
    setWorks([]);
    setSaved("");
    setStatus(null);
  };

  if (authed === null) return <div className="admin admin-center">Loading…</div>;
  if (!authed) {
    return (
      <Login
        status={status}
        onDone={() => {
          // Keep edits made before the session expired.
          if (works.length) setAuthed(true);
          else load();
          setStatus(null);
        }}
      />
    );
  }

  const work = works[selected];
  const image = (src: string) => previews[src] ?? src;

  return (
    <div className="admin">
      <header className="admin-bar">
        <div>
          <strong>Featured work</strong>
          <span className={dirty ? "admin-dot dirty" : "admin-dot"}>{dirty ? "Unpublished changes" : "Everything published"}</span>
        </div>
        <div className="admin-actions">
          <a href="/" target="_blank" rel="noreferrer" className="admin-btn ghost">
            View site
          </a>
          <button type="button" className="admin-btn ghost" onClick={signOut}>
            Sign out
          </button>
          <button type="button" className="admin-btn primary" disabled={!dirty || busy} onClick={publish}>
            {busy ? "Publishing…" : "Publish changes"}
          </button>
        </div>
      </header>
      {status ? (
        <p className={`admin-status ${status.tone}`} role="status">
          {status.text}
        </p>
      ) : null}

      <div className="admin-layout">
        <nav className="admin-list" aria-label="Works">
          <p className="admin-hint">Order here is the order on the home page.</p>
          {works.map((item, index) => (
            <div key={index} className={index === selected ? "admin-item active" : "admin-item"}>
              <button type="button" className="admin-item-main" onClick={() => setSelected(index)}>
                {item.cover ? <img src={image(item.cover)} alt="" /> : <span className="admin-thumb-empty" />}
                <span>
                  <strong>{item.title || "Untitled work"}</strong>
                  <small>
                    {LAYOUTS.find((layout) => layout.value === item.homeLayout)?.label}
                    {item.visible ? "" : " · Hidden"}
                  </small>
                </span>
              </button>
              <span className="admin-order">
                <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => move(index, -1)}>
                  ↑
                </button>
                <button type="button" aria-label="Move down" disabled={index === works.length - 1} onClick={() => move(index, 1)}>
                  ↓
                </button>
              </span>
            </div>
          ))}
          <button type="button" className="admin-btn add" onClick={add}>
            + Add work
          </button>
        </nav>

        {work ? (
          <main className="admin-editor" key={selected}>
            <Section title="Card on the home page">
              <label className="admin-toggle">
                <input type="checkbox" checked={work.visible} onChange={(e) => update(selected, (w) => ({ ...w, visible: e.target.checked }))} />
                Show on the site
              </label>
              <Field label="Title">
                <input
                  value={work.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    update(selected, (w) => ({ ...w, title }));
                    if (autoSlug.current.has(work.slug)) {
                      const slug = slugify(title) || work.slug;
                      autoSlug.current.delete(work.slug);
                      autoSlug.current.add(slug);
                      renameSlug(selected, slug);
                    }
                  }}
                />
              </Field>
              <Field label="Page address" hint="Lowercase letters, numbers and dashes.">
                <div className="admin-prefix">
                  <span>mohebbi.top/case-study/</span>
                  <input
                    value={work.slug}
                    onChange={(e) => {
                      autoSlug.current.delete(work.slug);
                      renameSlug(selected, e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"));
                    }}
                  />
                </div>
              </Field>
              <Field label="Summary" hint="One or two sentences shown on the card.">
                <textarea rows={3} value={work.summary} onChange={(e) => update(selected, (w) => ({ ...w, summary: e.target.value }))} />
              </Field>
              <div className="admin-grid">
                <Field label="Company">
                  <input value={work.company} onChange={(e) => update(selected, (w) => ({ ...w, company: e.target.value }))} />
                </Field>
                <Field label="Your role">
                  <input value={work.role} onChange={(e) => update(selected, (w) => ({ ...w, role: e.target.value }))} />
                </Field>
                <Field label="Duration" hint="e.g. 6 Weeks">
                  <input value={work.duration} onChange={(e) => update(selected, (w) => ({ ...w, duration: e.target.value }))} />
                </Field>
                <Field label="Year">
                  <input value={work.year} onChange={(e) => update(selected, (w) => ({ ...w, year: e.target.value }))} />
                </Field>
              </div>
              <Field label="Layout on the home page" group>
                <div className="admin-segments">
                  {LAYOUTS.map((layout) => (
                    <label key={layout.value} className={work.homeLayout === layout.value ? "on" : undefined} title={layout.hint}>
                      <input type="radio" name="layout" checked={work.homeLayout === layout.value} onChange={() => setLayout(selected, layout.value)} />
                      <strong>{layout.label}</strong>
                      <small>{layout.hint}</small>
                    </label>
                  ))}
                </div>
              </Field>
              <div className="admin-grid">
                <ImageField label="Cover image" value={work.cover} preview={image} maxWidth={1600} upload={uploadImage} onError={fail} onChange={(cover) => update(selected, (w) => ({ ...w, cover }))} />
                <ImageField label="Company logo" value={work.logo} preview={image} maxWidth={160} upload={uploadImage} onError={fail} onChange={(logo) => update(selected, (w) => ({ ...w, logo }))} small />
              </div>
            </Section>

            <CaseStudyEditor
              work={work}
              others={works.filter((_, i) => i !== selected)}
              preview={image}
              upload={uploadImage}
              onError={fail}
              onChange={(caseStudy) => update(selected, (w) => ({ ...w, caseStudy }))}
            />

            <div className="admin-danger">
              {saved.includes(`"slug":"${work.slug}"`) && work.visible ? (
                <a href={`/case-study/${work.slug}`} target="_blank" rel="noreferrer" className="admin-btn ghost">
                  Open live page
                </a>
              ) : null}
              <button type="button" className="admin-btn danger" onClick={() => remove(selected)}>
                Delete this work
              </button>
            </div>
          </main>
        ) : (
          <main className="admin-editor admin-center">No works yet. Add one to get started.</main>
        )}
      </div>
    </div>
  );
}

function CaseStudyEditor({
  work,
  others,
  preview,
  upload,
  onError,
  onChange,
}: {
  work: Work;
  others: Work[];
  preview: (src: string) => string;
  upload: (file: File, maxWidth: number) => Promise<string>;
  onError: (error: unknown) => void;
  onChange: (study: Work["caseStudy"]) => void;
}) {
  const study = work.caseStudy;
  const set = (patch: Partial<Work["caseStudy"]>) => onChange({ ...study, ...patch });
  const setBlock = (index: number, block: CaseBlock) => set({ blocks: study.blocks.map((b, i) => (i === index ? block : b)) });
  const moveBlock = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= study.blocks.length) return;
    const blocks = [...study.blocks];
    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
    set({ blocks });
  };
  const [toolsText, setToolsText] = useState(study.tools.join(", "));
  const heroIndex = study.blocks.findIndex((block) => block.type === "wide");

  return (
    <>
      <Section title="Case study page">
        <p className="admin-hint">Leave a field empty to reuse the value from the card above.</p>
        <Field label="Page heading">
          <input value={study.title} placeholder={work.title} onChange={(e) => set({ title: e.target.value })} />
        </Field>
        <Field label="Browser tab title">
          <input value={study.documentTitle} placeholder={work.title} onChange={(e) => set({ documentTitle: e.target.value })} />
        </Field>
        <Field label="Description" hint="Shown in Google results and link previews.">
          <textarea rows={2} value={study.description} placeholder={work.summary} onChange={(e) => set({ description: e.target.value })} />
        </Field>
        <div className="admin-grid">
          <Field label="Organisation">
            <input value={study.organisation} placeholder={work.company} onChange={(e) => set({ organisation: e.target.value })} />
          </Field>
          <Field label="Role">
            <input value={study.role} placeholder={work.role} onChange={(e) => set({ role: e.target.value })} />
          </Field>
          <Field label="Duration">
            <input value={study.duration} placeholder={work.duration} onChange={(e) => set({ duration: e.target.value })} />
          </Field>
          <Field label="Tools & technologies" hint="Separate with commas.">
            <input
              value={toolsText}
              onChange={(e) => {
                setToolsText(e.target.value);
                set({ tools: e.target.value.split(",").map((tool) => tool.trim()).filter(Boolean) });
              }}
            />
          </Field>
        </div>
      </Section>

      <Section title="Story">
        <p className="admin-hint">The first image block is shown large at the top of the page.</p>
        {study.blocks.map((block, index) => (
          <div className="admin-block" key={index}>
            <div className="admin-block-head">
              <span>
                {BLOCKS.find((item) => item.type === block.type)?.label}
                {index === heroIndex ? " · Top image" : ""}
              </span>
              <span className="admin-order">
                <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => moveBlock(index, -1)}>
                  ↑
                </button>
                <button type="button" aria-label="Move down" disabled={index === study.blocks.length - 1} onClick={() => moveBlock(index, 1)}>
                  ↓
                </button>
                <button type="button" aria-label="Remove block" onClick={() => set({ blocks: study.blocks.filter((_, i) => i !== index) })}>
                  ✕
                </button>
              </span>
            </div>
            <BlockFields block={block} preview={preview} upload={upload} onError={onError} onChange={(next) => setBlock(index, next)} />
          </div>
        ))}
        <div className="admin-add-blocks">
          <span>Add:</span>
          {BLOCKS.map((item) => (
            <button key={item.type} type="button" className="admin-btn ghost small" onClick={() => set({ blocks: [...study.blocks, emptyBlock(item.type)] })}>
              + {item.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="“Other works” at the bottom of the page">
        {others.length ? (
          <div className="admin-checks">
            {others.map((other) => (
              <label key={other.slug}>
                <input
                  type="checkbox"
                  checked={study.related.includes(other.slug)}
                  onChange={(e) =>
                    set({ related: e.target.checked ? [...study.related, other.slug] : study.related.filter((id) => id !== other.slug) })
                  }
                />
                {other.title || "Untitled work"}
              </label>
            ))}
          </div>
        ) : (
          <p className="admin-hint">Add more works to link them here.</p>
        )}
      </Section>
    </>
  );
}

function BlockFields({
  block,
  preview,
  upload,
  onError,
  onChange,
}: {
  block: CaseBlock;
  preview: (src: string) => string;
  upload: (file: File, maxWidth: number) => Promise<string>;
  onError: (error: unknown) => void;
  onChange: (block: CaseBlock) => void;
}) {
  if (block.type === "h") return <input value={block.text} placeholder="Heading" onChange={(e) => onChange({ ...block, text: e.target.value })} />;
  if (block.type === "quote" || block.type === "outcome") {
    return <textarea rows={2} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />;
  }
  if (block.type === "p") {
    return (
      <>
        <textarea rows={4} value={block.text} onChange={(e) => onChange({ ...block, text: e.target.value })} />
        <Field label="Bold phrases" hint="One per line. Each must appear exactly in the paragraph.">
          <textarea
            rows={2}
            value={(block.strong ?? []).join("\n")}
            onChange={(e) => {
              const strong = e.target.value.split("\n");
              onChange({ ...block, strong: strong.some((s) => s.trim()) ? strong : undefined });
            }}
            onBlur={() => onChange({ ...block, strong: block.strong?.map((s) => s.trim()).filter(Boolean) })}
          />
        </Field>
      </>
    );
  }
  if (block.type === "wide") {
    return (
      <>
        <ImageField label="Image" value={block.src} preview={preview} maxWidth={1600} upload={upload} onError={onError} onChange={(src) => onChange({ ...block, src })} />
        <Field label="Image description" hint="For screen readers and search engines.">
          <input value={block.alt} onChange={(e) => onChange({ ...block, alt: e.target.value })} />
        </Field>
      </>
    );
  }
  return (
    <>
      <div className="admin-grid">
        {block.srcs.map((src, i) => (
          <ImageField
            key={i}
            label={i === 0 ? "Left image" : "Right image"}
            value={src}
            preview={preview}
            maxWidth={1000}
            upload={upload}
            onError={onError}
            onChange={(next) => onChange({ ...block, srcs: (i === 0 ? [next, block.srcs[1]] : [block.srcs[0], next]) as [string, string] })}
          />
        ))}
      </div>
      <Field label="Image description">
        <input value={block.alt} onChange={(e) => onChange({ ...block, alt: e.target.value })} />
      </Field>
    </>
  );
}

function ImageField({
  label,
  value,
  preview,
  maxWidth,
  upload,
  onError,
  onChange,
  small,
}: {
  label: string;
  value: string;
  preview: (src: string) => string;
  maxWidth: number;
  upload: (file: File, maxWidth: number) => Promise<string>;
  onError: (error: unknown) => void;
  onChange: (url: string) => void;
  small?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const choose = async (file?: File) => {
    if (!file) return;
    setLoading(true);
    try {
      onChange(await upload(file, maxWidth));
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
      if (input.current) input.current.value = "";
    }
  };
  return (
    <div className="admin-field">
      <span className="admin-label">{label}</span>
      <button
        type="button"
        className={small ? "admin-image small" : "admin-image"}
        onClick={() => input.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          choose(e.dataTransfer.files[0]);
        }}
        disabled={loading}
      >
        {loading ? <span>Uploading…</span> : value ? <img src={preview(value)} alt="" /> : <span>Click or drop an image</span>}
      </button>
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => choose(e.target.files?.[0])} />
    </div>
  );
}

function Login({ status, onDone }: { status: Status; onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(status?.text ?? "");
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.login(password);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="admin admin-center">
      <form className="admin-login" onSubmit={submit}>
        <h1>Admin</h1>
        <p className="admin-hint">Manage the featured work on mohebbi.top.</p>
        <Field label="Password">
          <input type="password" autoFocus autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error ? <p className="admin-status error">{error}</p> : null}
        <button type="submit" className="admin-btn primary" disabled={!password || busy}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="admin-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, hint, group, children }: { label: string; hint?: string; group?: boolean; children: ReactNode }) {
  const Tag = group ? "div" : "label";
  return (
    <Tag className="admin-field">
      <span className="admin-label">{label}</span>
      {children}
      {hint ? <small className="admin-hint">{hint}</small> : null}
    </Tag>
  );
}
