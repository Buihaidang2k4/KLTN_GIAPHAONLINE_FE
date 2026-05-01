<script setup lang="ts">
import { Clock, ListOrdered, ChevronRight } from 'lucide-vue-next';
import type { CeremonyRes } from '@/types/family/ceremony.types';

interface Props {
    ceremony: CeremonyRes;
}

defineProps<Props>();
defineEmits(['select']);

const getTypeStyle = (type: string) => {
    switch (type) {
        case 'Hỷ sự': return 'bg-slate-700/10 text-slate-900 border-slate-700/20';
        case 'Tang lễ': return 'bg-slate-100 text-slate-700 border-slate-200';
        case 'Lễ Tết': return 'bg-slate-50 text-slate-700 border-slate-200';
        default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
};
</script>

<template>
    <div @click="$emit('select', ceremony.ceremonyId)"
        class="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:border-slate-700/30 transition-all cursor-pointer flex flex-col h-full relative">
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
            <div class="flex items-center gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                <ListOrdered class="w-4 h-4" /> {{ ceremony.timelines.length }} Giai đoạn
            </div>
            <div
                class="flex items-center gap-1 text-slate-700 font-bold text-[9px] uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                Chi tiết
                <ChevronRight class="w-4 h-4" />
            </div>
        </div>
    </div>
</template>
