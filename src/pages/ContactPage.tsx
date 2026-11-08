import { FormEvent, useState } from "react";
import { ProjectCard } from "../components/ProjectCard";
import { ServiceList } from "../components/Sections";
import { Socials } from "../components/Socials";
import { Testimonials } from "../components/Testimonials";
import { contact, findSection, profile, projects } from "../data/content";

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const featured = projects.slice(0, 2);
  const work = findSection("work");
  const services = findSection("services");
  const testimonials = findSection("testimonials");

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
        <p className="kicker">{contact.kicker}</p>
        <h2>{contact.title}</h2>
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
            {services ? (
              <label>
                Service*
                <select name="service" required defaultValue={services.items[0]}>
                  {services.items.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>
            ) : null}
            <label>
              Message
              <textarea name="message" placeholder="Enter your message" />
            </label>
            <button type="submit">Submit</button>
            {sent ? <p className="success">{contact.successMessage}</p> : null}
          </form>
          <aside className="contact-card">
            {profile.avatar ? <img className="portrait-lg" src={profile.avatar} alt="Portrait" /> : null}
            {profile.available ? <span className="tag">{profile.availableText.toUpperCase()}</span> : null}
            <p className="who-line">{contact.cardLine}</p>
            <Socials />
          </aside>
        </div>
      </section>

      {work && featured.length ? (
        <section className="section inner" id="work">
          {work.kicker ? <p className="kicker">{work.kicker}</p> : null}
          <h2>{contact.workTitle}</h2>
          <div className="work-grid">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} layout="stack" />
            ))}
          </div>
        </section>
      ) : null}

      {services ? (
        <section className="section inner" id="service">
          {services.kicker ? <p className="kicker">{services.kicker}</p> : null}
          <h2>{services.title}</h2>
          <ServiceList items={services.items} />
        </section>
      ) : null}

      {testimonials ? (
        <div className="inner">
          <Testimonials section={testimonials} />
        </div>
      ) : null}
    </main>
  );
}
