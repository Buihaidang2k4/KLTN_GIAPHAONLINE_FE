<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
    Trophy,
    Medal,
    Award,
    Building2,
    Search,
    CalendarDays,
    Eye,
    User,
    Trash2
} from 'lucide-vue-next'
import { formatDate } from '@/utils/format-date'
import { useFamilyStore } from '@/store/family/useFamilyStore';
import { useCreateFamilyAchievementMutation, useFamilyAchievementsQuery, useUpdateFamilyAchievementMutation, useDeleteFamilyAchievementMutation } from '@/hooks/queries/family/family_achievement/useFamilyAchievement';
import { usePagination } from '@/composables/common/usePagination';
import AppPagination from '@/components/forms/common/AppPagination.vue';
import type { FamilyAchievementReq, FamilyAchievementRes, UpdateFamilyAchievementReq } from '@/types/family/family-achievement.types';
import CreateOrUpdateAchievementForm from '@/components/forms/family_achievement/CreateOrUpdateAchievementForm.vue';
import { notify } from '@/utils/notify';

const familyStore = useFamilyStore();
const familyId = computed(() => familyStore.currentFamilyId);

const { mutate: createAchievement } = useCreateFamilyAchievementMutation();
const { mutate: updateAchievement } = useUpdateFamilyAchievementMutation();
const { mutate: deleteAchievement } = useDeleteFamilyAchievementMutation();


const {
    pagination,
    currentPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    setTotalPages
} = usePagination(6, 0);

const paginationPage = computed(() => ({
    page: pagination.page,
    size: pagination.size
}))

const keyword = ref('');

const { data: achievements } = useFamilyAchievementsQuery(familyId, paginationPage, keyword)

watch(
    () => achievements.value?.data?.totalPages,
    total => {
        setTotalPages(total || 0)
    },
    { immediate: true }
)
// safe access to achievements list
const safeAchievements = computed(() => achievements.value?.data?.items || [])


// ui 
const getTypeStyle = (type: string) => {
    switch (type) {
        case 'AWARD':
            return {
                icon: Award,
                label: 'Giải thưởng',
                badge: 'bg-yellow-50 text-yellow-700 border-yellow-100'
            }
        case 'SOCIAL':
            return {
                icon: Award,
                label: 'Xã hội',
                badge: 'bg-purple-50 text-purple-700 border-purple-100'
            }
        case 'SPORT':
            return {
                icon: Trophy,
                label: 'Thể thao',
                badge: 'bg-orange-50 text-orange-700 border-orange-100'
            }
        default:
            return {
                icon: Medal,
                label: 'Sự nghiệp',
                badge: 'bg-emerald-50 text-emerald-700 border-emerald-100'
            }
    }
}


// actions
const isOpenForm = ref<boolean>(false)
const formMode = ref<'create' | 'update'>('create')
const selectedAchievement = ref<FamilyAchievementRes | null>(null)

const openCreateForm = () => {
    formMode.value = 'create'
    selectedAchievement.value = null
    isOpenForm.value = true
}

const openUpdateForm = (achievement: FamilyAchievementRes) => {
    console.log('achievement', achievement.achievementId)
    formMode.value = 'update'
    selectedAchievement.value = achievement
    isOpenForm.value = true
}

const closeForm = () => {
    isOpenForm.value = false
    selectedAchievement.value = null
}

// action
const hanldeDeleteAchievement = (achievementId: number) => {
    deleteAchievement({ familyId: familyId.value!, achievementId },
        {
            onSuccess: () => {
                notify.success(
                    "Thông báo",
                    "Xóa thành tích thành công"
                )
            }
        }
    )
}
const handleCreateOrUpdateAchievement = (payload: {
    data: FamilyAchievementReq | UpdateFamilyAchievementReq
    evidenceFile: File | null
}) => {
    if (formMode.value === 'create') {
        createAchievement(
            {
                familyId: familyId.value!,
                data: payload.data as FamilyAchievementReq,
                evidenceFile: payload.evidenceFile
            },
            {
                onSuccess: () => {
                    notify.success('Thông báo', 'Thêm thành tích thành công')
                    closeForm()
                }
            }
        )
    } else {
        updateAchievement(
            {
                familyId: familyId.value!,
                achievementId: selectedAchievement.value!.achievementId,
                data: payload.data as UpdateFamilyAchievementReq,
                evidenceFile: payload.evidenceFile
            },
            {
                onSuccess: () => {
                    notify.success('Thông báo', 'Cập nhật thành tích thành công')
                    closeForm()
                }
            }
        )
    }
}

</script>

<template>
    <div class="min-h-screen bg-slate-50 p-4 md:p-8">
        <div class="max-w-7xl mx-auto space-y-6">

            <!-- Header -->
            <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <div
                        class="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-100">
                        <Trophy :size="14" />
                        Bảng vàng dòng họ
                    </div>
                    <h1 class="mt-3 text-2xl md:text-3xl font-bold text-slate-900">
                        Thành tích dòng họ
                    </h1>
                    <p class="mt-2 text-sm text-slate-500">
                        Danh sách thành tích được trình bày gọn gàng, dễ theo dõi khi số lượng thành viên lớn.
                    </p>
                </div>
            </div>

            <!-- Toolbar -->
            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div class="relative w-full md:max-w-md">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
                        <input v-model="keyword" type="text" placeholder="Tìm theo tên, giải thưởng, tổ chức..."
                            class="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                    </div>
                    <!-- Action Button -->
                    <div class="flex items-center gap-3">
                        <button class="bg-indigo-600 px-4 py-2 rounded-2xl text-white cursor-pointer "
                            @click="openCreateForm">
                            Thêm thành tích
                        </button>
                    </div>
                </div>
            </div>

            <!-- Grid -->
            <div v-if="safeAchievements.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div v-for="achievement in safeAchievements" :key="achievement.achievementId"
                    class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all">
                    <!-- top -->
                    <div class="flex items-start">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-start justify-between gap-2">
                                <div class="rounded-lg bg-slate-100 p-2 shrink-0">
                                    <User :size="26" class="text-slate-500" />
                                </div>

                                <div class="min-w-0">
                                    <h3 class="truncate text-sm font-bold text-slate-900">
                                        {{ achievement.personName }}
                                    </h3>
                                    <p class="mt-0.5 text-xs text-slate-500 flex items-center gap-1">
                                        <CalendarDays :size="13" />
                                        {{ formatDate(achievement.achievedDate) }}
                                    </p>
                                </div>

                                <div class="shrink-0 inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold"
                                    :class="getTypeStyle(achievement.achievementType).badge">
                                    <component :is="getTypeStyle(achievement.achievementType).icon" :size="12" />
                                    {{ getTypeStyle(achievement.achievementType).label }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- content -->
                    <div class="mt-4 space-y-3">
                        <h2 class="line-clamp-2 text-base font-semibold leading-6 text-slate-800">
                            {{ achievement.name }}
                        </h2>

                        <div class="flex flex-wrap gap-2">
                            <span
                                class="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-100">
                                {{ achievement.rank }}
                            </span>
                            <span
                                class="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-100 max-w-full">
                                <Building2 :size="12" />
                                <span class="truncate max-w-45">{{ achievement.organization }}</span>
                            </span>
                        </div>

                        <p class="line-clamp-2 text-sm text-slate-500 leading-6">
                            {{ achievement.description }}
                        </p>
                    </div>

                    <!-- footer -->
                    <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <div>
                            <button @click="openUpdateForm(achievement)"
                                class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition">
                                <Eye :size="16" />
                                Xem chi tiết
                            </button>

                            <button @click="hanldeDeleteAchievement(achievement.achievementId)"
                                class="text-sm text-red-600 hover:text-red-800 transition">
                                <Trash2 :size="16" />
                            </button>
                        </div>

                        <div class="text-xs text-slate-400">
                            Num: {{ achievement.achievementId }}
                        </div>
                    </div>


                </div>
            </div>

            <!-- Empty -->
            <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <Search :size="20" class="text-slate-400" />
                </div>
                <h3 class="text-base font-semibold text-slate-800">Không tìm thấy kết quả</h3>
                <p class="mt-1 text-sm text-slate-500">
                    Không có dữ liệu phù hợp với từ khóa "{{ keyword }}"
                </p>
            </div>

            <!-- Form Modal -->
            <CreateOrUpdateAchievementForm v-if="isOpenForm" :show="isOpenForm" :achievement="selectedAchievement"
                :mode="formMode" @close="closeForm" @submit="handleCreateOrUpdateAchievement($event)" />

            <!-- Pagination -->
            <AppPagination :total-pages="pagination.totalPages" :page="currentPage" :has-prev="hasPrevPage"
                :has-next="hasNextPage" @next="nextPage" @prev="prevPage" />


        </div>
    </div>
</template>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>