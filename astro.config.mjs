// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    // Origin GitHub Pages (по владельцу) + base = имя репозитория: сайт живет
    // как project page по адресу <site>/cv/. base влияет и на dev: сервер
    // отдает страницу на localhost:4321/cv/, ассеты - через import.meta.env.BASE_URL.
    // Слеш в конце обязателен: import.meta.env.BASE_URL отдается ровно как задано
    // ("/cv/"), и на него опираются строковые склейки путей (favicon, фото, lang).
    site: "https://yourdisenchantment.github.io",
    base: "/cv/",
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
