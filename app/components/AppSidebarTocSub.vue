<script lang="ts" setup>
import type { TocLink } from "@nuxt/content";

defineProps<{
    links: Array<TocLink>;
}>();
</script>

<template>
    <SidebarMenuSub>
        <SidebarMenuSubItem v-for="link in links" :key="link.id">
            <SidebarMenuSubButton as-child>
                <NuxtLink
                    :href="`#${link.id}`"
                    class="opacity-90"
                    :title="link.text"
                >
                    <span>{{ link.text }}</span>
                </NuxtLink>
            </SidebarMenuSubButton>
            <AppSidebarTocSub v-if="link.children" :links="link.children" />
        </SidebarMenuSubItem>
    </SidebarMenuSub>
</template>
