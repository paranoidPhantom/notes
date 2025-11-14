import { defineContentConfig, defineCollection } from "@nuxt/content";
import { z } from "zod";

export default defineContentConfig({
    collections: {
        content: defineCollection({
            type: "page",
            source: "**",
            schema: z.object({
                lectureVkLink: z.array(z.string()).optional(),
                lectureYouTubeLink: z.array(z.string()).optional(),
                index: z.number(),
            }),
        }),
    },
});
