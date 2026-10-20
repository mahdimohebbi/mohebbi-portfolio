import { Link } from "react-router-dom";
import type { Project } from "../data/content";

export function ProjectCard({ project, layout }: { project: Project; layout?: Project["homeLayout"] }) {
  const kind = layout ?? project.homeLayout;
  return (
    <Link className={`card card-${kind}`} to={`/case-study/${project.slug}`}>
      <div className="media">
        <img src={project.cover} alt="" />
      </div>
      <div className="copy">
        <h3>{project.title}</h3>
        <div className="meta">
          <span className="pill">{project.duration}</span>
          <span className="pill">{project.year}</span>
        </div>
        <p className="summary">{project.summary}</p>
        <div className="foot">
          <img src={project.logo} alt="" />
          <div>
            <strong>{project.company}</strong>
            <span>{project.role}</span>
          </div>
          <span className="arrow" aria-hidden="true">
            <svg className="arrow-right" width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg className="arrow-up" width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
