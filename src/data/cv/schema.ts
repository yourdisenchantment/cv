// Resume zod schema. Validates ru.json / en.json at build time through the
// data collection (src/content.config.ts). The Cv type feeds the components.
import { z } from "zod";

// Period: start/end in "YYYY-MM" format; end: null = present.
const period = z.object({
    start: z.string(),
    end: z.string().nullable(),
});

const meta = z.object({
    title: z.string(),
    description: z.string(),
});

const about = z.object({
    photo: z.string(), // path under src/assets/, e.g. "/images/my-face.jpg"
    name: z.string(),
    role: z.string(),
    birthDate: z.string(), // ISO "YYYY-MM-DD"
    city: z.string(),
    summary: z.string(),
    research: z.string().optional(), // PhD research focus, accented under summary
    availability: z.string().optional(),
});

// no href -> the value is an email, rendered as a mailto: link.
// archived -> a lost account, shown with a label.
// group: "contact" (email/messenger/site) | "resource" (github/gitlab/...).
const contact = z.object({
    label: z.string(),
    value: z.string(),
    href: z.url().optional(),
    archived: z.boolean().optional(),
    group: z.enum(["contact", "resource"]),
});

const experience = z.object({
    period: period,
    company: z.string(),
    role: z.string(),
    achievements: z.array(z.string()),
    skills: z.array(z.string()),
});

const education = z.object({
    period: period,
    institution: z.string(),
    faculty: z.string(),
    department: z.string().optional(), // e.g. "Кафедра прикладной математики"
    code: z.string().optional(), // field-of-study code, e.g. "01.03.04"
    degree: z.string(),
    honors: z.string().optional(), // e.g. "Красный диплом" (honors degree)
});

const course = z.object({
    period: period,
    institution: z.string(),
    course: z.string(),
    skills: z.array(z.string()),
});

const project = z.object({
    name: z.string(),
    url: z.url(),
    description: z.string().optional(),
    stack: z.array(z.string()).optional(),
});

// Achievement: a plain string, or an object with an optional attached scan
// (file - path under public/, e.g. "/documents/scan.pdf"). Mind that
// everything in public/ is published on deploy.
const achievement = z.union([
    z.string(),
    z.object({
        text: z.string(),
        file: z.string().optional(),
    }),
]);

// level/course - only for kind: "vkr" (bachelor's/master's graduation thesis).
const publication = z.object({
    kind: z.enum([
        "article",
        "thesis",
        "patent",
        "vkr",
        "dataset",
        "collection",
        "journal",
    ]),
    title: z.string(),
    level: z.enum(["bachelor", "master"]).optional(),
    course: z.number().optional(),
    index: z.enum(["vak", "rinc"]).optional(), // indexing badge (elibrary status)
    urls: z.array(z.url()),
});

export const cvSchema = z.object({
    meta: meta,
    about: about,
    contacts: z.array(contact),
    skills: z.array(z.string()),
    experience: z.array(experience),
    education: z.array(education),
    courses: z.array(course),
    projects: z.array(project),
    publications: z.array(publication),
    achievements: z.array(achievement),
});

export type Cv = z.infer<typeof cvSchema>;
