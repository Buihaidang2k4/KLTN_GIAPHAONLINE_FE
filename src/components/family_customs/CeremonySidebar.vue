<script setup lang="ts">
import { Calendar, Clock } from 'lucide-vue-next';
import type { CeremonyRes } from '@/types/ceremony/ceremony';

interface Props {
    ceremony: CeremonyRes | undefined;
}

defineProps<Props>();

const getTypeStyle = (type: string) => {
    switch (type) {
        case 'Hỷ sự': return 'bg-slate-700/10 text-slate-900 border-slate-700/20';
        case 'Tang lễ': return 'bg-slate-100 text-slate-700 border-slate-200';
        case 'Lễ Tết': return 'bg-slate-50 text-slate-700 border-slate-200';
        default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
};

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
};
</script>

<template>
    <aside class="md:sticky md:top-8">
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <span
                :class="['inline-block text-[8px] uppercase font-bold px-3 py-1.5 rounded-full border mb-4 tracking-[0.15em] shadow-sm', getTypeStyle(ceremony?.ceremonyType || '')]">
                {{ ceremony?.ceremonyType }}
            </span>
            <h2 class="text-3xl font-semibold font-cursive text-slate-900 mb-4 leading-[1.1]">
                {{ ceremony?.ceremonyName }}
            </h2>
            <p class="text-slate-600 font-medium text-xs leading-relaxed mb-6 italic border-l-4 border-slate-200 pl-4">
                {{ ceremony?.description }}
            </p>

            <div class="space-y-4 pt-4 border-t border-slate-100">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <Calendar class="w-5 h-5" />
                    </div>
                    <div>
                        <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Cấp độ quản lý
                        </p>
                        <p class="text-sm font-bold text-slate-700">Dòng tộc Vũ Văn </p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div
                        class="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 shadow-inner">
                        <Clock class="w-5 h-5" />
                    </div>
                    <div>
                        <p class="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Cập nhật lần
                            cuối
                        </p>
                        <p class="text-sm font-bold text-slate-700">
                            {{ formatDate(ceremony?.updatedAt) }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>
