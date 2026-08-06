// Canonical address of the resume. It is deployed twice from the same source -
// GitHub Pages under <origin>/cv/ and Cloudflare Pages at the root of its own
// host - so both serve byte-identical pages. To a crawler that is
// duplicate content, and it picks a winner on its own unless told which one
// counts. These constants tell it.
//
// Hardcoded on purpose, not derived from Astro.site / BASE_URL: those describe
// wherever the current build is headed, and the canonical URL has to name the
// same page regardless of which platform produced it. This constant is the
// only place the choice is made - change it and both <link rel="canonical">
// and the JSON-LD url follow.
//
// Note this is the one spot where a *.pages.dev hostname is written down;
// astro.config.mjs deliberately reads it from CF_PAGES_URL instead. That is
// the trade for having a stable canonical: recreating the Pages project under
// a new name means editing this line, and the contact in the resume JSON.
import type { Locale } from "./format";

export const CANONICAL_ROOT = "https://mpavel-cv.pages.dev/";

/**
 * Absolute URL of a locale's page on the canonical deployment.
 *
 * Args:
 *   lang: page language. Follows the site's routing (model B): en lives at the
 *     root, every other locale under its own prefix.
 *
 * Returns:
 *   The absolute URL, with a trailing slash.
 */
export function canonicalUrl(lang: Locale): string {
    return lang === "en" ? CANONICAL_ROOT : `${CANONICAL_ROOT}${lang}/`;
}
