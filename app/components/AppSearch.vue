<script setup lang="ts">
import type { Toc, TocLink } from "@nuxt/content";
import { useMagicKeys } from "@vueuse/core";
const open = useState<boolean>("search", () => false);

const { Meta_K, Ctrl_K } = useMagicKeys({
    passive: false,
    onEventFired(e) {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) e.preventDefault();
    },
});

watch([Meta_K, Ctrl_K], (v) => {
    if (v[0] || v[1]) handleOpenChange();
});

function handleOpenChange() {
    open.value = !open.value;
}

const toc = useState<Toc>("toc");
const tocSelect = (link: TocLink) => {
    open.value = false;
    navigateTo(`#${link.id}`);
};

const input = ref("");
const {
    data: results,
    status,
    refresh,
} = useFetch("/api/search", {
    params: {
        query: input,
    },
});

const debounceRefresh = useDebounceFn(refresh, 300);

setTimeout(() => {
    if (open.value) refresh();
}, 1000);

watch(input, () => {
    debounceRefresh();
});

const selectLink = (link: string) => {
    input.value = "";
    open.value = false;
    navigateTo(link);
};
</script>

<template>
    <div>
        <CommandDialog v-model:open="open">
            <CommandInput
                v-model="input"
                placeholder="Поиск по странице и сайту..."
            />
            <CommandList>
                <CommandEmpty
                    v-if="results?.length === 0 && status === 'success'"
                >
                    <span>Ничего не найдено.</span>
                </CommandEmpty>
                <CommandGroup v-else heading="Лекции" always-render>
                    <div
                        v-if="status === 'pending'"
                        class="flex justify-center"
                    >
                        <Icon name="svg-spinners:ring-resize" />
                    </div>
                    <CommandItem
                        v-for="result in results"
                        :key="result.refIndex"
                        always-render
                        value="unused"
                        @select="selectLink(result.item.id)"
                    >
                        <p class="opacity-90">
                            <span
                                v-for="(value, index) in getHighlightedChunks(
                                    result
                                )"
                                :key="index"
                                :style="{
                                    'background-color': value.highlighted
                                        ? 'var(--foreground)'
                                        : 'transparent',
                                    color: value.highlighted
                                        ? 'var(--background)'
                                        : 'inherit',
                                }"
                            >
                                {{ value.text }}
                            </span>
                        </p>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup v-if="toc" heading="Оглавление">
                    <CommandItem
                        value="recordings"
                        @select="navigateTo('#recordings')"
                    >
                        <Icon
                            name="material-symbols:video-library"
                            class="mr-1"
                        />
                        Записи лекций
                    </CommandItem>
                    <CommandItem
                        v-for="item in toc.links"
                        :key="item.id"
                        :value="item.text"
                        @select="tocSelect(item)"
                    >
                        {{ item.text }}
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    </div>
</template>
