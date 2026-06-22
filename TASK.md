# TASK — Этап 0: Инструментарий (форматтер, линтер, git-хуки)

Цель этапа — настроить автоматическое форматирование и линтинг, чтобы код
в репозитории всегда был единообразным, а ошибки ловились до коммита/пуша.

Подробный план этапа — в ROADMAP.md, секция "Этапы -> 0".

## Задачи

### 0.1 Prettier (форматтер)

- Установить `prettier` и `prettier-plugin-astro` (dev-зависимости).
- Конфиг `.prettierrc.json`: регистрирует плагин для `.astro`.
- `.prettierignore`: исключить `dist/`, `.astro/`, `node_modules/`, `legacy/`
  (legacy не форматируем — это референс, его не трогаем).
- Скрипты в package.json: `format` (`prettier --write .`), `format:check`.
- Проверка: `bunx prettier --check .` проходит без ошибок.

### 0.2 ESLint (линтер)

- Установить `eslint@^9`, `@eslint/js@^9`, `eslint-plugin-astro@^1`,
  `eslint-plugin-jsx-a11y@^6` (dev-зависимости).
- Flat config `eslint.config.mjs`: @eslint/js recommended + astro recommended
    - astro jsx-a11y-recommended. Игноры: dist, .astro, node_modules, legacy.
- Скрипт `lint` в package.json.
- Проверка: `bunx eslint .` проходит.

### 0.3 husky + lint-staged (git-хуки)

- Установить `husky`, `lint-staged`.
- Скрипт `prepare: husky` в package.json (хуки ставятся автоматически после
  `bun install`).
- `.husky/pre-commit`: `bunx lint-staged` (форматирует и линтит staged-файлы).
- `.husky/pre-push`: `bunx astro check` (полная проверка типов проекта).
- Конфиг lint-staged в package.json:
    - `*.{astro,js,mjs,cjs,ts,css,json,md}` -> `prettier --write`
    - `*.{astro,js,mjs,cjs}` -> `eslint --fix`
      (eslint --fix идёт после prettier, чтобы финальное форматирование было
      за prettier).
- Проверка: хук срабатывает при `git commit`/`git push`.

### 0.4 .gitignore под husky

- Добавить `.husky/_/` (внутренняя служебная папка husky 9, генерируется
  скриптом prepare; коммитить её не нужно).

### 0.5 Итоговая проверка

- `bunx prettier --check .` — зелёно.
- `bunx eslint .` — зелёно.
- `bunx astro check` — зелёно.
- Прогнать хук вручную.

## Результаты

### 0.1 Prettier

- Установлены `prettier@3.8.4`, `prettier-plugin-astro@0.14.1`.
- `.prettierrc.json`: `plugins` + `tabWidth: 4` (парсер `astro` плагин
  регистрирует сам; отступ 4 пробела — по предпочтению владельца).
- `.prettierignore`: `dist/`, `.astro/`, `node_modules/`, `legacy/`, `bun.lock`, `.husky/_/`.
- Скрипты `format`, `format:check`.
- Проверка: `bun run format:check` — все файлы соответствуют стилю.

### 0.2 ESLint

- Установлены `eslint@9.39.4`, `@eslint/js@9.39.4`, `eslint-plugin-astro@1.7.0`,
  `eslint-plugin-jsx-a11y@6.10.2`.
- `eslint.config.mjs` (flat config): игноры + `@eslint/js` recommended +
  `astro.configs['flat/recommended']` + `astro.configs['flat/jsx-a11y-recommended']`.
- Важно: у плагина v1 flat-конфиги лежат под ключами `flat/*` (непрефиксованные —
  старый eslintrc-формат, для ESLint 9 не годятся).
- Скрипт `lint`.
- Проверка: `bun run lint` — 0 ошибок; для `.astro` активны 42 правила `astro/*`.

### 0.3 husky + lint-staged

- Установлены `husky@9.1.7`, `lint-staged@17.0.8`.
- `bunx husky init` -> `.husky/_/`, `prepare: husky` в package.json.
- `.husky/pre-commit` = `bunx lint-staged`; `.husky/pre-push` = `bunx astro check`.
- `lint-staged` в package.json с непересекающимися глобами (во избежание гонки
  записи в один файл): код через массив `[eslint --fix, prettier --write]`,
  остальное через `prettier --write`.
- Проверка: ручной прогон pre-commit на staged-файлах — exit 0, eslint+prettier
  отработали по цепочке.

### 0.4 .gitignore под husky

- Добавлен `.husky/_/`.

### 0.5 Итоговая проверка

- `bun run format:check` — зелёно.
- `bun run lint` — зелёно.
- `bunx astro check` — 0 errors / 0 warnings / 0 hints.
- Попутно установлены `@astrojs/check@0.9.9` и `typescript@6.0.3` — без них
  `astro check` интерактивно просит установить и виснет в неинтерактивном
  шелле. Теперь запускается без запросов.

### 0.6 commitlint (добавлено по запросу владельца)

- Установлены `@commitlint/cli@21.0.2`, `@commitlint/config-conventional@21.0.2`.
- `commitlint.config.mjs`: extends `@commitlint/config-conventional`.
- `.husky/commit-msg`: `bunx commitlint --edit "$1"` (проверяет стиль коммита).
- Проверка: плохое сообщение отклоняется (`type-empty`), `chore: ...` проходит.
- Стиль коммитов зафиксирован и в памяти ассистента: английский, Conventional
  Commits.
