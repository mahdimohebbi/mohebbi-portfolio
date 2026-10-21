import { FormEvent, useState } from "react";
import { ProjectCard } from "../components/ProjectCard";
import { Testimonials } from "../components/Testimonials";
import { asset, projects, serviceOptions, services } from "../data/content";
import { Socials } from "../components/Socials";

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const featured = projects.slice(0, 2);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (!name || !email) return;
    setSent(true);
  };

  return (
    <main>
      <section className="section inner contact-hero">
        <p className="kicker">// Contact me</p>
        <h2>Feel free to send me a message, I will get back to you as soon as possible.</h2>
        <div className="contact-grid">
          <form onSubmit={onSubmit}>
            <label>
              Name*
              <input name="name" required placeholder="John doe" autoComplete="name" />
            </label>
            <label>
              Email*
              <input name="email" type="email" required placeholder="john@framer.com" autoComplete="email" />
            </label>
            <label>
              Service*
              <select name="service" required defaultValue="UI & Product Design">
                {serviceOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label>
              Message
              <textarea name="message" placeholder="Enter your message" />
            </label>
            <button type="submit">Submit</button>
            {sent ? <p className="success">I'll reach you soon</p> : null}
          </form>
          <aside className="contact-card">
            <img className="portrait-lg" src={asset("iNf1aETYjPNKr0YUXZwmPYoK7ZI.png")} alt="Portrait" />
            <span className="tag">AVAILABLE</span>
            <p className="who-line">Zolt Mercer · Design engineer</p>
            <Socials />
          </aside>
        </div>
      </section>

      <section className="section inner" id="work">
        <p className="kicker">// Featured works</p>
        <h2>Have a look at some of my work</h2>
        <div className="work-grid">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} layout="stack" />
          ))}
        </div>
      </section>

      <section className="section inner" id="service">
        <p className="kicker">// Services i propvide</p>
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
    </main>
  );
}
