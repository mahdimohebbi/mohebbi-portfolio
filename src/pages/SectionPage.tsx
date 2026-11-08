import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { SectionView } from "../components/Sections";
import { getSectionPage } from "../data/content";
import { NotFoundPage } from "./NotFoundPage";

/** A section's own page with all of its items, e.g. /learn-together. */
export function SectionPage() {
  const { slug = "" } = useParams();
  const section = getSectionPage(slug);

  useEffect(() => {
    if (!section) return;
    document.title = section.page.documentTitle || section.title;
    return () => {
      document.title = "Mohebbiam";
    };
  }, [section]);

  if (!section) return <NotFoundPage />;
  return (
    <main>
      <SectionView section={section} full />
    </main>
  );
}
