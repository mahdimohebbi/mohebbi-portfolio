import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import type { Section, Site, Work } from "../data/content";
import { Unauthorized, api, prepareImage, toBase64, type Content, type Shas, type Upload } from "./api";
import { AddSection, ContactEditor, FooterEditor, ProfileEditor, SectionItems, SectionSettings, newSection, typeLabel } from "./SiteEditors";
import { AdminContext, Field, Order, Panel, moveItem, type Admin } from "./ui";
import { WorksEditor } from "./WorksEditor";
import "./admin.css";

type Status = { tone: "info" | "ok" | "error"; text: string } | null;
/** Which editor is open: a fixed page, or a home section by id. */
type View = "profile" | "contact" | "footer" | "add" | { section: string };

const MAX_FILE = 3.2 * 1024 * 1024;

export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [content, setContent] = useState<Content | null>(null);
  const [saved, setSaved] = useState("");
  const [shas, setShas] = useState<Shas>({ works: "", site: "" });
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [view, setView] = useState<View>("profile");
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);

  const dirty = authed === true && content !== null && JSON.stringify(content) !== saved;

  useEffect(() => {
    document.title = "Admin · Mohebbiam";
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
      const next = { works: data.works, site: data.site };
      setContent(next);
      setSaved(JSON.stringify(next));
      setShas(data.shas);
      setUploads([]);
      setAuthed(true);
    } catch (error) {
      if (error instanceof Unauthorized) setAuthed(false);
      else fail(error);
    }
  }, [fail]);

  useEffect(() => {
    load();
  }, [load]);

  const admin = useMemo<Admin>(() => {
    const remember = (upload: Upload, dataUrl: string) => {
      setUploads((list) => [...list, upload]);
      setPreviews((map) => ({ ...map, [upload.url]: dataUrl }));
      return upload.url;
    };
    return {
      uploadImage: async (file, maxWidth) => {
        const image = await prepareImage(file, maxWidth);
        return remember(await api.upload(image.type, image.data), `data:${image.type};base64,${image.data}`);
      },
      uploadFile: async (file) => {
        if (file.size > MAX_FILE) throw new Error("This file is larger than 3 MB. Export a smaller PDF and try again.");
        return remember(await api.upload(file.type, await toBase64(file)), "");
      },
      preview: (src) => previews[src] || src,
      fail,
    };
  }, [previews, fail]);

  const publish = async () => {
    if (!content) return;
    setBusy(true);
    setStatus({ tone: "info", text: "Publishing…" });
    try {
      const result = await api.save(content, shas, uploads);
      setShas(result.shas);
      setSaved(JSON.stringify(content));
      setUploads([]);
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
    setContent(null);
    setSaved("");
    setStatus(null);
  };

  if (authed === null) return <div className="admin admin-center">Loading…</div>;
  if (!authed || !content) {
    return (
      <Login
        status={status}
        onDone={() => {
          // Keep edits made before the session expired.
          if (content) setAuthed(true);
          else load();
          setStatus(null);
        }}
      />
    );
  }

  const { site, works } = content;
  const setSite = (next: Site) => setContent({ ...content, site: next });
  const setWorks = (next: Work[]) => setContent({ ...content, works: next });
  const setSections = (sections: Section[]) => setSite({ ...site, sections });
  const savedContent = JSON.parse(saved) as Content;
  const publishedSlugs = new Set(savedContent.works.map((work) => work.slug));

  const openSection = typeof view === "object" ? site.sections.find((section) => section.id === view.section) : undefined;
  const sectionIndex = openSection ? site.sections.indexOf(openSection) : -1;
  const updateSection = (next: Section) => setSections(site.sections.map((section, i) => (i === sectionIndex ? next : section)));

  return (
    <AdminContext.Provider value={admin}>
      <div className="admin">
        <header className="admin-bar">
          <div>
            <strong>Site editor</strong>
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
            <button type="button" aria-label="Dismiss" onClick={() => setStatus(null)}>
              ✕
            </button>
          </p>
        ) : null}

        <div className="admin-layout">
          <nav className="admin-nav" aria-label="Site areas">
            <p className="admin-nav-title">Home page</p>
            <NavButton active={view === "profile"} label="Intro & profile" detail="Name, photo, bio, resume" onClick={() => setView("profile")} />
            {site.sections.map((section, index) => (
              <div className="admin-nav-row" key={section.id}>
                <NavButton
                  active={typeof view === "object" && view.section === section.id}
                  label={section.title || "Untitled section"}
                  detail={`${typeLabel(section.type)}${section.visible ? "" : " · Hidden"}`}
                  muted={!section.visible}
                  onClick={() => setView({ section: section.id })}
                />
                <Order index={index} count={site.sections.length} onMove={(delta) => setSections(moveItem(site.sections, index, delta))} />
              </div>
            ))}
            <button type="button" className={view === "add" ? "admin-btn add active" : "admin-btn add"} onClick={() => setView("add")}>
              + Add section
            </button>
            <p className="admin-nav-title">Other</p>
            <NavButton active={view === "contact"} label="Contact page" onClick={() => setView("contact")} />
            <NavButton active={view === "footer"} label="Footer & social links" onClick={() => setView("footer")} />
          </nav>

          <main className="admin-main" key={typeof view === "object" ? view.section : view}>
            {view === "profile" ? <ProfileEditor site={site} onChange={setSite} /> : null}
            {view === "contact" ? <ContactEditor site={site} onChange={setSite} /> : null}
            {view === "footer" ? <FooterEditor site={site} onChange={setSite} /> : null}
            {view === "add" ? (
              <AddSection
                hasWork={site.sections.some((section) => section.type === "work")}
                onAdd={(type) => {
                  const section = newSection(type, new Set(site.sections.map((item) => item.id)));
                  setSections([...site.sections, section]);
                  setView({ section: section.id });
                }}
              />
            ) : null}
            {openSection ? (
              <SectionSettings
                section={openSection}
                onChange={updateSection}
                onDelete={() => {
                  const warning =
                    openSection.type === "work"
                      ? `Delete the "${openSection.title}" section? Your featured works are kept and come back if you add the section again.`
                      : `Delete the "${openSection.title}" section and everything in it?`;
                  if (!window.confirm(warning)) return;
                  setSections(site.sections.filter((section) => section.id !== openSection.id));
                  setView("profile");
                }}
              >
                {openSection.type === "work" ? (
                  <WorksEditor works={works} onChange={setWorks} published={publishedSlugs} />
                ) : (
                  <SectionItems section={openSection} onChange={updateSection} />
                )}
              </SectionSettings>
            ) : null}
          </main>
        </div>
      </div>
    </AdminContext.Provider>
  );
}

function NavButton({ active, label, detail, muted, onClick }: { active: boolean; label: string; detail?: string; muted?: boolean; onClick: () => void }) {
  return (
    <button type="button" className={`admin-nav-btn${active ? " active" : ""}${muted ? " muted" : ""}`} onClick={onClick}>
      <strong>{label}</strong>
      {detail ? <small>{detail}</small> : null}
    </button>
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
        <Panel title="Admin">
          <p className="admin-hint">Edit everything on mohebbi.top.</p>
          <Field label="Password">
            <input type="password" autoFocus autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          {error ? <p className="admin-status error">{error}</p> : null}
          <button type="submit" className="admin-btn primary" disabled={!password || busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </Panel>
      </form>
    </div>
  );
}
