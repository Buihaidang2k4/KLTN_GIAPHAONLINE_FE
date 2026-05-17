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
import { useFamilyPermissions } from '@/composables/family/useFamilyPermissions';
import { notify } from '@/utils/notify';


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
const { canDeleteFamily, canWriteFamily } = useFamilyPermissions(familyId);


const totalCategory = computed(() => safeFamilyCategory.value.length);
const publicCategory = computed(() => safeFamilyCategory.value.filter(item => item.isPublic).length);
const selectedCategory = computed(() =>
    safeFamilyCategory.value.find(item => Number(item.familyCategoryId) === editingCategoryId.value) ?? null
);
const isSavingCategory = computed(() => isCreatingCategory.value || isUpdatingCategory.value);

const openModal = (type: 'add' | 'edit', data: FamilyCategoryRes | null = null) => {
    if (!canWriteFamily.value) {
        notify.error("Thông báo", "Bạn không có quyền thực hiện thao tác này");
        return;
    }

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
                },
                onError: () => showToast("Cập nhật danh mục thất bại"),
            }
        );
    } else {
        createFamilyCategory(
            { familyId: familyId.value, data: payload },
            {
                onSuccess: () => {
                    showToast("Thêm danh mục thành công");
                    closeModal();
                },
                onError: () => showToast("Thêm danh mục thất bại"),
            }
        );
    }
};

const deleteFamily = (id: number) => {
    if (!canDeleteFamily.value) {
        notify.error("Thông báo", "Bạn không có quyền thực hiện thao tác này");
        return;
    }

    const confirm = window.confirm("Bạn có muốn xóa gia phả này không !");

    if (confirm) {
        deleteFamilyCategory(id, {
            onSuccess: () => showToast("Đã xóa danh mục"),
            onError: () => showToast("Xóa danh mục thất bại"),
        });
    }
    return
};

const viewDetail = (category: FamilyCategoryRes) => {
    const categoryId = Number(category.familyCategoryId);

    if (!categoryId) return;

    showToast(`Đang mở danh mục: ${category.familyName}`);

    router.push({
        name: "FamilyChart",
        query: {
            categoryId
        }
    });
};


</script>

<template>
    <div id="app"
        class="min-h-screen bg-gradient-to-b from-[#faf8f3] via-[#f6f1e8] to-[#ede6d9] px-4 py-5 md:px-7 md:py-8">
        <main class="mx-auto max-w-7xl">
            <!-- Header -->
            <div
                class="mb-6 flex flex-col gap-4 rounded-[22px] border border-white/80 bg-white/90 p-4 shadow-[0_24px_64px_-12px_rgba(45,39,31,0.12)] ring-1 ring-slate-900/[0.04] backdrop-blur-md md:flex-row md:items-center md:justify-between md:p-5">
                <div class="flex items-start gap-3">
                    <div
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-700 ring-1 ring-red-100">
                        <Archive class="h-5 w-5" />
                    </div>
                    <div>
                        <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-red-700">Gia phả online</p>
                        <h1 class="mt-0.5 text-2xl font-black tracking-tight text-slate-950">Thư viện Gia Phả</h1>
                        <p class="mt-0.5 text-[13px] font-medium text-slate-500">Quản lý, lưu trữ và mở nhanh các cây
                            phả hệ
                            dòng tộc</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2.5 sm:min-w-[300px]">
                    <div class="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5">
                        <div class="mb-1 flex items-center gap-1.5 text-slate-400">
                            <Database class="h-3.5 w-3.5" />
                            <span class="text-[9px] font-bold uppercase">Danh mục</span>
                        </div>
                        <p class="text-base font-black text-slate-900">{{ totalCategory }}</p>
                        <p class="text-[10px] font-semibold text-slate-400">danh mục gia phả</p>
                    </div>
                    <div class="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5">
                        <div class="mb-1 flex items-center gap-1.5 text-slate-400">
                            <Users class="h-3.5 w-3.5" />
                            <span class="text-[9px] font-bold uppercase">Công khai</span>
                        </div>
                        <p class="text-base font-black text-slate-900">{{ publicCategory }}</p>
                        <p class="text-[10px] font-semibold text-slate-400">danh mục đang hiển thị</p>
                    </div>
                </div>
            </div>

            <!-- Grid of Family Cards -->
            <div v-if="safeFamilyCategory.length" class="grid grid-cols-1 gap-4 pb-16 sm:grid-cols-2 xl:grid-cols-3">
                <div v-for="family in safeFamilyCategory" :key="family.familyCategoryId"
                    class="group relative flex min-h-[328px] flex-col overflow-hidden rounded-[22px] border border-slate-200/70 bg-white shadow-[0_2px_8px_rgba(45,39,31,0.04),0_18px_48px_-8px_rgba(45,39,31,0.12)] ring-1 ring-inset ring-white/60 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-amber-200/50 hover:shadow-[0_20px_56px_-12px_rgba(45,39,31,0.18)]">
                    <!-- Family Image -->
                    <div class="relative h-[158px] shrink-0 overflow-hidden">
                        <img :src="TreeBanner" :alt="family.familyName"
                            class="h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.06] group-hover:brightness-[1.05]">
                        <div
                            class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-amber-900/10">
                        </div>
                        <div
                            class="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/35 to-transparent">
                        </div>
                        <div class="absolute left-3 top-3">
                            <span v-if="family.isPublic"
                                class="inline-flex items-center rounded-full border border-white/25 bg-red-600/95 px-3 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-white shadow-[0_4px_14px_rgba(185,28,28,0.45)] backdrop-blur-sm">
                                Công khai
                            </span>

                            <span v-else
                                class="inline-flex items-center rounded-full border border-white/20 bg-slate-900/85 px-3 py-0.5 text-[9px] font-black uppercase tracking-[0.12em] text-white/95 shadow-lg backdrop-blur-sm">
                                Riêng tư
                            </span>
                        </div>

                        <div class="absolute bottom-3 left-3 right-3">
                            <h3
                                class="text-base font-semibold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
                                {{ family.familyName }}
                            </h3>
                            <p class="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/75">Mã danh mục
                                #{{ family.familyCategoryId }}</p>
                        </div>

                        <div class="absolute right-3 top-3">
                            <span class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[9px] font-bold tracking-wide text-white shadow-[0_2px_8px_rgba(0,0,0,0.2)] backdrop-blur-md">
                                <Users :size="10" class="text-amber-300" />
                                {{ family.totalPerson }} thành viên
                            </span>
                        </div>
                    </div>

                    <!-- Family Info -->
                    <div class="flex grow flex-col gap-3.5 p-4 pt-4">
                        <div class="grid grid-cols-2 gap-2.5">
                            <div
                                class="rounded-xl border border-slate-100/90 bg-gradient-to-br from-slate-50/90 to-white px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                                <div class="mb-1.5 flex items-center gap-1.5 text-slate-400">
                                    <span
                                        class="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm ring-1 ring-slate-100">
                                        <Users class="h-3 w-3" />
                                    </span>
                                    <span class="text-[8px] font-bold uppercase tracking-[0.12em]">Nguồn gốc</span>
                                </div>
                                <p class="line-clamp-2 text-xs font-bold leading-snug text-slate-800">
                                    {{ family.origin || 'Chưa có' }}
                                </p>
                            </div>
                            <div
                                class="rounded-xl border border-slate-100/90 bg-gradient-to-br from-slate-50/90 to-white px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                                <div class="mb-1.5 flex items-center gap-1.5 text-slate-400">
                                    <span
                                        class="flex h-6 w-6 items-center justify-center rounded-md bg-white text-slate-500 shadow-sm ring-1 ring-slate-100">
                                        <GitBranch class="h-3 w-3" />
                                    </span>
                                    <span class="text-[8px] font-bold uppercase tracking-[0.12em]">Trạng thái</span>
                                </div>
                                <p class="text-xs font-bold leading-snug text-slate-800">
                                    {{ family.isPublic ? 'Công khai' : 'Riêng tư' }}
                                </p>
                            </div>
                        </div>

                        <div class="rounded-xl border border-slate-100 bg-[#faf8f5] px-3 py-2.5">
                            <p class="mb-1.5 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">Mô tả</p>
                            <p class="line-clamp-3 min-h-[3rem] text-xs leading-relaxed text-slate-600">
                                {{ family.description || 'Chưa có mô tả' }}
                            </p>
                        </div>

                        <!-- Action Buttons -->
                        <div class="mt-auto flex items-stretch gap-2 pt-0.5">
                            <button type="button" @click="viewDetail(family)"
                                class="flex min-h-9 grow items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 px-3 py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(15,23,42,0.25)] ring-1 ring-white/10 transition-all hover:from-red-700 hover:via-red-700 hover:to-red-800 hover:shadow-[0_6px_20px_rgba(185,28,28,0.35)] active:scale-[0.98]">
                                <BookOpen class="h-3.5 w-3.5 shrink-0 opacity-90" />
                                Mở Gia Phả
                            </button>
                            <button type="button" @click="openModal('edit', family)"
                                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-500 shadow-sm transition-all hover:border-amber-300/80 hover:bg-amber-50 hover:text-amber-700 active:scale-95"
                                title="Chỉnh sửa">
                                <Pencil class="h-3.5 w-3.5" />
                            </button>
                            <button type="button" @click="deleteFamily(Number(family.familyCategoryId))"
                                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-500 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                                title="Xóa">
                                <Trash2 class="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else
                class="mx-auto mb-16 flex max-w-sm flex-col items-center rounded-[22px] border border-dashed border-slate-300/80 bg-white/60 px-6 py-12 text-center shadow-inner">
                <div
                    class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                    <Archive class="h-6 w-6 opacity-90" />
                </div>
                <h2 class="text-base font-bold text-slate-800">Chưa có danh mục gia phả</h2>
                <p class="mt-2 text-xs leading-relaxed text-slate-500">Thêm danh mục để bắt đầu lưu trữ và mở cây phả
                    hệ.
                </p>
            </div>

            <div v-if="pagination.totalPages > 1" class="-mt-4 flex justify-center pb-14 sm:-mt-5">
                <AppPagination :page="currentPage" :total-pages="pagination.totalPages" :has-next="hasNextPage"
                    :has-prev="hasPrevPage" @next="nextPage" @prev="prevPage" />
            </div>
        </main>

        <!-- Floating Action Button -->
        <button @click="openModal('add')"
            class="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-xl shadow-red-950/20 transition-all hover:bg-red-700 active:scale-90">
            <Plus class="h-5 w-5" />
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
