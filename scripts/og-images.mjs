// Draws the link-preview cards: public/og-en.jpg and public/og-ru.jpg.
//
// A card is a static image, so it does not follow the CV data by itself - run
// this again whenever the name, the role or the photo change, and commit the
// result. Name and role come from the same JSON the site renders, the photo
// from src/assets, the size and the host from src/lib/canonical.ts, so there is
// nothing to retype here.
//
// Not wired into the build and not a project dependency: it needs a browser,
// and the project has none. Run it with bun from any directory that has
// playwright-core installed - it is looked up in the working directory, not in
// the repo:
//
//   cd "$(mktemp -d)" && bun add playwright-core
//   bun <repo>/scripts/og-images.mjs
//
// CHROMIUM_PATH points at a Chromium binary when Playwright has none of its
// own; CHROMIUM_NO_SANDBOX=1 is for running as root inside a container.
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CANONICAL_ROOT, LOCALES, OG_IMAGE } from "../src/lib/canonical.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = (...parts) => path.join(root, ...parts);

let chromium;
try {
    const require = createRequire(path.join(process.cwd(), "noop.js"));
    ({ chromium } = require("playwright-core"));
} catch {
    console.error(
        "playwright-core not found in the working directory. Run:\n" +
            '  cd "$(mktemp -d)" && bun add playwright-core\n' +
            "and start this script from there.",
    );
    process.exit(1);
}

// Fonts and photo go in as data: URIs. The page is set from a string, so it
// has no file origin to load siblings from, and a card must not depend on
// anything outside this process anyway.
const dataUri = (p, mime) =>
    `data:${mime};base64,${readFileSync(p).toString("base64")}`;
const font = (name) => dataUri(file("src", "fonts", name), "font/woff2");

// Same split the site's fonts.css uses: one file per script, picked per glyph.
const LATIN =
    "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+20AC, U+2122, U+2212";
const CYRILLIC = "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116";
const face = (family, style, name, range) =>
    `@font-face{font-family:"${family}";font-style:${style};font-weight:100 900;` +
    `src:url(${font(name)}) format("woff2");unicode-range:${range}}`;

const css = `
${face("Inter", "normal", "inter-latin.woff2", LATIN)}
${face("Inter", "normal", "inter-cyrillic.woff2", CYRILLIC)}
${face("JetBrains Mono", "italic", "jetbrains-mono-italic-latin.woff2", LATIN)}
${face("JetBrains Mono", "italic", "jetbrains-mono-italic-cyrillic.woff2", CYRILLIC)}
${face("JetBrains Mono", "normal", "jetbrains-mono-latin.woff2", LATIN)}
* { box-sizing: border-box; margin: 0 }
body { width: ${OG_IMAGE.width}px; height: ${OG_IMAGE.height}px; display: flex;
       align-items: center; background: #fff; font-family: "Inter", sans-serif }
.text { flex: 1; align-self: stretch; padding: 76px 40px 72px 84px;
        display: flex; flex-direction: column; justify-content: space-between }
h1 { font-size: 66px; line-height: 1.08; font-weight: 700; color: #000;
     letter-spacing: -0.01em }
.role { margin-top: 30px; font-family: "JetBrains Mono", monospace;
        font-style: italic; font-size: 27px; line-height: 1.4; color: #616161 }
.host { font-family: "JetBrains Mono", monospace; font-size: 24px; color: #616161 }
.photo { width: 424px; height: 510px; margin-right: 60px; flex: none }
.photo img { width: 100%; height: 100%; object-fit: cover; object-position: center top }
`;

const photo = dataUri(
    file("src", "assets", "images", "my-face.jpg"),
    "image/jpeg",
);
const host = new URL(CANONICAL_ROOT).host;
const escape = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
    args: process.env.CHROMIUM_NO_SANDBOX ? ["--no-sandbox"] : [],
});
const page = await browser.newPage({ viewport: OG_IMAGE });

for (const lang of LOCALES) {
    const { about } = JSON.parse(
        readFileSync(file("src", "data", "cv", `${lang}.json`), "utf8"),
    );
    await page.setContent(
        `<style>${css}</style><body>
           <div class="text">
             <div><h1>${escape(about.name)}</h1><p class="role">${escape(about.role)}</p></div>
             <p class="host">${host}</p>
           </div>
           <div class="photo"><img src="${photo}" alt=""></div>
         </body>`,
    );
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.images[0].complete);
    const out = file("public", `og-${lang}.jpg`);
    await page.screenshot({ path: out, type: "jpeg", quality: 88 });
    console.log("written", path.relative(root, out));
}
await browser.close();
