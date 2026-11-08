import siteData from "./site.json";
import worksData from "./works.json";

// Everything on the site except featured works lives in site.json; featured
// works live in works.json. Both are edited from the /admin panel.

export const asset = (file: string) => `/assets/images/${file}`;

export type Social = { label: string; href: string; icon: string; mono: boolean };

export type Video = {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  date: string;
  description: string;
  tag: string;
};

export type Job = {
  company: string;
  logo: string;
  /** Show the logo in white in dark mode (for dark logos). */
  logoWhite: boolean;
  title: string;
  dates: string;
  span: string;
  /** Highlights the span in green, e.g. for a current role. */
  current: boolean;
  tags: string[];
  highlight: string;
  body: string;
};

export type Testimonial = { quote: string; name: string; role: string; photo: string };

export type CardItem = {
  title: string;
  description: string;
  image: string;
  url: string;
  /** Small outlined label, e.g. "Figma plugin". */
  label: string;
  /** Muted text next to the label, e.g. a year. */
  meta: string;
};

export type Article = {
  title: string;
  summary: string;
  url: string;
  /** Where it's published, e.g. "Medium". */
  source: string;
  date: string;
  readingTime: string;
  image: string;
};

export type SectionPage = { enabled: boolean; slug: string; documentTitle: string };

type SectionBase = { id: string; visible: boolean; kicker: string; title: string };

export type Section =
  | (SectionBase & { type: "work" })
  | (SectionBase & { type: "experience"; items: Job[] })
  | (SectionBase & { type: "services"; items: string[] })
  | (SectionBase & { type: "testimonials"; items: Testimonial[] })
  | (SectionBase & { type: "videos"; items: Video[]; homeLimit: number; page: SectionPage })
  | (SectionBase & { type: "cards"; items: CardItem[]; homeLimit: number; page: SectionPage })
  | (SectionBase & { type: "articles"; items: Article[]; homeLimit: number; page: SectionPage })
  | (SectionBase & { type: "text"; body: string; buttonLabel: string; buttonUrl: string });

export type ListSection = Extract<Section, { page: SectionPage }>;

export type Site = {
  profile: {
    name: string;
    role: string;
    avatar: string;
    available: boolean;
    availableText: string;
    heroTitle: string;
    heroImage: string;
    bio: string;
    resume: string;
    resumeFileName: string;
    resumeLabel: string;
  };
  sections: Section[];
  contact: { kicker: string; title: string; cardLine: string; successMessage: string; workTitle: string };
  footer: { lines: string[]; copyright: string };
  socials: Social[];
};

export const site = siteData as Site;
export const { profile, contact, footer, socials } = site;

const hasContent = (section: Section) =>
  section.type === "work" || section.type === "text" ? true : section.items.length > 0;

/** Sections shown on the home page, in order. */
export const sections = site.sections.filter((section) => section.visible && hasContent(section));

export const findSection = <T extends Section["type"]>(type: T) =>
  sections.find((section): section is Extract<Section, { type: T }> => section.type === type);

/** Sections that have their own page, e.g. /learn-together. */
export const getSectionPage = (slug: string) =>
  sections.find((section): section is ListSection => "page" in section && section.page.enabled && section.page.slug === slug);

export type ProjectLayout = "feature" | "stack" | "reverse";

export type Project = {
  slug: string;
  title: string;
  duration: string;
  year: string;
  summary: string;
  company: string;
  role: string;
  logo: string;
  cover: string;
  homeLayout: ProjectLayout;
};

export type CaseBlock =
  | { type: "h"; text: string }
  | { type: "p"; text: string; strong?: string[] }
  | { type: "quote"; text: string }
  | { type: "outcome"; text: string }
  | { type: "pair"; srcs: [string, string]; alt: string }
  | { type: "wide"; src: string; alt: string };

export type CaseStudy = {
  slug: string;
  title: string;
  documentTitle: string;
  description: string;
  organisation: string;
  role: string;
  duration: string;
  tools: string[];
  blocks: CaseBlock[];
  related: string[];
};

export type Work = Project & {
  /** Hidden works stay in the data file but don't appear anywhere on the site. */
  visible: boolean;
  caseStudy: Omit<CaseStudy, "slug">;
};

// Featured works are edited from the /admin panel, which commits works.json.
export const works = worksData as Work[];

const published = works.filter((work) => work.visible);

export const projects: Project[] = published.map(({ visible: _visible, caseStudy: _caseStudy, ...project }) => project);

// Empty case-study fields fall back to the matching card field.
export const caseStudies: CaseStudy[] = published.map(({ slug, title, summary, company, role, duration, caseStudy }) => ({
  ...caseStudy,
  slug,
  title: caseStudy.title || title,
  documentTitle: caseStudy.documentTitle || caseStudy.title || title,
  description: caseStudy.description || summary,
  organisation: caseStudy.organisation || company,
  role: caseStudy.role || role,
  duration: caseStudy.duration || duration,
  related: caseStudy.related.filter((id) => published.some((work) => work.slug === id)),
}));

export function getCase(slug: string) {
  return caseStudies.find((item) => item.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((item) => item.slug === slug);
}
