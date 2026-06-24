// Formatting of resume periods and dates. ru/en tables filled in.

export type Locale = "ru" | "en";

// Months in nominative case - for periods ("Июль 2025 - Февраль 2026").
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

// Months in genitive case - for the birth date ("6 ноября 2002"). English has
// no case inflection, so the same names are reused ("6 November 2002").
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

// "Present" label for an open-ended period (end: null).
const PRESENT: Record<Locale, string> = {
    ru: "настоящее время",
    en: "present",
};

// "YYYY-MM" -> "Month YYYY" (nominative). Throws on an invalid format.
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
 * Period "Month Year - Month Year" or "Month Year - present".
 *
 * Args:
 *   period: { start: "YYYY-MM", end: "YYYY-MM" | null }. end: null - present.
 *   locale: "ru" | "en" (default "ru").
 *
 * Returns:
 *   The formatted period string.
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
 * Link without protocol: host + path, without "https://" and trailing "/".
 * For print: a bare handle without a domain is unclear, so we show "host/path"
 * (e.g. "t.me/yourdisenchantment", "github.com/yourdisenchantment").
 *
 * Args:
 *   url: an absolute URL.
 *
 * Returns:
 *   A "host/path" string (or just "host" for a root path).
 */
export function linkHostPath(url: string): string {
    const u = new URL(url);
    const path = u.pathname === "/" ? "" : u.pathname.replace(/\/$/, "");
    return u.hostname + path;
}

/**
 * Birth date from ISO "YYYY-MM-DD" -> "D month YYYY" (genitive case).
 *
 * Args:
 *   iso: date in "YYYY-MM-DD" format.
 *   locale: "ru" | "en" (default "ru").
 *
 * Returns:
 *   The formatted date.
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
