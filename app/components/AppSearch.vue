<script setup lang="ts">
import type { Toc, TocLink } from "@nuxt/content";
import { useMagicKeys } from "@vueuse/core";
import type { FuseResultMatch } from "fuse.js";
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
    watch: false,
});

const debounceRefresh = useDebounceFn(() => refresh(), 200, {
    maxWait: 1000,
});

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
const matchToSpanSequence = (match: FuseResultMatch) => {
    if (!match.value) {
        return [{ text: "", highlight: false }];
    }
    const spans: Array<{ text: string; highlight: boolean }> = [];
    let lastIndex = 0;
    match.indices.forEach(([start, end]) => {
        if (!match.value) return;
        if (lastIndex < start) {
            let text = match.value.slice(lastIndex, start);
            if (text.length > 30) {
                text =
                    text.slice(0, 15) +
                    "   ...   " +
                    text.slice(text.length - 15);
            }
            spans.push({
                text,
                highlight: false,
            });
        }
        spans.push({
            text: match.value.slice(start, end + 1),
            highlight: true,
        });
        lastIndex = end + 1;
    });
    if (lastIndex < match.value.length) {
        let text = match.value.slice(lastIndex);
        if (text.length > 30) {
            text =
                text.slice(0, 15) + "   ...   " + text.slice(text.length - 15);
        }
        spans.push({
            text,
            highlight: false,
        });
    }
    return spans;
};
</script>

<template>
    <div>
        <CommandDialog v-model:open="open" @selected-value="console.warn">
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
                        <div class="flex flex-col gap-1">
                            <div
                                class="text-[12px] opacity-50 flex items-center gap-1 flex-wrap"
                            >
                                <template
                                    v-for="(title, index) in result.item.titles"
                                    :key="index"
                                >
                                    <Icon
                                        v-if="index > 0"
                                        name="mdi:arrow-right"
                                    />
                                    <span>{{ title }}</span>
                                </template>
                            </div>
                            <p
                                v-for="match in result.matches"
                                :key="match.key"
                                class="text-sm"
                            >
                                <span
                                    v-for="(
                                        segment, index
                                    ) in matchToSpanSequence(match)"
                                    :key="index"
                                    :style="{
                                        'background-color': segment.highlight
                                            ? 'var(--foreground)'
                                            : 'transparent',
                                        color: segment.highlight
                                            ? 'var(--background)'
                                            : 'inherit',
                                    }"
                                >
                                    {{ segment.text }}
                                </span>
                            </p>
                        </div>
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
