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
  <div class="min-h-screen bg-[#fbfaf5] p-4 md:p-8 font-sans">
    <div class="max-w-[1440px] mx-auto">
      
      <!-- HEADER SECTION -->
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <div class="p-2 bg-indigo-50 rounded-lg">
              <FolderTree :size="20" class="text-indigo-600" />
            </div>
            <span class="text-xs font-bold text-indigo-600/80 uppercase tracking-[0.2em]">Quản lý nội dung</span>
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">Danh mục bài viết</h1>
          <p class="text-sm text-slate-500 font-medium max-w-md leading-relaxed">
            Hệ thống phân loại bài viết khoa học giúp lưu giữ và tra cứu lịch sử dòng tộc dễ dàng.
          </p>
        </div>

        <button @click="openCreateForm"
          class="inline-flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 rounded-2xl transition-all shadow-lg shadow-slate-200 hover:shadow-xl active:scale-95 font-bold text-sm">
          <Plus :size="18" />
          <span>Thêm danh mục mới</span>
        </button>
      </header>

      <!-- DASHBOARD STATS & SEARCH -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <!-- Search & Filter Area -->
        <div class="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div class="relative flex-1 w-full">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
            <input v-model="searchQuery" type="text" placeholder="Tìm kiếm tên danh mục, mô tả hoặc ID..."
              class="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm font-medium outline-none" />
          </div>
          <div class="h-10 w-px bg-slate-100 mx-2 hidden md:block"></div>
          <div class="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl">
            <LayoutGrid :size="16" class="text-slate-400" />
            <span class="text-xs font-bold text-slate-600 whitespace-nowrap">{{ categories.length || 0 }} Chuyên mục</span>
          </div>
        </div>

        <!-- Quick Stats Card -->
        <div class="lg:col-span-4 bg-indigo-600 p-5 rounded-3xl shadow-xl shadow-indigo-100 flex items-center justify-between group overflow-hidden relative">
          <div class="relative z-10">
            <p class="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-1">Tổng số bài viết</p>
            <h3 class="text-3xl font-black text-white">90 <span class="text-xs font-normal text-indigo-200 ml-1">nội dung</span></h3>
          </div>
          <div class="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center relative z-10 backdrop-blur-md">
            <Hash :size="24" class="text-white" />
          </div>
          <!-- Decorative Background Elements -->
          <div class="absolute -right-4 -bottom-4 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
        </div>
      </div>

      <!-- TABLE CONTAINER -->
      <div class="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/30 overflow-hidden">
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr class="bg-slate-50/40 border-b border-slate-100">
                <th v-for="(title, index) in tableHeaders" :key="index"
                  class="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                  {{ title.label }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="(category, index) in categories" :key="category.categoryId"
                class="hover:bg-indigo-50/30 transition-all duration-300 group">
                
                <!-- STT -->
                <td class="px-8 py-6">
                  <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold font-mono">
                    {{ (pagination.page * pagination.size) + index + 1 }}
                  </span>
                </td>

                <!-- TÊN DANH MỤC -->
                <td class="px-8 py-6">
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-800 text-[15px] group-hover:text-indigo-600 transition-colors">{{ category.name }}</span>
                    <div class="flex items-center gap-1.5 mt-1.5">
                       <span class="px-1.5 py-0.5 bg-slate-100 text-[9px] font-bold text-slate-500 rounded uppercase tracking-wider">ID: {{ category.categoryId }}</span>
                    </div>
                  </div>
                </td>

                <!-- MÔ TẢ -->
                <td class="px-8 py-6">
                  <p class="text-sm text-slate-600 line-clamp-2 max-w-xs leading-relaxed font-medium">
                    {{ category.description || 'Chưa có mô tả chi tiết' }}
                  </p>
                </td>

                <!-- TRẠNG THÁI -->
                <td class="px-8 py-6">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-bold border border-emerald-100">
                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Hoạt động
                  </span>
                </td>

                <!-- NGÀY TẠO -->
                <td class="px-8 py-6">
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-slate-700">{{ formatDate(category.createdAt) }}</span>
                    <span class="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Khởi tạo</span>
                  </div>
                </td>

                <!-- CẬP NHẬT -->
                <td class="px-8 py-6">
                   <div v-if="category.updatedAt" class="flex flex-col">
                    <span class="text-sm font-semibold text-slate-700">{{ formatDate(category.updatedAt) }}</span>
                    <span class="text-[10px] text-slate-400 font-medium uppercase mt-0.5">Lần cuối</span>
                  </div>
                  <span v-else class="text-slate-400 text-xs">-</span>
                </td>

                <!-- HÀNH ĐỘNG -->
                <td class="px-8 py-6">
                  <div class="flex items-center gap-2 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button @click="openUpdateForm(category)"
                      class="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-slate-100"
                      title="Chỉnh sửa">
                      <Edit2 :size="16" />
                    </button>
                    <button @click="handleDeletePostCategory(category.categoryId)"
                      class="p-2.5 text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-slate-100"
                      title="Xóa danh mục">
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
              
              <!-- EMPTY STATE -->
              <tr v-if="categories.length === 0">
                <td colspan="7" class="px-8 py-24 text-center">
                  <div class="flex flex-col items-center max-w-xs mx-auto">
                    <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Search :size="32" class="text-slate-300" />
                    </div>
                    <h4 class="text-slate-900 font-bold text-lg">Không có dữ liệu</h4>
                    <p class="text-slate-500 text-sm mt-2 font-medium">Chúng tôi không tìm thấy danh mục nào phù hợp với yêu cầu của bạn.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- PAGINATION SECTION -->
      <div class="mt-10">
        <AppPagination 
          :page="currentPage" 
          :total-pages="pagination.totalPages" 
          :has-next="hasNextPage"
          :has-prev="hasPrevPage" 
          @next="nextPage" 
          @prev="prevPage" 
        />
      </div>
    </div>

    <!-- MODAL FORM -->
    <CreateUpdateFamilyPostCategoryForm 
      :is-open="isShowAddOrUpdatePostForm" 
      :mode="currentMode"
      :data="selectedPostCategory" 
      :is-loading="isLoading" 
      @close="closePostForm" 
      @submit="handleFormSubmit" 
    />
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
  border: 2px solid white;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

:deep(.pagination-container) {
  display: flex !important;
  justify-content: center !important;
  margin-top: 0 !important;
}

/* Animations */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.2); }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>