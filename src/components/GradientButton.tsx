import { useEffect, useRef, type AnchorHTMLAttributes } from "react";

// Warm palette built around the site accent (#ff5c00).
const COLORS = ["#ffc94d", "#ff9f1c", "#ff5c00", "#ff3b1f", "#cc4900", "#ffd8a8"];

// Pill link with blurred color blobs drifting behind a glossy layer. By default
// only a thin glowing ring shows; on hover the colors fill the whole button.
export function GradientButton({ className, children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const blobs = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = blobs.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(root.children) as HTMLElement[];
    const shuffle = () => {
      for (const item of items) {
        const x = Math.floor(Math.random() * 200 - 100);
        const y = Math.floor(Math.random() * 200 - 100);
        item.style.transform = `translate(${x}%, ${y}%)`;
      }
    };
    const first = window.setTimeout(shuffle, 100);
    const timer = window.setInterval(shuffle, 1500);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <a className={["gradient-btn", className].filter(Boolean).join(" ")} {...props}>
      <span className="gb-content">{children}</span>
      <span className="gb-inner" aria-hidden="true" />
      <span className="gb-gloss" aria-hidden="true" />
      <span className="gb-blobs" ref={blobs} aria-hidden="true">
        {COLORS.map((color) => (
          <span key={color} style={{ background: color }} />
        ))}
      </span>
    </a>
  );
}
