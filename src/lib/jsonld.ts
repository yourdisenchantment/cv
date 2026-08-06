// JSON-LD schema.org/Person for <head>. Data comes from the local CV JSON,
// so the object is already localized (role/url depend on the page language).
import type { Cv } from "../data/cv/schema";

// Builds the Person object for the markup.
//
// pageUrl - the page's canonical URL (see lib/canonical.ts). Passed in rather
// than derived from site+base, so that it agrees with <link rel="canonical">:
// the resume ships from two origins, and the two signals must not disagree
// about which one is the page.
//
// site - Astro.site, the origin this build is going to. Used only to
// absolutize imagePath, which is why it stays the deploy origin and not the
// canonical one: imagePath comes from astro:assets already carrying this
// build's base, so resolving it against another origin would point at a file
// that is not there.
//
// sameAs - external profiles (contacts with href), excluding lost ones
// (archived).
export function personSchema(
    data: Cv,
    site: URL | undefined,
    imagePath: string,
    pageUrl: string,
) {
    // contacts is an optional section - no contacts means no sameAs profiles.
    const sameAs = (data.contacts ?? [])
        .filter((c) => c.href && !c.archived)
        .map((c) => c.href as string);

    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: data.about.name,
        jobTitle: data.about.role,
        url: pageUrl,
        image: site ? new URL(imagePath, site).href : imagePath,
        sameAs,
    };
}
