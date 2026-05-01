<script setup lang="ts">
import { Edit3, Trash2 } from 'lucide-vue-next';
import type { CeremonyTimelineRes } from '@/types/family/ceremony.types';

interface Props {
    step: CeremonyTimelineRes;
    isLast: boolean;
}

defineProps<Props>();
defineEmits(['edit', 'delete']);
</script>

<template>
    <div
        class="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-2xl hover:border-slate-700/30 transition-all flex flex-col gap-6 relative overflow-hidden hover:bg-slate-50/30">

        <!-- PROGRESS DOT AND LINE -->
        <div class="flex gap-6">
            <div class="flex flex-col items-center shrink-0">
                <div
                    class="w-6 h-6 rounded-full border-4 border-slate-700 bg-white ring-8 ring-slate-700/5 group-hover:bg-slate-700 transition-colors shadow-lg">
                </div>
                <div v-if="!isLast" class="w-1 h-24 bg-slate-700/15 rounded-full my-4"></div>
            </div>

            <!-- CONTENT -->
            <div class="grow">
                <div class="flex justify-between items-start mb-6">
                    <div class="flex-1">
                        <p class="text-[10px] font-bold text-slate-700 opacity-70 uppercase tracking-[0.25em] mb-2">Bước
                            0{{
                                step.stepOrder }}</p>
                        <h4
                            class="text-3xl font-bold text-slate-900 group-hover:text-slate-700 transition-colors leading-tight mb-3">
                            {{ step.stepName }}
                        </h4>
                        <p class="text-sm text-slate-600 font-medium leading-relaxed italic">
                            {{ step.stepDescription }}
                        </p>
                    </div>
                    <div
                        class="flex gap-3 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0 shrink-0">
                        <button @click="$emit('edit', step)"
                            class="p-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-all shadow-md border border-slate-200/50 hover:shadow-lg">
                            <Edit3 class="w-5 h-5" />
                        </button>
                        <button @click="$emit('delete', step.timelineId)"
                            class="p-2.5 bg-slate-100 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-md border border-slate-200/50 hover:shadow-lg">
                            <Trash2 class="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <!-- GUIDELINES -->
                <div
                    class="bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 rounded-xl border border-slate-200 mb-6 shadow-sm">
                    <p class="text-slate-700 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                        {{ step.stepGuideline }}
                    </p>
                </div>

                <!-- PREPS -->
                <div v-if="step.timelinePreparations?.length" class="space-y-4">
                    <h5 class="text-[11px] font-bold text-slate-700 uppercase tracking-[0.35em]">📋 Lễ vật chuẩn bị ({{
                        step.timelinePreparations.length }} mục)</h5>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div v-for="prep in step.timelinePreparations" :key="prep.preparationId"
                            class="bg-gradient-to-br from-white to-slate-50/50 border-2 border-slate-200 p-6 rounded-xl hover:border-slate-700/40 hover:shadow-lg transition-all group/item shadow-sm hover:bg-white">
                            <div class="flex justify-between items-start mb-4 gap-3">
                                <div class="flex-1">
                                    <span
                                        class="text-lg font-bold text-slate-900 leading-tight block">{{ prep.itemName }}</span>
                                    <div class="flex items-baseline gap-1.5 mt-2">
                                        <span
                                            class="text-3xl font-bold tracking-tighter text-slate-900">{{ prep.quantity }}</span>
                                        <span
                                            class="text-xs font-bold text-slate-500 uppercase tracking-widest">{{ prep.unit }}</span>
                                    </div>
                                </div>
                                <span v-if="prep.required"
                                    class="text-[9px] font-bold bg-red-50 text-red-700 px-3 py-1.5 rounded-lg uppercase tracking-widest border-2 border-red-200 font-semibold whitespace-nowrap">⭐
                                    Ưu tiên</span>
                            </div>

                            <p v-if="prep.note"
                                class="text-xs text-slate-600 italic leading-relaxed border-t-2 border-slate-200 pt-4 mt-4">
                                💡 {{ prep.note }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
