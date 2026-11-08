import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { projects, type Article, type CardItem, type ListSection, type Section } from "../data/content";
import { ProjectCard } from "./ProjectCard";
import { Testimonials } from "./Testimonials";
import { VideoCard } from "./VideoCard";

/** Renders one home-page section. `full` shows every item (used on a section's own page). */
export function SectionView({ section, full = false }: { section: Section; full?: boolean }) {
  switch (section.type) {
    case "work":
      return <WorkSection section={section} />;
    case "experience":
      return <ExperienceSection section={section} />;
    case "services":
      return (
        <section className="section inner" id={section.id}>
          <SectionHead section={section} />
          <ServiceList items={section.items} />
        </section>
      );
    case "testimonials":
      return (
        <div className="inner" id={section.id}>
          <Testimonials section={section} />
        </div>
      );
    case "videos":
      return (
        <ListShell section={section} full={full} className="video-grid">
          {(full ? section.items : section.items.slice(0, section.homeLimit)).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </ListShell>
      );
    case "cards":
      return (
        <ListShell section={section} full={full} className="video-grid">
          {(full ? section.items : section.items.slice(0, section.homeLimit)).map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </ListShell>
      );
    case "articles":
      return (
        <ListShell section={section} full={full} className="article-list">
          {(full ? section.items : section.items.slice(0, section.homeLimit)).map((item, index) => (
            <ArticleRow key={index} item={item} />
          ))}
        </ListShell>
      );
    case "text":
      return (
        <section className="section inner" id={section.id}>
          <SectionHead section={section} />
          <div className="text-block">
            {section.body
              .split(/\n{2,}/)
              .filter((paragraph) => paragraph.trim())
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            {section.buttonLabel && section.buttonUrl ? (
              <a className="show-more" href={section.buttonUrl} {...external(section.buttonUrl)}>
                {section.buttonLabel}
              </a>
            ) : null}
          </div>
        </section>
      );
  }
}

const external = (url: string) => (/^https?:\/\//.test(url) ? { target: "_blank", rel: "noreferrer" } : {});

function SectionHead({ section, action }: { section: { kicker: string; title: string }; action?: ReactNode }) {
  return (
    <>
      {section.kicker ? <p className="kicker">{section.kicker}</p> : null}
      {action ? (
        <div className="learn-head">
          <h2>{section.title}</h2>
          {action}
        </div>
      ) : (
        <h2>{section.title}</h2>
      )}
    </>
  );
}

function ListShell({ section, full, className, children }: { section: ListSection; full: boolean; className: string; children: ReactNode }) {
  const more = !full && section.page.enabled && section.items.length > section.homeLimit;
  return (
    <section className={full ? "section inner learn" : "section inner"} id={section.id}>
      <SectionHead
        section={section}
        action={
          more ? (
            <Link className="show-more" to={`/${section.page.slug}`}>
              Show more
            </Link>
          ) : undefined
        }
      />
      <div className={className}>{children}</div>
    </section>
  );
}

export function ServiceList({ items }: { items: string[] }) {
  return (
    <div className="services">
      {items.map((service, index) => (
        <p className="service" key={index}>
          {index + 1}. {service}
        </p>
      ))}
    </div>
  );
}

function WorkSection({ section }: { section: Extract<Section, { type: "work" }> }) {
  const feature = projects.find((project) => project.homeLayout === "feature") ?? projects[0];
  const stacked = projects.filter((project) => project.homeLayout === "stack" && project !== feature);
  const reverse = projects.find((project) => project.homeLayout === "reverse" && project !== feature);
  if (!feature) return null;
  return (
    <section className="section inner" id={section.id}>
      <SectionHead section={section} />
      <div className="work-list">
        <ProjectCard project={feature} layout="feature" />
        {stacked.length ? (
          <div className="work-grid">
            {stacked.map((project) => (
              <ProjectCard key={project.slug} project={project} layout="stack" />
            ))}
          </div>
        ) : null}
        {reverse ? <ProjectCard project={reverse} layout="reverse" /> : null}
      </div>
    </section>
  );
}

function ExperienceSection({ section }: { section: Extract<Section, { type: "experience" }> }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState({ top: 0, height: 0, fill: 0, active: 0 });

  useEffect(() => {
    const root = timelineRef.current;
    if (!root) return;

    const update = () => {
      const indexes = root.querySelectorAll<HTMLElement>(".index");
      if (indexes.length < 2) return;
      const rootTop = root.getBoundingClientRect().top;
      const centers = [...indexes].map((node) => {
        const rect = node.getBoundingClientRect();
        return rect.top + rect.height / 2;
      });
      const top = centers[0] - rootTop;
      const height = centers[centers.length - 1] - centers[0];
      const trigger = window.innerHeight * 0.55;
      const fill = Math.min(100, Math.max(0, ((trigger - centers[0]) / height) * 100));
      const active = centers.filter((center) => center <= trigger).length;
      setLine((current) =>
        Math.abs(current.top - top) < 0.5 &&
        Math.abs(current.height - height) < 0.5 &&
        Math.abs(current.fill - fill) < 0.4 &&
        current.active === active
          ? current
          : { top, height, fill, active },
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(root);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section className="section inner" id={section.id}>
      <SectionHead section={section} />
      <div className="timeline" ref={timelineRef}>
        <div className="timeline-track" style={{ top: line.top, height: line.height }} aria-hidden="true">
          <div className="timeline-fill" style={{ height: `${line.fill}%` }} />
        </div>
        {section.items.map((job, index) => (
          <article className="row" key={index}>
            <div className="rail">
              <div className={index < line.active ? "index active" : "index"}>{String(index + 1).padStart(2, "0")}</div>
            </div>
            <div className="job">
              <div className="company-line">
                {job.logo ? <img className={job.logoWhite ? "white" : undefined} src={job.logo} alt="" loading="lazy" decoding="async" /> : null}
                <span>{job.company}</span>
              </div>
              <h3>{job.title}</h3>
              <div className="dates">
                <span>{job.dates}</span>
                {job.span ? <span className={job.current ? "green" : "muted"}>{job.span}</span> : null}
              </div>
              {job.tags.length ? (
                <div className="tags">
                  {job.tags.map((tag) => (
                    <span className="pill" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
              {job.highlight ? <p className="highlight">{job.highlight}</p> : null}
              {job.body ? <p>{job.body}</p> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Card({ item }: { item: CardItem }) {
  const body = (
    <>
      {item.image ? (
        <div className="video-thumb">
          <img src={item.image} alt="" loading="lazy" decoding="async" />
        </div>
      ) : null}
      <div className="video-body">
        <p className="video-title">
          <bdi>{item.title}</bdi>
        </p>
        {item.description ? (
          <p className="video-desc">
            <bdi>{item.description}</bdi>
          </p>
        ) : null}
        {item.label || item.meta || item.url ? (
          <div className="video-meta">
            {item.label ? <span className="video-tag">{item.label}</span> : <span />}
            {item.meta ? <span className="video-date">{item.meta}</span> : null}
          </div>
        ) : null}
      </div>
    </>
  );
  return item.url ? (
    <a className="video-card" href={item.url} {...external(item.url)}>
      {body}
    </a>
  ) : (
    <div className="video-card">{body}</div>
  );
}

function ArticleRow({ item }: { item: Article }) {
  const meta = [item.source, item.date, item.readingTime].filter(Boolean);
  return (
    <a className="article-row" href={item.url} {...external(item.url)}>
      <div className="article-text">
        {meta.length ? <p className="article-meta">{meta.join(" · ")}</p> : null}
        <p className="article-title">
          <bdi>{item.title}</bdi>
        </p>
        {item.summary ? (
          <p className="article-summary">
            <bdi>{item.summary}</bdi>
          </p>
        ) : null}
      </div>
      {item.image ? (
        <div className="article-image">
          <img src={item.image} alt="" loading="lazy" decoding="async" />
        </div>
      ) : null}
      <span className="arrow" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
          <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}
