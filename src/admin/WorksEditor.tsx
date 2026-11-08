import { useRef, useState } from "react";
import type { CaseBlock, ProjectLayout, Work } from "../data/content";
import { Check, Field, ImageField, Order, Panel, Tags, Text, moveItem, useAdmin } from "./ui";

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
  return { type, text: "" };
};

export const slugify = (text: string) =>
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

/** Featured works: list on the left, the selected work's card and case study on the right. */
export function WorksEditor({ works, onChange, published }: { works: Work[]; onChange: (works: Work[]) => void; published: Set<string> }) {
  const { preview } = useAdmin();
  const [selected, setSelected] = useState(0);
  // Slugs of works created in this session whose page address still follows the title.
  const autoSlug = useRef(new Set<string>());

  const update = (index: number, change: (work: Work) => Work) => onChange(works.map((work, i) => (i === index ? change(work) : work)));

  const renameSlug = (index: number, slug: string, patch: Partial<Work> = {}) => {
    const old = works[index].slug;
    onChange(
      works.map((work, i) => {
        const next = i === index ? { ...work, ...patch, slug } : work;
        return { ...next, caseStudy: { ...next.caseStudy, related: next.caseStudy.related.map((id) => (id === old ? slug : id)) } };
      }),
    );
  };

  const setLayout = (index: number, layout: ProjectLayout) =>
    onChange(
      works.map((work, i) => {
        if (i === index) return { ...work, homeLayout: layout };
        // Only one Large and one Wide card fit on the home page.
        if (layout !== "stack" && work.homeLayout === layout) return { ...work, homeLayout: "stack" };
        return work;
      }),
    );

  const remove = (index: number) => {
    const work = works[index];
    if (!window.confirm(`Delete "${work.title || "this work"}"? It disappears from the site when you publish.`)) return;
    onChange(
      works
        .filter((_, i) => i !== index)
        .map((item) => ({ ...item, caseStudy: { ...item.caseStudy, related: item.caseStudy.related.filter((id) => id !== work.slug) } })),
    );
    setSelected(Math.max(0, index - 1));
  };

  const work = works[selected];

  return (
    <div className="admin-works">
      <nav className="admin-list" aria-label="Works">
        <p className="admin-hint">Order here is the order on the home page.</p>
        {works.map((item, index) => (
          <div key={index} className={index === selected ? "admin-item active" : "admin-item"}>
            <button type="button" className="admin-item-main" onClick={() => setSelected(index)}>
              {item.cover ? <img src={preview(item.cover)} alt="" /> : <span className="admin-thumb-empty" />}
              <span>
                <strong>{item.title || "Untitled work"}</strong>
                <small>
                  {LAYOUTS.find((layout) => layout.value === item.homeLayout)?.label}
                  {item.visible ? "" : " · Hidden"}
                </small>
              </span>
            </button>
            <Order
              index={index}
              count={works.length}
              onMove={(delta) => {
                onChange(moveItem(works, index, delta));
                setSelected(index + delta);
              }}
            />
          </div>
        ))}
        <button
          type="button"
          className="admin-btn add"
          onClick={() => {
            const next = newWork(new Set(works.map((item) => item.slug)));
            autoSlug.current.add(next.slug);
            onChange([...works, next]);
            setSelected(works.length);
          }}
        >
          + Add work
        </button>
      </nav>

      {work ? (
        <div className="admin-editor" key={selected}>
          <Panel title="Card on the home page">
            <Check label="Show on the site" checked={work.visible} onChange={(visible) => update(selected, (w) => ({ ...w, visible }))} />
            <Text
              label="Title"
              value={work.title}
              onChange={(title) => {
                if (autoSlug.current.has(work.slug)) {
                  const slug = slugify(title) || work.slug;
                  autoSlug.current.delete(work.slug);
                  autoSlug.current.add(slug);
                  renameSlug(selected, slug, { title });
                } else update(selected, (w) => ({ ...w, title }));
              }}
            />
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
            <Text label="Summary" hint="One or two sentences shown on the card." rows={3} value={work.summary} onChange={(summary) => update(selected, (w) => ({ ...w, summary }))} />
            <div className="admin-grid">
              <Text label="Company" value={work.company} onChange={(company) => update(selected, (w) => ({ ...w, company }))} />
              <Text label="Your role" value={work.role} onChange={(role) => update(selected, (w) => ({ ...w, role }))} />
              <Text label="Duration" hint="e.g. 6 Weeks" value={work.duration} onChange={(duration) => update(selected, (w) => ({ ...w, duration }))} />
              <Text label="Year" value={work.year} onChange={(year) => update(selected, (w) => ({ ...w, year }))} />
            </div>
            <Field label="Layout on the home page" group>
              <div className="admin-segments">
                {LAYOUTS.map((layout) => (
                  <label key={layout.value} className={work.homeLayout === layout.value ? "on" : undefined}>
                    <input type="radio" name="layout" checked={work.homeLayout === layout.value} onChange={() => setLayout(selected, layout.value)} />
                    <strong>{layout.label}</strong>
                    <small>{layout.hint}</small>
                  </label>
                ))}
              </div>
            </Field>
            <div className="admin-grid">
              <ImageField label="Cover image" value={work.cover} maxWidth={1600} onChange={(cover) => update(selected, (w) => ({ ...w, cover }))} />
              <ImageField label="Company logo" value={work.logo} maxWidth={160} small onChange={(logo) => update(selected, (w) => ({ ...w, logo }))} />
            </div>
          </Panel>

          <CaseStudyEditor work={work} others={works.filter((_, i) => i !== selected)} onChange={(caseStudy) => update(selected, (w) => ({ ...w, caseStudy }))} />

          <div className="admin-danger">
            {published.has(work.slug) && work.visible ? (
              <a href={`/case-study/${work.slug}`} target="_blank" rel="noreferrer" className="admin-btn ghost">
                Open live page
              </a>
            ) : null}
            <button type="button" className="admin-btn danger" onClick={() => remove(selected)}>
              Delete this work
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-editor admin-empty">No works yet. Add one to get started.</div>
      )}
    </div>
  );
}

function CaseStudyEditor({ work, others, onChange }: { work: Work; others: Work[]; onChange: (study: Work["caseStudy"]) => void }) {
  const study = work.caseStudy;
  const set = (patch: Partial<Work["caseStudy"]>) => onChange({ ...study, ...patch });
  const setBlock = (index: number, block: CaseBlock) => set({ blocks: study.blocks.map((b, i) => (i === index ? block : b)) });
  const heroIndex = study.blocks.findIndex((block) => block.type === "wide");

  return (
    <>
      <Panel title="Case study page">
        <p className="admin-hint">Leave a field empty to reuse the value from the card above.</p>
        <Text label="Page heading" value={study.title} placeholder={work.title} onChange={(title) => set({ title })} />
        <Text label="Browser tab title" value={study.documentTitle} placeholder={work.title} onChange={(documentTitle) => set({ documentTitle })} />
        <Text label="Description" hint="Shown in Google results and link previews." rows={2} value={study.description} placeholder={work.summary} onChange={(description) => set({ description })} />
        <div className="admin-grid">
          <Text label="Organisation" value={study.organisation} placeholder={work.company} onChange={(organisation) => set({ organisation })} />
          <Text label="Role" value={study.role} placeholder={work.role} onChange={(role) => set({ role })} />
          <Text label="Duration" value={study.duration} placeholder={work.duration} onChange={(duration) => set({ duration })} />
          <Tags label="Tools & technologies" value={study.tools} onChange={(tools) => set({ tools })} />
        </div>
      </Panel>

      <Panel title="Story">
        <p className="admin-hint">The first image block is shown large at the top of the page.</p>
        {study.blocks.map((block, index) => (
          <div className="admin-block" key={index}>
            <div className="admin-block-head">
              <span>
                {BLOCKS.find((item) => item.type === block.type)?.label}
                {index === heroIndex ? " · Top image" : ""}
              </span>
              <Order
                index={index}
                count={study.blocks.length}
                onMove={(delta) => set({ blocks: moveItem(study.blocks, index, delta) })}
                onRemove={() => set({ blocks: study.blocks.filter((_, i) => i !== index) })}
              />
            </div>
            <BlockFields block={block} onChange={(next) => setBlock(index, next)} />
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
      </Panel>

      <Panel title="“Other works” at the bottom of the page">
        {others.length ? (
          <div className="admin-checks">
            {others.map((other) => (
              <Check
                key={other.slug}
                label={other.title || "Untitled work"}
                checked={study.related.includes(other.slug)}
                onChange={(checked) => set({ related: checked ? [...study.related, other.slug] : study.related.filter((id) => id !== other.slug) })}
              />
            ))}
          </div>
        ) : (
          <p className="admin-hint">Add more works to link them here.</p>
        )}
      </Panel>
    </>
  );
}

function BlockFields({ block, onChange }: { block: CaseBlock; onChange: (block: CaseBlock) => void }) {
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
        <ImageField label="Image" value={block.src} maxWidth={1600} onChange={(src) => onChange({ ...block, src })} />
        <Text label="Image description" hint="For screen readers and search engines." value={block.alt} onChange={(alt) => onChange({ ...block, alt })} />
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
            maxWidth={1000}
            onChange={(next) => onChange({ ...block, srcs: (i === 0 ? [next, block.srcs[1]] : [block.srcs[0], next]) as [string, string] })}
          />
        ))}
      </div>
      <Text label="Image description" value={block.alt} onChange={(alt) => onChange({ ...block, alt })} />
    </>
  );
}
