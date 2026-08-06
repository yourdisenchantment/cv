// Canonical address of the resume. It is deployed twice from the same source -
// GitHub Pages under <origin>/cv/ and Cloudflare Pages at the root of
// cv-325.pages.dev - so both serve byte-identical pages. To a crawler that is
// duplicate content, and it picks a winner on its own unless told which one
// counts. These constants tell it.
//
// Hardcoded on purpose, not derived from Astro.site / BASE_URL: those describe
// wherever the current build is headed, and the canonical URL has to name the
// same page regardless of which platform produced it. Flip the origin here to
// move the canonical to Cloudflare - it is the only place that decides.
import type { Locale } from "./format";

export const CANONICAL_ROOT = "https://yourdisenchantment.github.io/cv/";

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
