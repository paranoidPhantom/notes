import { defineContentConfig, defineCollection } from "@nuxt/content";
import { z } from "zod";

export default defineContentConfig({
    collections: {
        content: defineCollection({
            type: "page",
            source: "**/*.md",
            schema: z.object({
                tags: z.array(z.string()),
                image: z.string(),
                date: z.date(),
            }),
        }),
    },
});
