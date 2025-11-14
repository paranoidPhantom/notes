<script setup lang="ts">
const route = useRoute();
const { data, error } = await useAsyncData(`${route.fullPath}`, async () => {
    const page = await queryCollection("content").path(route.path).first();
    if (!page) {
        throw createError({
            statusCode: 404,
            message: "Страница не найдена",
        });
    }
    return page;
});

onMounted(() => {
    if (error.value) {
        throw createError({
            statusCode: error.value?.statusCode || 500,
            message: error.value?.message || "Ошибка сервера",
        });
    }
});

useSeoMeta({
    title: data.value?.title,
    description: data.value?.description,
});

const toc = computed(() => data.value?.body.toc);
const tocGlobal = useState("toc", () => toc.value);
syncRef(tocGlobal, toc);

const videoCollapseState = useCookie<boolean>("video-collapse-state");
const videoTabState = useCookie<string>("video-tab-state");
</script>

<template>
    <div v-if="data" class="space-y-4">
        <Collapsible
            v-if="data.lectureYouTubeLink && data.lectureVkLink"
            id="recordings"
            v-model:open="videoCollapseState"
            class="group/collapsible space-y-4"
        >
            <CollapsibleTrigger>
                <Button>
                    <span>Записи лекций</span>

                    <Icon
                        name="material-symbols:chevron-right"
                        class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                    />
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <Card class="px-16">
                    <Tabs v-model="videoTabState" default-value="yt">
                        <TabsList>
                            <TabsTrigger value="yt"> YouTube </TabsTrigger>
                            <TabsTrigger value="vk"> VK Видео </TabsTrigger>
                        </TabsList>
                        <TabsContent value="yt">
                            <Carousel>
                                <CarouselContent>
                                    <CarouselItem
                                        v-for="video in data.lectureYouTubeLink"
                                        :key="video"
                                    >
                                        <ScriptYouTubePlayer
                                            :video-id="extractYouTubeId(video)"
                                            :player-options="{
                                                host: 'https://www.youtube.com',
                                            }"
                                            :player-vars="{
                                                color: 'white',
                                                hl: 'ru',
                                            }"
                                            class="rounded-xl overflow-hidden"
                                        />
                                    </CarouselItem>
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </TabsContent>
                        <TabsContent value="vk">
                            <Carousel>
                                <CarouselContent>
                                    <CarouselItem
                                        v-for="video in data.lectureVkLink"
                                        :key="video"
                                    >
                                        <iframe
                                            :src="`https://vk.com/video_ext.php?oid=${extractVkVideoId(video)[1]}&id=${extractVkVideoId(video)[2]}d&hd=2`"
                                            allow="autoplay; encrypted-media; fullscreen; picture-in-picture;"
                                            frameborder="0"
                                            allowfullscreen
                                            class="rounded-xl overflow-hidden w-full aspect-video"
                                        />
                                    </CarouselItem>
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </TabsContent>
                    </Tabs>
                </Card>
            </CollapsibleContent>
        </Collapsible>
        <div class="md overflow-x-auto">
            <ContentRenderer v-if="data" :value="data" />
        </div>
    </div>
</template>

<style lang="scss"></style>
