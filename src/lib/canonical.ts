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

// Every language the resume is published in. The single list for everything
// that has to enumerate them - the sitemap, the hreflang links - so adding a
// language is one edit here plus the content, not a hunt through the pages.
// (astro.config.mjs keeps its own for the router; that one is Astro's.)
export const LOCALES: readonly Locale[] = ["en", "ru"];

// Size of the link-preview card, in pixels. 1200x630 is the 1.91:1 shape every
// messenger and social network crops to. public/og-<lang>.jpg is drawn at
// exactly this size by scripts/og-images.mjs, which reads it from here.
export const OG_IMAGE = { width: 1200, height: 630 } as const;

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

/**
 * Absolute URL of a locale's link-preview image on the canonical deployment.
 *
 * Built from CANONICAL_ROOT, not from the build's own origin, for the same
 * reason the canonical URL is: the page people share is the canonical one,
 * and the image has to resolve from wherever that page's tags are read. The
 * file is a static asset in public/, so it sits at the root of the canonical
 * host.
 *
 * Args:
 *   lang: page language - each locale has its own card.
 *
 * Returns:
 *   The absolute URL of public/og-<lang>.jpg.
 */
export function ogImageUrl(lang: Locale): string {
    return `${CANONICAL_ROOT}og-${lang}.jpg`;
}
