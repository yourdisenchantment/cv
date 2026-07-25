# CV - Pavel Mikheyev

Personal resume built with [Astro](https://astro.build/) as a static site and
deployed to GitHub Pages.

Live: https://yourdisenchantment.github.io/cv/

## Features

- **Bilingual** (i18n model B): English at `/`, Russian at `/ru/`. UI strings
  and resume content are localized; a language switcher links between locales.
- **Light/dark theme** via `data-theme` on `<html>`, persisted in
  `localStorage`, defaulting to `prefers-color-scheme`. Applied before first
  paint to avoid a flash.
- **Print / PDF** as a real A4 document (`@media print`): black on white
  regardless of theme, controlled page breaks, outlined chips to save ink.
- **Accessibility**: WCAG AA contrast, visible keyboard focus, dismissible
  tooltips, reduced-motion support.
- **Content as data**: the resume lives in JSON validated by a zod schema -
  editing JSON updates the page without touching components.
- **Self-hosted fonts** (Inter, JetBrains Mono, Material Symbols), no external
  requests; `schema.org/Person` JSON-LD for SEO.

## Stack

- [Astro](https://astro.build/) 6 (static output, SSG), TypeScript (strict).
- Package manager: **bun**. Node `>=22.12.0`.
- [zod](https://zod.dev/) for the resume data schema.
- ESLint (astro + jsx-a11y) and Prettier; git hooks via husky + lint-staged;
  commit style enforced by commitlint (Conventional Commits).

## Project structure

```text
src/
├── components/
│   ├── cv/            # resume sections (About, Experience, Projects, ...)
│   └── Dock.astro     # floating control bar (theme, language, print, source)
├── data/
│   ├── cv/            # resume content: en.json / ru.json + zod schema
│   └── private.json   # gitignored: print-only phone (see below)
├── layouts/           # BaseLayout (html/head, theme + tooltip scripts)
├── lib/               # i18n, date/link formatting, JSON-LD builder
├── pages/             # routes: / (en), /ru/ (ru)
└── styles/            # tokens (variables.css), layout, print, fonts
public/                # static assets (favicon, images, document scans)
```

## Editing content

Resume content is in `src/data/cv/en.json` and `src/data/cv/ru.json`, validated
on build by the zod schema in `src/data/cv/schema.ts`. Keep both locale files in
the same shape. Experience, education and courses are sorted by date and
publications by their `year` field (newest first) in code, so entry order in
JSON does not matter. `en.example.json` is a template covering every field.

### Private data

The phone number lives in `src/data/private.json`, which is gitignored (copy
`private.example.json` and fill it in). The contacts block reads it at build
time and renders it print-only, so the number reaches a locally generated PDF
but never the deployed HTML or this repository. To print a PDF with the number,
build locally (`bun run build && bun run preview`) rather than using the public
site.

## Commands

| Command            | Action                               |
| :----------------- | :----------------------------------- |
| `bun install`      | Install dependencies                 |
| `bun dev`          | Dev server at `localhost:4321/cv/`   |
| `bun run build`    | Production build to `./dist/`        |
| `bun run preview`  | Preview the production build locally |
| `bunx astro check` | Type-check `.astro`/TS templates     |
| `bun run lint`     | ESLint (astro + jsx-a11y)            |
| `bun run format`   | Format with Prettier                 |

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds the site with
bun and publishes it to GitHub Pages on every push to `main`. The site is served
as a project page under `/cv/`, set via `base` in `astro.config.mjs`.

Repository setting required once: **Settings -> Pages -> Source = GitHub
Actions**.
