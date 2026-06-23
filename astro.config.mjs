// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
    // Origin для GitHub Pages (по владельцу репозитория). Provisorio:
    // финализируется на этапе 10 (деплой). base не задаем, чтобы dev жил на '/'.
    site: "https://yourdisenchantment.github.io",
    i18n: {
        defaultLocale: "ru",
        locales: ["ru", "en"],
        routing: {
            // ru -> '/', en -> '/en/'
            prefixDefaultLocale: false,
        },
    },
});
