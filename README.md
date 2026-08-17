# CV - Pavel Mikheyev

Personal resume built with [Astro](https://astro.build/) as a static site,
deployed to GitHub Pages and Cloudflare Pages from the same source.

Live: https://mpavel-cv.pages.dev/ (canonical)
Mirror: https://yourdisenchantment.github.io/cv/

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

- [Astro](https://astro.build/) 7 (static output, SSG), TypeScript (strict).
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
├── pages/             # routes: / (en), /ru/ (ru), sitemap.xml, stylebook (dev only)
└── styles/            # tokens (variables.css), layout, print, fonts
public/                # static assets (favicon, images, document scans)
```

## Editing content

Resume content is in `src/data/cv/en.json` and `src/data/cv/ru.json`, validated
on build by the zod schema in `src/data/cv/schema.ts`. Keep both locale files in
the same shape. Experience, education and courses are sorted by date and
publications by their `year` field (newest first) in code, so entry order in
JSON does not matter. `en.example.json` is a template covering every field.

The resume is a kit: every section is optional (only `meta` and `about` are
required). Drop a key and the section is left out; an empty array leaves it out
too, but shows a red `[error]` marker in dev, since an empty array means the
section was declared and never filled.

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

## Development

`/cv/stylebook` is a DEV-only page - the Dock links to it in dev, and its
`getStaticPaths` returns nothing in production, so it never ships. It shows the
design tokens (colours, type scale, spacing) next to live samples of every
resume section, rendered from self-contained dummy data, so a component can be
checked without touching real content.

In dev the `<body>` also carries `debug-boxes`, which outlines the hovered
element to reveal box edges; turn it off in devtools with
`document.body.classList.remove('debug-boxes')`.

## Deployment

The site is published twice from the same commit on every push to `main`:

- **GitHub Pages** - a workflow (`.github/workflows/deploy.yml`) builds with bun
  and publishes it. Served as a project page under `/cv/`.
- **Cloudflare Pages** - builds the repository directly, no workflow here.
  Served at the root of its `*.pages.dev` host. Build command
  `bun install --frozen-lockfile && bun run build`, output directory `dist`,
  both set in the Cloudflare dashboard.

The only difference between them is whether the site sits at the origin root, so
`base` and `site` switch on `CF_PAGES`, which Cloudflare sets on every build:

```js
const onCloudflare = Boolean(process.env.CF_PAGES);
site: onCloudflare ? process.env.CF_PAGES_URL : "https://yourdisenchantment.github.io",
base: onCloudflare ? "/" : "/cv/",
```

No `*.pages.dev` hostname appears in the source: `CF_PAGES_URL` is the URL
Cloudflare is deploying to, so recreating the Pages project under a different
name needs no code change. Note that on Cloudflare it is the deployment's own
URL, hash prefix and all - it feeds only the JSON-LD photo, never the canonical.

Neither build pins bun - both take the latest release, deliberately. What keeps
the two outputs identical is `bun.lock` plus `--frozen-lockfile`, not the
version of the runtime: the lockfile fixes the dependency tree, and the flag
makes a build fail loudly rather than quietly resolve something else. The
trade is that a bad bun release can break both deploys at once; the cost of
that is a stale site until it is fixed, since a failed build never replaces
what is already published.

To pin after all, both sides need doing: `bun-version` in the workflow, and a
`BUN_VERSION` variable in the Cloudflare project settings - Cloudflare reads no
`.bun-version` file, unlike `.nvmrc` for Node.

Check both branches after touching either one:

```bash
bun run build && CF_PAGES=1 bun run build
```

Both deployments serve identical pages, so every page declares a canonical URL
pointing at one of them - Cloudflare. That choice lives in
`src/lib/canonical.ts`, deliberately independent of `base`/`site`, and it is
the only file that decides; both `<link rel="canonical">` and the JSON-LD `url`
read from it. It is also the only place a `*.pages.dev` hostname is written
down, so recreating the Pages project means editing it and the site contact in
`src/data/cv/{ru,en}.json`.

`sitemap.xml` reads from the same file. It is an endpoint
(`src/pages/sitemap.xml.ts`), not a static asset, so its two `<loc>` entries
are generated by `canonicalUrl()` and cannot drift from what the pages declare
about themselves; both builds emit the same file. `public/robots.txt` is
static and points at the canonical sitemap - on Cloudflare it lands at the
origin root, on GitHub Pages under `/cv/`, where crawlers do not look for it,
which is fine for the deployment that is not canonical.

Repository setting required once: **Settings -> Pages -> Source = GitHub
Actions**.
