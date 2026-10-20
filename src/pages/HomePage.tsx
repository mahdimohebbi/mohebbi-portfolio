import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ProjectCard } from "../components/ProjectCard";
import { Testimonials } from "../components/Testimonials";
import { CV_FILENAME, CV_URL, asset, experience, projects, retainer, services } from "../data/content";

export function HomePage() {
  const [progress, setProgress] = useState(8);
  const feature = projects[0];
  const stacked = projects.filter((project) => project.homeLayout === "stack");
  const reverse = projects.find((project) => project.homeLayout === "reverse");

  useEffect(() => {
    const onScroll = () => {
      const timeline = document.getElementById("experience");
      if (!timeline) return;
      const rect = timeline.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.4;
      const seen = Math.min(Math.max(-rect.top, 0), total);
      setProgress(Math.round((seen / total) * 100));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main>
      <section className="inner hero" id="about">
        <div>
          <p className="badge">
            <i />
            Available
          </p>
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
        <div className="lanyard" aria-hidden="true">
          <div className="cord" />
          <div className="clip" />
          <div className="portrait">
            <img src={asset("iNf1aETYjPNKr0YUXZwmPYoK7ZI.png")} alt="Mohammad Mahdi Mohebbi" />
          </div>
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
        <div className="timeline">
          {experience.map((job, index) => (
            <article className="row" key={job.index}>
              <div className="rail">
                <div className="index">{job.index}</div>
                <div className="fill" style={{ ["--fill" as string]: `${Math.max(0, Math.min(100, progress - index * 22))}%` }} />
              </div>
              <div className="job">
                <div className="company-line">
                  <img src={job.logo} alt="" />
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

      <div className="inner">
        <Testimonials />
      </div>

      <section className="section inner" id="how-it-work">
        <p className="kicker">// How it works</p>
        <h2>No agencies - just me, fully in on your product</h2>
        <div className="pricing">
          <div className="price-photo">
            <img src={asset("nYmXZiNjSPyLZtY9JlqcEE5i8.png")} alt="Mohammad Mahdi Mohebbi" />
            <span className="tag">AVAILABLE</span>
            <p>Mohammad Mahdi Mohebbi</p>
            <p className="sub">Product Designer</p>
          </div>
          <div className="price-copy">
            <h3>Monthly Retainer</h3>
            <p className="sub">One design engineer dedicated to your product.</p>
            <p className="sub">I design it, build it, and ship it - start to finish, no middleman.</p>
            <ul className="checks">
              {retainer.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link className="connect" to="/contact-me">
              Let's connect →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
