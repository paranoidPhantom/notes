<script lang="ts" setup>
import type { ContentNavigationItem, Toc } from "@nuxt/content";
import { useSidebar } from "./ui/sidebar";

const toc = useState<Toc>("toc");

const sidebar = useSidebar();

const tocOpen = useCookie<boolean>("toc-open");
const lecturesOpen = useCookie<boolean>("lectures-open");
const searchOpen = useState<boolean>("search");

const launchSearch = () => {
    searchOpen.value = true;
    if (sidebar.isMobile.value) {
        sidebar.setOpenMobile(false);
    }
};

const router = useRouter();

router.afterEach(() => {
    if (sidebar.isMobile.value) {
        sidebar.setOpenMobile(false);
    }
});

const nav = useState<ContentNavigationItem[] | undefined>("navigation");
</script>

<template>
    <Sidebar variant="floating" collapsible="icon">
        <SidebarHeader>
            <NuxtLink to="/" class="w-full flex">
                <Button
                    variant="outline"
                    class="flex justify-center overflow-hidden p-1 grow max-w-full"
                >
                    <Icon name="mdi:house" class="shrink-0" />
                </Button>
            </NuxtLink>
            <div class="flex gap-4 items-center">
                <Button
                    variant="outline"
                    class="flex justify-between overflow-hidden p-0 grow max-w-full"
                >
                    <SidebarTrigger />

                    <Transition name="sidebar-header" mode="out-in">
                        <Kbd v-if="sidebar.open.value">{{ useMeta() }} B</Kbd>
                    </Transition>
                </Button>
                <Transition name="sidebar-header" mode="out-in">
                    <div
                        v-if="sidebar.open.value"
                        class="flex gap-3 items-center"
                    >
                        <ColorPicker />
                        <NuxtLink
                            to="https://github.com/paranoidPhantom/notes"
                            target="_blank"
                        >
                            <Button variant="outline">
                                <Icon name="mdi:github" />
                            </Button>
                        </NuxtLink>
                    </div>
                </Transition>
            </div>
            <Button
                class="flex justify-start overflow-hidden p-2"
                variant="outline"
                @click="launchSearch()"
            >
                <Icon class="shrink-0" name="mdi:search" />
                <Transition name="sidebar-header" mode="out-in">
                    <div
                        v-if="sidebar.open.value"
                        class="w-full flex items-center"
                    >
                        Поиск
                        <Kbd class="ml-auto">{{ useMeta() }} K</Kbd>
                    </div>
                </Transition>
            </Button>
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup v-if="nav">
                <SidebarMenu>
                    <Collapsible
                        v-model:open="lecturesOpen"
                        title="Конспекты"
                        as-child
                        class="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger as-child>
                                <SidebarMenuButton tooltip="Конеспекты">
                                    <Icon
                                        class="shrink-0 mr-1"
                                        name="streamline-freehand:content-paper-edit"
                                    />
                                    <span>Конспекты</span>
                                    <Icon
                                        name="material-symbols:chevron-right"
                                        class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                    />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <AppSidebarNavSub :items="nav" />
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup v-if="toc">
                <SidebarMenu>
                    <Collapsible
                        v-model:open="tocOpen"
                        title="Оглавление"
                        as-child
                        class="group/collapsible"
                    >
                        <SidebarMenuItem>
                            <CollapsibleTrigger as-child>
                                <SidebarMenuButton tooltip="Оглавление">
                                    <Icon
                                        class="shrink-0 mr-1"
                                        name="tabler:heading"
                                    />
                                    <span>Оглавление</span>
                                    <Icon
                                        name="material-symbols:chevron-right"
                                        class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                    />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <AppSidebarTocSub
                                    :links="toc.links.filter((l) => l.text)"
                                />
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
    </Sidebar>
</template>

<style lang="scss" scoped>
.sidebar-header-enter-active,
.sidebar-header-leave-active {
    transition: all 0.3s;
    overflow: hidden;
    > * {
        flex-shrink: 0;
    }
}
.sidebar-header-enter-from,
.sidebar-header-leave-to {
    filter: blur(1rem);
    scale: 0.8;
}
</style>
