import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    vue: {
        compilerOptions: {
            isCustomElement: (tag) => {
                return tag.toLowerCase().includes("mjxcontainer");
            },
        },
    },
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
                highlight: {
                    theme: "catppuccin-mocha",
                    langs: ["python"],
                },
                remarkPlugins: { "remark-math": {} },
                rehypePlugins: { "rehype-mathjax": {} },
            },
        },
    },

    sitemap: {
        sources: ["/api/__sitemap__/urls"],
    },
    routeRules: {
        "/**": { isr: true },
        "/api/**": { isr: false },
    },
    // studio: {
    //     // Studio admin route (default: '/_studio')
    //     route: "/_studio",

    //     // GitHub repository configuration (owner and repo are required)
    //     repository: {
    //         provider: "github", // only GitHub is currently supported
    //         owner: "paranoidPhantom", // your GitHub username or organization
    //         repo: "notes", // your repository name
    //         branch: process.env.VERCEL_GIT_COMMIT_REF || "master", // the branch to commit to (default: main)
    //     },
    // },
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
        "@nuxt/scripts",
        // "nuxt-studio",
        "@nuxtjs/seo",
        "nuxt-posthog",
    ],
    site: {
        name: "Конспекты",
        url: "https://notes.hdla.cloud",
        favicon: "/favicon.svg",
    },
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
