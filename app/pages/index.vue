<script lang="ts" setup>
import type { ContentNavigationItem } from "@nuxt/content";

const data = useState<ContentNavigationItem[] | undefined>("navigation");
const colorMode = useColorMode();

const toc = useState("toc");
toc.value = undefined;
</script>

<template>
    <div>
        <Card class="relative flex flex-col items-center gap-20 px-4">
            <div class="py-24 lg:px-32 text-center">
                <span
                    class="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-5xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/90"
                >
                    Скоро здесь появится LLM агент, но это не точно
                </span>
            </div>

            <ParticlesBg
                :staticity="10"
                :color="colorMode.value === 'dark' ? '#fff' : '#000'"
                class="absolute inset-0"
            />
            <VanishingInput />
        </Card>
        <p class="opacity-30 mt-4">
            Я сделал эту штуку за 10 часов не судите строго
        </p>
        <template v-for="sub in data" :key="sub.path">
            <h2
                class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
            >
                {{ sub.title }}
            </h2>
            <template v-for="course in sub.children" :key="course.path">
                <h3
                    class="mt-8 mb-4 scroll-m-20 text-2xl font-semibold tracking-tight"
                >
                    {{ course.title }}
                </h3>

                <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <NuxtLink
                        v-for="link in course.children"
                        :to="link.path"
                        :key="link.path"
                    >
                        <Card class="px-4">
                            {{ link.title }}
                        </Card>
                    </NuxtLink>
                </div>
            </template>
        </template>
        <hr class="my-9" />
        <NuxtLink to="https://t.me/paranoidPhantom" target="_blank">
            <Button variant="outline">
                <Icon name="mdi:telegram" />
                <span class="font-semibold">Сообщить об ошибке/связаться</span>
            </Button>
        </NuxtLink>
    </div>
</template>
