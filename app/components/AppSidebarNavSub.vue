<script lang="ts" setup>
import type { ContentNavigationItem } from "@nuxt/content";

defineProps<{
    items: Array<ContentNavigationItem>;
}>();

const route = useRoute();
</script>

<template>
    <SidebarMenuSub>
        <SidebarMenuSubItem v-for="item in items" :key="item.path">
            <SidebarMenuSubButton
                as-child
                class="w-full"
                :class="{ 'bg-secondary': item.path === route.path }"
            >
                <NuxtLink
                    :href="item.children ? '' : `${item.path}`"
                    :title="item.title"
                >
                    <span>{{ item.title }}</span>
                </NuxtLink>
            </SidebarMenuSubButton>
            <AppSidebarNavSub v-if="item.children" :items="item.children" />
        </SidebarMenuSubItem>
    </SidebarMenuSub>
</template>
