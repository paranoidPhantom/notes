<script lang="ts" setup>
const defaultOpen = useCookie<boolean>("sidebar_state");

const { data: nav } = await useAsyncData("navigation", () => {
    return queryCollectionNavigation("content", ["lectureYouTubeLink"]).order(
        "index",
        "ASC"
    );
});

useState("navigation").value = nav.value;
useSeoMeta({
    ogImage: "/og.png",
    description: "допсяш одобряет",
});
</script>

<template>
    <div>
        <NuxtRouteAnnouncer />
        <SidebarProvider :default-open="defaultOpen">
            <AppSidebar />
            <AppSearch />
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </SidebarProvider>
    </div>
</template>
