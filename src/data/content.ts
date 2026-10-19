export const asset = (file: string) => `/assets/images/${file}`;

export const CV_URL =
  "https://drive.google.com/file/d/1RjY0RGWsY3-7nPxAaWZGwEg8LQq-Xthc/view?usp=sharing";

export const socials = [
  { href: "https://gmail.com/", label: "Email", icon: asset("2r0tMSF7EWzSPXNxVDMxk3eqUg.png") },
  { href: "https://linkedin.com/", label: "LinkedIn", icon: asset("Pn59joQsJtNvf0zGbsR6yXhIKA.png") },
  { href: "https://x.com/", label: "X", icon: asset("DqwlYiGLvOFU8KRZqaSNdJxEbik.png") },
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

export const projects: Project[] = [
  {
    slug: "building-a-perfect-design-system-from-zero",
    title: "Building a new experience",
    duration: "1 Years",
    year: "2025",
    summary:
      "Joined the team when every single screen was built in complete isolation and there is no tokens, no components, no consistency.",
    company: "SnappPay",
    role: "Product Designer",
    logo: asset("Rk1npsW6CWkdNeAhnwtnGuspwo.png"),
    cover: asset("HXl2XmtZecb2vb3Yte8nMVJTQ.png"),
    homeLayout: "feature",
  },
  {
    slug: "redesigning-the-core-dashboard-of-saas-product",
    title: "Redesigning the Core Dashboard of saas product",
    duration: "3 month",
    year: "2024",
    summary:
      "The old dashboard had 11 years of visual debt. I stripped it back, rebuilt every component in React, and shipped a version that cut user drop-off by 40%.",
    company: "Setare Aval",
    role: "Frontend + designer",
    logo: asset("PKL0cOBwT5LveHXGW1hSFhHajSE.png"),
    cover: asset("FJm9lkqFOZ8skzXu5opgSSar2Iw.png"),
    homeLayout: "stack",
  },
  {
    slug: "launching-a-marketing-site-in-5-days",
    title: "launching a Marketing Site in 5 Days",
    duration: "1 Week",
    year: "2025",
    summary:
      "Startup needed a launch site before their funding announcement. I designed and built the entire thing in Framer — live in 5 days, no handoff needed.",
    company: "Setare Aval",
    role: "Design engineer",
    logo: asset("PKL0cOBwT5LveHXGW1hSFhHajSE.png"),
    cover: asset("2sngz7vnl2Hwf5K2uLGBlP5cH5A.png"),
    homeLayout: "stack",
  },
  {
    slug: "prototyping-an-onboarding-flow-that-actually-converts",
    title: "Prototyping an Onboarding Flow That Actually Converts",
    duration: "6 Weeks",
    year: "2024",
    summary:
      "The original onboarding had a 60% drop-off at step two. I redesigned the flow in framer and handed devs production-ready specs.",
    company: "SnappBox",
    role: "Designer",
    logo: asset("TEvYeIoGqRfw0xtTuDGonwrZlw.png"),
    cover: asset("VKoqdMRhhobaYKCO653Yhxi5i8.png"),
    homeLayout: "reverse",
  },
];

export const experience = [
  {
    index: "01",
    company: "Lumio",
    logo: asset("mdmULrzPqJO79Ram2lsfUJbUAE.png"),
    title: "Design Engineer",
    dates: "2025 –",
    span: "Present",
    spanTone: "green" as const,
    tags: ["React", "Figma", "Design system", "Tailwind"],
    highlight: "Built a design system adopted by 4 product teams within 30 days",
    body: "Joined as the first design engineer on the team. Owned the entire design-to-code pipeline. built the product's design system from scratch, shipped new features weekly, and made sure nothing got lost between Figma and production.",
  },
  {
    index: "02",
    company: "Trackflow HQ",
    logo: asset("shFvG2qqC1MIMwzRFghTPQBdDa8.png"),
    title: "Frontend Engineer + Designer",
    dates: "2023 – 2024",
    span: "1 year",
    spanTone: "muted" as const,
    tags: ["React", "Next.js", "Figma", "CSS", "Component architecture"],
    highlight: "Rebuilt the entire dashboard UI and cut user drop-off by 40%",
    body: "Started as a frontend engineer but quickly moved into a hybrid role. Rebuilt the core dashboard UI, reduced design inconsistencies across 30+ screens, and introduced component-based thinking to a team that had never used one.",
  },
  {
    index: "03",
    company: "Orion Labs",
    logo: asset("tGLKBEYVJf0hOdNWGNTPQgstU.png"),
    title: "Freelance Design Engineer",
    dates: "2023",
    span: "5 Months",
    spanTone: "muted" as const,
    tags: ["Framer", "Motion design", "Visual design", "Copywriting"],
    highlight: "Designed and shipped a full marketing site solo in under a week",
    body: "Brought in to design and build a launch marketing site before a funding announcement. Delivered a fully animated Framer site in 5 days — design, build, and deployment handled solo.",
  },
  {
    index: "04",
    company: "Self-initiated",
    logo: asset("DDifs5jHTTam1p3atAcUJyLuA8o.png"),
    title: "Side Projects & Open Source",
    dates: "2022 –",
    span: "Ongoing · Personal",
    spanTone: "accent" as const,
    tags: ["React", "Framer", "Type script", "Passion for building"],
    highlight: "3 shipped products with real users, 1 open source component library",
    body: "Built a Framer component playground, a minimal habit tracker app, and a Chrome extension for designers. Where most of the real learning happens — no deadlines, no clients, just curiosity and craft.",
  },
];

export const services = [
  "1. UI & Product Design",
  "2. Design Engineering",
  "3. Framer Development",
  "4. Design Systems",
  "5. Interaction & Motion Design",
];

export const serviceOptions = [
  "UI & Product Design",
  "Design Engineering",
  "Framer Development",
  "Design Systems",
  "Interaction & Motion Design",
];

export const testimonials = [
  {
    quote:
      "Working with Moheb was a different experience. He didn't just deliver designs he delivered a working product.",
    name: "Hossein Mahmoudvand",
    role: "Product Design Lead, SnappPay",
    photo: asset("Pbqe6AAIA2xNq5NIZmBMy2YGg8.jpeg"),
    photoAlt: "Hossein Mahmoudvand",
  },
  {
    quote:
      "Moheb built our entire design system in under a month. Every component was documented, every token was connected.",
    name: "Priya Nair",
    role: "Product Lead, Lumio SaaS",
    photo: asset("ha3LcxKJvi7M8Gj9DpRDKSplUoU.png"),
    photoAlt: "Priya Nair",
  },
  {
    quote:
      "I've hired a lot of freelancers. Moheb is the rare one who actually cares about the craft. He flagged things I hadn't even noticed.",
    name: "Daniel Hoffmann",
    role: "CTO, Trackflow HQ",
    photo: asset("R2ciXKhdnuMP1LL0NQj83MWKno.png"),
    photoAlt: "Daniel Hoffmann",
  },
];

export const retainer = [
  "Pause or cancel anytime",
  "One request at a time",
  "Avg. 48 hour turnaround",
  "Unlimited revisions",
  "Design + code delivered",
  "Up to 2 stakeholders",
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

const img = asset;

export const caseStudies: CaseStudy[] = [
  {
    slug: "building-a-perfect-design-system-from-zero",
    title: "Building a new experience",
    documentTitle: "Building a new experience - My Framer Site",
    description:
      "Joined the team when every screen was built in isolation — no tokens, no components, no shared language between design and engineering.",
    organisation: "SnappPay",
    role: "Product Designer",
    duration: "1 Years",
    tools: ["Figma"],
    related: [
      "redesigning-the-core-dashboard-of-saas-product",
      "launching-a-marketing-site-in-5-days",
    ],
    blocks: [
      { type: "wide", src: img("XB22gMlc8JhDmNfkgStDHPf0Y.png"), alt: "Lumio design system cover" },
      { type: "h", text: "Problem" },
      {
        type: "p",
        text: "Joined the team when every screen was built in isolation — no tokens, no components, no shared language between design and engineering. Four teams shipping UI that looked like four different products.",
      },
      {
        type: "pair",
        srcs: [img("FrYRyhlqJw11PYIRV7BVi24kxP0.png"), img("Q6q8CW8ze8LSqXQuoMoSqDQFnhU.png")],
        alt: "Design system screens",
      },
      { type: "h", text: "My role" },
      {
        type: "p",
        text: "I owned the entire design-to-code pipeline. Audited every existing screen, defined the token system, built the component library in Figma and React, and got all four teams using it within a month.",
      },
      { type: "h", text: "Outcome" },
      { type: "outcome", text: "Design system adopted by 4 product teams within 30 days of launch" },
      { type: "h", text: "How i solved it" },
      { type: "p", text: "The first thing I did was nothing.", strong: ["nothing"] },
      {
        type: "p",
        text: "No Figma, no components — just two weeks of pure audit. I went through every screen in the product and catalogued every button, every spacing decision, every color hardcoded differently by a different engineer on a different day.",
      },
      {
        type: "quote",
        text: "By the end I had a spreadsheet with 340 inconsistencies across 30 screens. That document became the brief.",
      },
      {
        type: "p",
        text: "Then I built the token system before touching a single component. Every color, spacing value, border radius, and typography decision was defined as a Figma variable and mirrored as a CSS custom property in the codebase. The rule was simple —",
        strong: ["token system", "Figma variable", "CSS custom property"],
      },
      { type: "quote", text: "If it isn't a token, it doesn't exist." },
      { type: "p", text: "That single constraint eliminated an entire category of future inconsistency." },
      {
        type: "p",
        text: "Components came last. Each one was built simultaneously in Figma and React — so there was never a moment where the design file and the codebase diverged. Every component shipped with default, hover, focused, and disabled states. Every decision had a written reason in Notion.",
        strong: ["simultaneously in Figma and React"],
      },
      {
        type: "p",
        text: "The goal wasn't just to build a system — it was to build one the team could maintain without me.",
        strong: ["it was to build one the team could maintain without me."],
      },
      { type: "wide", src: img("pYNekn8vLMKygFxfM1UUZRXG1is.png"), alt: "Component documentation" },
      { type: "h", text: "What shipped" },
      {
        type: "p",
        text: "60+ components across 8 categories — forms, navigation, data display, feedback, overlays, layout, typography, and actions.",
        strong: ["60+ components across 8 categories"],
      },
      {
        type: "p",
        text: "Every component was documented in Storybook with live examples, prop tables, and usage guidelines written for engineers — not designers.",
        strong: ["Storybook"],
      },
      {
        type: "quote",
        text: "The thing that made adoption fast wasn't the quality of the components — it was the documentation.",
      },
      {
        type: "p",
        text: "Engineers didn't have to ask questions because the answers were already there. The system went live to the first team in week 14. By week 16 all four product teams had migrated their active sprints onto the new components.",
        strong: ["week 14.", "week 16"],
      },
      { type: "h", text: "What worked" },
      {
        type: "p",
        text: "Auditing before designing saved weeks of rework. Building tokens first made everything downstream faster. Writing documentation as I built — not after — meant the team could adopt it immediately.",
      },
      { type: "h", text: "What I'd Do Differently" },
      {
        type: "p",
        text: "Involve engineers earlier in token naming — had to rename variables later. Ship a smaller v1 faster instead of covering every edge case before launch.",
      },
    ],
  },
  {
    slug: "redesigning-the-core-dashboard-of-saas-product",
    title: "Redesigning the Core Dashboard of saas product",
    documentTitle: "Redesigning the Core Dashboard of saas product - My Framer Site",
    description:
      "The old dashboard had 11 years of visual debt. I stripped it back, rebuilt every component in React, and shipped a version that cut user drop-off by 40%.",
    organisation: "Setare Aval",
    role: "Frontend + designer",
    duration: "3 month",
    tools: ["Figma"],
    related: [
      "building-a-perfect-design-system-from-zero",
      "launching-a-marketing-site-in-5-days",
    ],
    blocks: [
      { type: "wide", src: img("x8AZaTrGwEBNokQDHAdo0M7Ko1E.png"), alt: "Dashboard redesign cover" },
      { type: "h", text: "Problem" },
      {
        type: "p",
        text: "The dashboard had 11 years of visual debt — 30+ screens built by different people with no shared system. Users were dropping off at the core workflow screen at a 60% rate. Three different teams had built UI in completely different ways and nobody owned the problem.",
      },
      {
        type: "pair",
        srcs: [img("Rfu46onsfvhp0Ak0M3EQBArEs.png"), img("LZv1hqEg77zkK9SAWaEBlbQsdk.png")],
        alt: "Dashboard screens",
      },
      { type: "h", text: "My role" },
      {
        type: "p",
        text: "I led the full redesign — user research, information architecture, visual design, and frontend implementation in Next.js. Worked directly with the CTO and two engineers throughout.",
      },
      { type: "h", text: "Outcome" },
      { type: "outcome", text: "User drop-off reduced from 60% to 22% within 6 weeks of launch" },
      { type: "h", text: "How i solved it" },
      {
        type: "p",
        text: "The first thing I did was talk to users — 8 interviews in the first week. Not about what they wanted the dashboard to look like. About what they were actually trying to do every day and where they kept getting stuck. The answers were consistent and painful. Nobody could find anything. The navigation was built around the company's internal team structure, not around what users needed to accomplish. I redesigned the information architecture before touching a single visual. Grouped every feature by user job-to-be-done. That structural change alone solved more than half the confusion before any visual work started.",
        strong: ["8 interviews", "I redesigned the information architecture before touching a single visual."],
      },
      {
        type: "quote",
        text: "We didn't have a design problem. We had a structure problem wearing a design problem's clothes.",
      },
      {
        type: "p",
        text: "Then came the visual layer — a clean component system built in parallel between Figma and Next.js using feature flags so we could ship incrementally. Each section went live separately. We measured drop-off at every step. The data told us what was working before we committed to the full release.",
        strong: ["feature flags"],
      },
      { type: "wide", src: img("FK9sB8zfTqjqMGnssU0T7jvmVT0.png"), alt: "Shipped dashboard" },
      { type: "h", text: "What shipped" },
      {
        type: "p",
        text: "What shipped was a completely rebuilt dashboard — cleaner information hierarchy, 40% fewer clicks to reach core actions, and a consistent component system the engineering team now builds on top of.",
        strong: ["completely rebuilt dashboard"],
      },
      {
        type: "quote",
        text: "The thing that surprised the team most was how fast adoption happened — because we shipped incrementally, there was no big scary cutover.",
      },
      {
        type: "p",
        text: "The feature flag approach meant users were already familiar with most of the new UI before the full switch. Drop-off at the core workflow screen went from 60% to 22% within 6 weeks of launch.",
        strong: ["feature flag approach", "60% to 22%"],
      },
      { type: "h", text: "What worked" },
      {
        type: "p",
        text: "Shipping with feature flags — measuring impact at each step gave the whole team confidence. Starting with IA before visuals — solving structure first made every design decision faster and cheaper. Pairing with an engineer from day one — nothing got lost between design and build.",
      },
      { type: "h", text: "What I'd Do Differently" },
      {
        type: "p",
        text: "Run usability tests during the process not just at the end — caught some issues later than I should have. Document design decisions more thoroughly for whoever maintains it after me. Push for a design system conversation earlier — some inconsistency still remains.",
      },
    ],
  },
  {
    slug: "launching-a-marketing-site-in-5-days",
    title: "launching a Marketing Site in 5 Days",
    documentTitle: "launching a Marketing Site in 5 Days - My Framer Site",
    description:
      "Startup needed a launch site before their funding announcement. I designed and built the entire thing in Framer — live in 5 days, no handoff needed.",
    organisation: "Setare Aval",
    role: "Design engineer",
    duration: "1 Week",
    tools: ["Figma"],
    related: [
      "building-a-perfect-design-system-from-zero",
      "redesigning-the-core-dashboard-of-saas-product",
    ],
    blocks: [
      { type: "wide", src: img("he6cpeaxv0wi3oUfrfCFNRs6XD4.png"), alt: "Marketing site cover" },
      { type: "h", text: "Problem" },
      {
        type: "p",
        text: "Orion had a funding announcement in 5 days and no marketing site. Just a Figma file with rough brand guidelines, a product that hadn't been fully named yet, and a deadline that couldn't move for any reason.",
      },
      {
        type: "pair",
        srcs: [img("85cjVqSPEvndIM2ZhVg3z4nSv0.png"), img("GK79PxZLMAyKNWO4I8bvwQxEAJo.png")],
        alt: "Marketing site screens",
      },
      { type: "h", text: "My role" },
      {
        type: "p",
        text: "Everything — brand refinement, copy writing, visual design, Framer build, custom animations, CMS setup, domain connection, and deployment. Solo from brief to live in 5 days.",
      },
      { type: "h", text: "Outcome" },
      { type: "outcome", text: "Site live in 5 days, featured in 3 design newsletters the week of launch" },
      { type: "h", text: "How i solved it" },
      {
        type: "p",
        text: "Day 1 — story before pixels. I didn't open Framer on day one. I refined the brand, locked the color system, wrote every line of copy, and mapped the full page architecture. No visual work until the narrative was completely clear.",
        strong: ["Day 1 — story before pixels."],
      },
      { type: "quote", text: "If the story isn't right, the design doesn't matter. Fix the words first." },
      {
        type: "p",
        text: "Days 2 and 3 — design and build simultaneously. For marketing sites on a tight deadline I design directly in Framer. There's no Figma-to-Framer translation step, no drift between what was designed and what ships. What you see in the canvas is exactly what goes live.",
        strong: ["Days 2 and 3 — design and build simultaneously."],
      },
      {
        type: "p",
        text: "Days 4 and 5 — interactions, mobile, and launch. Scroll animations were the last thing added — not the first. Every animation had to earn its place by making the content clearer or the experience more memorable. Nothing decorative. Nothing that slowed the page down.",
        strong: ["Days 4 and 5 — interactions, mobile, and launch."],
      },
      { type: "wide", src: img("qHNFnBVn7NzTPs4iU6p1hR5HVlA.png"), alt: "Launched marketing site" },
      { type: "h", text: "What shipped" },
      {
        type: "p",
        text: "A fully animated Framer site — 6 sections, custom scroll interactions, CMS-powered updates section, mobile responsive at every breakpoint, SEO configured, Open Graph previews set, and live on a custom domain.",
        strong: ["fully animated Framer site"],
      },
      { type: "quote", text: "5 days. One person. No handoff. Just a brief and a deadline." },
      {
        type: "p",
        text: "The site was picked up by 3 design newsletters the week of launch and became one of the references Orion used in their investor deck to show design quality.",
        strong: ["3 design newsletters"],
      },
      { type: "h", text: "What worked" },
      {
        type: "p",
        text: "Locking copy and structure before any design — saved at least two rounds of visual rework. Designing directly in Framer — the speed advantage on a 5 day deadline was massive. Keeping animations purposeful and minimal — fast load time and no motion sickness complaints.",
      },
      { type: "h", text: "What I'd Do Differently" },
      {
        type: "p",
        text: "Set up analytics from day one — lost first-day traffic data by adding it after launch. Build a small component library even for a single-page site — some mobile inconsistency crept in. Brief the client on CMS editing before launch — had to do a walkthrough call the day after.",
      },
    ],
  },
  {
    slug: "prototyping-an-onboarding-flow-that-actually-converts",
    title: "Prototyping an Onboarding Flow That Actually Converts",
    documentTitle: "Prototyping an Onboarding Flow That Actually Converts - My Framer Site",
    description:
      "The original onboarding had a 60% drop-off at step two. I redesigned the flow in framer and handed devs production-ready specs.",
    organisation: "SnappBox",
    role: "Designer",
    duration: "6 Weeks",
    tools: ["Figma"],
    related: [
      "building-a-perfect-design-system-from-zero",
      "redesigning-the-core-dashboard-of-saas-product",
    ],
    blocks: [
      { type: "wide", src: img("XiTu2BPTU7JIvWJAftQBMCPViU.png"), alt: "Onboarding flow cover" },
      { type: "h", text: "Problem" },
      {
        type: "p",
        text: "Stackwise had an onboarding flow that was bleeding users before they ever saw the core product. 60% of new signups were dropping off at step two. The team had tried copy changes and button colour tests but nothing moved the number. The problem wasn't the words or the colours — it was the flow itself. Too many steps, too much asked too early, and zero sense of progress for the user.",
      },
      {
        type: "pair",
        srcs: [img("PawvToX6Eyw3zsycrcH2MTkppY.png"), img("Zjdx5OjB22com7ofEmN6cfyQaI.png")],
        alt: "Onboarding screens",
      },
      { type: "h", text: "My role" },
      {
        type: "p",
        text: "I owned the full UX redesign — user research, flow mapping, high-fidelity prototyping in Framer, micro-interaction design, and working with the engineering team to spec every interaction for production.",
      },
      { type: "h", text: "Outcome" },
      { type: "outcome", text: "Onboarding completion rate went from 38% to 84% in 4 weeks of launch" },
      { type: "h", text: "How i solved it" },
      {
        type: "p",
        text: "I started where the data was — session recordings of 40 users going through the existing onboarding. Watched where they hesitated, where they scrolled back up, where they closed the tab. The pattern was clear. Step two asked users to connect three integrations before they had any idea why they should care.",
        strong: ["session recordings of 40 users"],
      },
      {
        type: "quote",
        text: "You can't ask for commitment before you've shown value. The flow was asking people to invest before they understood what they were investing in.",
      },
      {
        type: "p",
        text: "I restructured the entire flow around a single principle — show the product working before asking for anything. Moved the value demonstration to step one. Made the integrations optional and movable to after activation. Reduced the mandatory steps from 7 to 3. Then prototyped every micro-interaction in Framer — progress indicators, step transitions, success states, error handling. Every state accounted for before a single line of production code was written. The engineering team had a prototype they could interact with instead of a Figma file they had to interpret.",
        strong: ["restructured the entire flow", "Framer"],
      },
      {
        type: "pair",
        srcs: [img("pI5fRuAePTer5u0hjDE1CdimJ4.png"), img("FGNUuNyHy6Ll1g01RlfMjBlcAo.png")],
        alt: "Prototype states",
      },
      { type: "h", text: "What shipped" },
      {
        type: "p",
        text: "A completely rebuilt onboarding flow — 3 mandatory steps instead of 7, a value demonstration before any integration requests, and smooth transitions between every state.",
        strong: ["completely rebuilt onboarding flow"],
      },
      {
        type: "quote",
        text: "The prototype was so close to production that engineering said it was the smoothest handoff they'd ever had.",
      },
      {
        type: "p",
        text: "Onboarding completion rate went from 38% to 84% within 4 weeks of the new flow going live. The team also reported a significant drop in support tickets about setup confusion in the first two weeks post-launch.",
        strong: ["38% to 84%", "significant drop in support tickets"],
      },
      { type: "h", text: "What worked" },
      {
        type: "p",
        text: "Watching session recordings before redesigning — showed the real problem instantly, no guessing. Prototyping every state in Framer — engineering had zero ambiguity during build. Moving value demonstration to step one — the single biggest lever on completion rate.",
      },
      { type: "h", text: "What I'd Do Differently" },
      {
        type: "p",
        text: "Test the prototype with real users before handing to engineering — caught one confusing step only after launch. Set up a more granular funnel tracking from day one to measure each step individually. Explore a more personalised onboarding path for different user types earlier in the process.",
      },
    ],
  },
];

export function getCase(slug: string) {
  return caseStudies.find((item) => item.slug === slug);
}

export function getProject(slug: string) {
  return projects.find((item) => item.slug === slug);
}
