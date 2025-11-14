export const useMeta = () => {
    const macOS = computed(
        () =>
            import.meta.client &&
            navigator &&
            navigator.userAgent &&
            navigator.userAgent.match(/Macintosh;/)
    );

    const meta = computed(() =>
        import.meta.server ? "_" : macOS.value ? "⌘" : "Ctrl"
    );
    return meta;
};
