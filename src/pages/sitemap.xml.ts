// Minimal sitemap for the two locale pages. URLs come from canonicalUrl(),
// the same single source of truth as <link rel="canonical"> and the JSON-LD
// url (src/lib/canonical.ts) - so this never drifts from what search engines
// are told is the canonical page, regardless of which of the two builds
// (GitHub Pages / Cloudflare Pages) produced this file.
import type { APIRoute } from "astro";
import { canonicalUrl } from "../lib/canonical";
import type { Locale } from "../lib/format";

const locales: Locale[] = ["en", "ru"];

export const GET: APIRoute = () => {
    const urls = locales.map((lang) => canonicalUrl(lang));
    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>
`;

    return new Response(body, {
        headers: { "Content-Type": "application/xml" },
    });
};
