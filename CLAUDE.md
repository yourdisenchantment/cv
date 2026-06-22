# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Проект

Персональное резюме (CV) Павла Михеева. На ветке `dev` идёт переписывание статичного HTML/CSS/JS-сайта в Astro. `main` — предыдущая (legacy) версия, оригинал сайта сохранён в ней.

- Пакетный менеджер: **bun**. Node `>=22.12.0`.
- Контент резюме на русском, язык страницы `ru`.

## Команды

- `bun install` — установка зависимостей.
- `bun dev` — дев-сервер на `localhost:4321`.
- `bun run build` — продакшен-сборка в `./dist/`.
- `bun run preview` — локальный предпросмотр сборки.
- `bunx astro check` — проверка типов `.astro`/TS (диагностика шаблонов).
- `bun run lint` — ESLint (astro + jsx-a11y правила).
- `bun run format` / `bun run format:check` — Prettier.

Тестов нет; линтер — ESLint (flat config `eslint.config.mjs`), форматтер —
Prettier. Проверка типов — `astro check`. Git-хуки (husky + lint-staged):
`pre-commit` форматирует/линтит staged-файлы, `pre-push` гоняет полный
`astro check`, `commit-msg` проверяет стиль коммита через commitlint
(Conventional Commits, конфиг `commitlint.config.mjs`). Коммиты — на английском
в Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:` и т.п.).

## Структура

- `src/pages/index.astro` — единственная страница (пока стартовый шаблон Astro, контент резюме ещё не перенесён).
- `public/` — статические ассеты (favicon).
- `astro.config.mjs` — пустая конфигурация `defineConfig({})`, интеграций нет.
- `tsconfig.json` — extends `astro/tsconfigs/strict`.

### legacy/ (источник миграции)

Исходный статичный сайт, с которого переносится контент. Хранится локально
как референс: убран из отслеживания и добавлен в `.gitignore` (в репозиторий не
идёт, оригинал сохранён в `main`). Файлы на диске нужны для чтения при миграции:

- `legacy/index.html` — вёрстка резюме, темы (`data-theme="light"`), SEO-мета, JSON-LD.
- `legacy/css/` — `reset.css`, `variables.css` (CSS-переменные тем), `styles.css`, `cv-layout.css`, `print.css` (стили печати).
- `legacy/js/script.js` — вставка JSON-LD `schema.org/Person`, копирование текста из элементов, переключение темы.
- `legacy/images/` — изображения резюме.

## Архитектура миграции

Цель — воспроизвести `legacy/` внутри Astro: разнести вёрстку по `.astro`-компонентам, перенести CSS (переменные тем, печать), сохранить JS-поведение (тема, копирование, JSON-LD) и SEO-мета. Сейчас Astro-проект пустой, поэтому любая задача — это перенос очередного куска из `legacy/` с сохранением внешнего вида и поведения, а не доработка существующих абстракций.
