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
    achievements: string;
    // achievements: note that document originals/scans are available on request
    scansOnRequest: string;
    // achievements: label of the attached-scan pill button (same in both
    // locales, kept in the dict like every user-visible string)
    pdfLink: string;
    // "About" block labels
    birthDate: string;
    city: string;
    // about: PhD research focus label (value comes from about.research)
    researchFocus: string;
    // contacts
    archived: string;
    // contacts: mailto link tooltip
    sendEmail: string;
    // external link tooltip (hover)
    openInNewTab: string;
    // publications: kind
    kindArticle: string;
    kindThesis: string;
    kindPatent: string;
    kindVkr: string;
    kindDataset: string;
    kindCollection: string;
    kindJournal: string;
    // publications: level (graduation thesis only)
    levelBachelor: string;
    levelMaster: string;
    // publications: indexing badge (elibrary status)
    indexVak: string;
    indexRinc: string;
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
    // dock: stylebook (DEV-only page of design tokens)
    stylebook: string;
    // page main heading (visually hidden, for screen readers / outline)
    resumeTitle: string;
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
        achievements: "Достижения",
        scansOnRequest: "Сканы оригиналов и другие документы - по запросу",
        pdfLink: "PDF",
        birthDate: "Дата рождения",
        city: "Город",
        researchFocus: "Тема исследования для аспирантуры",
        archived: "archived",
        sendEmail: "Написать на почту",
        openInNewTab: "Открыть в новой вкладке",
        kindArticle: "Статья",
        kindThesis: "Тезисы",
        kindPatent: "Патент",
        kindVkr: "ВКР",
        kindDataset: "Датасет",
        kindCollection: "Сборник",
        kindJournal: "Журнал",
        levelBachelor: "Бакалавриат",
        levelMaster: "Магистратура",
        indexVak: "ВАК",
        indexRinc: "РИНЦ",
        course: "курс",
        sourceLink: "Код",
        dockNav: "Управление резюме",
        themeToggle: "Сменить тему",
        downloadPdf: "Скачать PDF",
        print: "Печать",
        sourceCode: "Исходный код резюме",
        stylebook: "Стилгайд",
        resumeTitle: "Резюме",
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
        achievements: "Achievements",
        scansOnRequest:
            "Scans of originals and other documents available on request",
        pdfLink: "PDF",
        birthDate: "Date of birth",
        city: "City",
        researchFocus: "PhD research focus",
        archived: "archived",
        sendEmail: "Send email",
        openInNewTab: "Open in a new tab",
        kindArticle: "Article",
        kindThesis: "Conference paper",
        kindPatent: "Patent",
        kindVkr: "Graduation thesis",
        kindDataset: "Dataset",
        kindCollection: "Collection",
        kindJournal: "Journal",
        levelBachelor: "Bachelor",
        levelMaster: "Master",
        indexVak: "VAK",
        indexRinc: "RSCI",
        course: "Year",
        sourceLink: "Code",
        dockNav: "Resume controls",
        themeToggle: "Toggle theme",
        downloadPdf: "Download PDF",
        print: "Print",
        sourceCode: "Resume source code",
        stylebook: "Stylebook",
        resumeTitle: "Resume",
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
