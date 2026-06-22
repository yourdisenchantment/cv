// @ts-check
import js from "@eslint/js";
import astro from "eslint-plugin-astro";

// ESLint 9 flat config: массив конфигов, применяемых последовательно.
// Каждый конфиг может фильтровать по files/ignores и добавлять правила/плагины.
export default [
    // Не линтим генерируемое, стороннее и legacy-референс миграции.
    {
        ignores: ["dist/", ".astro/", "node_modules/", "legacy/"],
    },
    // Базовые правила для JS-файлов (.js/.mjs/.cjs).
    js.configs.recommended,
    // Парсинг .astro + правила против ошибок шаблона и клиентских скриптов.
    ...astro.configs["flat/recommended"],
    // Правила доступности для .astro (требует eslint-plugin-jsx-a11y).
    ...astro.configs["flat/jsx-a11y-recommended"],
];
