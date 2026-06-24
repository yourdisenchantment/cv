// Resume UI strings. Flat dictionary, no pluralization/interpolation.
// ru/en filled in. Components read strings via t(lang, key); adding a
// language = extending the dictionary without touching components.

import type { Locale } from "./format";

// UI string keys. keyof Dict lets t() check keys at compile time.
type Dict = {
    // section headings
    about: string;
    contacts: string;
    skills: string;
    experience: string;
    education: string;
    courses: string;
    projects: string;
    publications: string;
    // "About" block labels
    birthDate: string;
    city: string;
    // contacts
    archived: string;
    // contacts: email copy
    copyEmail: string;
    copied: string;
    // external link tooltip (hover)
    openInNewTab: string;
    // copy button tooltip (hover, before click)
    copy: string;
    // publications: kind
    kindArticle: string;
    kindThesis: string;
    kindPatent: string;
    kindVkr: string;
    kindDataset: string;
    // publications: level (graduation thesis only)
    levelBachelor: string;
    levelMaster: string;
    // publications: the word "year" (for thesis: "2 курс" / "Year 2")
    course: string;
    // projects: repository link text
    sourceLink: string;
    // dock bar: aria/tooltips
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
        copyEmail: "Скопировать почту",
        copied: "Скопировано",
        openInNewTab: "Открыть в новой вкладке",
        copy: "Скопировать",
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
        copyEmail: "Copy email",
        copied: "Copied",
        openInNewTab: "Open in a new tab",
        copy: "Copy",
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
 * Returns the UI string for a language and key. Falls back to ru when the
 * en value is empty (safety net).
 *
 * Args:
 *   lang: page language.
 *   key: string key from Dict.
 *
 * Returns:
 *   The localized string.
 */
export function t(lang: Locale, key: keyof Dict): string {
    const value = ui[lang][key];
    return value || ui.ru[key];
}
