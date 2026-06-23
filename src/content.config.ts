// Astro data collection "cv": JSON-резюме из src/data/cv/*.json. На сборке
// каждый файл валидируется zod-схемой; доступ - getEntry('cv', 'ru' | 'en').
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { cvSchema } from "./data/cv/schema";

const cv = defineCollection({
    loader: glob({ pattern: "*.json", base: "./src/data/cv" }),
    schema: cvSchema,
});

export const collections = { cv };
