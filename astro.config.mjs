// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    // Origin для GitHub Pages (по владельцу репозитория). Provisorio:
    // финализируется на этапе 10 (деплой). base не задаем, чтобы dev жил на '/'.
    site: "https://yourdisenchantment.github.io",
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
