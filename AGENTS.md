# AGENTS.md

Guidance for AI agents working in this repo. Verify against the executable
sources (package.json, astro.config.mjs, hooks) before trusting prose.

## Project

Personal CV of Pavel Mikheyev, a static Astro site deployed to GitHub Pages
as a project page under `/cv/`. Bilingual: English at `/`, Russian at `/ru/`
(Astro i18n model B - `prefixDefaultLocale: false`). `main` is the deployed
branch; `dev` is the working branch and is **not** deployed.

- Package manager: **bun**. Node `>=22.12.0` (`.nvmrc` pins 26).
- Resume content is Russian/English JSON, validated by a zod schema at build.

## Commands

| Command                | Action                                         |
| :--------------------- | :--------------------------------------------- |
| `bun install`          | Install deps                                   |
| `bun dev`              | Dev server at `localhost:4321/cv/` (note base) |
| `bun run build`        | Build to `./dist/`                             |
| `bun run preview`      | Preview the production build                   |
| `bunx astro check`     | Type-check `.astro`/TS (the only typecheck)    |
| `bun run lint`         | ESLint                                         |
| `bun run format`       | Prettier write                                 |
| `bun run format:check` | Prettier check                                 |

There is no test suite. Verify changes with: `bun run lint` ->
`bun run format:check` -> `bunx astro check` -> `bun run build`.

## Gotchas

- The dev server is at `localhost:4321/cv/`, not `/`. `base: "/cv/"`
  applies in dev too. `import.meta.env.BASE_URL` is exactly `/cv/` and
  must keep its trailing slash - string path concatenations rely on it
  (favicon, photo, lang prefix in `src/lib/jsonld.ts`).
- Commit style is enforced by a `commit-msg` hook (commitlint, Conventional
  Commits). Use a message **file** (`git commit -F <file>`), not multi-line
  `-m` - quotes break in the shell. English, imperative subject, no period.
- Before committing, ensure staged files do not intersect `.gitignore`
  (lint-staged aborts with "paths ignored"). `tmp/` and `legacy/` are
  gitignored.
- Hooks: `pre-commit` runs lint-staged (eslint --fix + prettier on staged
  `{astro,js,mjs,cjs,ts,css,json,md}`); `pre-push` runs the full
  `bunx astro check`.
- ESLint ignores `dist/`, `.astro/`, `node_modules/`, `legacy/`. TypeScript
  in `.astro` frontmatter is parsed by `@typescript-eslint/parser` but is
  **not** type-aware in lint - types are checked only by `astro check`.

## Architecture

Resume content lives in `src/data/cv/{en,ru}.json`, validated at build time
through an Astro content collection (`src/content.config.ts` -> zod schema
in `src/data/cv/schema.ts`). Components consume the inferred `Cv` type.
Pages load the entry via `getEntry("cv", lang)`:

- `src/pages/index.astro` -> en (root route)
- `src/pages/ru/index.astro` -> ru

- **Stylebook** (`src/pages/stylebook/[...slug].astro`) is a DEV-only page
  with all design tokens and live section samples. It is excluded from the
  prod build by an empty `getStaticPaths()` under `import.meta.env.PROD`, and
  its dock link is DEV-only too. Route is `/stylebook`, not `/__stylebook` -
  Astro drops underscore-prefixed paths from routing.
- **Keep both locale JSON files in the same shape.** `experience`,
  `education`, `courses` are sorted by date in code, so entry order in JSON
  does not matter.
- UI strings: flat dictionary in `src/lib/i18n.ts`, accessed via
  `t(lang, key)`. `t()` falls back to `ru` when the `en` value is empty.
- Date/link formatting: `src/lib/format.ts`. Periods use `"YYYY-MM"` with
  `end: null` meaning "present"; birth date is `"YYYY-MM-DD"`.
- JSON-LD `schema.org/Person` is built in `src/lib/jsonld.ts` from the CV
  entry + `Astro.site` + `BASE_URL`.
- Theme: `data-theme` on `<html>`, persisted in `localStorage`, applied
  pre-paint by an inline script in `BaseLayout.astro`. Theme toggle and
  print live in `src/components/Dock.astro`.
- Styles are plain CSS in `src/styles/` (variables/tokens, layout, print,
  fonts). `print.css` forces black-on-white A4 output regardless of theme.

## Migration reference (legacy/)

`legacy/` holds the original static HTML/CSS/JS site as a **local-only
reference** for the Astro migration - gitignored, not in the repo (original
preserved on `main`). Read it when reproducing markup/behavior, but never
edit or commit it.

## Workflow

- Session helper files (`ROADMAP.md`, `TASK.md`, `OVERVIEW.md`, etc.) live
  in `tmp/` (gitignored) and are recreated per session - they do not go into
  the repo.
- The user handles git themselves; do not run mutating git commands. To
  propose a commit, write the message to a file (e.g. `/tmp/cv-commit-msg.txt`)
  and hand over `git add` + `git commit -F` commands.
- Deploy is GitHub Actions (`.github/workflows/deploy.yml`) on push to
  `main` only, via `oven-sh/setup-bun@2` (pinned bun `1.3.14`) ->
  `bun install --frozen-lockfile` -> `bun run build` -> Pages deploy.
