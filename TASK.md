# TASK - Этап 1: Фундамент Astro и i18n

Цель - настроить базовую конфигурацию Astro (i18n, site), завести
структуру каталогов и каркас страницы-обертки резюме. Контент резюме
появляется на следующих этапах; здесь - только скелет.

Подробный план - в ROADMAP.md, секция "Этапы -> 1".

## Задачи

### 1.1 astro.config.mjs: site + i18n

- `site`: 'https://yourdisenchantment.github.io' (по владельцу remote;
  provisorio, финализируется на этапе 10).
- `i18n`: defaultLocale 'ru', locales ['ru', 'en'],
  routing.prefixDefaultLocale = false (ru на '/', en на '/en/').
- `base` НЕ задаем (этап 10, деплой) - чтобы dev жил на '/'.
- Проверка: `bun run build` собирается без ошибок.

### 1.2 Структура каталогов

- `src/layouts/BaseLayout.astro` - каркас страницы (Astro-конвенция: layouts
  в src/layouts/, не в src/components/).
- `src/components/.gitkeep` - каталог под компоненты секций резюме (этап 3).
- `src/data/.gitkeep` - каталог под zod-схему и JSON-контент (этап 2).

### 1.3 BaseLayout.astro (каркас страницы)

- Props: lang ('ru'|'en'), title, description?.
- `<html lang={lang}>`, head: charset, viewport, description, title, favicon.
- `<body><slot /></body>` - контент вставляют страницы через slot.
- Минимум: шрифты, тема, печать, a11y - следующие этапы.

### 1.4 index.astro (скелет ru-страницы)

- Использует BaseLayout с lang="ru", заголовок/описание резюме.
- Внутри - комментарий-заглушка: контент появится на этапах 2-3.
- Проверка: `bunx astro check` зелено, `bun run build` генерирует '/'.

### 1.5 Итоговая проверка

- `bunx astro check` - зелено.
- `bun run build` - зелено, в dist/ есть index.html.
- `bun run lint` / `bun run format:check` - зелено.

## Результаты

### 1.1 astro.config.mjs: site + i18n

- `site: "https://yourdisenchantment.github.io"` (по владельцу remote; provisorio,
  финализируется на этапе 10). `base` не задан (этап 10) - dev живет на '/'.
- `i18n`: defaultLocale `ru`, locales `["ru","en"]`, `prefixDefaultLocale: false`
  (ru -> '/', en -> '/en/').
- Проверка: `bun run build` собирается, генерирует `dist/index.html`.

### 1.2 Структура каталогов

- `src/layouts/BaseLayout.astro` (Astro-конвенция: layouts отдельно от components).
- `src/components/.gitkeep`, `src/data/.gitkeep` - под будущие этапы (3 и 2).

### 1.3 BaseLayout.astro

- Props: `lang: "ru"|"en"`, `title`, `description?`.
- head: charset, viewport, description, favicon (svg+ico), title; body через `<slot />`.

### 1.4 index.astro

- Использует BaseLayout с `lang="ru"`, заголовок/описание резюме; контент -
  заглушка-комментарий (этапы 2-3).

### 1.5 Итоговая проверка

- `bunx astro check` - 0 errors.
- `bun run build` - 1 page built, `dist/index.html` с `lang="ru"`.
- `bun run lint` / `bun run format:check` - зелено.
- Попутно: добавлен `@typescript-eslint/parser@8.62.0` и подключен в
  `eslint.config.mjs` как вложенный парсер фронтматтера `.astro` (без него
  eslint падал на `interface` - espree не понимает TS). Опция `project`
  (type-aware lint) не подключена - типы проверяет `astro check`.
