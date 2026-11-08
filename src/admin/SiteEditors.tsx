import { useState, type ReactNode } from "react";
import type { Article, CardItem, Job, ListSection, Section, Site, Social, Testimonial, Video } from "../data/content";
import { api } from "./api";
import { Check, Field, ImageField, ItemList, Panel, PdfField, Tags, Text, useAdmin } from "./ui";
import { slugify } from "./WorksEditor";

/** Section types, in the order they're offered when adding a section. */
export const SECTION_TYPES: { type: Section["type"]; label: string; description: string }[] = [
  { type: "cards", label: "Cards grid", description: "Things you built: apps, websites, Figma files, code, templates. Image, text, label and a link." },
  { type: "articles", label: "Articles & links", description: "Things you wrote or were featured in. A list of links with source, date and reading time." },
  { type: "videos", label: "YouTube videos", description: "Paste a YouTube link; the title and thumbnail are filled in for you." },
  { type: "text", label: "Text", description: "A heading with free text and an optional button, e.g. About me or Now." },
  { type: "experience", label: "Timeline", description: "Jobs, education or awards with dates, tags and a description." },
  { type: "testimonials", label: "Testimonials", description: "Quotes from people you've worked with." },
  { type: "services", label: "Numbered list", description: "Short lines like the services you offer." },
  { type: "work", label: "Featured works", description: "Your case studies." },
];

export const typeLabel = (type: Section["type"]) => SECTION_TYPES.find((item) => item.type === type)?.label ?? type;

const uniqueId = (base: string, taken: Set<string>) => {
  let id = slugify(base) || "section";
  for (let n = 2; taken.has(id); n += 1) id = `${slugify(base) || "section"}-${n}`;
  return id;
};

export function newSection(type: Section["type"], taken: Set<string>): Section {
  const id = uniqueId(typeLabel(type), taken);
  const base = { id, visible: true, kicker: `// ${typeLabel(type)}`, title: "New section" };
  const page = { enabled: true, slug: id, documentTitle: "" };
  switch (type) {
    case "work":
      return { ...base, type };
    case "text":
      return { ...base, type, body: "", buttonLabel: "", buttonUrl: "" };
    case "videos":
    case "cards":
    case "articles":
      return { ...base, type, items: [], homeLimit: 3, page };
    default:
      return { ...base, type, items: [] };
  }
}

export function ProfileEditor({ site, onChange }: { site: Site; onChange: (site: Site) => void }) {
  const profile = site.profile;
  const set = (patch: Partial<Site["profile"]>) => onChange({ ...site, profile: { ...profile, ...patch } });
  return (
    <>
      <Panel title="You">
        <div className="admin-grid">
          <Text label="Name" hint="Shown in the header." value={profile.name} onChange={(name) => set({ name })} />
          <Text label="Role" value={profile.role} onChange={(role) => set({ role })} />
        </div>
        <ImageField label="Photo" hint="Header and contact page." value={profile.avatar} maxWidth={800} small onChange={(avatar) => set({ avatar })} />
        <Check label="Show an availability badge" checked={profile.available} onChange={(available) => set({ available })} />
        {profile.available ? <Text label="Badge text" value={profile.availableText} onChange={(availableText) => set({ availableText })} /> : null}
      </Panel>
      <Panel title="Intro at the top of the home page">
        <Text label="Headline" value={profile.heroTitle} onChange={(heroTitle) => set({ heroTitle })} />
        <ImageField label="Image after the headline" hint="A small emoji-style image." value={profile.heroImage} maxWidth={160} small onChange={(heroImage) => set({ heroImage })} />
        <Text label="About you" rows={4} value={profile.bio} onChange={(bio) => set({ bio })} />
      </Panel>
      <Panel title="Resume">
        <PdfField label="Resume PDF" value={profile.resume} onChange={(resume) => set({ resume })} />
        <div className="admin-grid">
          <Text label="Button text" value={profile.resumeLabel} onChange={(resumeLabel) => set({ resumeLabel })} />
          <Text label="Downloaded file name" hint="e.g. Resume-Mohebbi.pdf" value={profile.resumeFileName} onChange={(resumeFileName) => set({ resumeFileName })} />
        </div>
      </Panel>
    </>
  );
}

export function ContactEditor({ site, onChange }: { site: Site; onChange: (site: Site) => void }) {
  const contact = site.contact;
  const set = (patch: Partial<Site["contact"]>) => onChange({ ...site, contact: { ...contact, ...patch } });
  return (
    <Panel
      title="Contact page"
      actions={
        <a className="admin-btn ghost small" href="/contact-me" target="_blank" rel="noreferrer">
          Open page
        </a>
      }
    >
      <Text label="Small label" value={contact.kicker} onChange={(kicker) => set({ kicker })} />
      <Text label="Heading" rows={2} value={contact.title} onChange={(title) => set({ title })} />
      <Text label="Line under your photo" value={contact.cardLine} onChange={(cardLine) => set({ cardLine })} />
      <Text label="Message after sending" value={contact.successMessage} onChange={(successMessage) => set({ successMessage })} />
      <Text label="Heading above featured works" value={contact.workTitle} onChange={(workTitle) => set({ workTitle })} />
      <p className="admin-hint">The service list and testimonials on this page come from those home page sections.</p>
    </Panel>
  );
}

export function FooterEditor({ site, onChange }: { site: Site; onChange: (site: Site) => void }) {
  const footer = site.footer;
  return (
    <>
      <Panel title="Footer">
        <Text
          label="Lines"
          hint="One per line."
          rows={3}
          value={footer.lines.join("\n")}
          onChange={(text) => onChange({ ...site, footer: { ...footer, lines: text.split("\n") } })}
        />
        <Text label="Copyright" value={footer.copyright} onChange={(copyright) => onChange({ ...site, footer: { ...footer, copyright } })} />
      </Panel>
      <Panel title="Social links">
        <p className="admin-hint">Shown in the footer and on the contact page.</p>
        <ItemList<Social>
          items={site.socials}
          onChange={(socials) => onChange({ ...site, socials })}
          summary={(item) => item.label}
          thumb={(item) => item.icon}
          noun="link"
          addLabel="Add link"
          create={() => ({ label: "", href: "https://", icon: "", mono: false })}
          render={(item, set) => (
            <>
              <div className="admin-grid">
                <Text label="Name" hint="Read out by screen readers." value={item.label} onChange={(label) => set({ ...item, label })} />
                <Text label="Link" hint="Use mailto:you@example.com for email." value={item.href} onChange={(href) => set({ ...item, href })} />
              </div>
              <ImageField label="Icon" value={item.icon} maxWidth={96} small onChange={(icon) => set({ ...item, icon })} />
              <Check label="Single-color icon (shown white in dark mode)" checked={item.mono} onChange={(mono) => set({ ...item, mono })} />
            </>
          )}
        />
      </Panel>
    </>
  );
}

/** Heading, visibility and (for list sections) own-page settings, shared by every section. */
export function SectionSettings({ section, onChange, onDelete, children }: { section: Section; onChange: (section: Section) => void; onDelete?: () => void; children?: ReactNode }) {
  const set = (patch: Partial<Section>) => onChange({ ...section, ...patch } as Section);
  return (
    <>
      <Panel
        title={section.title || "Untitled section"}
        actions={<span className="admin-badge">{typeLabel(section.type)}</span>}
      >
        <Check label="Show on the home page" checked={section.visible} onChange={(visible) => set({ visible })} />
        <Text label="Small label" hint="The // line above the heading. Optional." value={section.kicker} onChange={(kicker) => set({ kicker })} />
        <Text label="Heading" value={section.title} onChange={(title) => set({ title })} />
        {"page" in section ? <PageSettings section={section} onChange={onChange} /> : null}
      </Panel>
      {children}
      {onDelete ? (
        <div className="admin-danger">
          <button type="button" className="admin-btn danger" onClick={onDelete}>
            Delete this section
          </button>
        </div>
      ) : null}
    </>
  );
}

function PageSettings({ section, onChange }: { section: ListSection; onChange: (section: Section) => void }) {
  const setPage = (patch: Partial<ListSection["page"]>) => onChange({ ...section, page: { ...section.page, ...patch } });
  return (
    <>
      <Field label="Items on the home page" hint="The rest are on the section's own page.">
        <input
          type="number"
          min={1}
          max={12}
          value={section.homeLimit}
          onChange={(e) => onChange({ ...section, homeLimit: Math.max(1, Math.round(Number(e.target.value) || 1)) })}
        />
      </Field>
      <Check label="Give this section its own page with a “Show more” button" checked={section.page.enabled} onChange={(enabled) => setPage({ enabled })} />
      {section.page.enabled ? (
        <div className="admin-grid">
          <Field label="Page address">
            <div className="admin-prefix">
              <span>mohebbi.top/</span>
              <input value={section.page.slug} onChange={(e) => setPage({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") })} />
            </div>
          </Field>
          <Text label="Browser tab title" value={section.page.documentTitle} placeholder={section.title} onChange={(documentTitle) => setPage({ documentTitle })} />
        </div>
      ) : null}
    </>
  );
}

/** The item editor for every section type except Featured works. */
export function SectionItems({ section, onChange }: { section: Section; onChange: (section: Section) => void }) {
  switch (section.type) {
    case "experience":
      return (
        <Panel title="Entries">
          <ItemList<Job>
            items={section.items}
            onChange={(items) => onChange({ ...section, items })}
            summary={(job) => [job.title, job.company].filter(Boolean).join(" · ")}
            thumb={(job) => job.logo}
            noun="entry"
            addLabel="Add entry"
            create={() => ({ company: "", logo: "", logoWhite: false, title: "", dates: "", span: "", current: false, tags: [], highlight: "", body: "" })}
            render={(job, set) => (
              <>
                <div className="admin-grid">
                  <Text label="Title" hint="e.g. Product Designer" value={job.title} onChange={(title) => set({ ...job, title })} />
                  <Text label="Company / place" value={job.company} onChange={(company) => set({ ...job, company })} />
                  <Text label="Dates" hint="e.g. 2023 – 2025" value={job.dates} onChange={(dates) => set({ ...job, dates })} />
                  <Text label="Length" hint="e.g. 2 yrs 1 mos, or Present" value={job.span} onChange={(span) => set({ ...job, span })} />
                </div>
                <Check label="Current (shows the length in green)" checked={job.current} onChange={(current) => set({ ...job, current })} />
                <ImageField label="Logo" value={job.logo} maxWidth={160} small onChange={(logo) => set({ ...job, logo })} />
                <Check label="Dark logo: show it white in dark mode" checked={job.logoWhite} onChange={(logoWhite) => set({ ...job, logoWhite })} />
                <Tags label="Tags" value={job.tags} onChange={(tags) => set({ ...job, tags })} />
                <Text label="Highlight" hint="One bold sentence." value={job.highlight} onChange={(highlight) => set({ ...job, highlight })} />
                <Text label="Description" rows={4} value={job.body} onChange={(body) => set({ ...job, body })} />
              </>
            )}
          />
        </Panel>
      );
    case "services":
      return (
        <Panel title="Lines">
          <p className="admin-hint">Numbers are added automatically. These also fill the Service menu on the contact form.</p>
          <ItemList<string>
            items={section.items}
            onChange={(items) => onChange({ ...section, items })}
            summary={(item) => item}
            noun="line"
            addLabel="Add line"
            create={() => ""}
            render={(item, set) => <Text label="Text" value={item} onChange={set} />}
          />
        </Panel>
      );
    case "testimonials":
      return (
        <Panel title="Testimonials">
          <ItemList<Testimonial>
            items={section.items}
            onChange={(items) => onChange({ ...section, items })}
            summary={(item) => item.name}
            thumb={(item) => item.photo}
            noun="testimonial"
            addLabel="Add testimonial"
            create={() => ({ quote: "", name: "", role: "", photo: "" })}
            render={(item, set) => (
              <>
                <Text label="Quote" rows={3} value={item.quote} onChange={(quote) => set({ ...item, quote })} />
                <div className="admin-grid">
                  <Text label="Name" value={item.name} onChange={(name) => set({ ...item, name })} />
                  <Text label="Role & company" hint="e.g. Product Design Lead, SnappPay" value={item.role} onChange={(role) => set({ ...item, role })} />
                </div>
                <ImageField label="Photo" hint="Optional; initials are shown without one." value={item.photo} maxWidth={320} small onChange={(photo) => set({ ...item, photo })} />
              </>
            )}
          />
        </Panel>
      );
    case "videos":
      return (
        <Panel title="Videos">
          <p className="admin-hint">Newest first: the first {section.homeLimit} show on the home page.</p>
          <ItemList<Video>
            items={section.items}
            onChange={(items) => onChange({ ...section, items })}
            summary={(video) => video.title}
            thumb={(video) => video.thumbnail}
            noun="video"
            addLabel="Add video"
            create={() => ({ id: "", title: "", thumbnail: "", duration: "", date: "", description: "", tag: "" })}
            render={(video, set) => <VideoFields video={video} onChange={set} />}
          />
        </Panel>
      );
    case "cards":
      return (
        <Panel title="Cards">
          <p className="admin-hint">The first {section.homeLimit} show on the home page.</p>
          <ItemList<CardItem>
            items={section.items}
            onChange={(items) => onChange({ ...section, items })}
            summary={(item) => item.title}
            thumb={(item) => item.image}
            noun="card"
            addLabel="Add card"
            create={() => ({ title: "", description: "", image: "", url: "", label: "", meta: "" })}
            render={(item, set) => (
              <>
                <Text label="Title" value={item.title} onChange={(title) => set({ ...item, title })} />
                <Text label="Description" rows={2} value={item.description} onChange={(description) => set({ ...item, description })} />
                <Text label="Link" hint="Where the card goes: the live site, Figma Community page, GitHub repo or store page." value={item.url} placeholder="https://" onChange={(url) => set({ ...item, url })} />
                <div className="admin-grid">
                  <Text
                    label="Label"
                    hint="Pick one or type your own."
                    value={item.label}
                    list={["App", "Website", "Figma file", "Figma plugin", "UI kit", "Design system", "Open source", "Template"]}
                    onChange={(label) => set({ ...item, label })}
                  />
                  <Text label="Extra info" hint="e.g. 2025, or 7.8k duplicates" value={item.meta} onChange={(meta) => set({ ...item, meta })} />
                </div>
                <ImageField label="Image" hint="16:9 works best." value={item.image} maxWidth={1200} onChange={(image) => set({ ...item, image })} />
              </>
            )}
          />
        </Panel>
      );
    case "articles":
      return (
        <Panel title="Articles">
          <p className="admin-hint">Newest first: the first {section.homeLimit} show on the home page.</p>
          <ItemList<Article>
            items={section.items}
            onChange={(items) => onChange({ ...section, items })}
            summary={(item) => item.title}
            thumb={(item) => item.image}
            noun="article"
            addLabel="Add article"
            create={() => ({ title: "", summary: "", url: "", source: "", date: "", readingTime: "", image: "" })}
            render={(item, set) => (
              <>
                <Text label="Title" value={item.title} onChange={(title) => set({ ...item, title })} />
                <Text label="Link to the article" value={item.url} placeholder="https://" onChange={(url) => set({ ...item, url })} />
                <div className="admin-grid">
                  <Text label="Published on" value={item.source} list={["Medium", "Virgool", "LinkedIn", "Substack", "Dev.to", "Personal blog"]} onChange={(source) => set({ ...item, source })} />
                  <Text label="Date" hint="e.g. Oct 2026" value={item.date} onChange={(date) => set({ ...item, date })} />
                  <Text label="Reading time" hint="e.g. 6 min read" value={item.readingTime} onChange={(readingTime) => set({ ...item, readingTime })} />
                </div>
                <Text label="Summary" rows={2} value={item.summary} onChange={(summary) => set({ ...item, summary })} />
                <ImageField label="Cover image" hint="Optional." value={item.image} maxWidth={600} small onChange={(image) => set({ ...item, image })} />
              </>
            )}
          />
        </Panel>
      );
    case "text":
      return (
        <Panel title="Text">
          <Text label="Text" hint="Leave an empty line between paragraphs." rows={8} value={section.body} onChange={(body) => onChange({ ...section, body })} />
          <div className="admin-grid">
            <Text label="Button text" hint="Optional." value={section.buttonLabel} onChange={(buttonLabel) => onChange({ ...section, buttonLabel })} />
            <Text label="Button link" value={section.buttonUrl} placeholder="https://" onChange={(buttonUrl) => onChange({ ...section, buttonUrl })} />
          </div>
        </Panel>
      );
    case "work":
      return null;
  }
}

function VideoFields({ video, onChange }: { video: Video; onChange: (video: Video) => void }) {
  const { uploadImage, fail } = useAdmin();
  const [link, setLink] = useState(video.id ? `https://www.youtube.com/watch?v=${video.id}` : "");
  const [loading, setLoading] = useState(false);
  const fetchVideo = async () => {
    setLoading(true);
    try {
      const info = await api.youtube(link);
      const image = await fetch(`data:image/jpeg;base64,${info.image}`).then((response) => response.blob());
      const thumbnail = await uploadImage(image, 800);
      onChange({ ...video, id: info.id, title: video.title || info.title, thumbnail });
    } catch (error) {
      fail(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Field label="YouTube link">
        <div className="admin-inline">
          <input value={link} placeholder="https://www.youtube.com/watch?v=…" onChange={(e) => setLink(e.target.value)} />
          <button type="button" className="admin-btn ghost" disabled={!link || loading} onClick={fetchVideo}>
            {loading ? "Fetching…" : video.id ? "Refresh" : "Fetch details"}
          </button>
        </div>
      </Field>
      <Text label="Title" value={video.title} onChange={(title) => onChange({ ...video, title })} />
      <div className="admin-grid">
        <Text label="Length" hint="e.g. 22:56" value={video.duration} onChange={(duration) => onChange({ ...video, duration })} />
        <Text label="Date" hint="e.g. Sep 20, 2026" value={video.date} onChange={(date) => onChange({ ...video, date })} />
        <Text label="Tag" value={video.tag} onChange={(tag) => onChange({ ...video, tag })} />
      </div>
      <Text label="Description" rows={2} value={video.description} onChange={(description) => onChange({ ...video, description })} />
      <ImageField label="Thumbnail" hint="Filled in by Fetch details; you can replace it." value={video.thumbnail} maxWidth={800} onChange={(thumbnail) => onChange({ ...video, thumbnail })} />
    </>
  );
}

export function AddSection({ onAdd, hasWork }: { onAdd: (type: Section["type"]) => void; hasWork: boolean }) {
  return (
    <Panel title="Add a section">
      <p className="admin-hint">Pick a layout. You can rename it, fill it in and move it anywhere on the home page.</p>
      <div className="admin-types">
        {SECTION_TYPES.filter((item) => item.type !== "work" || !hasWork).map((item) => (
          <button key={item.type} type="button" className="admin-type" onClick={() => onAdd(item.type)}>
            <strong>{item.label}</strong>
            <small>{item.description}</small>
          </button>
        ))}
      </div>
    </Panel>
  );
}
