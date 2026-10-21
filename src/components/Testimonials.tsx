import { useState } from "react";
import { testimonials } from "../data/content";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const item = testimonials[index];
  const step = (direction: number) => {
    setIndex((current) => (current + direction + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section" aria-labelledby="words-title">
      <p className="kicker">// good words</p>
      <h2 id="words-title">some good words from people I've worked with</h2>
      <article className="quote-card">
        {item.photo ? (
          <img src={item.photo} alt={item.photoAlt} />
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
                  key={entry.name}
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
