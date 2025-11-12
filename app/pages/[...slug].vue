<script setup lang="ts">
const route = useRoute();
const { data, error } = await useAsyncData(async () => {
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
</script>

<template>
    <div class="md overflow-x-auto">
        <ContentRenderer v-if="data" :value="data" />
    </div>
</template>

<style lang="scss"></style>
