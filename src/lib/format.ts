// Форматирование периодов и дат резюме. ru/en-таблицы заполнены.

export type Locale = "ru" | "en";

// Месяцы в именительном падеже - для периодов ("Июль 2025 - Февраль 2026").
const MONTHS_NOMINATIVE: Record<Locale, string[]> = {
    ru: [
        "Январь",
        "Февраль",
        "Март",
        "Апрель",
        "Май",
        "Июнь",
        "Июль",
        "Август",
        "Сентябрь",
        "Октябрь",
        "Ноябрь",
        "Декабрь",
    ],
    en: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ],
};

// Месяцы в родительном падеже - для даты рождения ("6 ноября 2002").
// В английском падеж не выражается, используем те же имена ("6 November 2002").
const MONTHS_GENITIVE: Record<Locale, string[]> = {
    ru: [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря",
    ],
    en: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ],
};

// Метка "настоящее время" для открытого периода (end: null).
const PRESENT: Record<Locale, string> = {
    ru: "настоящее время",
    en: "present",
};

// "YYYY-MM" -> "Месяц YYYY" (именительный). Бросает при невалидном формате.
function formatMonthNominative(value: string, locale: Locale): string {
    const [year, month] = value.split("-");
    const idx = Number(month) - 1;
    if (!year || Number.isNaN(idx) || idx < 0 || idx > 11) {
        throw new Error(`Invalid period month "${value}"`);
    }
    const label = MONTHS_NOMINATIVE[locale][idx];
    if (!label) {
        throw new Error(`Month names for locale "${locale}" not filled`);
    }
    return `${label} ${year}`;
}

/**
 * Период "Месяц Год - Месяц Год" или "Месяц Год - настоящее время".
 *
 * Args:
 *   period: { start: "YYYY-MM", end: "YYYY-MM" | null }. end: null - настоящее.
 *   locale: "ru" | "en" (дефолт "ru").
 *
 * Returns:
 *   Отформатированную строку периода.
 */
export function formatPeriod(
    period: { start: string; end: string | null },
    locale: Locale = "ru",
): string {
    const start = formatMonthNominative(period.start, locale);
    const end = period.end
        ? formatMonthNominative(period.end, locale)
        : PRESENT[locale];
    return `${start} - ${end}`;
}

/**
 * Дата рождения из ISO "YYYY-MM-DD" -> "D месяц YYYY" (родительный падеж).
 *
 * Args:
 *   iso: дата в формате "YYYY-MM-DD".
 *   locale: "ru" | "en" (дефолт "ru").
 *
 * Returns:
 *   Отформатированную дату.
 */
export function formatBirthDate(iso: string, locale: Locale = "ru"): string {
    const [year, month, day] = iso.split("-");
    const idx = Number(month) - 1;
    const dayNum = Number(day);
    if (
        !year ||
        Number.isNaN(idx) ||
        idx < 0 ||
        idx > 11 ||
        Number.isNaN(dayNum)
    ) {
        throw new Error(`Invalid birth date "${iso}"`);
    }
    const label = MONTHS_GENITIVE[locale][idx];
    if (!label) {
        throw new Error(`Month names for locale "${locale}" not filled`);
    }
    return `${dayNum} ${label} ${year}`;
}
