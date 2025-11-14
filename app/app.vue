<script lang="ts" setup>
const defaultOpen = useCookie<boolean>("sidebar_state");
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
