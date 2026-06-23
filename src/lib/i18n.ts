// UI-строки интерфейса резюме. Плоский словарь, без pluralization/интерполяции.
// ru/en заполнены. Компоненты берут строки через t(lang, key); добавление
// языка = дополнение словаря без правки компонентов.

import type { Locale } from "./format";

// Ключи UI-строк. keyof Dict - чтобы t() проверял ключи на этапе компиляции.
type Dict = {
    // заголовки секций
    about: string;
    contacts: string;
    skills: string;
    experience: string;
    education: string;
    courses: string;
    projects: string;
    publications: string;
    // лейблы блока "О себе"
    birthDate: string;
    city: string;
    // контакты
    archived: string;
    // публикации: kind
    kindArticle: string;
    kindThesis: string;
    kindPatent: string;
    kindVkr: string;
    kindDataset: string;
    // публикации: level (для ВКР)
    levelBachelor: string;
    levelMaster: string;
    // публикации: слово "курс" (для ВКР, "2 курс" / "Year 2")
    course: string;
    // проекты: текст ссылки на репозиторий
    sourceLink: string;
    // док-бар: aria/тултипы
    dockNav: string;
    themeToggle: string;
    downloadPdf: string;
    print: string;
    sourceCode: string;
};

const ui: Record<Locale, Dict> = {
    ru: {
        about: "О себе",
        contacts: "Контакты",
        skills: "Навыки",
        experience: "Опыт работы",
        education: "Образование",
        courses: "Повышение квалификации",
        projects: "Проекты",
        publications: "Публикации",
        birthDate: "Дата рождения",
        city: "Город",
        archived: "archived",
        kindArticle: "Статья",
        kindThesis: "Тезисы",
        kindPatent: "Патент",
        kindVkr: "ВКР",
        kindDataset: "Датасет",
        levelBachelor: "Бакалавриат",
        levelMaster: "Магистратура",
        course: "курс",
        sourceLink: "Код",
        dockNav: "Управление резюме",
        themeToggle: "Сменить тему",
        downloadPdf: "Скачать PDF",
        print: "Печать",
        sourceCode: "Исходный код резюме",
    },
    en: {
        about: "About",
        contacts: "Contacts",
        skills: "Skills",
        experience: "Experience",
        education: "Education",
        courses: "Professional development",
        projects: "Projects",
        publications: "Publications",
        birthDate: "Date of birth",
        city: "City",
        archived: "archived",
        kindArticle: "Article",
        kindThesis: "Conference paper",
        kindPatent: "Patent",
        kindVkr: "Graduation thesis",
        kindDataset: "Dataset",
        levelBachelor: "Bachelor",
        levelMaster: "Master",
        course: "Year",
        sourceLink: "Code",
        dockNav: "Resume controls",
        themeToggle: "Toggle theme",
        downloadPdf: "Download PDF",
        print: "Print",
        sourceCode: "Resume source code",
    },
};

/**
 * Возвращает UI-строку для языка и ключа. Для пустого en-значения падает
 * обратно на ru (страховка).
 *
 * Args:
 *   lang: язык страницы.
 *   key: ключ строки из Dict.
 *
 * Returns:
 *   Локализованную строку.
 */
export function t(lang: Locale, key: keyof Dict): string {
    const value = ui[lang][key];
    return value || ui.ru[key];
}
