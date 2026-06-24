// JSON-LD schema.org/Person для <head>. Данные берутся из локального CV-JSON,
// поэтому объект уже локализован (role/url зависят от языка страницы).
import type { Cv } from "../data/cv/schema";
import type { Locale } from "./format";

// Собирает объект Person для разметки. site - Astro.site (origin из конфига);
// url страницы строится по модели B (en на '/', ru на '/ru/'). sameAs -
// внешние профили (контакты с href), кроме утерянных (archived).
export function personSchema(data: Cv, lang: Locale, site: URL | undefined) {
    const base = site?.href.replace(/\/$/, "") ?? "";
    const url = lang === "en" ? `${base}/` : `${base}/${lang}/`;
    const sameAs = data.contacts
        .filter((c) => c.href && !c.archived)
        .map((c) => c.href as string);

    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: data.about.name,
        jobTitle: data.about.role,
        url,
        image: `${base}${data.about.photo}`,
        sameAs,
    };
}
