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
    Trash2,
    Plus,
    Flower2
} from 'lucide-vue-next'
import { formatDate } from '@/utils/format-date'
import { useFamilyStore } from '@/store/family/useFamilyStore';
import { useCreateFamilyAchievementMutation, useFamilyAchievementsQuery, useUpdateFamilyAchievementMutation, useDeleteFamilyAchievementMutation } from '@/hooks/queries/family/family_achievement/useFamilyAchievement';
import { usePagination } from '@/composables/common/usePagination';
import AppPagination from '@/components/forms/common/AppPagination.vue';
import type { FamilyAchievementReq, FamilyAchievementRes, UpdateFamilyAchievementReq } from '@/types/family/family-achievement.types';
import CreateOrUpdateAchievementForm from '@/components/forms/family_achievement/CreateOrUpdateAchievementForm.vue';
import { notify } from '@/utils/notify';
import { useFamilyPermissions } from '@/composables/family/useFamilyPermissions';

const familyStore = useFamilyStore();
const familyId = computed(() => familyStore.currentFamilyId);

const { mutate: createAchievement } = useCreateFamilyAchievementMutation();
const { mutate: updateAchievement } = useUpdateFamilyAchievementMutation();
const { mutate: deleteAchievement } = useDeleteFamilyAchievementMutation();
const { canManageAchievement, withPermission } = useFamilyPermissions(familyId);

const {
    pagination,
    currentPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    setTotalPages
} = usePagination(6, 0);

const paginationPage = computed(() => ({ page: pagination.page, size: pagination.size }))
const keyword = ref('');
const { data: achievements } = useFamilyAchievementsQuery(familyId, paginationPage, keyword)

watch(() => achievements.value?.data?.totalPages, total => setTotalPages(total || 0), { immediate: true })

const safeAchievements = computed(() => achievements.value?.data?.items || [])

const getTypeStyle = (type: string) => {
    switch (type) {
        case 'AWARD': return { icon: Award, label: 'Giải thưởng', badge: 'bg-yellow-50 text-yellow-700 border-yellow-100' }
        case 'SOCIAL': return { icon: Award, label: 'Xã hội', badge: 'bg-purple-50 text-purple-700 border-purple-100' }
        case 'SPORT': return { icon: Trophy, label: 'Thể thao', badge: 'bg-orange-50 text-orange-700 border-orange-100' }
        default: return { icon: Medal, label: 'Sự nghiệp', badge: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
    }
}

const isOpenForm = ref<boolean>(false)
const formMode = ref<'create' | 'update'>('create')
const selectedAchievement = ref<FamilyAchievementRes | null>(null)

const openCreateForm = withPermission(canManageAchievement, () => {
    formMode.value = 'create'
    selectedAchievement.value = null
    isOpenForm.value = true
})

const openUpdateForm = (achievement: FamilyAchievementRes) => {
    formMode.value = 'update'
    selectedAchievement.value = achievement
    isOpenForm.value = true
}

const closeForm = () => {
    isOpenForm.value = false
    selectedAchievement.value = null
}

const hanldeDeleteAchievement = withPermission(canManageAchievement, (achievementId: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thành tích này?')) return
    deleteAchievement({ familyId: familyId.value!, achievementId }, {
        onSuccess: () => notify.success("Thông báo", "Xóa thành tích thành công")
    })
})

const handleCreateOrUpdateAchievement = withPermission(canManageAchievement, (payload: {
    data: FamilyAchievementReq | UpdateFamilyAchievementReq
    evidenceFile: File | null
}) => {
    if (formMode.value === 'create') {
        createAchievement(
            { familyId: familyId.value!, data: payload.data as FamilyAchievementReq, evidenceFile: payload.evidenceFile },
            { onSuccess: () => { notify.success('Thông báo', 'Thêm thành tích thành công'); closeForm() } }
        )
    } else {
        updateAchievement(
            { familyId: familyId.value!, achievementId: selectedAchievement.value!.achievementId, data: payload.data as UpdateFamilyAchievementReq, evidenceFile: payload.evidenceFile },
            { onSuccess: () => { notify.success('Thông báo', 'Cập nhật thành tích thành công'); closeForm() } }
        )
    }
})
</script>

<template>
    <main class="texture-parchment min-h-screen py-12 px-6">
        <div class="max-w-7xl mx-auto">

            <!-- Header -->
            <div class="text-center mb-14">
                <div
                    class="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 px-4 py-2 rounded-full mb-4">
                    <Trophy class="w-5 h-5 text-amber-700" />
                    <span class="text-xs font-semibold tracking-widest uppercase text-amber-700">
                        Bảng vàng dòng họ
                    </span>
                </div>

                <h1 class="text-4xl md:text-5xl font-bold text-[#2d1c0c] mb-3 font-serif">
                    Thành tích dòng họ
                </h1>

                <p class="text-stone-600 max-w-2xl mx-auto text-base">
                    Ghi nhận những thành tựu nổi bật của các thành viên qua các thế hệ,
                    góp phần làm rạng danh truyền thống và giá trị của dòng họ.
                </p>
            </div>


            <!-- Toolbar -->
            <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">

                <!-- Search -->
                <div class="relative w-full md:w-[420px]">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />

                    <input v-model="keyword" type="text" placeholder="Tìm theo tên, giải thưởng, tổ chức..."
                        class="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-white shadow-sm focus:ring-2 focus:ring-amber-300 focus:border-amber-300 outline-none transition" />
                </div>

                <!-- Add button -->
                <button @click="openCreateForm"
                    class="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition font-medium">
                    <Plus class="w-4 h-4" />
                    Thêm thành tích
                </button>

            </div>


            <!-- Grid -->
            <div v-if="safeAchievements.length" class="grid gap-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

                <div v-for="achievement in safeAchievements" :key="achievement.achievementId"
                    class="group bg-white rounded-2xl border border-stone-200 p-6 flex flex-col shadow-sm hover:shadow-xl transition-all duration-300">

                    <!-- Card header -->
                    <div class="flex items-start justify-between mb-5">

                        <div class="flex items-center gap-3">

                            <div
                                class="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                                <User class="w-5 h-5 text-amber-700" />
                            </div>

                            <div>
                                <h3 class="font-semibold text-stone-800">
                                    {{ achievement.personName }}
                                </h3>

                                <div class="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                                    <CalendarDays class="w-3 h-3" />
                                    {{ formatDate(achievement.achievedDate) }}
                                </div>
                            </div>
                        </div>


                        <!-- Type badge -->
                        <div class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
                            :class="getTypeStyle(achievement.achievementType).badge">
                            <component :is="getTypeStyle(achievement.achievementType).icon" class="w-3 h-3" />

                            {{ getTypeStyle(achievement.achievementType).label }}
                        </div>

                    </div>


                    <!-- Achievement title -->
                    <h4 class="font-semibold text-lg text-stone-800 mb-3 leading-snug line-clamp-2">
                        {{ achievement.name }}
                    </h4>


                    <!-- Tags -->
                    <div class="flex flex-wrap gap-2 mb-3">

                        <span class="text-xs bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-md">
                            {{ achievement.rank }}
                        </span>

                        <span
                            class="flex items-center gap-1 text-xs bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-md max-w-[170px]">
                            <Building2 class="w-3 h-3 flex-shrink-0" />
                            <span class="truncate">{{ achievement.organization }}</span>
                        </span>

                    </div>


                    <!-- Description -->
                    <p class="text-sm text-stone-600 line-clamp-2 mb-5">
                        {{ achievement.description }}
                    </p>


                    <!-- Footer -->
                    <div class="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">

                        <div class="flex items-center gap-3">

                            <button @click="openUpdateForm(achievement)"
                                class="flex items-center gap-1 text-sm text-amber-700 hover:text-amber-800 font-medium transition">
                                <Eye class="w-4 h-4" />
                                Chi tiết
                            </button>

                            <button @click="hanldeDeleteAchievement(achievement.achievementId)"
                                class="text-red-500 hover:text-red-600 transition">
                                <Trash2 class="w-4 h-4" />
                            </button>

                        </div>

                        <span class="text-[11px] text-stone-400 font-mono">
                            #{{ achievement.achievementId }}
                        </span>

                    </div>

                </div>
            </div>


            <!-- Empty state -->
            <div v-else class="text-center py-20 border border-dashed border-stone-300 rounded-2xl bg-white">
                <Search class="w-14 h-14 mx-auto text-stone-300 mb-4" />

                <h3 class="text-lg font-semibold text-stone-600">
                    Không tìm thấy kết quả
                </h3>

                <p class="text-sm text-stone-500 mt-1">
                    Không có dữ liệu phù hợp với từ khóa "{{ keyword }}"
                </p>
            </div>


            <!-- Modal -->
            <CreateOrUpdateAchievementForm v-if="isOpenForm" :show="isOpenForm" :achievement="selectedAchievement"
                :mode="formMode" @close="closeForm" @submit="handleCreateOrUpdateAchievement($event)" />


            <!-- Pagination -->
            <div class="mt-12">
                <AppPagination :total-pages="pagination.totalPages" :page="currentPage" :has-prev="hasPrevPage"
                    :has-next="hasNextPage" @next="nextPage" @prev="prevPage" />
            </div>

        </div>
    </main>
</template>

<style scoped>
.texture-parchment {
    background-color: #fcf9ef;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
}

.plaque-border {
    border: 1px solid #432406;
    box-shadow: inset 0 0 0 1px rgba(119, 90, 25, 0.2);
}

.double-border {
    border: 2px solid #775a19;
    outline: 1px solid #432406;
    outline-offset: 2px;
}

.parchment-card {
    background-color: #fcf9ef;
    position: relative;
    box-shadow: 2px 2px 5px rgba(67, 36, 6, 0.05), 0 10px 25px -5px rgba(67, 36, 6, 0.1);
    border: 1px solid #d4c3b8;
}

.parchment-card::after {
    content: '';
    position: absolute;
    top: 6px;
    left: 6px;
    right: 6px;
    bottom: 6px;
    border: 1px solid rgba(119, 90, 25, 0.15);
    pointer-events: none;
    border-radius: 12px;
}

h1,
h3,
h4 {
    font-family: 'EB Garamond', serif;
}

.line-clamp-1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
</style>
