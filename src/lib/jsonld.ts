// JSON-LD schema.org/Person for <head>. Data comes from the local CV JSON,
// so the object is already localized (role/url depend on the page language).
import type { Cv } from "../data/cv/schema";
import type { Locale } from "./format";

// Builds the Person object for the markup. site - Astro.site (origin), base -
// import.meta.env.BASE_URL ("/cv/"). root = origin+base (e.g. .../cv/); url
// follows model B (en at root, ru at root+"ru/"). imagePath - the optimized
// photo URL from astro:assets (already includes base), absolutized against
// site. sameAs - external profiles (contacts with href), excluding lost ones
// (archived).
export function personSchema(
    data: Cv,
    lang: Locale,
    site: URL | undefined,
    base: string,
    imagePath: string,
) {
    const root = site ? new URL(base, site).href.replace(/\/?$/, "/") : base;
    const url = lang === "en" ? root : `${root}${lang}/`;
    const sameAs = data.contacts
        .filter((c) => c.href && !c.archived)
        .map((c) => c.href as string);

    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: data.about.name,
        jobTitle: data.about.role,
        url,
        image: site ? new URL(imagePath, site).href : imagePath,
        sameAs,
    };
}
