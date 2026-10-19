# Mohebbiam

A production reconstruction of the product design portfolio at [mohebbiam.framer.website](https://mohebbiam.framer.website/).

The visual system, copy, project imagery, and routes follow the published Framer site. This is a React application, not a Framer export.

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

Vite prints a local URL. Open it in a browser.

## Production build

```bash
npm run build
npm run preview
```

`npm run build` typechecks with TypeScript and writes the static site to `dist/`.

## Project structure

- `src/pages` — home, case studies, contact, and the missing-page route
- `src/components` — shared chrome, project cards, testimonials, and rich text
- `src/data/content.ts` — portfolio copy and asset references
- `src/styles/global.css` — design tokens and layout
- `public/assets/images` — images retrieved from the published site

## Routes

- `/` home
- `/case-study/:slug` each case study
- `/contact-me` contact form
- any other path shows the not-found page

The contact form checks the required fields in the browser and shows “I'll reach you soon”. It does not send email; the original form is hosted by Framer.

## Notes

- Dark mode matches the published site. The rail button switches to the light palette and remembers the choice.
- The live clock uses the visitor’s local time, which is how the published header behaved during inspection.
- The contact portrait card keeps the name “Zolt Mercer” because that is the text on the published page.
