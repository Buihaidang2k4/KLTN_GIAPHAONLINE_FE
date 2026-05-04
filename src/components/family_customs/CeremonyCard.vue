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
    switch (type) {
        case 'Hỷ sự': return 'bg-slate-700/10 text-slate-900 border-slate-700/20';
        case 'Tang lễ': return 'bg-slate-100 text-slate-700 border-slate-200';
        case 'Lễ Tết': return 'bg-slate-50 text-slate-700 border-slate-200';
        default: return 'bg-slate-50 text-slate-600 border-slate-100';
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
            <span
                :class="['text-[8px] uppercase font-bold px-3 py-1.5 rounded-lg border tracking-[0.15em] shadow-sm', getTypeStyle(ceremony.ceremonyType)]">
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
