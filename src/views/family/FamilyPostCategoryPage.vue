<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  FolderTree,
  Plus,
  Search,
  Edit2,
  Trash2,
  Hash,
  LayoutGrid
} from 'lucide-vue-next'
import { formatDate } from '@/utils/format-date';
import { useCreateFamilyPostCategoryMutation, useDeleteFamilyPostCategoryMutation, useFamilyPostCategoriesByFamilyQuery, useUpdateFamilyPostCategoryMutation } from '@/hooks/queries/family/family_post_category/useFamilyPostCategory';
import type { FamilyPostCategoryRes, PostCategoryReq } from '@/types/family/post_category.types';
import { useFamilyStore } from '@/store/family/useFamilyStore';
import CreateUpdateFamilyPostCategoryForm from '@/components/forms/family_post_category/CreateUpdateFamilyPostCategoryForm.vue';
import AppPagination from '@/components/forms/common/AppPagination.vue';
import { usePagination } from '@/composables/common/usePagination';

const familyStore = useFamilyStore();
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

const searchQuery = ref('')
const keyword = computed(() => searchQuery.value.trim() || null)

const params = computed(() => ({
  page: pagination.page,
  size: pagination.size,
}))

const { data: familyPostCategoriesData } = useFamilyPostCategoriesByFamilyQuery(familyId, keyword, params)
const categories = computed(() => familyPostCategoriesData.value?.data?.items || []);

watch(
  () => familyPostCategoriesData.value?.data?.totalPages,
  (total) => setTotalPages(total || 0),
  { immediate: true }
)

// Reset page when searching
watch(searchQuery, () => {
  pagination.page = 0
})

const { mutate: createCategory, isPending: isCreatePending } = useCreateFamilyPostCategoryMutation();
const { mutate: updateCategory, isPending: isUpdatePending } = useUpdateFamilyPostCategoryMutation();
const { mutate: deleteCategory, isPending: isDeletePending } = useDeleteFamilyPostCategoryMutation();

const isLoading = computed(() => isCreatePending.value || isUpdatePending.value || isDeletePending.value)

const mode = {
  create: 'create',
  update: 'update',
} as const

const currentMode = ref<typeof mode[keyof typeof mode]>(mode.create);
const isShowAddOrUpdatePostForm = ref(false);
const selectedPostCategory = ref<FamilyPostCategoryRes | null>(null)

const closePostForm = () => {
  isShowAddOrUpdatePostForm.value = false
  selectedPostCategory.value = null
}

const openCreateForm = () => {
  currentMode.value = mode.create
  selectedPostCategory.value = null
  isShowAddOrUpdatePostForm.value = true
}

const openUpdateForm = (postCategory: FamilyPostCategoryRes) => {
  currentMode.value = mode.update
  selectedPostCategory.value = postCategory
  isShowAddOrUpdatePostForm.value = true
}

const handleFormSubmit = (payload: PostCategoryReq) => {
  if (!familyId.value) return

  if (currentMode.value === 'create') {
    createCategory({
      familyId: familyId.value,
      data: payload
    })
  } else {
    if (!selectedPostCategory.value?.categoryId) return
    updateCategory({
      familyId: familyId.value,
      categoryId: selectedPostCategory.value.categoryId,
      data: payload
    })
  }
}

const handleDeletePostCategory = (categoryId: number) => {
  if (!familyId.value) return

  if (confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
    deleteCategory({
      familyId: familyId.value,
      categoryId
    })
  }
}

// Watch for successful mutations to close form
watch(
  () => [isCreatePending.value, isUpdatePending.value],
  ([createPending, updatePending]) => {
    if (!createPending && !updatePending && currentMode.value) {
      closePostForm()
    }
  }
)

const tableHeaders = [
  { label: '#' },
  { label: 'Tên danh mục' },
  { label: 'Mô tả' },
  { label: 'Trạng thái' },
  { label: 'Ngày tạo' },
  { label: 'Cập nhật' },
  { label: 'Hành động' },
]
</script>

<template>
  <div class="p-8 bg-slate-50 min-h-screen font-sans">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <div class="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-1">
          <FolderTree :size="16" />
          <span>Quản lý nội dung</span>
        </div>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Danh mục bài viết</h1>
        <p class="text-slate-500 text-sm mt-1">Phân loại các bài viết để con cháu dễ dàng tìm kiếm thông tin.</p>
      </div>

      <button @click="openCreateForm"
        class="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl transition-all shadow-lg active:scale-95 font-bold">
        <Plus :size="20" />
        Thêm danh mục
      </button>
    </div>

    <!-- Stats & Search -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <div class="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" :size="20" />
          <input v-model="searchQuery" type="text" placeholder="Tìm tên danh mục hoặc mô tả..."
            class="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium" />
        </div>
        <div class="h-10 w-px bg-slate-100 mx-2 hidden md:block"></div>
        <div class="hidden md:flex items-center gap-2 text-slate-500 font-bold px-4">
          <LayoutGrid :size="18" />
          <span class="text-sm whitespace-nowrap">{{ categories.length || 0 }} Danh mục</span>
        </div>
      </div>

      <div
        class="bg-indigo-600 p-4 rounded-3xl shadow-lg shadow-indigo-100 flex items-center justify-between text-white">
        <div>
          <p class="text-indigo-100 text-xs font-bold uppercase tracking-wider">Tổng bài viết</p>
          <h3 class="text-2xl font-black mt-0.5">90</h3>
        </div>
        <div class="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
          <Hash :size="24" />
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-4xl border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-100">
              <th v-for="(title, index) in tableHeaders" :key="index"
                class="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                {{ title.label }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr v-for="(category, index) in categories" :key="category.categoryId"
              class="hover:bg-slate-50/50 transition-all group">
              <!-- STT -->
              <td class="px-8 py-6 font-mono text-slate-500 font-bold">
                {{ (pagination.page * pagination.size) + index + 1 }}
              </td>

              <!-- Tên danh mục -->
              <td class="px-8 py-6">
                <div class="flex flex-col">
                  <span class="font-bold text-slate-800 text-base leading-tight">{{ category.name }}</span>
                  <span class="text-xs text-slate-400 mt-1 line-clamp-1 italic">ID: {{ category.categoryId }}</span>
                </div>
              </td>

              <!-- Mô tả -->
              <td class="px-8 py-6">
                <span class="text-sm text-slate-600 line-clamp-2">{{ category.description || '-' }}</span>
              </td>

              <!-- Trạng thái -->
              <td class="px-8 py-6">
                <span
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-semibold border border-emerald-100">
                  <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  Hoạt động
                </span>
              </td>

              <!-- Ngày tạo -->
              <td class="px-8 py-6 text-sm text-slate-600">{{ formatDate(category.createdAt) }}</td>

              <!-- Cập nhật -->
              <td class="px-8 py-6 text-sm text-slate-600">
                {{ category.updatedAt ? formatDate(category.updatedAt) : '-' }}
              </td>

              <!-- Hành động -->
              <td class="px-8 py-6">
                <div
                  class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <button @click="openUpdateForm(category)"
                    class="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    title="Sửa">
                    <Edit2 :size="18" />
                  </button>
                  <button @click="handleDeletePostCategory(category.categoryId)"
                    class="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Xóa">
                    <Trash2 :size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

    <!-- Form Modal -->
    <CreateUpdateFamilyPostCategoryForm :is-open="isShowAddOrUpdatePostForm" :mode="currentMode"
      :data="selectedPostCategory" :is-loading="isLoading" @close="closePostForm" @submit="handleFormSubmit" />

    <AppPagination :page="currentPage" :total-pages="pagination.totalPages" :has-next="hasNextPage" :has-prev="hasPrevPage"
      @next="nextPage" @prev="prevPage" />
  </div>
</template>

<style scoped>
/* Smooth font loading or system defaults */
:deep(*) {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Custom Table Scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>