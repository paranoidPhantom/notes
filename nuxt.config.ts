import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-07-15",
    devtools: { enabled: true },

    css: ["~/assets/css/tailwind.css"],
    vite: {
        plugins: [tailwindcss()],
    },
    content: {
        build: {
            transformers: ["@/transformers/split-latex"],
            markdown: {
                remarkPlugins: { "remark-math": {} },
                rehypePlugins: { "rehype-mathjax": {} },
            },
        },
    },

    app: {
        pageTransition: { name: "page", mode: "out-in" },
    },
    modules: [
        "@nuxt/eslint",
        "@nuxt/content",
        "@nuxt/fonts",
        "@nuxtjs/color-mode",
        "shadcn-nuxt",
        "@vueuse/nuxt",
        "@nuxt/icon",
    ],
    shadcn: {
        /**
         * Prefix for all the imported component
         */
        prefix: "",
        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: "~/components/ui",
    },
    colorMode: {
        classSuffix: "",
    },
});
