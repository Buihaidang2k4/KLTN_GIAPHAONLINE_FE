<script setup lang="ts">
import { Edit3, Trash2 } from 'lucide-vue-next';
import type { CeremonyTimelineRes } from '@/types/ceremony/ceremony';

interface Props {
    step: CeremonyTimelineRes;
    isLast: boolean;
}

defineProps<Props>();
defineEmits(['edit', 'delete']);
</script>

<template>
    <div
        class="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-slate-700/30 transition-all flex flex-col md:flex-row gap-4 relative overflow-hidden">

        <!-- PROGRESS DOT -->
        <div class="flex flex-col items-center shrink-0">
            <div
                class="w-4 h-4 rounded-full border-3 border-slate-700 bg-white ring-6 ring-slate-700/5 group-hover:bg-slate-700 transition-colors">
            </div>
            <div v-if="!isLast" class="w-0.5 h-full bg-slate-700/10 rounded-full my-3"></div>
        </div>

        <!-- CONTENT -->
        <div class="grow">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <p class="text-[8px] font-bold text-slate-700 opacity-60 uppercase tracking-[0.2em] mb-1">Bước 0{{
                        step.stepOrder }}</p>
                    <h4
                        class="text-2xl font-semibold font-cursive text-slate-900 group-hover:text-slate-700 transition-colors leading-tight">
                        {{ step.stepName }}
                    </h4>
                    <p class="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
                        {{ step.stepDescription }}
                    </p>
                </div>
                <div
                    class="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                    <button @click="$emit('edit', step)"
                        class="p-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-700 hover:text-white transition-all shadow-sm border border-slate-200/50">
                        <Edit3 class="w-4 h-4" />
                    </button>
                    <button @click="$emit('delete', step.timelineId)"
                        class="p-2 bg-slate-100 text-red-500 rounded-md hover:bg-red-600 hover:text-white transition-all shadow-sm border border-slate-200/50">
                        <Trash2 class="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div class="bg-slate-50/70 p-5 rounded-lg border border-slate-100 mb-4 prose prose-slate prose-sm">
                <p class="text-slate-700 text-xs leading-relaxed font-medium whitespace-pre-wrap italic">
                    {{ step.stepGuideline }}
                </p>
            </div>

            <!-- PREPS -->
            <div v-if="step.timelinePreparations?.length" class="space-y-4">
                <h5 class="text-[8px] font-bold text-slate-700 uppercase tracking-[0.3em] ml-1">Lễ vật chuẩn bị</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div v-for="prep in step.timelinePreparations" :key="prep.preparationId"
                        class="bg-white border border-slate-200 p-5 rounded-lg hover:border-slate-700/30 transition-all group/item shadow-sm">
                        <div class="flex justify-between items-start mb-4">
                            <span
                                class="text-lg font-semibold font-serif text-slate-900 leading-tight">{{ prep.itemName }}</span>
                            <span v-if="prep.required"
                                class="text-[8px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-md uppercase tracking-widest border border-red-100">Ưu
                                tiên</span>
                        </div>

                        <div class="flex items-baseline gap-1 mb-3">
                            <span class="text-2xl font-light tracking-tighter text-slate-900">{{ prep.quantity }}</span>
                            <span
                                class="text-xs font-bold text-slate-400 uppercase tracking-widest">{{ prep.unit }}</span>
                        </div>

                        <p v-if="prep.note"
                            class="text-[9px] text-slate-400 mt-3 italic leading-relaxed border-t border-slate-100 pt-2">
                            Ghi chú: {{ prep.note }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
