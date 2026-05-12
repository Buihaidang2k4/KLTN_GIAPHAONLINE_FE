<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Users, GitBranch, BookOpen, Pencil, Trash2, Plus, Database, Archive } from 'lucide-vue-next';
import TreeBanner from '@/assets/images/TreeBanner.png';
import router from '@/app/router';
import { useFamilyStore } from '@/store/family/useFamilyStore';
import { usePagination } from '@/composables/common/usePagination';
import AppPagination from '@/components/forms/common/AppPagination.vue';
import CreateUpdateFamilyCategoryForm from '@/components/forms/family_category/CreateUpdateFamilyCategoryForm.vue';
import {
    useCreateFamilyCategoryMutation,
    useDeleteFamilyCategoryMutation,
    useFamilyCategoriesQuery,
    useUpdateFamilyCategoryMutation
} from '@/hooks/queries/family/family_category/useFamilyCategory';
import type { FamilyCategoryReq, FamilyCategoryRes } from '@/types/family/family-category.types';


const familyStore = useFamilyStore()
const familyId = computed(() => familyStore.currentFamilyId)

const {
    pagination,
    currentPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    setTotalPages
} = usePagination(10, 0)

const params = computed(() => ({
    page: pagination.page,
    size: pagination.size,
}))
const { data: familyCategoryData } = useFamilyCategoriesQuery(familyId, params);
const safeFamilyCategory = computed(() => familyCategoryData.value?.data?.items ?? []);

watch(
    () => familyCategoryData.value?.data?.totalPages,
    (total) => setTotalPages(total || 0),
    { immediate: true }
)

const isModalOpen = ref(false);
const modalType = ref<'add' | 'edit'>('add');
const editingCategoryId = ref<number | null>(null);
const toast = ref({ show: false, message: '' });

const { mutate: createFamilyCategory, isPending: isCreatingCategory } = useCreateFamilyCategoryMutation();
const { mutate: updateFamilyCategory, isPending: isUpdatingCategory } = useUpdateFamilyCategoryMutation();
const { mutate: deleteFamilyCategory } = useDeleteFamilyCategoryMutation();

const totalCategory = computed(() => safeFamilyCategory.value.length);
const publicCategory = computed(() => safeFamilyCategory.value.filter(item => item.isPublic).length);
const selectedCategory = computed(() =>
    safeFamilyCategory.value.find(item => Number(item.familyCategoryId) === editingCategoryId.value) ?? null
);
const isSavingCategory = computed(() => isCreatingCategory.value || isUpdatingCategory.value);

const openModal = (type: 'add' | 'edit', data: FamilyCategoryRes | null = null) => {
    modalType.value = type;
    editingCategoryId.value = type === 'edit' && data ? Number(data.familyCategoryId) : null;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    editingCategoryId.value = null;
};

const showToast = (msg: string) => {
    toast.value = { show: true, message: msg };
    setTimeout(() => toast.value.show = false, 3000);
};

const saveFamily = (payload: FamilyCategoryReq) => {
    if (!payload.familyName || !familyId.value) return;

    if (modalType.value === 'edit') {
        if (!editingCategoryId.value) return;

        updateFamilyCategory(
            { categoryId: editingCategoryId.value, data: payload },
            {
                onSuccess: () => {
                    showToast("Đã cập nhật danh mục");
                    closeModal();
                }
            }
        );
    } else {
        createFamilyCategory(
            { familyId: familyId.value, data: payload },
            {
                onSuccess: () => {
                    showToast("Thêm danh mục thành công");
                    closeModal();
                }
            }
        );
    }
};

const deleteFamily = (id: number) => {
    const confirm = window.confirm("Bạn có muốn xóa gia phả này không !");

    if (confirm) {
        deleteFamilyCategory(id, {
            onSuccess: () => showToast("Đã xóa danh mục")
        });
    }
    return
};

const viewDetail = (category: FamilyCategoryRes) => {
    const categoryId = Number(category.familyCategoryId);

    if (!categoryId) return;

    showToast(`Đang mở: ${category.familyName}`);

    router.push({
        name: "FamilyChart",
        query: {
            categoryId
        }
    });
};


</script>

<template>
    <div id="app" class="min-h-screen bg-[#f7f3ea] px-4 py-6 md:px-8 md:py-8">
        <main class="mx-auto max-w-7xl">
            <!-- Header -->
            <div
                class="mb-7 flex flex-col gap-5 rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-[0_20px_60px_rgba(35,31,24,0.08)] backdrop-blur md:flex-row md:items-center md:justify-between md:p-6">
                <div class="flex items-start gap-4">
                    <div
                        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700 ring-1 ring-red-100">
                        <Archive class="h-6 w-6" />
                    </div>
                    <div>
                        <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-red-700">Gia phả online</p>
                        <h1 class="mt-1 text-3xl font-black tracking-tight text-slate-950">Thư viện Gia Phả</h1>
                        <p class="mt-1 text-sm font-medium text-slate-500">Quản lý, lưu trữ và mở nhanh các cây phả hệ
                            dòng tộc</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 sm:min-w-[360px]">
                    <div class="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                        <div class="mb-2 flex items-center gap-2 text-slate-400">
                            <Database class="h-4 w-4" />
                            <span class="text-[10px] font-bold uppercase">Danh mục</span>
                        </div>
                        <p class="text-lg font-black text-slate-900">{{ totalCategory }}</p>
                        <p class="text-[11px] font-semibold text-slate-400">danh mục gia phả</p>
                    </div>
                    <div class="rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                        <div class="mb-2 flex items-center gap-2 text-slate-400">
                            <Users class="h-4 w-4" />
                            <span class="text-[10px] font-bold uppercase">Công khai</span>
                        </div>
                        <p class="text-lg font-black text-slate-900">{{ publicCategory }}</p>
                        <p class="text-[11px] font-semibold text-slate-400">danh mục đang hiển thị</p>
                    </div>
                </div>
            </div>

            <!-- Grid of Family Cards -->
            <div class="grid grid-cols-1 gap-5 pb-20 sm:grid-cols-2 xl:grid-cols-3">
                <div v-for="family in safeFamilyCategory" :key="family.familyCategoryId"
                    class="group flex min-h-[368px] flex-col overflow-hidden rounded-[26px] border border-white/80 bg-white shadow-[0_16px_45px_rgba(35,31,24,0.09)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(35,31,24,0.14)]">
                    <!-- Family Image -->
                    <div class="relative h-48 overflow-hidden">
                        <img :src="TreeBanner" :alt="family.familyName"
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent">
                        </div>
                        <div class="absolute left-4 top-4">
                            <span
                                class="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-white shadow-lg shadow-red-950/20">
                                {{ family.isPublic ? 'Công khai' : 'Riêng tư' }}
                            </span>
                        </div>
                        <div class="absolute bottom-4 left-4 right-4">
                            <h3 class="text-base font-bold text-white leading-tight drop-shadow-md">
                                {{ family.familyName }}
                            </h3>
                            <p class="mt-1 text-xs font-semibold text-white/70">Mã danh mục #{{ family.familyCategoryId
                            }}</p>
                        </div>
                    </div>

                    <!-- Family Info -->
                    <div class="flex grow flex-col p-5">
                        <div class="mb-5 grid grid-cols-2 gap-3">
                            <div class="rounded-2xl bg-[#f8fafc] px-3 py-3">
                                <div class="mb-1 flex items-center gap-1.5 text-slate-400">
                                    <Users class="h-3.5 w-3.5" />
                                    <span class="text-[10px] font-bold uppercase">Nguồn gốc</span>
                                </div>
                                <p class="line-clamp-1 text-sm font-black text-slate-900">
                                    {{ family.origin || 'Chưa có' }}
                                </p>
                            </div>
                            <div class="rounded-2xl bg-[#f8fafc] px-3 py-3">
                                <div class="mb-1 flex items-center gap-1.5 text-slate-400">
                                    <GitBranch class="h-3.5 w-3.5" />
                                    <span class="text-[10px] font-bold uppercase">Trạng thái</span>
                                </div>
                                <p class="text-sm font-black text-slate-900">
                                    {{ family.isPublic ? 'Công khai' : 'Riêng tư' }}
                                </p>
                            </div>
                        </div>

                        <!-- Storage Bar -->
                        <div class="mb-5">
                            <div class="mb-2 flex justify-between text-[10px] font-bold uppercase text-slate-400">
                                <span>Mô tả</span>
                            </div>
                            <p class="line-clamp-2 min-h-10 text-sm font-medium text-slate-600">
                                {{ family.description || 'Chưa có mô tả' }}
                            </p>
                        </div>

                        <!-- Action Buttons -->
                        <div class="mt-auto flex items-center gap-2">
                            <button @click="viewDetail(family)"
                                class="flex min-h-11 grow items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-red-700 active:scale-95">
                                <BookOpen class="h-4 w-4" />
                                Mở Gia Phả
                            </button>
                            <button @click="openModal('edit', family)"
                                class="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-amber-200 hover:bg-amber-50 hover:text-amber-600 active:scale-90">
                                <Pencil class="h-4 w-4" />
                            </button>
                            <button @click="deleteFamily(Number(family.familyCategoryId))"
                                class="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-90">
                                <Trash2 class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="-mt-12 flex justify-center pb-16">
                <AppPagination :page="currentPage" :total-pages="pagination.totalPages" :has-next="hasNextPage"
                    :has-prev="hasPrevPage" @next="nextPage" @prev="prevPage" />
            </div>
        </main>

        <!-- Floating Action Button -->
        <button @click="openModal('add')"
            class="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-950/20 transition-all hover:bg-red-700 active:scale-90">
            <Plus class="w-6 h-6" />
        </button>

        <CreateUpdateFamilyCategoryForm :is-open="isModalOpen" :mode="modalType" :data="selectedCategory"
            :is-loading="isSavingCategory" @close="closeModal" @submit="saveFamily" />

        <!-- Toast Notification -->
        <transition name="modal">
            <div v-if="toast.show"
                class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50">
                <div class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                <span class="font-bold text-xs">{{ toast.message }}</span>
            </div>
        </transition>
    </div>
</template>
