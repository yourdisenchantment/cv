// @ts-check
import js from "@eslint/js";
import astro from "eslint-plugin-astro";
import tsParser from "@typescript-eslint/parser";

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
    // TypeScript во фронтматтере .astro: вложенный парсер @typescript-eslint/parser.
    // (без опции project/type-aware линтинга - типы проверяет astro check)
    {
        files: ["**/*.astro"],
        languageOptions: {
            parserOptions: {
                parser: tsParser,
            },
        },
    },
    // .ts-файлы (zod-схема и пр., этап 2) парсим TS-парсером. URL - стандартный
    // веб/Node-глобал (используется в format.ts), объявляем для no-undef.
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            globals: {
                URL: "readonly",
            },
        },
    },
];
