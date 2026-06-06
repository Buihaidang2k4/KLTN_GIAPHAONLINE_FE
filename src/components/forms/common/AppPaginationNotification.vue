<script setup lang="ts">
import { unref, type MaybeRef } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

interface Props {
    page: MaybeRef<number>
    totalPages: MaybeRef<number>
    hasNext: MaybeRef<boolean>
    hasPrev: MaybeRef<boolean>
}

const props = defineProps<Props>()

const emit = defineEmits<{
    (e: 'next'): void 
    (e: 'prev'): void
}>()
</script>

<template>
    <div class="flex items-center justify-between w-full py-1">
        <span class="text-[11px] font-medium text-slate-500">
            Trang {{ unref(props.page) + 1 }} / {{ unref(props.totalPages) || 1 }}
        </span>

        <div class="flex items-center gap-1">
            <button 
                @click="emit('prev')" 
                :disabled="!unref(props.hasPrev)"
                class="p-1 rounded-md border border-slate-150 transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95"
            >
                <ChevronLeft :size="14" class="text-slate-600" />
            </button>

            <button 
                @click="emit('next')" 
                :disabled="!unref(props.hasNext)"
                class="p-1 rounded-md bg-amber-500 text-white transition disabled:opacity-40 disabled:cursor-not-allowed hover:bg-amber-600 active:scale-95 shadow-sm"
            >
                <ChevronRight :size="14" />
            </button>
        </div>
    </div>
</template>
