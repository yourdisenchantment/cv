// UI-строки интерфейса резюме. Плоский словарь, без pluralization/интерполяции.
// ru заполнен; en - этап 6. Закладка под i18n: компоненты берут строки через
// t(lang, key), добавление en = дополнение словаря без правки компонентов.

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
    // публикации: слово "курс" (для ВКР, "2 курс")
    course: string;
    // проекты: текст ссылки на репозиторий
    sourceLink: string;
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
    },
    // этап 6: заполнить en-значениями.
    en: {
        about: "",
        contacts: "",
        skills: "",
        experience: "",
        education: "",
        courses: "",
        projects: "",
        publications: "",
        birthDate: "",
        city: "",
        archived: "",
        kindArticle: "",
        kindThesis: "",
        kindPatent: "",
        kindVkr: "",
        kindDataset: "",
        levelBachelor: "",
        levelMaster: "",
        course: "",
        sourceLink: "",
    },
};

/**
 * Возвращает UI-строку для языка и ключа. Для незаполненного en падает обратно
 * на ru (пока en-словарь не заполнен на этапе 6).
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
