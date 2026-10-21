import { socials } from "../data/content";

export function Socials() {
  return (
    <div className="socials">
      {socials.map((item) => {
        const mail = item.href.startsWith("mailto:");
        return (
          <a
            key={item.id}
            href={item.href}
            aria-label={item.label}
            {...(mail ? {} : { target: "_blank", rel: "noreferrer" })}
          >
            <img className={item.mono ? "mono" : undefined} src={item.icon} alt="" />
          </a>
        );
      })}
    </div>
  );
}
