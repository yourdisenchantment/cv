// Astro data collection "cv": resume JSON from src/data/cv/*.json. At build
// time each file is validated by the zod schema; access via
// getEntry('cv', 'ru' | 'en').
import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";
import { cvSchema } from "./data/cv/schema";

const cv = defineCollection({
    loader: glob({ pattern: "*.json", base: "./src/data/cv" }),
    schema: cvSchema,
});

export const collections = { cv };
