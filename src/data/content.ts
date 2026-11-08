import worksData from "./works.json";

export const asset = (file: string) => `/assets/images/${file}`;

export const CV_URL = "/assets/Resume-mohebbi.pdf";
export const CV_FILENAME = "Resume-Mohebbi.pdf";

export const socials = [
  { id: "dribbble", href: "https://dribbble.com/mohebbiam", label: "Dribbble", icon: "/assets/social/dribbble.png", mono: true },
  { id: "instagram", href: "https://www.instagram.com/mohebbiam", label: "Instagram", icon: "/assets/social/instagram.png", mono: true },
  { id: "youtube", href: "https://youtube.com/@ProductCastX", label: "YouTube", icon: "/assets/social/youtube.png", mono: false },
  { id: "gmail", href: "mailto:mahdi.mohebbi.m@gmail.com", label: "Gmail", icon: "/assets/social/gmail.png", mono: false },
  { id: "linkedin", href: "https://www.linkedin.com/in/mohebbiam", label: "LinkedIn", icon: "/assets/social/linkedin.png", mono: false },
  { id: "telegram", href: "https://t.me/mohammadmahdiiam", label: "Telegram", icon: "/assets/social/telegram.png", mono: false },
  { id: "figma", href: "https://www.figma.com/@mohebbiam", label: "Figma", icon: "/assets/social/figma.png", mono: false },
] as const;

export type Video = {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  date: string;
  description: string;
  tag: string;
};

export const videos: Video[] = [
  {
    id: "GwUyg7FzmxI",
    title: "Figma Variables - وریبل در فیگما",
    thumbnail: "/assets/videos/GwUyg7FzmxI.webp",
    duration: "22:56",
    date: "Sep 20, 2026",
    description: "آموزش کامل وریبل‌ها (Variables) در فیگما؛ از صفر تا طراحی تم‌های رنگی و دیزاین سیستم 🧩🎨",
    tag: "Variables",
  },
  {
    id: "tv3JLCZKdz8",
    title: "Figma Slot - اسلات در فیگما",
    thumbnail: "/assets/videos/tv3JLCZKdz8.webp",
    duration: "11:35",
    date: "Aug 21, 2026",
    description: "توی این ویدیو به سراغ یکی از تکنیک‌های فوق‌العاده کاربردی در ساخت دیزاین سیستم و کامپوننت‌های پیشرفته فیگما یعنی الگوی اسلات (Slot Components) رفتیم.",
    tag: "Slot",
  },
  {
    id: "RgPlWTEAI04",
    title: "Figma Effects (Shaders Tutorial) - (Shaders آموزش ) افکت‌ها در فیگما",
    thumbnail: "/assets/videos/RgPlWTEAI04.webp",
    duration: "21:50",
    date: "Aug 7, 2026",
    description: "آموزش سیر تا پیاز افکت‌ها، شیدرها و Effect Styles در فیگما 🪄✨",
    tag: "Effects",
  },
  {
    id: "-V-ewM5004o",
    title: "استایل‌ها در فیگما - Figma Styles",
    thumbnail: "/assets/videos/-V-ewM5004o.webp",
    duration: "18:08",
    date: "Jul 25, 2026",
    description: "آموزش کامل و اصولی استایل‌ها (Styles) در فیگما 🎨🖌️",
    tag: "Styles",
  },
  {
    id: "xA4r1bJQLpI",
    title: "Figma Component - آموزش کامپوننت فیگما",
    thumbnail: "/assets/videos/xA4r1bJQLpI.webp",
    duration: "21:57",
    date: "Jul 18, 2026",
    description: "یادگیری اصولی کامپوننت‌ها در فیگما؛🔥",
    tag: "Component",
  },
  {
    id: "sU86ymUEYNU",
    title: "آموزش فیگما موشن - Figma Motion",
    thumbnail: "/assets/videos/sU86ymUEYNU.webp",
    duration: "20:30",
    date: "Jul 6, 2026",
    description: "چطور در فیگما مثل یک حرفه‌ای انیمیشن و موشن طراحی کنیم؟",
    tag: "Motion",
  },
  {
    id: "oiaVm8OOTDs",
    title: "آموزش قابلیت Auto-Layout در فیگما - Auto-Layout Tutorial in Figma",
    thumbnail: "/assets/videos/oiaVm8OOTDs.webp",
    duration: "19:12",
    date: "Jun 20, 2026",
    description: "توی این ویدیو رفتیم سراغ یکی از مهم‌ترین و کاربردی‌ترین قابلیت‌های فیگما یعنی Auto Layout!",
    tag: "Auto Layout",
  },
  {
    id: "KysqbO60QpI",
    title: "آشنایی با ابزارهای فیگما - Introduction to Figma Tools",
    thumbnail: "/assets/videos/KysqbO60QpI.webp",
    duration: "26:03",
    date: "Jun 20, 2026",
    description: "توی این ویدیو میریم سراغ بررسی ابزارهای مختلف فیگما و یاد میگیریم چجوری تو Figma Community برای خودمون پروفایل بسازیم.",
    tag: "Tools",
  },
  {
    id: "z6uYh7uYcmU",
    title: "آشنایی با فیگما - Getting Started with Figma",
    thumbnail: "/assets/videos/z6uYh7uYcmU.webp",
    duration: "16:04",
    date: "Jun 12, 2026",
    description: "توی این ویدیو سراغ نرم‌افزار فیگما رفتیم و قراره باهاش آشنا بشیم.",
    tag: "Getting Started",
  },
  {
    id: "M-8yB27FSrA",
    title: "آموزش پروتوتایپ فیگما - Figma Prototype",
    thumbnail: "/assets/videos/M-8yB27FSrA.webp",
    duration: "25:43",
    date: "May 22, 2026",
    description: "در این ویدیو به آموزش قابلیت پروتوتایپ نرم‌افزار Figma خواهیم پرداخت.",
    tag: "Prototype",
  },
];

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

export const experience = [
  {
    index: "01",
    company: "SnappPay",
    logo: asset("Rk1npsW6CWkdNeAhnwtnGuspwo.webp"),
    title: "Product Designer",
    dates: "2025 –",
    span: "Present",
    spanTone: "green" as const,
    tags: ["Wallet", "Fintech", "Design systems", "Figma"],
    highlight: "Designing core financial products, including the SnappPay Wallet.",
    body: "I focus on scalable, user-centric experiences for fintech services, from customer-facing flows such as Cashback, Gift Card, Gold purchase, and withdrawals to back-office dashboards. I work with Product, Research, Data, and Engineering, and keep the work aligned with the design system.",
  },
  {
    index: "02",
    company: "SetareAval (MCI)",
    logo: asset("PKL0cOBwT5LveHXGW1hSFhHajSE.webp"),
    title: "Product Designer",
    dates: "2023 – 2025",
    span: "2 yrs 1 mos",
    spanTone: "muted" as const,
    tags: ["Loans", "Dashboards", "UX"],
    highlight: "Led design of the Setareh-Yek loan platform, which has distributed over 500 billion toman in loans.",
    body: "I designed the loan acquisition and management experience for users, vendors, and administrators, including the application flow, installment tools, dashboards, campaign pages, and credit-scoring checks.",
  },
  {
    index: "03",
    company: "SetareAval (MCI)",
    logo: asset("PKL0cOBwT5LveHXGW1hSFhHajSE.webp"),
    title: "UX/UI Designer",
    dates: "2021 – 2023",
    span: "1 yr 11 mos",
    spanTone: "muted" as const,
    tags: ["Figma", "Design system", "Usability testing"],
    highlight: "Contributed to the Morph Design System, now past 7,800 Figma community duplicates.",
    body: "I worked on SetareYek, SetareSim, and Rondtarin with five designers. I migrated 10+ services from Adobe XD to Figma, redesigned a responsive B2B dashboard used by Asanpardakht, HamrahCard, and Parsian, and designed the SetareSim e-commerce platform.",
  },
  {
    index: "04",
    company: "Rahnema College",
    logo: asset("rahnema.webp"),
    logoTone: "white" as const,
    title: "Product Design Mentor",
    dates: "2025 – 2026",
    span: "In progress",
    spanTone: "green" as const,
    tags: ["Mentorship", "UX research", "Design systems"],
    highlight: "Mentoring students in the Product Design Bootcamp.",
    body: "I guide students on UX research, UI design, design systems, and AR/VR design through feedback sessions, real-world product challenges, and reviews of the projects they build during the course.",
  },
  {
    index: "05",
    company: "Cando",
    logo: asset("cando.webp"),
    logoTone: "white" as const,
    title: "Product Design Instructor",
    dates: "2025",
    span: "3 mos",
    spanTone: "muted" as const,
    tags: ["Teaching", "Figma", "UX research"],
    highlight: "Teaching the Product Design course at Cando.",
    body: "I teach product design fundamentals, UX research, benchmarking, UI design, Figma, and portfolio development, and I lead workshops on resume writing and building a professional social-media presence.",
  },
];

export const services = [
  "1. UI & Product Design",
  "2. Design Engineering",
  "3. Design Systems",
  "4. Interaction & Motion Design",
];

export const serviceOptions = [
  "UI & Product Design",
  "Design Engineering",
  "Design Systems",
  "Interaction & Motion Design",
];

export const testimonials = [
  {
    quote:
      "Working with Moheb was a different experience. He didn't just deliver designs he delivered a working product.",
    name: "Hossein Mahmoudvand",
    role: "Product Design Lead, SnappPay",
    photo: asset("Pbqe6AAIA2xNq5NIZmBMy2YGg8.webp"),
    photoAlt: "Hossein Mahmoudvand",
  },
  {
    quote:
      "Working with Moheb on product felt easy. He listens, he designs with the real flow in mind, and the files he hands over are already ready to build.",
    name: "Mohammad Hossein Ahmadi",
    role: "Product Designer, SnappMarket",
    photo: asset("mohammad-hossein-ahmadi.webp"),
    photoAlt: "Mohammad Hossein Ahmadi",
  },
  {
    quote:
      "As an engineer, Moheb is the designer I trust. The specs were clear, the edge cases were there, and I could build without going back and forth.",
    name: "Mahdi Saedi",
    role: "Software Engineer, SetareAval",
    photo: asset("mahdi-saedi.webp"),
    photoAlt: "Mahdi Saedi",
  },
];

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
