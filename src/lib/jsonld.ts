// JSON-LD schema.org/Person для <head>. Данные берутся из локального CV-JSON,
// поэтому объект уже локализован (role/url зависят от языка страницы).
import type { Cv } from "../data/cv/schema";
import type { Locale } from "./format";

// Собирает объект Person для разметки. site - Astro.site (origin), base -
// import.meta.env.BASE_URL ("/cv/"). root = origin+base (напр. .../cv/); url
// строится по модели B (en на root, ru на root+"ru/"). sameAs - внешние
// профили (контакты с href), кроме утерянных (archived).
export function personSchema(
    data: Cv,
    lang: Locale,
    site: URL | undefined,
    base: string,
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
        image: `${root}${data.about.photo.replace(/^\//, "")}`,
        sameAs,
    };
}
