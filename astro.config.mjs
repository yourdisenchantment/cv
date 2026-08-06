// @ts-check
import { defineConfig } from "astro/config";

// Сайт публикуется в двух местах, и они отличаются только тем, лежит ли он в
// корне origin'а. GitHub Pages отдает его как project page, <site>/cv/, поэтому
// base = имя репозитория. Cloudflare Pages отдает его в корне своего домена,
// и там base обязан быть "/", иначе ассеты уезжают в несуществующий /cv/_astro/.
//
// Признак - CF_PAGES: Cloudflare выставляет его на каждой своей сборке и больше
// его не выставляет никто, так что одной этой проверки достаточно. NODE_ENV для
// такого не годится: Astro не гарантирует его значение на момент чтения конфига,
// и условие может молча схлопнуться не в ту сторону.
//
// Локальная разработка идет по ветке GitHub Pages (CF_PAGES не задан): сервер
// отдает страницу на localhost:4321/cv/, как и раньше.
//
// Слеш в конце base обязателен: import.meta.env.BASE_URL отдается ровно как
// задано, и на него опираются строковые склейки путей (favicon, фото, lang).
// "/cv" без слеша дал бы "/cvru/" вместо "/cv/ru/".
// Хост Cloudflare берется из CF_PAGES_URL ("the URL of the current deployment"),
// а не хардкодится: имя проекта на pages.dev нельзя переименовать, его меняют
// пересозданием проекта, и хардкод пришлось бы править следом. Для preview-сборок
// переменная дает адрес самого превью - это тоже верно, ассеты лежат именно там.
// site на ветке Cloudflare нужен только чтобы сделать абсолютным путь к фото в
// JSON-LD; канонический адрес задан отдельно и от платформы не зависит
// (src/lib/canonical.ts). Если переменной вдруг не окажется, site станет
// undefined - Astro это допускает, а jsonld.ts отдаст относительный путь.
const onCloudflare = Boolean(process.env.CF_PAGES);

// https://astro.build/config
export default defineConfig({
    site: onCloudflare
        ? process.env.CF_PAGES_URL
        : "https://yourdisenchantment.github.io",
    base: onCloudflare ? "/" : "/cv/",
    i18n: {
        // en -> '/', ru -> '/ru/'. Английский по умолчанию (модель B): все
        // попадают на en, русский - переключением. См. ROADMAP этап 6.
        defaultLocale: "en",
        locales: ["ru", "en"],
        routing: {
            prefixDefaultLocale: false,
        },
    },
});
