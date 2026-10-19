import { useEffect, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { asset, socials } from "../data/content";

const links = [
  { id: "about", href: "/#about", label: "About", icon: "user" },
  { id: "work", href: "/#work", label: "Work", icon: "pen" },
  { id: "service", href: "/#service", label: "Sevice", icon: "image" },
  { id: "how-it-work", href: "/#how-it-work", label: "Pricing", icon: "tag" },
] as const;

function Icon({ name }: { name: string }) {
  if (name === "user") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="8" r="3.2" />
        <path d="M5 19c1.4-3 3.8-4.5 7-4.5S17.6 16 19 19" />
      </svg>
    );
  }
  if (name === "pen") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 20l4.2-1 9.4-9.4-3.2-3.2L5 15.8 4 20z" />
        <path d="M13.2 6.6l3.2 3.2" />
      </svg>
    );
  }
  if (name === "image") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.3" />
        <path d="M7 17l3.5-3.5 2.2 2.2L16 12l3 4" />
      </svg>
    );
  }
  if (name === "sun") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
      </svg>
    );
  }
  if (name === "moon") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M16 3.5A8.5 8.5 0 1 0 20.5 14 7 7 0 0 1 16 3.5z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M7 7h10l-1 11H8L7 7z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}

function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 1000 * 20);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export function Shell({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  const time = useClock();
  const [theme, setTheme] = useState(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  const [active, setActive] = useState("about");

  useEffect(() => {
    if (pathname !== "/") return;
    const sections = ["about", "work", "service", "how-it-work"];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -45% 0px", threshold: [0.1, 0.4] },
    );
    sections.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, [pathname]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  };

  return (
    <div className="shell">
      <nav className="side-nav" aria-label="Primary">
        {links.map((link) => {
          const current = pathname === "/" && (hash === `#${link.id}` || (!hash && active === link.id));
          return (
            <Link key={link.id} to={link.href} aria-label={link.label} aria-current={current ? "true" : undefined}>
              <Icon name={link.icon} />
            </Link>
          );
        })}
        <button type="button" aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={toggleTheme}>
          <Icon name={theme === "dark" ? "sun" : "moon"} />
        </button>
      </nav>

      {pathname.startsWith("/case-study") ? null : (
      <header className="topbar">
        <Link to="/" className="who">
          <img src={asset("iNf1aETYjPNKr0YUXZwmPYoK7ZI.png")} alt="Mohammad Mahdi Mohebi" />
          <span>
            <strong>Mohammad Mahdi Mohebi</strong>
            <span>Product Designer</span>
          </span>
        </Link>
        <div className="status">
          <span className="available">
            <i /> Available
          </span>
          <span>US</span>
          <time className="clock" dateTime={time}>
            {time}
          </time>
        </div>
      </header>
      )}

      <div className="frame">
        {children}
        <footer className="site-footer">
        <div className="inner footer-lines">
          <p>Thank you, for visiting here</p>
          <p>Let's create something beautiful</p>
        </div>
        <div className="socials">
          {socials.map((item) => (
            <a key={item.label} href={item.href} aria-label={item.label} target="_blank" rel="noreferrer">
              <img src={item.icon} alt="" />
            </a>
          ))}
        </div>
        <p className="copyline">@Moheb 2026</p>
        </footer>
      </div>
    </div>
  );
}
