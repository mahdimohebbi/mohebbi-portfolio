import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Shell } from "./components/Shell";
import { CaseStudyPage } from "./pages/CaseStudyPage";
import { ContactPage } from "./pages/ContactPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView();
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <Shell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/case-study/:slug" element={<CaseStudyPage />} />
        <Route path="/contact-me" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Shell>
  );
}
