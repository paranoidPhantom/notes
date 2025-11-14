import { defineContentConfig, defineCollection } from "@nuxt/content";
import { z } from "zod";

export default defineContentConfig({
    collections: {
        content: defineCollection({
            type: "page",
            source: "**",
            schema: z.object({
                title: z.string(),
                lectureVkLink: z.array(z.string()).optional(),
                lectureYouTubeLink: z.array(z.string()).optional(),
                index: z.number(),
                author: z.object({
                    name: z.string(),
                    isu: z.number().optional(),
                }),
            }),
        }),
    },
});
