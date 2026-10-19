import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProjectCard } from "../components/ProjectCard";
import { RichText } from "../components/RichText";
import { getCase, getProject } from "../data/content";
import { NotFoundPage } from "./NotFoundPage";

export function CaseStudyPage() {
  const { slug = "" } = useParams();
  const study = getCase(slug);
  const [points, setPoints] = useState(0);

  useEffect(() => {
    if (!study) return;
    document.title = study.documentTitle;
    const previous = document.querySelector('meta[name="description"]');
    const prior = previous?.getAttribute("content") ?? "";
    previous?.setAttribute("content", study.description);
    return () => {
      document.title = "Mohebbiam";
      previous?.setAttribute("content", prior);
    };
  }, [study]);

  useEffect(() => {
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setPoints(height > 0 ? Math.round((window.scrollY / height) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  if (!study) return <NotFoundPage />;

  const hero = study.blocks.find((block) => block.type === "wide");
  const body = study.blocks.filter((block) => block !== hero);
  const related = study.related.map((id) => getProject(id)).filter((item) => item !== undefined);

  return (
    <article className="case inner">
      <div className="progress" aria-live="polite">
        <b>{points}%</b> Points
      </div>
      <Link className="back" to="/">
        ‹ Back to home
      </Link>
      <h1>{study.title}</h1>
      {hero && hero.type === "wide" ? (
        <div className="hero-shot">
          <img src={hero.src} alt={hero.alt} />
        </div>
      ) : null}
      <dl className="facts">
        <div>
          <dt>
            <small>Organisation</small>
          </dt>
          <dd>
            <strong>{study.organisation}</strong>
          </dd>
        </div>
        <div>
          <dt>
            <small>Role</small>
          </dt>
          <dd>
            <strong>{study.role}</strong>
          </dd>
        </div>
        <div>
          <dt>
            <small>Duration</small>
          </dt>
          <dd>
            <strong>{study.duration}</strong>
          </dd>
        </div>
        <div>
          <dt>
            <small>Tools & Technologies</small>
          </dt>
          <dd>
            {study.tools.map((tool) => (
              <span className="tool" key={tool}>
                {tool}
              </span>
            ))}
          </dd>
        </div>
      </dl>
      <div className="prose">
        {body.map((block, index) => {
          if (block.type === "h") return <h2 key={index}>{block.text}</h2>;
          if (block.type === "p") {
            return (
              <p key={index}>
                <RichText text={block.text} strong={block.strong} />
              </p>
            );
          }
          if (block.type === "quote") {
            return (
              <blockquote className="pull" key={index}>
                <p>{block.text}</p>
              </blockquote>
            );
          }
          if (block.type === "outcome") {
            return (
              <p className="outcome" key={index}>
                <span aria-hidden="true">●</span> {block.text}
              </p>
            );
          }
          if (block.type === "pair") {
            return (
              <div className="pair" key={index}>
                {block.srcs.map((src) => (
                  <img key={src} src={src} alt={block.alt} loading="lazy" />
                ))}
              </div>
            );
          }
          return (
            <div className="wide-shot" key={index}>
              <img src={block.src} alt={block.alt} loading="lazy" />
            </div>
          );
        })}
      </div>
      <section className="section">
        <p className="kicker">// Other works</p>
        <h2>Have a look at my other work</h2>
        <div className="work-grid">
          {related.map((project) => (
            <ProjectCard key={project.slug} project={project} layout="stack" />
          ))}
        </div>
      </section>
    </article>
  );
}
