<script setup lang="ts">
import { ref } from 'vue';
import { Clock, ListOrdered, MoreHorizontal } from 'lucide-vue-next';
import type { CeremonyRes } from '@/types/family/ceremony.types';
import CreateOrUpdateCeremonyForm from '../forms/ceremony/CreateOrUpdateCeremonyForm.vue';

interface Props {
    ceremony: CeremonyRes;
}

defineProps<Props>();

const emit = defineEmits<{
    select: [number]
    submit: [payload: {
        data: any
    }]
    listener: [id: number]
    delete: [id: number]
    close: []
}>()

const getTypeStyle = (type: string) => {
    const styles: Record<string, { background: string; color: string; borderColor: string }> = {
        'Hỷ sự': { background: '#fef2f2', color: '#be123c', borderColor: '#fecdd3' },
        'Tang lễ': { background: '#f1f5f9', color: '#475569', borderColor: '#cbd5e1' },
        'Lễ Tết': { background: '#fefce8', color: '#a16207', borderColor: '#fde68a' },
        'Cúng giỗ': { background: '#faf5ff', color: '#7e22ce', borderColor: '#e9d5ff' },
        'Sinh nhật': { background: '#fdf2f8', color: '#be185d', borderColor: '#fbcfe8' },
        'Mừng thọ': { background: '#fff7ed', color: '#c2410c', borderColor: '#fed7aa' },
        'Khánh thành': { background: '#ecfdf5', color: '#047857', borderColor: '#a7f3d0' },
        'Tân gia': { background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' },
        'Tâm linh': { background: '#f5f3ff', color: '#6d28d9', borderColor: '#ddd6fe' },
        'Gia đình': { background: '#f0fdfa', color: '#0f766e', borderColor: '#99f6e4' },
        'Truyền thống': { background: '#fffbeb', color: '#b45309', borderColor: '#fde68a' },
        'Khác': { background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' },
    }

    const style = styles[type] ?? { background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' }

    return {
        backgroundColor: style.background,
        color: style.color,
        borderColor: style.borderColor
    }
};


const selectCeremony = (id: number) => {
    emit('select', id)
}

const handleListener = (id: number) => {
    emit("listener", id)
}

const handleDelete = (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa nghi lễ này không?")) {
        emit('delete', id)
    }
}

const isMenuOpen = ref(false)

const actions = [
    { key: 'UPDATE', label: 'Chỉnh sửa' },
    { key: 'DETAIL', label: 'Chi tiết' },
    { key: 'DELETE', label: 'Xóa' }
] as const

type ActionKey = typeof actions[number]['key']

const handleAction = (action: ActionKey, id: number) => {
    isMenuOpen.value = false

    if (action === 'DETAIL') {
        selectCeremony(id)
        return
    }

    if (action === 'UPDATE') {
        handleListener(id)
        return
    }

    handleDelete(id)
}

</script>

<template>
    <div
        class="group bg-white rounded-2xl border border-slate-200  p-6 shadow-sm hover:shadow-xl hover:border-slate-700/30 transition-all  flex flex-col h-full relative">
        <div class="flex justify-between items-start mb-6">
            <span class="text-[8px] uppercase font-bold px-3 py-1.5 rounded-lg border tracking-[0.15em] shadow-sm"
                :style="getTypeStyle(ceremony.ceremonyType)">
                {{ ceremony.ceremonyType }}
            </span>
            <Clock class="w-4 h-4 text-slate-400" />
        </div>

        <h3
            class="text-2xl font-semibold text-slate-900 mb-3 group-hover:text-slate-700 transition-colors leading-tight">
            {{ ceremony.ceremonyName }}
        </h3>

        <p
            class="text-slate-600 text-xs font-medium line-clamp-3 mb-6 leading-relaxed italic border-l-2 border-slate-200 pl-4">
            "{{ ceremony.description }}"
        </p>

        <div class="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">

            <div class="flex items-center gap-2 text-[11px] text-slate-500 font-semibold">
                <ListOrdered class="w-4 h-4" />
                {{ ceremony.timelines.length }} giai đoạn
            </div>

            <div class="relative">
                <button @click.stop="isMenuOpen = !isMenuOpen"
                    class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
                    title="Tác vụ">
                    <MoreHorizontal class="w-4 h-4" />
                </button>

                <div v-if="isMenuOpen"
                    class="absolute right-0 top-11 z-20 min-w-36 overflow-hidden rounded-xl  border border-slate-200 bg-white py-1 shadow-xl">
                    <button v-for="action in actions" :key="action.key"
                        @click.stop="handleAction(action.key, ceremony.ceremonyId)" :class="[
                            'flex w-full items-center px-4 py-2.5 text-left text-sm transition cursor-pointer',
                            action.key === 'DELETE'
                                ? 'text-rose-600 hover:bg-rose-50'
                                : 'text-slate-700 hover:bg-slate-50'
                        ]">
                        {{ action.label }}
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>
