<script setup lang="ts">
interface Props {
    page: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
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
            <button @click="emit('prev')" :disabled="!hasPrev"
                class="rounded-xl px-4 py-2 text-sm font-medium transition" :class="!hasPrev
                    ? 'cursor-not-allowed bg-slate-50 text-slate-400'
                    : 'cursor-pointer text-slate-700 hover:bg-slate-50 active:scale-95'">
                ← Trước
            </button>

            <span class="rounded-xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
                Trang {{ page + 1 }} / {{ totalPages || 1 }}
            </span>

            <button @click="emit('next')" :disabled="!hasNext"
                class="rounded-xl px-4 py-2 text-sm font-medium transition"
                :class="!hasNext
                    ? 'cursor-not-allowed bg-slate-50 text-slate-400'
                    : 'cursor-pointer bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95 shadow-md shadow-indigo-200'">
                Sau →
            </button>
        </div>
    </div>
</template>