<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
    BookOpen, Plus, ListOrdered, ArrowLeft, Info,
    Search, ChevronRight
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
import { useFamilyPermissions } from '@/composables/family/useFamilyPermissions';

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

const ceremonyTypeConfigMap: Record<string, { bg: string; text: string; border: string; dot: string; soft: string; hover: string; ring: string }> = {
    'Hỷ sự': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', dot: 'bg-rose-600', soft: 'bg-rose-100/60', hover: 'hover:border-rose-200 hover:bg-rose-50/40', ring: 'ring-rose-100' },
    'Tang lễ': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-500', soft: 'bg-slate-100', hover: 'hover:border-slate-300 hover:bg-slate-50', ring: 'ring-slate-100' },
    'Lễ Tết': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500', soft: 'bg-amber-100/70', hover: 'hover:border-amber-300 hover:bg-amber-50/80', ring: 'ring-amber-100' },
    'Cúng giỗ': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500', soft: 'bg-purple-100/60', hover: 'hover:border-purple-300 hover:bg-purple-50/70', ring: 'ring-purple-100' },
    'Sinh nhật': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', dot: 'bg-pink-500', soft: 'bg-pink-100/60', hover: 'hover:border-pink-300 hover:bg-pink-50/70', ring: 'ring-pink-100' },
    'Mừng thọ': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500', soft: 'bg-orange-100/60', hover: 'hover:border-orange-300 hover:bg-orange-50/70', ring: 'ring-orange-100' },
    'Khánh thành': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', soft: 'bg-emerald-100/60', hover: 'hover:border-emerald-300 hover:bg-emerald-50/70', ring: 'ring-emerald-100' },
    'Tân gia': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', soft: 'bg-blue-100/60', hover: 'hover:border-blue-300 hover:bg-blue-50/70', ring: 'ring-blue-100' },
    'Tâm linh': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500', soft: 'bg-violet-100/60', hover: 'hover:border-violet-300 hover:bg-violet-50/70', ring: 'ring-violet-100' },
    'Gia đình': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500', soft: 'bg-teal-100/60', hover: 'hover:border-teal-300 hover:bg-teal-50/70', ring: 'ring-teal-100' },
    'Truyền thống': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500', soft: 'bg-yellow-100/60', hover: 'hover:border-yellow-300 hover:bg-yellow-50/70', ring: 'ring-yellow-100' },
    'Khác': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-500', soft: 'bg-slate-100', hover: 'hover:border-slate-300 hover:bg-slate-50', ring: 'ring-slate-100' }
}

const selectedCeremonyTheme = computed(() => {
    const type = selectedCeremony.value?.ceremonyType || 'Khác'
    return ceremonyTypeConfigMap[type] ?? ceremonyTypeConfigMap['Khác']!
})
//hook
const { mutate: createCeremonyMutation } = useCreateCeremonyMutation();
const { mutate: updateCeremonyMutation } = useUpdateCeremonyMutation();
const { mutate: deleteCeremonyMutation } = useDeleteCeremonyMutation();
const { canManageCeremony, withPermission } = useFamilyPermissions(familyId);

// handle action
const hanldeDeleteCeremony = withPermission(canManageCeremony, (ceremonyId: number) => {
    if (ceremonyId == null) return;
    deleteCeremonyMutation(ceremonyId, {
        onSuccess: () => notify.success("Thông báo", "Xóa phong tục thành công")
    })
})

const handleCreateCeremony = (pay: CeremonyReq) => {
    createCeremonyMutation({ familyId: familyId.value, data: pay }, {
        onSuccess: () => notify.success("Thông báo", "Tạo phong tục thành công")
    })
}

const handleUpdateFromForm = (payload: CeremonyUpdateReq) => {
    if (!editingCeremonyId.value) return
    updateCeremonyMutation({ ceremonyId: editingCeremonyId.value, data: payload }, {
        onSuccess: () => {
            isShowForm.value = false
            notify.success("Thông báo", "Cập nhật phong tục thành công")
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

const openCreateForm = withPermission(canManageCeremony, () => {
    mode.value = 'create'
    editingCeremonyId.value = null
    isShowForm.value = true
})

const handleSelectCeremony = (id: number) => {
    selectedCeremonyId.value = id
}

const listenerUpdateCeremony = withPermission(canManageCeremony, (id: number) => {
    isShowForm.value = true
    mode.value = 'update'
    editingCeremonyId.value = id
})

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

const openCreateTimelineModal = withPermission(canManageCeremony, () => {
    modeTimeline.value = 'create'
    openModal(null)
})

const handleTimelineSave = (data: CeremonyTimelineReq) => {
    if (modeTimeline.value === 'update') handleUpdateTimelineStep(data)
    else handleCreateTimelineStep(data)
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

const handleUpdateTimelineStep = withPermission(canManageCeremony, (data: CeremonyTimelineReq) => {
    if (!editingStep.value?.timelineId) return
    updateTimelineMutaion({ timelineId: editingStep.value.timelineId, data }, {
        onSuccess: () => {
            closeStepModal()
            notify.success("Thông báo", "Cập nhật bước thành công")
        }
    })
})

const handleDeleteTimelineStep = withPermission(canManageCeremony, (timelineId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bước này?')) return
    if (!timelineId) return
    deleteTimelineMutation(timelineId, {
        onSuccess: () => notify.success("Thông báo", "Xóa bước thành công")
    })
})

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
    <div class="min-h-screen bg-[#fbfaf5] text-slate-900 selection:bg-slate-100 selection:text-slate-900">

        <TimelineStepModal :show="showStepModal" :mode="modeTimeline" :editing-step="editingStep"
            @close="closeStepModal" @save="handleTimelineSave" />
        <TimelinePreparationModal :show="showPreparationModal" :timeline="selectedPreparationTimeline"
            @close="closePreparationModal" />

        <header class="border-b mb-10 border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-10">

            <div class="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between gap-6">

                <!-- LEFT -->
                <div v-if="!selectedCeremonyId" class="flex items-center gap-4">

                    <div class="w-11 h-11 flex items-center justify-center
      bg-slate-900 rounded-xl shadow-md">
                        <BookOpen class="w-6 h-6 text-white" />
                    </div>

                    <div>
                        <p class="text-[11px] tracking-widest uppercase text-slate-500 font-semibold">
                            Hệ thống quản lý nghi lễ
                        </p>

                        <h1 class="text-2xl font-bold text-slate-900">
                            Chi tiết <span class="italic text-slate-500">Nghi Lễ</span>
                        </h1>
                    </div>

                </div>

                <!-- DETAIL HEADER -->
                <div v-else class="flex items-center gap-4 flex-1">

                    <button @click="goBack" class="flex items-center gap-2 px-4 py-2 rounded-lg
        border border-slate-200 bg-white
        text-sm font-medium text-slate-600
        hover:bg-slate-50 transition">

                        <ArrowLeft class="w-4 h-4" />
                        Quay lại
                    </button>

                    <div class="flex flex-col">
                        <h1 class="text-xl font-semibold text-slate-900">
                            {{ selectedCeremony?.ceremonyName }}
                        </h1>

                        <p class="text-sm text-slate-500">
                            {{ selectedCeremony?.description }}
                        </p>
                    </div>

                </div>


                <!-- RIGHT -->
                <div v-if="!selectedCeremonyId" class="flex items-center gap-3">

                    <!-- SEARCH -->
                    <div class="relative w-64">

                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />

                        <input v-model="keyword" placeholder="Tìm nghi lễ..." class="w-full pl-9 pr-3 py-2.5
          border border-slate-200
          rounded-lg
          text-sm
          bg-slate-50
          focus:bg-white
          focus:border-indigo-500
          focus:ring-2 focus:ring-indigo-200
          outline-none transition" />

                    </div>

                    <!-- CREATE BUTTON -->
                    <button @click="openCreateForm" class="flex items-center gap-2
        bg-slate-900 text-white
        px-4 py-2.5
        rounded-lg
        text-sm font-semibold
        shadow hover:bg-slate-800
        transition">

                        <Plus class="w-4 h-4" />
                        Thêm nghi lễ
                    </button>

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
                        <div class="space-y-8">

                            <!-- HEADER CARD -->
                            <div
                                class="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                                <div class="absolute left-0 top-0 h-full w-1.5" :class="selectedCeremonyTheme.dot">
                                </div>

                                <div
                                    class="pointer-events-none absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_18%_20%,#000,transparent_58%)]">
                                </div>

                                <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 pl-8">

                                    <!-- LEFT -->
                                    <div class="flex items-start gap-4">

                                        <div class="w-12 h-12 flex items-center justify-center rounded-xl border shadow-sm"
                                            :class="[selectedCeremonyTheme.bg, selectedCeremonyTheme.border]">
                                            <ListOrdered class="w-6 h-6" :class="selectedCeremonyTheme.text" />
                                        </div>

                                        <div>
                                            <div 
                                                class="mb-2 flex flex-wrap items-center gap-2">
                                                <span
                                                    class="inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] font-bold"
                                                    :class="[selectedCeremonyTheme.bg, selectedCeremonyTheme.text, selectedCeremonyTheme.border]">
                                                    <span class="h-1.5 w-1.5 rounded-full"
                                                        :class="selectedCeremonyTheme.dot"></span>
                                                    {{ selectedCeremony?.ceremonyType || 'Khác' }}
                                                </span>
                                            </div>

                                            <h3 class="text-xl font-semibold text-slate-900">
                                                Tiến trình thực hiện
                                            </h3>

                                            <p class="text-sm text-slate-500 mt-1">
                                                Tổng cộng
                                                <span class="font-semibold text-slate-900">
                                                    {{ selectedTimelines.length || 0 }}
                                                </span>
                                                bước nghi lễ
                                            </p>
                                        </div>

                                    </div>

                                    <!-- ACTION -->
                                    <button @click="openCreateTimelineModal"
                                        class="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                                        :class="selectedCeremonyTheme.dot">

                                        <Plus class="w-4 h-4" />
                                        Thêm bước

                                    </button>

                                </div>


                                <!-- TIMELINE MAP -->
                                <div v-if="selectedTimelines.length"
                                    class="border-t border-slate-200 bg-white px-6 py-6">

                                    <div class="mb-5 flex items-center gap-2">
                                        <span class="h-2 w-2 rounded-full" :class="selectedCeremonyTheme.dot"></span>
                                        <p class="text-xs font-bold uppercase tracking-wider"
                                            :class="selectedCeremonyTheme.text">
                                            Timeline
                                        </p>
                                    </div>

                                    <div class="relative pl-8">

                                        <!-- line -->
                                        <div class="absolute left-[13px] top-1 bottom-1 w-[2px] bg-slate-200"></div>

                                        <div class="space-y-3">

                                            <div v-for="step in selectedTimelines" :key="step.timelineId"
                                                class="group relative flex items-center gap-4">

                                                <!-- dot -->
                                                <button @click="scrollToTimelineStep(step.timelineId)"
                                                    class="absolute -left-8 w-6 h-6 flex items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white shadow-sm transition group-hover:scale-110"
                                                    :class="selectedCeremonyTheme.dot">

                                                    {{ step.stepOrder }}

                                                </button>


                                                <!-- step card -->
                                                <button @click="scrollToTimelineStep(step.timelineId)"
                                                    class="flex-1 flex items-center justify-between rounded-xl border bg-slate-50/60 px-4 py-3 text-left shadow-sm shadow-slate-100 transition hover:bg-white hover:shadow-md"
                                                    :class="[selectedCeremonyTheme.border, selectedCeremonyTheme.hover]">

                                                    <div class="min-w-0">

                                                        <p class="text-sm font-semibold text-slate-800 truncate">
                                                            {{ step.stepName }}
                                                        </p>

                                                        <p class="text-xs text-slate-500 truncate mt-0.5">
                                                            {{ step.stepDescription }}
                                                        </p>

                                                    </div>

                                                    <ChevronRight class="w-4 h-4 text-slate-400" />

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            <!-- EMPTY STATE -->
                            <div v-if="selectedTimelines.length === 0"
                                class="rounded-2xl border border-dashed bg-white py-20 flex flex-col items-center text-center"
                                :class="selectedCeremonyTheme.border">

                                <div class="w-20 h-20 rounded-full flex items-center justify-center shadow-sm mb-6 border"
                                    :class="[selectedCeremonyTheme.bg, selectedCeremonyTheme.border]">
                                    <Info class="w-10 h-10" :class="selectedCeremonyTheme.text" />
                                </div>

                                <h4 class="text-lg font-semibold text-slate-700 mb-2">
                                    Chưa có bước nghi lễ
                                </h4>

                                <p class="text-sm text-slate-500 max-w-md mb-6">
                                    Bắt đầu tạo các bước thực hiện cho nghi lễ
                                    <span class="font-semibold text-slate-900">
                                        {{ selectedCeremony?.ceremonyName }}
                                    </span>
                                </p>

                                <button @click="openCreateTimelineModal"
                                    class="text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-sm hover:opacity-90"
                                    :class="selectedCeremonyTheme.dot">

                                    Thêm bước đầu tiên

                                </button>

                            </div>
                            <!-- STEPS -->
                            <div v-else class="space-y-6">

                                <div v-for="(step, index) in selectedTimelines" :key="step.timelineId"
                                    :id="`timeline-step-${step.timelineId}`">

                                    <TimelineStep :step="step" :is-last="index === selectedTimelines.length - 1"
                                        @edit="handleEditTimelineStep" @delete="handleDeleteTimelineStep"
                                        @manage-preparations="handleManagePreparations" />

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
