import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { asset } from "../data/content";
import { Socials } from "./Socials";

function Icon({ name }: { name: "sun" | "moon" }) {
  if (name === "sun") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M16 3.5A8.5 8.5 0 1 0 20.5 14 7 7 0 0 1 16 3.5z" />
    </svg>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(document.documentElement.dataset.theme === "light" ? "light" : "dark");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  };

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="who">
          <img src={asset("iNf1aETYjPNKr0YUXZwmPYoK7ZI.png")} alt="Mohammad Mahdi Mohebi" />
          <span>
            <strong>Mohammad Mahdi Mohebi</strong>
            <span>Product Designer</span>
          </span>
        </Link>
        <div className="top-actions">
          <div className="status">
            <span className="available">
              <i /> Available
            </span>
          </div>
          <button
            type="button"
            className="theme-toggle"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} />
          </button>
        </div>
      </header>

      <div className="frame">
        {children}
        <footer className="site-footer">
        <div className="inner footer-lines">
          <p>Thank you, for visiting here</p>
          <p>Let's create something beautiful</p>
        </div>
        <Socials />
        <p className="copyline">@Moheb 2026</p>
        </footer>
      </div>
    </div>
  );
}
