import { SectionView } from "../components/Sections";
import { profile, sections } from "../data/content";

export function HomePage() {
  return (
    <main>
      <section className="inner hero" id="about">
        <div>
          <h1>
            {profile.heroTitle}
            {profile.heroImage ? <img src={profile.heroImage} alt="" /> : null}
          </h1>
          <p className="role">{profile.role}</p>
          <p className="lede">{profile.bio}</p>
          {profile.resume ? (
            <a className="cv" href={profile.resume} download={profile.resumeFileName || undefined}>
              {profile.resumeLabel}
            </a>
          ) : null}
        </div>
      </section>

      {sections.map((section) => (
        <SectionView key={section.id} section={section} />
      ))}
    </main>
  );
}
