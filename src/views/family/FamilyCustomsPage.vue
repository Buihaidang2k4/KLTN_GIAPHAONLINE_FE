<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    BookOpen, Plus, ListOrdered, ArrowLeft, Info,
    Search
} from 'lucide-vue-next';
import type { CeremonyReq, CeremonyTimelineReq, CeremonyTimelineRes, CeremonyUpdateReq } from '@/types/family/ceremony.types';

// Import components
import TimelineStepModal from '@/components/family_customs/TimelineStepModal.vue';
import CeremonyCard from '@/components/family_customs/CeremonyCard.vue';
import TimelineStep from '@/components/family_customs/TimelineStep.vue';
import AppPagination from '@/components/forms/common/AppPagination.vue';
import { usePagination } from '@/composables/common/usePagination';
import { refDebounced } from '@vueuse/core';
import { useFamilyStore } from '@/store/family/useFamilyStore';
import { useCreateCeremonyMutation, useDeleteCeremonyMutation, useFamilyCeremonysQuery, useUpdateCeremonyMutation } from '@/hooks/queries/family/ceremony/useCeremony';
import { notify } from '@/utils/notify';
import CreateOrUpdateCeremonyForm from '@/components/forms/ceremony/CreateOrUpdateCeremonyForm.vue';
import { useCreateCeremonyTimelineMutation, useDeleteCeremonyTimelineMutation, useUpdateCeremonyTimelineMutation } from '@/hooks/queries/family/ceremony/useCeremonyTimeline';
import TimelinePreparationModal from '@/components/family_customs/TimelinePreparationModal.vue';

// --- STATE ---
const selectedCeremonyId = ref<number | null>(null);
const showStepModal = ref(false);
const editingStep = ref<CeremonyTimelineRes | null>(null);
const showPreparationModal = ref(false)
const selectedPreparationTimeline = ref<CeremonyTimelineRes | null>(null)

const goBack = () => selectedCeremonyId.value = null;

const openModal = (step: CeremonyTimelineRes | null = null) => {
    editingStep.value = step;
    showStepModal.value = true;
};

const closeStepModal = () => {
    showStepModal.value = false
    editingStep.value = null
}

// start
const familyStore = useFamilyStore();
const familyId = computed(() => familyStore.currentFamilyId);

//  pagination
const {
    currentPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    setTotalPages,
    pagination
} = usePagination(6, 0);

const keyword = ref('');
const debounceKeyword = computed(() => refDebounced(keyword, 400))

const params = computed(() => ({
    page: pagination.page,
    size: pagination.size,
}))

const { data: ceremonyData } = useFamilyCeremonysQuery(
    familyId,
    params,
    debounceKeyword.value
)

watch(
    () => ceremonyData.value?.data?.totalPages,
    (total: any) => setTotalPages(total || 0),
    { immediate: true }
)

const safeCeremonies = computed(() => ceremonyData.value ? ceremonyData.value.data?.items : [])
const selectedCeremony = computed(() =>
    safeCeremonies.value?.find(ceremony => ceremony.ceremonyId === selectedCeremonyId.value) ?? null
)
//hook
const { mutate: createCeremonyMutation } = useCreateCeremonyMutation();
const { mutate: updateCeremonyMutation } = useUpdateCeremonyMutation();
const { mutate: deleteCeremonyMutation } = useDeleteCeremonyMutation();

// handle action
const hanldeDeleteCeremony = (ceremonyId: number) => {
    if (ceremonyId == null) return;

    deleteCeremonyMutation(ceremonyId, {
        onSuccess: () => {
            notify.success("Thông báo", "Xóa phong tục thành công")
        }
    })
}

const handleCreateCeremony = (pay: CeremonyReq) => {
    createCeremonyMutation({ familyId: familyId.value, data: pay }, {
        onSuccess: () => {
            notify.success("Thông báo", "Tạo phong tục thành công")
        }
    })
}

const handleUpdateFromForm = (payload: CeremonyUpdateReq) => {
    if (!editingCeremonyId.value) return
    updateCeremonyMutation({ ceremonyId: editingCeremonyId.value, data: payload }, {
        onSuccess: () => {
            isShowForm.value = false
            notify.success("Thông báo", "Cập nhật phong tục thànhc công")
        }
    })
}

// state 
const isShowForm = ref(false);
const mode = ref<'create' | 'update'>('create')
const editingCeremonyId = ref<number | null>(null)

const editingCeremony = computed(() =>
    safeCeremonies.value?.find(item => item.ceremonyId === editingCeremonyId.value) ?? null
)

const openCreateForm = () => {
    mode.value = 'create'
    editingCeremonyId.value = null
    isShowForm.value = true
}

const handleSelectCeremony = (id: number) => {
    selectedCeremonyId.value = id
}


const listenerUpdateCeremony = (id: number) => {
    isShowForm.value = true
    mode.value = 'update'
    editingCeremonyId.value = id
}

const closeFormCeremony = () => {
    isShowForm.value = false;
    editingCeremonyId.value = null
}

// ceremony timeline
const { mutate: createTimelineMutaion } = useCreateCeremonyTimelineMutation();
const { mutate: updateTimelineMutaion } = useUpdateCeremonyTimelineMutation();
const { mutate: deleteTimelineMutation } = useDeleteCeremonyTimelineMutation();


// handle timeline 
const modeTimeline = ref<'create' | 'update'>('create');



const selectedTimelines = computed(() => {
    const timelines = safeCeremonies.value?.find(
        ceremony => ceremony.ceremonyId === selectedCeremonyId.value
    )?.timelines ?? []

    const sortedTimelines = timelines
        .filter(timeline => timeline.stepOrder != null)
        .sort((a, b) => a.stepOrder - b.stepOrder)

    return sortedTimelines;
})

const openCreateTimelineModal = () => {
    modeTimeline.value = 'create'
    openModal(null)
}

const handleTimelineSave = (data: CeremonyTimelineReq) => {
    if (modeTimeline.value === 'update') {
        handleUpdateTimelineStep(data)
    } else {
        handleCreateTimelineStep(data)
    }
}

const handleEditTimelineStep = (step: CeremonyTimelineRes) => {
    modeTimeline.value = 'update'
    openModal(step)
}

const handleCreateTimelineStep = (data: CeremonyTimelineReq) => {
    if (!selectedCeremonyId.value) return

    createTimelineMutaion({ ceremonyId: selectedCeremonyId.value, data }, {
        onSuccess: () => {
            closeStepModal()
            notify.success("Thông báo", "Tạo bước thành công")
        },

        onError: (error) => {
            console.error('create timeline error', error)
            notify.error('Thông báo', 'Tạo bước thất bại')
        }
    })
}

const handleUpdateTimelineStep = (data: CeremonyTimelineReq) => {
    if (!editingStep.value?.timelineId) return

    updateTimelineMutaion({ timelineId: editingStep.value.timelineId, data }, {
        onSuccess: () => {
            closeStepModal()
            notify.success("Thông báo", "Cập nhật bước thành công")
        }
    })
}

const handleDeleteTimelineStep = (timelineId: number) => {
    if (!timelineId) return
    deleteTimelineMutation(timelineId, {
        onSuccess: () => {
            notify.success("Thông báo", "Xóa bước thành công")
        }
    })
}

const handleManagePreparations = (step: CeremonyTimelineRes) => {
    selectedPreparationTimeline.value = step
    showPreparationModal.value = true
}

const closePreparationModal = () => {
    showPreparationModal.value = false
    selectedPreparationTimeline.value = null
}

const scrollToTimelineStep = (timelineId: number) => {
    const target = document.getElementById(`timeline-step-${timelineId}`)

    if (!target) return

    target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    })
}
</script>

<template>
    <div class="min-h-screen bg-white text-slate-900 selection:bg-slate-100 selection:text-slate-900">

        <TimelineStepModal :show="showStepModal" :mode="modeTimeline" :editing-step="editingStep"
            @close="closeStepModal" @save="handleTimelineSave" />
        <TimelinePreparationModal :show="showPreparationModal" :timeline="selectedPreparationTimeline"
            @close="closePreparationModal" />

        <header
            class="max-w-full mx-auto pt-10 px-4 mb-12 text-slate-900 bg-linear-to-br from-slate-50 to-white border-b border-slate-200/50">
            <div class="max-w-6xl mx-auto">
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6">
                    <div v-if="!selectedCeremonyId" class="flex items-center gap-6">
                        <div class="p-3 bg-slate-700 rounded-lg shadow-2xl shadow-slate-700/20">
                            <BookOpen class="text-white w-8 h-8" />
                        </div>
                        <div>
                            <span
                                class="block text-[9px] font-bold  text-slate-600 uppercase tracking-[0.3em] mb-1 opacity-50">Hệ
                                thống quản lý nghi thức</span>
                            <h1 class="text-4xl font-semibold tracking-tight leading-none">
                                Chi tiết <span class="italic text-slate-600">Nghi Lễ</span>
                            </h1>
                        </div>
                    </div>

                    <!-- Detail Header -->
                    <div v-else class="flex items-center gap-8 flex-1">
                        <div class="flex items-center gap-6 flex-1">
                            <div
                                class="p-4 bg-linear-to-br from-slate-700 to-slate-800 rounded-2xl shadow-2xl shadow-slate-700/30">
                                <ListOrdered class="text-white w-8 h-8" />
                            </div>
                            <div class="flex-1">
                                <span
                                    class="block text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-1 opacity-60">Xem
                                    chi tiết nghi thức</span>
                                <h1 class="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-slate-900">
                                    {{ selectedCeremony?.ceremonyName }}
                                </h1>
                                <p class="text-sm text-slate-600 mt-2 leading-relaxed">
                                    {{ selectedCeremony?.description }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <button v-if="selectedCeremonyId" @click="goBack"
                            class="group flex items-center gap-2 bg-white px-6 py-2.5 rounded-lg font-bold text-slate-700 border border-slate-300 shadow-sm hover:shadow-lg hover:border-slate-400 transition-all active:scale-95 text-[9px] uppercase tracking-widest">
                            <ArrowLeft class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Quay lại
                        </button>

                        <div v-else class="flex gap-2">
                            <div class="relative flex-1 lg:w-72">
                                <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
                                <input v-model="keyword" type="text" placeholder="Tìm kiếm phong tục theo tên..."
                                    class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            </div>

                            <button @click="openCreateForm"
                                class="flex items-center gap-2 bg-slate-700 text-white border-slate-800 cursor-pointer px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-slate-700/20 hover:bg-slate-600 transition-all active:scale-95 text-[9px] uppercase tracking-widest">
                                <Plus class="w-5 h-5" /> Thêm phong tục
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <main class="max-w-full mx-auto px-4 pb-12">
            <div class="max-w-6xl mx-auto">
                <Transition mode="out-in" enter-active-class="transform transition duration-600 ease-out"
                    enter-from-class="opacity-0 translate-y-12" enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transform transition duration-400 ease-in"
                    leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-12">
                    <!-- LIST VIEW CEREMONY -->
                    <div v-if="!selectedCeremonyId" class="flex flex-col">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            style="min-height: 580px; align-content: start;">
                            <CeremonyCard v-for="ceremony in safeCeremonies" :key="ceremony.ceremonyId"
                                :ceremony="ceremony" @select="handleSelectCeremony" @delete="hanldeDeleteCeremony"
                                @listener="listenerUpdateCeremony" />
                        </div>

                        <div class="flex justify-center mt-6">
                            <AppPagination :page="currentPage" :total-pages="pagination.totalPages"
                                :has-next="hasNextPage" :has-prev="hasPrevPage" @next="nextPage" @prev="prevPage" />
                        </div>

                        <CreateOrUpdateCeremonyForm :show="isShowForm" :mode="mode" :ceremony="editingCeremony"
                            @close="closeFormCeremony" @create="handleCreateCeremony" @update="handleUpdateFromForm" />
                    </div>

                    <!-- DETAIL VIEW -->
                    <div v-else class="w-full">
                        <div class="space-y-6">
                            <div
                                class="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-linear-to-br from-slate-50 to-slate-100/50 rounded-2xl border-2 border-slate-200 shadow-sm hover:shadow-md transition-all">
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 mb-3">
                                        <div class="p-2.5 bg-slate-700 rounded-lg shadow-lg">
                                            <ListOrdered class="text-white w-6 h-6" />
                                        </div>
                                        <h3 class="text-2xl font-bold text-slate-900">
                                            Tiến trình thực hiện
                                        </h3>
                                    </div>
                                    <p class="text-sm text-slate-600 ml-11">Tổng cộng: <span
                                            class="font-bold text-slate-900">{{ selectedTimelines.length || '_ _' }}
                                            bước</span></p>

                                    <!-- Button Thêm bước -->
                                    <div class="mt-4 flex justify-end">
                                        <button @click="openCreateTimelineModal"
                                            class="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white cursor-pointer px-6 py-2.5 rounded-lg font-bold text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-slate-700/30 hover:shadow-xl">
                                            <Plus class="w-4 h-4" /> Thêm bước
                                        </button>
                                    </div>

                                    <!--  Map step -->
                                    <div v-if="selectedTimelines.length" class="mt-6 border-t border-slate-200/60 pt-5">
                                        <p class="mb-4 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400">
                                            Bản đồ tiến trình
                                        </p>

                                        <div class="relative pl-6">
                                            <!-- Timeline Line -->
                                            <div
                                                class="absolute left-[19px] top-2 bottom-2 w-[2px] rounded-full bg-gradient-to-b from-slate-300 via-slate-400 to-slate-300">
                                            </div>

                                            <div class="flex flex-col gap-1">
                                                <div v-for="(step, index) in selectedTimelines" :key="step.timelineId"
                                                    class="group relative flex items-center gap-4 py-1.5">

                                                    <!-- Dot -->
                                                    <button type="button" @click="scrollToTimelineStep(step.timelineId)"
                                                        class="absolute -left-6 z-10 shrink-0 cursor-pointer">
                                                        <!-- Glow ring -->
                                                        <span
                                                            class="absolute inset-0 rounded-full bg-slate-700/0 group-hover:bg-slate-700/10 scale-[1.6] transition-all duration-300 group-hover:scale-[2]">
                                                        </span>
                                                        <span
                                                            class="relative flex h-10 w-10 items-center justify-center rounded-full bg-white ring-2 ring-slate-200 group-hover:ring-slate-400 shadow-sm group-hover:shadow-md transition-all duration-300">
                                                            <span
                                                                class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-[10px] font-bold text-white shadow-inner">
                                                                {{ step.stepOrder }}
                                                            </span>
                                                        </span>
                                                    </button>

                                                    <!-- Content Card -->
                                                    <button type="button" @click="scrollToTimelineStep(step.timelineId)"
                                                        class="flex-1 ml-6 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-gradient-to-r from-white to-slate-50/50 px-4 py-2.5 text-left shadow-sm cursor-pointer transition-all duration-300 group-hover:border-slate-300 group-hover:shadow-md group-hover:translate-x-1 group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-100/60">
                                                        <div class="flex-1 min-w-0">
                                                            <p
                                                                class="text-[12px] font-semibold text-slate-800 line-clamp-1 group-hover:text-slate-900 transition-colors">
                                                                {{ step.stepName }}
                                                            </p>
                                                            <p
                                                                class="text-[10px] text-slate-400 line-clamp-1 mt-0.5 group-hover:text-slate-500 transition-colors">
                                                                {{ step.stepDescription }}
                                                            </p>
                                                        </div>
                                                        <svg class="w-4 h-4 text-slate-300 group-hover:text-slate-500 shrink-0 transition-all duration-300 group-hover:translate-x-0.5"
                                                            fill="none" viewBox="0 0 24 24" stroke="currentColor"
                                                            stroke-width="2">
                                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                                d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-if="selectedTimelines.length === 0"
                                class="bg-linear-to-br from-white to-slate-50/50 rounded-2xl p-20 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center shadow-sm">
                                <div
                                    class="w-24 h-24 bg-linear-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-8 shadow-md">
                                    <Info class="w-12 h-12 text-slate-400" />
                                </div>
                                <h4 class="text-slate-600 font-bold uppercase tracking-[0.4em] text-sm mb-3">Chưa có
                                    bước nào</h4>
                                <p class="text-slate-500 text-base font-medium mb-8 max-w-sm">Hãy bắt đầu xây dựng lộ
                                    trình chi tiết cho nghi lễ "<span class="font-bold text-slate-900">{{
                                        selectedCeremony?.ceremonyName }}</span>" này.</p>
                            </div>

                            <div v-else class="space-y-6 relative">
                                <div v-for="(step, index) in selectedTimelines" :key="step.timelineId"
                                    :id="`timeline-step-${step.timelineId}`">
                                    <TimelineStep :step="step" :is-last="index === selectedTimelines.length - 1"
                                        @edit="handleEditTimelineStep" @delete="handleDeleteTimelineStep"
                                        @manage-preparations="handleManagePreparations" />
                                </div>


                                <div class="flex items-center gap-8 py-8 px-6 opacity-30">
                                    <div class="w-4 h-4 rounded-full bg-slate-600"></div>
                                    <div class="h-0.5 bg-slate-600 grow rounded-full"></div>
                                    <span class="text-slate-600 font-bold uppercase tracking-[0.4em] text-[9px]">Hoàn
                                        tất
                                        tiến độ</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
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
