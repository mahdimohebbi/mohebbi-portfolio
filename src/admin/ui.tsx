import { createContext, useContext, useRef, useState, type ReactNode } from "react";

/** Upload, preview and error helpers shared by every editor. */
export type Admin = {
  /** Resize + upload an image; returns its site URL. */
  uploadImage: (file: Blob, maxWidth: number) => Promise<string>;
  /** Upload a file as-is (PDF); returns its site URL. */
  uploadFile: (file: File) => Promise<string>;
  /** Freshly uploaded files aren't on the site yet; this returns something an <img> can show. */
  preview: (src: string) => string;
  fail: (error: unknown) => void;
};

export const AdminContext = createContext<Admin>(null!);
export const useAdmin = () => useContext(AdminContext);

export function Panel({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="admin-section">
      <div className="admin-section-head">
        <h2>{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function Field({ label, hint, group, children }: { label: string; hint?: string; group?: boolean; children: ReactNode }) {
  const Tag = group ? "div" : "label";
  return (
    <Tag className="admin-field">
      <span className="admin-label">{label}</span>
      {children}
      {hint ? <small className="admin-hint">{hint}</small> : null}
    </Tag>
  );
}

export function Text({
  label,
  hint,
  value,
  onChange,
  rows,
  placeholder,
  list,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  list?: string[];
}) {
  const listId = useRef(`list-${Math.random().toString(36).slice(2)}`).current;
  return (
    <Field label={label} hint={hint}>
      {rows ? (
        <textarea rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input value={value} placeholder={placeholder} list={list ? listId : undefined} onChange={(e) => onChange(e.target.value)} />
      )}
      {list ? (
        <datalist id={listId}>
          {list.map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      ) : null}
    </Field>
  );
}

export function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="admin-toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

/** Comma-separated text edited as a list, keeping what the user typed while they type. */
export function Tags({ label, hint = "Separate with commas.", value, onChange }: { label: string; hint?: string; value: string[]; onChange: (value: string[]) => void }) {
  const [text, setText] = useState(value.join(", "));
  return (
    <Field label={label} hint={hint}>
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value.split(",").map((tag) => tag.trim()).filter(Boolean));
        }}
      />
    </Field>
  );
}

export function ImageField({
  label,
  value,
  maxWidth,
  onChange,
  small,
  hint,
}: {
  label: string;
  value: string;
  maxWidth: number;
  onChange: (url: string) => void;
  small?: boolean;
  hint?: string;
}) {
  const { uploadImage, preview, fail } = useAdmin();
  const [loading, setLoading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const choose = async (file?: File) => {
    if (!file) return;
    setLoading(true);
    try {
      onChange(await uploadImage(file, maxWidth));
    } catch (error) {
      fail(error);
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
      {value && !loading ? (
        <button type="button" className="admin-link" onClick={() => onChange("")}>
          Remove image
        </button>
      ) : null}
      {hint ? <small className="admin-hint">{hint}</small> : null}
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(e) => choose(e.target.files?.[0])} />
    </div>
  );
}

export function PdfField({ label, value, onChange }: { label: string; value: string; onChange: (url: string) => void }) {
  const { uploadFile, fail } = useAdmin();
  const [loading, setLoading] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const choose = async (file?: File) => {
    if (!file) return;
    setLoading(true);
    try {
      onChange(await uploadFile(file));
    } catch (error) {
      fail(error);
    } finally {
      setLoading(false);
      if (input.current) input.current.value = "";
    }
  };
  return (
    <div className="admin-field">
      <span className="admin-label">{label}</span>
      <div className="admin-file">
        <span>{loading ? "Uploading…" : value ? value.split("/").pop() : "No file"}</span>
        <button type="button" className="admin-btn ghost small" disabled={loading} onClick={() => input.current?.click()}>
          {value ? "Replace PDF" : "Upload PDF"}
        </button>
      </div>
      <small className="admin-hint">PDF, up to 3 MB.</small>
      <input ref={input} type="file" accept="application/pdf" hidden onChange={(e) => choose(e.target.files?.[0])} />
    </div>
  );
}

export function Order({ index, count, onMove, onRemove }: { index: number; count: number; onMove: (delta: number) => void; onRemove?: () => void }) {
  return (
    <span className="admin-order">
      <button type="button" aria-label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
        ↑
      </button>
      <button type="button" aria-label="Move down" disabled={index === count - 1} onClick={() => onMove(1)}>
        ↓
      </button>
      {onRemove ? (
        <button type="button" aria-label="Remove" onClick={onRemove}>
          ✕
        </button>
      ) : null}
    </span>
  );
}

export const moveItem = <T,>(list: T[], index: number, delta: number) => {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const next = [...list];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
};

/** A reorderable list of items, each collapsed to a one-line summary until opened. */
export function ItemList<T>({
  items,
  onChange,
  summary,
  thumb,
  render,
  create,
  addLabel,
  noun = "item",
}: {
  items: T[];
  onChange: (items: T[]) => void;
  summary: (item: T) => string;
  thumb?: (item: T) => string;
  render: (item: T, set: (item: T) => void) => ReactNode;
  create: () => T;
  addLabel: string;
  noun?: string;
}) {
  const { preview } = useAdmin();
  const [open, setOpen] = useState<number | null>(null);
  const set = (index: number, item: T) => onChange(items.map((current, i) => (i === index ? item : current)));
  return (
    <div className="admin-items">
      {items.map((item, index) => (
        <div className={open === index ? "admin-block open" : "admin-block"} key={index}>
          <div className="admin-item-row">
            <button type="button" className="admin-item-main" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)}>
              {thumb ? thumb(item) ? <img src={preview(thumb(item))} alt="" /> : <span className="admin-thumb-empty" /> : null}
              <span>
                <strong>{summary(item) || `New ${noun}`}</strong>
              </span>
              <span className="admin-chevron" aria-hidden="true">
                {open === index ? "−" : "+"}
              </span>
            </button>
            <Order
              index={index}
              count={items.length}
              onMove={(delta) => {
                onChange(moveItem(items, index, delta));
                if (open === index) setOpen(index + delta);
                else if (open === index + delta) setOpen(index);
              }}
              onRemove={() => {
                if (!window.confirm(`Remove "${summary(item) || `this ${noun}`}"?`)) return;
                onChange(items.filter((_, i) => i !== index));
                setOpen(null);
              }}
            />
          </div>
          {open === index ? <div className="admin-item-body">{render(item, (next) => set(index, next))}</div> : null}
        </div>
      ))}
      <button
        type="button"
        className="admin-btn add"
        onClick={() => {
          onChange([...items, create()]);
          setOpen(items.length);
        }}
      >
        + {addLabel}
      </button>
    </div>
  );
}
