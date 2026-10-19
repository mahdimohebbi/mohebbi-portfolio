import { useState } from "react";
import { testimonials } from "../data/content";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const item = testimonials[index];

  return (
    <section className="section" aria-labelledby="words-title">
      <p className="kicker">// good words</p>
      <h2 id="words-title">some good words from people I've worked with</h2>
      <article className="quote-card">
        <img src={item.photo} alt={item.photoAlt} />
        <div>
          <h3>{item.quote}</h3>
          <p className="name">{item.name}</p>
          <p className="by">{item.role}</p>
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
        </div>
      </article>
    </section>
  );
}
