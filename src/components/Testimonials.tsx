import { useState } from "react";
import type { Section } from "../data/content";

export function Testimonials({ section }: { section: Extract<Section, { type: "testimonials" }> }) {
  const testimonials = section.items;
  const [index, setIndex] = useState(0);
  const item = testimonials[index];
  const step = (direction: number) => {
    setIndex((current) => (current + direction + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section" aria-labelledby="words-title">
      {section.kicker ? <p className="kicker">{section.kicker}</p> : null}
      <h2 id="words-title">{section.title}</h2>
      <article className="quote-card">
        {item.photo ? (
          <img src={item.photo} alt={item.name} loading="lazy" decoding="async" />
        ) : (
          <span className="quote-fallback" aria-hidden="true">
            {item.name
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0])
              .join("")}
          </span>
        )}
        <div>
          <h3>{item.quote}</h3>
          <p className="name">{item.name}</p>
          <p className="by">{item.role}</p>
          <div className="quote-nav">
            <button className="quote-arrow" type="button" aria-label="Previous" onClick={() => step(-1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3.5 5.5 8 10 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="dots" role="tablist" aria-label="Testimonials">
              {testimonials.map((entry, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-label={entry.name}
                  aria-current={i === index ? "true" : undefined}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
            <button className="quote-arrow" type="button" aria-label="Next" onClick={() => step(1)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}
