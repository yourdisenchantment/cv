// zod-схема резюме. Валидирует ru.json / en.json на сборке через data
// collection (src/content.config.ts). Тип Cv - для компонентов этапа 3.
import { z } from "zod";

// Период: start/end в формате "YYYY-MM"; end: null = настоящее время.
const period = z.object({
    start: z.string(),
    end: z.string().nullable(),
});

const meta = z.object({
    title: z.string(),
    description: z.string(),
});

const about = z.object({
    photo: z.string(), // путь в public/, напр. "/images/my-face.jpg"
    name: z.string(),
    role: z.string(),
    birthDate: z.string(), // ISO "YYYY-MM-DD"
    city: z.string(),
    summary: z.string(),
    availability: z.string().optional(),
});

// href нет -> значение копируется в буфер (почта).
// archived -> утерянный аккаунт, показывать с пометкой.
// group: "contact" (связь: почта/мессенджер/сайт) | "resource" (github/gitlab/...).
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
    degree: z.string(),
    honors: z.string().optional(), // "Красный диплом"
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

// level/course - только для kind: "vkr" (ВКР бакалавра/магистра).
const publication = z.object({
    kind: z.enum(["article", "thesis", "patent", "vkr"]),
    title: z.string(),
    level: z.enum(["bachelor", "master"]).optional(),
    course: z.number().optional(),
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
});

export type Cv = z.infer<typeof cvSchema>;
