# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Проект

Персональное резюме (CV) Павла Михеева. На ветке `dev` идет переписывание статичного HTML/CSS/JS-сайта в Astro. `main` - предыдущая (legacy) версия, оригинал сайта сохранен в ней.

- Пакетный менеджер: **bun**. Node `>=22.12.0`.
- Контент резюме на русском, язык страницы `ru`.

## Команды

- `bun install` - установка зависимостей.
- `bun dev` - дев-сервер на `localhost:4321`.
- `bun run build` - продакшен-сборка в `./dist/`.
- `bun run preview` - локальный предпросмотр сборки.
- `bunx astro check` - проверка типов `.astro`/TS (диагностика шаблонов).
- `bun run lint` - ESLint (astro + jsx-a11y правила).
- `bun run format` / `bun run format:check` - Prettier.

Тестов нет; линтер - ESLint (flat config `eslint.config.mjs`), форматтер -
Prettier. Проверка типов - `astro check`. Git-хуки (husky + lint-staged):
`pre-commit` форматирует/линтит staged-файлы, `pre-push` гоняет полный
`astro check`, `commit-msg` проверяет стиль коммита через commitlint
(Conventional Commits, конфиг `commitlint.config.mjs`). Коммиты - на английском
в Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:` и т.п.).

## Рабочий цикл и коммиты

- Работа идет по этапам ROADMAP.md: берется пункт -> расписывается TASK.md ->
  выполняется -> под каждой задачей в TASK.md пишется краткий результат.
- `ROADMAP.md`, `TASK.md`, `overview.txt` - служебные файлы текущей сессии,
  лежат в `tmp/` (каталог в `.gitignore`, не отслеживается и не пушится). В новой
  сессии создаются заново; в репозиторий не идут.
- Коммитишь ты сам; я не коммичу без явного запроса.
- После каждого завершенного этапа я готовлю коммит: пишу сообщение в файл
  (по умолчанию `/tmp/cv-commit-msg.txt`) и предлагаю команду
  `git commit -F /tmp/cv-commit-msg.txt`. Сообщение - английский, Conventional
  Commits (тип по содержанию: `feat`/`fix`/`chore`/`docs`/...), subject в
  повелительном наклонении, lowercase, без точки, <=72 символов; тело с
  буллетами, пустая строка между subject и телом, строки тела <=100 символов.
- Стиль коммита проверяется хуком `commit-msg` (commitlint), так что невалидное
  сообщение будет отклонено - поэтому файл, а не `-m` (кавычки многострочного
  `-m` легко ломаются в шелле).
- Перед коммитом убеждаться, что staged-файлы не пересекаются с `.gitignore`
  (иначе lint-staged упадет на "paths ignored").

## Структура

- `src/pages/index.astro` - ru-страница резюме (скелет; контент появится на этапах 2-3).
- `src/layouts/BaseLayout.astro` - каркас страницы (`html`/`head`/`body`, `<slot />` для контента).
- `src/components/`, `src/data/` - под компоненты секций (этап 3) и zod-схему/JSON (этап 2).
- `public/` - статические ассеты (favicon).
- `astro.config.mjs` - `site` + `i18n` (ru по умолчанию на `/`, en на `/en/`); интеграций нет.
- `tsconfig.json` - extends `astro/tsconfigs/strict`.

### legacy/ (источник миграции)

Исходный статичный сайт, с которого переносится контент. Хранится локально
как референс: убран из отслеживания и добавлен в `.gitignore` (в репозиторий не
идет, оригинал сохранен в `main`). Файлы на диске нужны для чтения при миграции:

- `legacy/index.html` - верстка резюме, темы (`data-theme="light"`), SEO-мета, JSON-LD.
- `legacy/css/` - `reset.css`, `variables.css` (CSS-переменные тем), `styles.css`, `cv-layout.css`, `print.css` (стили печати).
- `legacy/js/script.js` - вставка JSON-LD `schema.org/Person`, копирование текста из элементов, переключение темы.
- `legacy/images/` - изображения резюме.

## Архитектура миграции

Цель - воспроизвести `legacy/` внутри Astro: разнести верстку по `.astro`-компонентам, перенести CSS (переменные тем, печать), сохранить JS-поведение (тема, копирование, JSON-LD) и SEO-мета. Сейчас Astro-проект пустой, поэтому любая задача - это перенос очередного куска из `legacy/` с сохранением внешнего вида и поведения, а не доработка существующих абстракций.
