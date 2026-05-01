<script setup lang="ts">
import { unref, type MaybeRef } from 'vue';

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
    <div class="mt-6 flex items-center justify-end">
        <div class="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <button @click="emit('prev')" :disabled="!unref(props.hasPrev)"
                class="rounded-xl px-4 py-2 text-sm font-medium transition" :class="!unref(props.hasPrev)
                    ? 'cursor-not-allowed bg-slate-50 text-slate-400'
                    : 'cursor-pointer text-slate-700 hover:bg-slate-50 active:scale-95'">
                ← Trước
            </button>

            <span class="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
                Trang {{ unref(props.page) + 1 }} / {{ unref(props.totalPages) || 1 }}
            </span>

            <button @click="emit('next')" :disabled="!unref(props.hasNext)"
                class="rounded-xl px-4 py-2 text-sm font-medium transition"
                :class="!unref(props.hasNext)
                    ? 'cursor-not-allowed bg-slate-50 text-slate-400'
                    : 'cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-200'">
                Sau →
            </button>
        </div>
    </div>
</template>