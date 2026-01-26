<script setup lang="ts">
import { computed } from "vue";

type ToastType = "success" | "error" | "info" | "warning";
const props = defineProps<{
    type: ToastType;
    title: string;
    message: string;
}>();

const config = computed(() => {
    switch (props.type) {
        case "success": return { color: "text-emerald-500", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" };
        case "error": return { color: "text-rose-500", icon: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" };
        case "info": return { color: "text-blue-500", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" };
        case "warning": return { color: "text-amber-500", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" };
        default: return { color: "text-gray-400", icon: "" };
    }
});
</script> 

<template>
    <div
        class="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white border border-gray-100 shadow-lg shadow-gray-200/50 max-w-[260px]">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" :class="config.color" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="config.icon" />
        </svg>

        <div class="flex flex-col min-w-0">
            <span class="text-[11px] font-bold text-gray-900 leading-none mb-0.5 uppercase tracking-wider">
                {{ title }}
            </span>
            <p class="text-[12px] text-gray-500 leading-tight truncate">
                {{ message }}
            </p>
        </div>
    </div>
</template>