<script lang="ts" setup>
import type { Toc } from "@nuxt/content";
import { useSidebar } from "./ui/sidebar";

const toc = useState<Toc>("toc");

const sidebar = useSidebar();
</script>

<template>
    <Sidebar variant="floating" collapsible="icon">
        <SidebarHeader>
            <div class="flex gap-10 items-center">
                <Button variant="outline" class="w-0">
                    <SidebarTrigger />
                </Button>
                <Transition name="sidebar-header" mode="out-in">
                    <div
                        v-if="sidebar.open.value"
                        class="flex gap-10 items-center w-48"
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
        </SidebarHeader>
        <SidebarContent>
            <SidebarGroup v-if="toc">
                <SidebarMenu>
                    <Collapsible
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
        <SidebarFooter />
    </Sidebar>
</template>

<style lang="scss" scoped>
.sidebar-header-enter-active,
.sidebar-header-leave-active {
    transition: all 0.12s;
    overflow: hidden;
    > * {
        flex-shrink: 0;
    }
}
.sidebar-header-enter-from,
.sidebar-header-leave-to {
    width: 2rem;
}
</style>
