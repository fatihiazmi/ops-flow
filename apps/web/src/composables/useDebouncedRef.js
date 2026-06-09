import { ref, watch } from "vue";
export function useDebouncedRef(source, delayMs = 300) {
    const debounced = ref(source.value);
    let timer = null;
    watch(source, (val) => {
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(() => {
            debounced.value = val;
        }, delayMs);
    });
    return debounced;
}
//# sourceMappingURL=useDebouncedRef.js.map