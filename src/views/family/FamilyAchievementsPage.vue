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
const { canManageAchievement } = useFamilyPermissions(familyId);


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
    if (!canManageAchievement.value) {
        notify.error("Thông báo", 'Bạn không có quyền thực hiện thao tác này ')
        return
    }

    formMode.value = 'create'
    selectedAchievement.value = null
    isOpenForm.value = true
}

const openUpdateForm = (achievement: FamilyAchievementRes) => {
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
    if (!canManageAchievement.value) {
        notify.error("Thông báo", 'Bạn không có quyền thực hiện thao tác này ')
        return
    }

    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa thành tích này?')
    if (!isConfirmed) return

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
    if (!canManageAchievement.value) {
        notify.error("Thông báo", 'Bạn không có quyền thực hiện thao tác này ')
        return
    }


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
    <main class="texture-parchment min-h-screen py-10 px-4 md:px-8">
        <div class="max-w-7xl mx-auto">

            <!-- Header Section -->
            <div class="mb-12 text-center">
                <div
                    class="inline-flex items-center gap-2 bg-[#ebe8de] px-4 py-2 rounded-full mb-4 border border-[#d4c3b8]">
                    <Trophy class="w-5 h-5 text-[#775a19]" />
                    <span class="text-[10px] font-bold uppercase tracking-widest text-[#775a19]">Bảng vàng dòng
                        họ</span>
                </div>
                <h1 class="font-serif text-4xl md:text-5xl text-[#432406] mb-3 font-bold">Thành tích dòng họ</h1>
                <p class="text-lg text-[#50453c] max-w-2xl mx-auto italic font-medium">
                    Danh sách thành tích được trình bày trang trọng, ghi nhận những cống hiến và vinh quang của các
                    thành viên qua các thế hệ.
                </p>
            </div>

            <!-- Search and Actions Bar -->
            <div
                class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-amber-100 p-4 md:p-5 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between transition-all">

                <!-- Ô tìm kiếm -->
                <div class="relative w-full md:w-2/3">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 w-5 h-5" />
                    <input v-model="keyword"
                        class="w-full pl-10 pr-4 py-2.5 bg-amber-50/30 rounded-xl border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 focus:outline-none text-stone-700 placeholder:text-stone-400 transition-all duration-200"
                        placeholder="🔍 Tìm theo tên, giải thưởng, tổ chức..." type="text" />
                </div>

                <!-- Nút thêm -->
                <button @click="openCreateForm"
                    class="w-full md:w-auto bg-gradient-to-r from-amber-800 to-amber-700 text-amber-50 px-5 py-2.5 rounded-xl font-semibold tracking-wide hover:from-amber-900 hover:to-amber-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 group">
                    <Plus class="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                    <span>Thêm thành tích</span>
                </button>
            </div>

            <!-- Grid -->
            <div v-if="safeAchievements.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div v-for="achievement in safeAchievements" :key="achievement.achievementId"
                    class="parchment-card rounded-2xl p-6 flex flex-col h-full relative group hover:shadow-[0_15px_35px_rgba(58,37,18,0.15)] transition-all duration-300">
                    <!-- Trang trí góc -->
                    <Flower2
                        class="absolute top-2 right-2 w-12 h-12 text-[#775a19] opacity-[0.05] group-hover:opacity-10 transition-opacity" />

                    <div class="flex justify-between items-start mb-4 relative z-10">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-12 h-12 bg-[#f1eee4] rounded-full flex items-center justify-center border border-[#d4c3b8]">
                                <User class="w-6 h-6 text-[#50453c]" />
                            </div>
                            <div>
                                <h3 class="font-serif text-xl text-[#432406] font-bold">{{ achievement.personName }}
                                </h3>
                                <div class="flex items-center gap-1 text-[#50453c] text-xs">
                                    <CalendarDays class="w-3 h-3" />
                                    <span>{{ formatDate(achievement.achievedDate) }}</span>
                                </div>
                            </div>
                        </div>
                        <!-- Badge Loại -->
                        <div class="px-2.5 py-1 rounded border flex items-center gap-1"
                            :class="getTypeStyle(achievement.achievementType).badge">
                            <component :is="getTypeStyle(achievement.achievementType).icon" class="w-3 h-3" />
                            <span
                                class="text-[10px] font-bold uppercase tracking-tight">{{ getTypeStyle(achievement.achievementType).label }}</span>
                        </div>
                    </div>

                    <div class="flex-grow mb-4 relative z-10">
                        <h4 class="font-serif text-lg text-[#1c1c16] mb-2 font-semibold line-clamp-1 italic">
                            {{ achievement.name }}
                        </h4>
                        <div class="flex flex-wrap gap-2 mb-3">
                            <span
                                class="bg-[#f1eee4] px-2 py-0.5 border border-[#d4c3b8] text-[#50453c] text-[10px] font-bold uppercase">
                                {{ achievement.rank }}
                            </span>
                            <div
                                class="flex items-center gap-1 text-[#50453c] bg-[#f1eee4] px-2 py-0.5 border border-[#d4c3b8] max-w-[180px]">
                                <Building2 class="w-3 h-3 flex-shrink-0" />
                                <span class="text-[10px] font-medium truncate">{{ achievement.organization }}</span>
                            </div>
                        </div>
                        <p class="text-sm text-[#50453c] line-clamp-2 leading-relaxed">
                            {{ achievement.description }}
                        </p>
                    </div>

                    <div
                        class="border-t border-[#d4c3b8] pt-4 flex justify-between items-center mt-auto relative z-10 border-dashed">
                        <div class="flex items-center gap-4">
                            <button @click="openUpdateForm(achievement)"
                                class="flex items-center gap-1.5 text-[#775a19] hover:text-[#432406] transition-colors text-xs font-bold uppercase">
                                <Eye class="w-4 h-4" />
                                Chi tiết
                            </button>
                            <button @click="hanldeDeleteAchievement(achievement.achievementId)"
                                class="text-[#ba1a1a] hover:opacity-70 transition-opacity">
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                        <span class="text-[10px] text-[#82746b] font-mono italic">Mã:
                            {{ achievement.achievementId }}</span>
                    </div>
                </div>
            </div>

            <!-- Empty -->
            <div v-else class="text-center py-20 bg-[#f1eee4] rounded-2xl border-2 border-dashed border-[#d4c3b8]">
                <Search class="w-16 h-16 text-[#d4c3b8] mx-auto mb-4" />
                <h3 class="text-[#82746b] font-serif text-xl italic">Không tìm thấy kết quả</h3>
                <p class="mt-1 text-sm text-[#82746b]">Không có dữ liệu phù hợp với từ khóa "{{ keyword }}"</p>
            </div>

            <!-- Form Modal -->
            <CreateOrUpdateAchievementForm v-if="isOpenForm" :show="isOpenForm" :achievement="selectedAchievement"
                :mode="formMode" @close="closeForm" @submit="handleCreateOrUpdateAchievement($event)" />

            <!-- Pagination -->
            <div class="mt-10">
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
