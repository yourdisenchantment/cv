# AGENTS.md

Guidance for AI agents working in this repo, and the only source of truth
for it - `CLAUDE.md` is a pointer here and holds no instructions of its own,
so edit this file alone. Verify against the executable sources
(package.json, astro.config.mjs, hooks) before trusting prose.

## Project

Personal CV of Pavel Mikheyev, a static Astro site deployed twice from one
source: GitHub Pages as a project page under `/cv/`, and Cloudflare Pages at
the root of its own `*.pages.dev` host. Bilingual: English at `/`, Russian at `/ru/`
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

- The dev server is at `localhost:4321/cv/`, not `/`. `base` applies in dev
  too, and dev follows the GitHub Pages branch (`CF_PAGES` unset), so it is
  `/cv/`. `import.meta.env.BASE_URL` is exactly `/cv/` and must keep its
  trailing slash - string path concatenations rely on it (favicon, photo,
  lang prefix in `src/components/Dock.astro`). `"/cv"` without the slash
  yields `/cvru/`.
- `base` and `site` switch on `process.env.CF_PAGES` in `astro.config.mjs`:
  Cloudflare sets it on every build and nothing else does. Do not reach for
  `NODE_ENV` here - Astro does not guarantee its value when the config is
  read, so the condition can collapse the wrong way silently. Verify a change
  to either branch by building both: `bun run build` and
  `CF_PAGES=1 bun run build`, then grep `dist/index.html` for the asset paths.
- The canonical URL is **not** derived from `base`/`site`. It is hardcoded in
  `src/lib/canonical.ts`, because both deployments serve identical pages and
  the canonical has to name the same one whichever platform built it. That
  file is the single place that decides which deployment search engines
  count; `personSchema` takes the same value so JSON-LD cannot disagree
  with `<link rel="canonical">`. Cloudflare is the canonical one, so this
  file is also the only spot holding a `*.pages.dev` hostname - deliberately,
  since `astro.config.mjs` avoids one on purpose. Recreating the Pages project
  under a new name means editing this constant **and** the site contact in
  `src/data/cv/{ru,en}.json`; the config itself needs nothing.
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
`en.example.json` next to them is a template covering every schema field;
it enters the collection and gets validated by the build, but no page uses
it. Pages load the entry via `getEntry("cv", lang)`:

Private data (phone) lives in `src/data/private.json` (**gitignored**, outside
the `cv/` collection; template: `private.example.json`). `Contacts.astro` reads
it via `import.meta.glob` (no file -> `{}` -> number not rendered), and the
phone row is **print-only**. So the deployed build/repo never contain the
number - it only reaches a locally generated PDF. Print with the number from a
local build, not the public site.

- `src/pages/index.astro` -> en (root route)
- `src/pages/ru/index.astro` -> ru

- **Stylebook** (`src/pages/stylebook/[...slug].astro`) is a DEV-only page
  with all design tokens and live section samples. It is excluded from the
  prod build by an empty `getStaticPaths()` under `import.meta.env.PROD`, and
  its dock link is DEV-only too. Route is `/stylebook`, not `/__stylebook` -
  Astro drops underscore-prefixed paths from routing.
- **Keep both locale JSON files in the same shape.** `experience`,
  `education`, `courses` are sorted by date and `publications` by their
  `year` field (newest first) in code, so entry order in JSON does not matter.
- **The resume is a kit: every section is optional** (only `meta` and `about`
  are required - they are the document identity). A missing key means the
  section is not part of this CV and renders nothing. An empty array renders
  nothing either, but leaves a red `[error]` marker in DEV
  (`DevError.astro`): an empty array means "declared and left unfilled", and
  silence would hide it.
- UI strings: flat dictionary in `src/lib/i18n.ts`, accessed via
  `t(lang, key)`. `t()` falls back to `ru` when the `en` value is empty.
- Date/link formatting: `src/lib/format.ts`. Periods use `"YYYY-MM"` with
  `end: null` meaning "present"; birth date is `"YYYY-MM-DD"`.
- JSON-LD `schema.org/Person` is built in `src/lib/jsonld.ts` from the CV
  entry + `Astro.site` + the page's canonical URL. `Astro.site` is only used
  to absolutize the photo, which must stay on the origin that built the page;
  the `url` field is the canonical one, so it matches `<link rel="canonical">`.
- Theme: `data-theme` on `<html>`, persisted in `localStorage`, applied
  pre-paint by an inline script in `BaseLayout.astro`. Theme toggle and
  print live in `src/components/Dock.astro`.
- Styles are plain CSS in `src/styles/` (variables/tokens, layout, print,
  fonts). `print.css` forces black-on-white A4 output regardless of theme.

## Needs checking (known, do not "fix" blindly)

Open questions deliberately left open. Ask before changing any of them -
otherwise the change reinstates an option that was already rejected.

- **`#about` print gap.** The `about-summary` paragraph sits at 10px on
  screen and 24px in print (the generic `.section-body > * + *` rule).
  `#research` got an override, `#about` did not: there it is a single gap
  between the info block and a paragraph, so the wider spacing may be
  intentional. Check it on paper before evening it out.
- **Stranded section headings in Firefox print.** Firefox does not
  implement `break-after: avoid` for paged media, so a heading can be left
  at the foot of a page without its section (seen on Experience and
  Publications; Chrome is fine). No CSS fixes it. Wrapping the heading and
  the first entry in one `break-inside: avoid` container is not a fix - it
  creates a 4-5cm unbreakable block, the exact problem that made dated
  entries fragmentable. Re-check in Firefox after any print change.
- **`overrides` in `package.json`** pin patched versions of transitive
  dependencies (`bun audit` -> clean). Nothing here needs babysitting: the
  ranges are carets, so `bun update` floats them upward on its own, and
  Dependabot keeps the parents current. They exist because Dependabot does
  **not** do security updates for the bun ecosystem - only version updates -
  so this block is what actually closes the advisories. Dropping an entry
  once its parent resolves the fix is optional tidying, not a chore: check
  by deleting the line, running `bun install && bun audit`, and keeping the
  deletion only if the result is still clean.
- **Scans in `public/documents/` are published on deploy** and reachable by
  direct URL, indexable, with no link from the page needed. The phone number
  lives in `private.json` and prints only on paper precisely so it stays off
  the public web - a scan that carries it on a letterhead would put it back.
  Read a document before adding it, and redact what the site is not meant to
  carry.

## Settled - do not re-open

Decisions already made and measured. Reversing one is a content call for
the user, not a cleanup.

- **Per-entry skill chips do not print.** `section:not(#skills) .skill-list`
  hides them; the standalone Skills section keeps its own. They repeated the
  same vocabulary a dozen times and cost most of a page. Screen is unchanged.
- **Research paragraphs are unbreakable in print**, unlike dated entries. A
  paragraph is 2-4cm, so the worst case is a short tail; a job entry is half
  a page, which is why the same rule was wrong there.
- **Page count is quantized by ~3cm unbreakable blocks.** Shaving words does
  not remove a page - measured three times, plus hiding duplicate
  publication URLs; the saving just moves to the next page. Only removing a
  whole block (a card, an entry) changes the count.
- **Numbers in the CV come from the code, not from memory.** The Thrive.io
  ETL bullets state mechanisms (anti-join replacing a per-group row
  comparison) and counts taken from notebook output. A speedup percentage
  nobody measured does not go in.

## Migration reference (legacy/)

`legacy/` holds the original static HTML/CSS/JS site as a **local-only
reference** for the Astro migration - gitignored, not in the repo (original
preserved on `main`). Read it when reproducing markup/behavior, but never
edit or commit it.

## Workflow

- **The dev server is a relay - only one owner of port 4321 at a time.**
  The user shuts theirs down before handing over a task; the agent starts
  its own (`cv-dev` in `.claude/launch.json`). When done, the agent **stops
  its server** and reminds the user to start theirs again for their own
  checking. If 4321 is held by someone else's process, do not start a second
  server on another port and do not kill theirs - tell the user it is still
  up.
- Check what is holding the port: `astro dev` serves live source with HMR,
  `astro preview` serves the built `dist/`, so edits are invisible there
  until `bun run build`. If a style change "does not apply", check this
  first (`ps -o command= -p <pid>`) before hunting for a CSS bug.
- Session helper files (`ROADMAP.md`, `TASK.md`, `OVERVIEW.md`, etc.) live
  in `tmp/` (gitignored) and are recreated per session - they do not go into
  the repo.
- The user handles git themselves; do not run mutating git commands. To
  propose a commit, write the message to a file (e.g. `/tmp/cv-commit-msg.txt`)
  and hand over `git add` + `git commit -F` commands.
- Two deploys, both on push to `main`, both from the same commit:
    - GitHub Actions (`.github/workflows/deploy.yml`) via `oven-sh/setup-bun@2`
      (pinned bun `1.3.14`) -> `bun install --frozen-lockfile` ->
      `bun run build` -> Pages deploy. Serves `/cv/`.
    - Cloudflare Pages builds the repo itself, no workflow in this repo. It
      sets `CF_PAGES`, which is what flips `base` to `/`. Serves the root of
      its own `*.pages.dev` host. Build command and output directory live in
      the Cloudflare dashboard, not here - if a build breaks there and not in
      Actions, look there first.
    - **bun is deliberately unpinned on both.** The workflow passes no
      `bun-version` (and `package.json` carries neither `packageManager` nor
      `engines.bun` for `setup-bun` to read, so it lands on latest); Cloudflare
      has `BUN_VERSION=latest`. Reproducibility comes from `bun.lock` plus
      `--frozen-lockfile`, not from the runtime version - so do not "fix" this
      by pinning one side, which would only make the two differ. To pin, pin
      both: `bun-version` in the workflow **and** `BUN_VERSION` in the
      Cloudflare dashboard, which reads no `.bun-version` file (`.nvmrc` works
      for Node, which is why that asymmetry is easy to trip over).
    - **No `*.pages.dev` hostname is hardcoded anywhere.** The `site` for that
      branch comes from `CF_PAGES_URL`, the URL Cloudflare is deploying to -
      in practice the deployment's own hashed URL, not the project alias. It
      feeds only the JSON-LD photo, so the churn is invisible; the canonical
      URL is decided elsewhere and never moves.
      That matters because the hostname is fixed when the Pages project is
      created and cannot be renamed - changing it means deleting the project
      and making a new one, and a hardcoded host would have to be chased
      afterwards. Preview deployments get their own preview URL there, which
      is also correct: that is where their assets actually live.
