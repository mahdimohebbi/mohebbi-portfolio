import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ProjectCard } from "../components/ProjectCard";
import { Testimonials } from "../components/Testimonials";
import { VideoCard } from "../components/VideoCard";
import { CV_FILENAME, CV_URL, asset, experience, projects, services, videos } from "../data/content";

export function HomePage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState({ top: 0, height: 0, fill: 0, active: 0 });
  const feature = projects[0];
  const stacked = projects.filter((project) => project.homeLayout === "stack");
  const reverse = projects.find((project) => project.homeLayout === "reverse");

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
    <main>
      <section className="inner hero" id="about">
        <div>
          <h1>
            I am Moheb
            <img src={asset("jvGr0RTMInClAF2QT0iQSaByfE.png")} alt="" />
          </h1>
          <p className="role">Product Designer</p>
          <p className="lede">
            Product Designer with 5+ years of experience turning complex systems into intuitive, scalable digital products. I don’t just bridge design and strategy. I craft high-impact user experiences from the first concept to the final pixel.
          </p>
          <a className="cv" href={CV_URL} download={CV_FILENAME}>
            Download Resume
          </a>
        </div>
      </section>

      <section className="section inner" id="work">
        <p className="kicker">// Featured works</p>
        <h2>These are ones that taught me the most</h2>
        <div className="work-list">
          <ProjectCard project={feature} layout="feature" />
          <div className="work-grid">
            {stacked.map((project) => (
              <ProjectCard key={project.slug} project={project} layout="stack" />
            ))}
          </div>
          {reverse ? <ProjectCard project={reverse} layout="reverse" /> : null}
        </div>
      </section>

      <section className="section inner" id="experience">
        <p className="kicker">//Experience</p>
        <h2>Where i'm good and where i learned from</h2>
        <div className="timeline" ref={timelineRef}>
          <div className="timeline-track" style={{ top: line.top, height: line.height }} aria-hidden="true">
            <div className="timeline-fill" style={{ height: `${line.fill}%` }} />
          </div>
          {experience.map((job, index) => (
            <article className="row" key={job.index}>
              <div className="rail">
                <div className={index < line.active ? "index active" : "index"}>{job.index}</div>
              </div>
              <div className="job">
                <div className="company-line">
                  {job.logo ? <img className={job.logoTone === "white" ? "white" : undefined} src={job.logo} alt="" /> : null}
                  <span>{job.company}</span>
                </div>
                <h3>{job.title}</h3>
                <div className="dates">
                  <span>{job.dates}</span>
                  <span className={job.spanTone}>{job.span}</span>
                </div>
                <div className="tags">
                  {job.tags.map((tag) => (
                    <span className="pill" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="highlight">{job.highlight}</p>
                <p>{job.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section inner" id="service">
        <p className="kicker">// Services i provide</p>
        <h2>I can help you with these things</h2>
        <div className="services">
          {services.map((service) => (
            <p className="service" key={service}>
              {service}
            </p>
          ))}
        </div>
      </section>

      <section className="section inner" id="learn">
        <p className="kicker">// Learn together</p>
        <div className="learn-head">
          <h2>Latest videos from my YouTube channel</h2>
          <Link className="show-more" to="/learn-together">
            Show more
          </Link>
        </div>
        <div className="video-grid">
          {videos.slice(0, 3).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      <div className="inner">
        <Testimonials />
      </div>
    </main>
  );
}
