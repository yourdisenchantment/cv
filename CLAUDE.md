# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Рядом лежит `AGENTS.md` (на английском) с тем же содержанием для других
> агентов - правь оба файла согласованно при изменениях. Источник истины -
> исполняемые файлы (`package.json`, `astro.config.mjs`, хуки), а не проза.

## Проект

Персональное резюме (CV) Павла Михеева - статичный сайт на Astro (SSG),
деплоится на GitHub Pages как project page по адресу `/cv/`. Двуязычный
(Astro i18n, модель B - `prefixDefaultLocale: false`): английский на `/`,
русский на `/ru/`. Ветка `main` - деплоится; `dev` - рабочая, **не**
деплоится. (Исторически `main` хранит и legacy-оригинал статичного сайта.)

- Пакетный менеджер: **bun**. Node `>=22.12.0` (`.nvmrc` пинит 26).
- Контент резюме - JSON на en/ru, валидируется zod-схемой на сборке.

## Команды

- `bun install` - установка зависимостей.
- `bun dev` - дев-сервер на `localhost:4321/cv/` (учитывай `base`, не `/`).
- `bun run build` - продакшен-сборка в `./dist/`.
- `bun run preview` - локальный предпросмотр сборки.
- `bunx astro check` - проверка типов `.astro`/TS (единственный typecheck).
- `bun run lint` - ESLint (astro + jsx-a11y).
- `bun run format` / `bun run format:check` - Prettier write / check.

Тестов нет. Проверять изменения цепочкой: `bun run lint` ->
`bun run format:check` -> `bunx astro check` -> `bun run build`.

Git-хуки (husky + lint-staged): `pre-commit` - lint-staged (eslint --fix +
prettier на staged-файлах); `pre-push` - полный `bunx astro check`;
`commit-msg` - commitlint (Conventional Commits). ESLint игнорирует
`dist/`, `.astro/`, `node_modules/`, `legacy/`. TS во фронтматтере `.astro`
парсится `@typescript-eslint/parser`, но **без** type-aware линтинга - типы
проверяет только `astro check`.

## Архитектура

Контент резюме - `src/data/cv/{en,ru}.json`, валидируется на сборке через
Astro content collection (`src/content.config.ts` -> zod-схема в
`src/data/cv/schema.ts`); компоненты получают выведенный тип `Cv`. Рядом
лежит `en.example.json` - шаблон со всеми полями схемы; он тоже попадает в
коллекцию и валидируется сборкой, но страницами не используется. Страницы
грузят запись через `getEntry("cv", lang)`:

Приватные данные (телефон) - в `src/data/private.json` (**gitignored**, вне
коллекции `cv/`; шаблон - `private.example.json`). `Contacts.astro` читает его
через `import.meta.glob` (нет файла -> `{}` -> номер не рендерится), строка
телефона - **print-only**. Итог: в задеплоенной сборке/репозитории номера нет,
он попадает только в локально сгенерированный PDF. Печатать с номером - из
локальной сборки, не с публичного сайта.

- `src/pages/index.astro` -> en (корневой роут `/`).
- `src/pages/ru/index.astro` -> ru (`/ru/`).
- `src/layouts/BaseLayout.astro` - каркас `html`/`head`, инлайн-скрипты темы
  (применяется до первой отрисовки) и тултипов; принимает `jsonLd`.
- `src/components/cv/*` - секции резюме, собираются в `Resume.astro`.
- `src/components/Dock.astro` - плавающая панель (тема, язык, печать/PDF,
  исходник; ссылка на stylebook - только в DEV).

Вспомогательное в `src/lib/`:

- `i18n.ts` - плоский словарь UI-строк, доступ через `t(lang, key)`; `t()`
  падает обратно на `ru`, если значение `en` пустое.
- `format.ts` - формат дат/ссылок; периоды в `"YYYY-MM"`, `end: null` =
  "по настоящее время"; дата рождения - `"YYYY-MM-DD"`.
- `jsonld.ts` - сборка JSON-LD `schema.org/Person` из записи CV + `Astro.site`
    - `BASE_URL`.

Стили - обычный CSS в `src/styles/` (токены `variables.css`, layout, печать,
шрифты). `print.css` дает черно-белый A4 независимо от темы. Тема - атрибут
`data-theme` на `<html>`, хранится в `localStorage`.

**Stylebook** (`src/pages/stylebook/[...slug].astro`) - DEV-only страница с
токенами и живыми сэмплами секций. Исключается из прод-сборки пустым
`getStaticPaths()` при `import.meta.env.PROD`. Роут `/stylebook` (не
`/__stylebook`: Astro выкидывает из роутинга пути с подчеркиванием).

### Важные инварианты

- **Держи оба locale-JSON в одинаковой форме.** `experience`, `education`,
  `courses` сортируются по дате в коде - порядок записей в JSON не важен.
- `base: "/cv/"` действует и в dev. `import.meta.env.BASE_URL` отдается ровно
  как `/cv/` (с конечным слешем) - на это опираются строковые склейки путей
  (favicon, фото, языковой префикс в `jsonld.ts`). Слеш не убирать.

### legacy/ (референс миграции)

`legacy/` - исходный статичный HTML/CSS/JS-сайт как **локальный** референс
для миграции: gitignored, в репозиторий не идет (оригинал в `main`). Читать
при воспроизведении верстки/поведения, но **не** редактировать и не коммитить.

## Рабочий цикл и коммиты

- Служебные файлы сессии (`ROADMAP.md`, `TASK.md`, `OVERVIEW.md` и т.п.) лежат
  в `tmp/` (в `.gitignore`), создаются заново в каждой сессии, в репозиторий
  не идут.
- Коммитишь ты сам; агент не запускает мутирующие git-команды - только готовит
  план. Сообщение пишется в файл и предлагается команда
  `git commit -F /tmp/cv-commit-msg.txt`.
- Стиль коммита: английский, Conventional Commits (`feat`/`fix`/`chore`/
  `docs`/...), subject в повелительном наклонении, lowercase, без точки,
  `<=72` символов; тело с буллетами, пустая строка после subject, строки тела
  `<=100`. Использовать **файл**, а не многострочный `-m` (кавычки ломаются в
  шелле, хук `commit-msg` отклонит невалидное сообщение).
- Перед коммитом убеждаться, что staged-файлы не пересекаются с `.gitignore`
  (иначе lint-staged падает с "paths ignored"). Версию пакета без явной
  команды не бампить.

## Деплой

GitHub Actions (`.github/workflows/deploy.yml`) на push в `main`: через
`oven-sh/setup-bun@2` (bun пинится) -> `bun install --frozen-lockfile` ->
`bun run build` -> публикация на Pages. Один раз в настройках репозитория:
Settings -> Pages -> Source = GitHub Actions.
