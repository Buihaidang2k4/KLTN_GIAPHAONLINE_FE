<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    BookOpen, Plus, ListOrdered, ArrowLeft, Info
} from 'lucide-vue-next';
import type { CeremonyRes, CeremonyTimelineRes } from '@/types/ceremony/ceremony';

// Import components
import StepModal from '@/components/family_customs/StepModal.vue';
import CeremonyCard from '@/components/family_customs/CeremonyCard.vue';
import CeremonySidebar from '@/components/family_customs/CeremonySidebar.vue';
import TimelineStep from '@/components/family_customs/TimelineStep.vue';

// --- MOCK DATA ---
const INITIAL_CEREMONIES: CeremonyRes[] = [
    {
        ceremonyId: 1,
        familyId: 5,
        ceremonyType: "Hỷ sự",
        ceremonyName: "Lễ Cưới Truyền Thống",
        description: "Quy trình tổ chức lễ cưới theo phong tục dòng tộc, tập trung vào các nghi thức gia tiên và tiếp đón.",
        timelines: [
            {
                timelineId: 1,
                ceremonyId: 1,
                stepOrder: 1,
                stepName: "Lễ Dạm Ngõ",
                stepDescription: "Nhà trai mang trầu cau sang đặt vấn đề chính thức.",
                stepGuideline: "Chuẩn bị: 1 cơi trầu, 1 chai rượu, chè. Đại diện nhà trai thưa chuyện với nhà gái tại bàn thờ gia tiên.",
                timelinePreparations: [
                    {
                        preparationId: 2,
                        timelineId: 1,
                        itemName: "Cơi trầu quả",
                        itemType: "Lễ vật",
                        quantity: 1,
                        unit: "Bộ",
                        note: "Trầu têm cánh phượng",
                        required: true,
                        createdAt: "2026-04-12T09:14:54.428+00:00",
                        updatedAt: null
                    },
                    {
                        preparationId: 3,
                        timelineId: 1,
                        itemName: "Rượu Vodka/Vang",
                        itemType: "Lễ vật",
                        quantity: 1,
                        unit: "Chai",
                        note: "Loại thượng hạng",
                        required: true,
                        createdAt: "2026-04-20T16:02:08.930+00:00",
                        updatedAt: "2026-04-20T16:02:08.930+00:00"
                    }
                ],
                createdAt: "2026-04-12T09:10:56.427+00:00",
                updatedAt: "2026-04-12T09:10:56.427+00:00"
            },
            {
                timelineId: 3,
                ceremonyId: 1,
                stepOrder: 2,
                stepName: "Lễ Đón Dâu",
                stepDescription: "Đoàn nhà trai sang đón cô dâu về nhà chồng.",
                stepGuideline: "Mẹ chồng trao quà cho con dâu. Chú rể đón cô dâu sau khi thắp hương gia tiên nhà gái.",
                timelinePreparations: [],
                createdAt: "2026-04-12T09:14:54.428+00:00",
                updatedAt: "2026-04-12T09:14:54.428+00:00"
            }
        ],
        createdAt: "2026-04-12T02:44:05.336+00:00",
        updatedAt: "2026-04-12T09:09:34.824+00:00"
    },
    {
        ceremonyId: 2,
        familyId: 5,
        ceremonyType: "Tang lễ",
        ceremonyName: "Nghi Thức Tang Lễ Dòng Tộc",
        description: "Quy trình tổ chức tang lễ trang nghiêm, hiếu nghĩa, đảm bảo các bước tẩm liệm đúng đạo lý.",
        timelines: [],
        createdAt: "2026-04-12T02:44:05.336+00:00",
        updatedAt: "2026-04-12T09:09:34.824+00:00"
    }
];

// --- STATE ---
const ceremonies = ref<CeremonyRes[]>(INITIAL_CEREMONIES);
const selectedCeremonyId = ref<number | null>(null);
const showStepModal = ref(false);
const editingStep = ref<CeremonyTimelineRes | null>(null);

// --- COMPUTED ---
const selectedCeremony = computed(() =>
    ceremonies.value.find(c => c.ceremonyId === selectedCeremonyId.value)
);

const currentSteps = computed(() => {
    if (!selectedCeremony.value) return [];
    return [...selectedCeremony.value.timelines].sort((a, b) => a.stepOrder - b.stepOrder);
});

// --- METHODS ---
const goBack = () => selectedCeremonyId.value = null;

const openModal = (step: CeremonyTimelineRes | null = null) => {
    editingStep.value = step;
    showStepModal.value = true;
};

const handleSaveStep = (stepData: Partial<CeremonyTimelineRes>) => {
    if (!selectedCeremonyId.value) return;

    const ceremonyIndex = ceremonies.value.findIndex(c => c.ceremonyId === selectedCeremonyId.value);
    if (ceremonyIndex === -1) return;

    const ceremony = ceremonies.value[ceremonyIndex];
    let newTimelines = [...ceremony.timelines];

    if (editingStep.value) {
        // Update
        newTimelines = newTimelines.map(t =>
            t.timelineId === editingStep.value!.timelineId ? { ...t, ...stepData } as CeremonyTimelineRes : t
        );
    } else {
        // Add new
        const maxOrder = currentSteps.value.length > 0 ? Math.max(...currentSteps.value.map(s => s.stepOrder)) : 0;
        const newStep: CeremonyTimelineRes = {
            ...stepData,
            timelineId: Date.now(),
            ceremonyId: selectedCeremonyId.value,
            stepOrder: maxOrder + 1,
            timelinePreparations: stepData.timelinePreparations || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        } as CeremonyTimelineRes;
        newTimelines.push(newStep);
    }

    ceremonies.value[ceremonyIndex].timelines = newTimelines;
    showStepModal.value = false;
    editingStep.value = null;
};

const deleteStep = (timelineId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bước này?')) return;

    const ceremonyIndex = ceremonies.value.findIndex(c => c.ceremonyId === selectedCeremonyId.value);
    if (ceremonyIndex === -1) return;

    const remainingSteps = ceremonies.value[ceremonyIndex].timelines.filter(t => t.timelineId !== timelineId);
    ceremonies.value[ceremonyIndex].timelines = remainingSteps
        .sort((a: any, b: any) => a.stepOrder - b.stepOrder)
        .map((s: any, idx: any) => ({ ...s, stepOrder: idx + 1 }));
};
</script>

<template>
    <div class="min-h-screen bg-white font-sans text-slate-900 selection:bg-slate-100 selection:text-slate-900">

        <StepModal :show="showStepModal" :editing-step="editingStep" @close="showStepModal = false"
            @save="handleSaveStep" />

        <header class="max-w-6xl mx-auto pt-10 px-4 mb-12 text-slate-900">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
                <div class="flex items-center gap-6">
                    <div class="p-3 bg-slate-700 rounded-lg shadow-2xl shadow-slate-700/20">
                        <BookOpen class="text-white w-8 h-8" />
                    </div>
                    <div>
                        <span
                            class="block text-[9px] font-bold  text-slate-600 uppercase tracking-[0.3em] mb-1 opacity-50">Hệ
                            thống quản lý nghi thức</span>
                        <h1 class="text-4xl font-semibold font-cursive tracking-tight leading-none">
                            Chi tiết <span class="italic text-slate-600">Nghi Lễ</span>
                        </h1>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <div v-if="selectedCeremonyId" class="flex items-center gap-3 mr-4">
                        <div class="text-right">
                            <p class="text-[10px] uppercase font-bold text-slate-600 opacity-50">Quản lý bởi</p>
                            <p class="text-sm font-bold text-slate-900 opacity-80">Vũ Văn (ID: 5)</p>
                        </div>
                        <div
                            class="w-12 h-12 rounded-full bg-stone-200 border-2 border-white shadow-sm flex items-center justify-center text-xl font-serif">
                            V</div>
                    </div>
                    <button v-if="selectedCeremonyId" @click="goBack"
                        class="group flex items-center gap-2 bg-white px-6 py-2.5 rounded-lg font-bold text-slate-700 border border-slate-300 shadow-sm hover:shadow-lg transition-all active:scale-95 text-[9px] uppercase tracking-widest">
                        <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Quay lại
                    </button>
                    <button v-else
                        class="flex items-center gap-2 bg-slate-700 text-white border-slate-800 cursor-pointer px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-slate-700/20 hover:bg-slate-600 transition-all active:scale-95 text-[9px] uppercase tracking-widest">
                        <Plus class="w-5 h-5" /> Thêm phong tục
                    </button>
                </div>
            </div>
        </header>

        <main class="max-w-6xl mx-auto px-4 pb-12">
            <Transition mode="out-in" enter-active-class="transform transition duration-600 ease-out"
                enter-from-class="opacity-0 translate-y-12" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transform transition duration-400 ease-in"
                leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-12">
                <!-- LIST VIEW -->
                <div v-if="!selectedCeremonyId" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <CeremonyCard v-for="ceremony in ceremonies" :key="ceremony.ceremonyId" :ceremony="ceremony"
                        @select="id => selectedCeremonyId = id" />
                </div>

                <!-- DETAIL VIEW -->
                <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div class="lg:col-span-4">
                        <CeremonySidebar :ceremony="selectedCeremony" />
                    </div>

                    <div class="lg:col-span-8 space-y-6">
                        <div
                            class="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <h3 class="text-base font-bold font-serif text-slate-900 flex items-center gap-3">
                                <ListOrdered class="w-6 h-6 text-slate-600 opacity-50" />
                                Tiến trình thực hiện
                            </h3>
                            <button @click="openModal()"
                                class="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white cursor-pointer px-5 py-2.5 rounded-lg font-bold text-[9px] uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg shadow-slate-700/20">
                                <Plus class="w-4 h-4" /> Thêm tiến độ
                            </button>
                        </div>

                        <div v-if="currentSteps.length === 0"
                            class="bg-white rounded-2xl p-16 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                            <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                <Info class="w-8 h-8 text-slate-400" />
                            </div>
                            <h4 class="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs mb-2">Thông tin trống
                            </h4>
                            <p class="text-slate-500 text-sm font-medium">Bắt đầu xây dựng lộ trình chi tiết cho nghi lễ
                                này.</p>
                        </div>

                        <div v-else class="space-y-6 relative">
                            <TimelineStep v-for="(step, index) in currentSteps" :key="step.timelineId" :step="step"
                                :is-last="index === currentSteps.length - 1" @edit="openModal" @delete="deleteStep" />

                            <div class="flex items-center gap-8 py-8 px-6 opacity-30">
                                <div class="w-4 h-4 rounded-full bg-slate-600"></div>
                                <div class="h-0.5 bg-slate-600 grow rounded-full"></div>
                                <span class="text-slate-600 font-bold uppercase tracking-[0.4em] text-[9px]">Hoàn tất
                                    tiến độ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
        </main>
    </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3a3a2820;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #3a3a2840;
}
</style>
