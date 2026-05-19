<script setup>
import { computed, ref, watch } from 'vue'
import {
    FolderTree, Plus, Search, Filter, Hash, Pencil, Trash2,
} from 'lucide-vue-next'
import {
    useArticleCategoriesQuery,
    useDeleteArticleCategoryMutation
} from '@/hooks/queries/article_category/useArticleCategory'
import { usePagination } from '@/composables/common/usePagination'
import AppPagination from '@/components/forms/common/AppPagination.vue'
import CreateArticleCategoryModal from '@/components/forms/article_category/CreateArticleCategoryModal.vue'
import UpdateArticleCategoryModal from '@/components/forms/article_category/UpdateArticleCategoryModal.vue'
import { refDebounced } from '@vueuse/core'

const keyword = ref('')

const {
    pagination,
    currentPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    setTotalPages
} = usePagination(10, 0)
const debouncedKeyword = refDebounced(keyword, 500);

const queryParams = computed(() => ({
    page: pagination.page,
    size: pagination.size,
    sort: 'displayOrder,asc',
    keyword: debouncedKeyword.value
}))


const { data: categoryData, isFetching } = useArticleCategoriesQuery(queryParams)
const { mutate: deleteCategory } = useDeleteArticleCategoryMutation()

const categories = computed(() => categoryData.value?.data ?? {
    page: pagination.page,
    size: pagination.size,
    totalElements: 0,
    totalPages: 0,
    first: true,
    last: true,
    hasNext: false,
    hasPrevious: false,
    sortBy: 'displayOrder',
    sortDirection: 'ASC',
    items: []
})
const totalElements = computed(() => categories.value.totalElements || 0)

watch(
    () => categoryData.value?.data?.totalPages,
    (total) => setTotalPages(total || 0),
    { immediate: true }
)

watch(debouncedKeyword, () => {
    pagination.page = 0
})

const isCreateModalOpen = ref(false)
const isUpdateModalOpen = ref(false)
const selectedCategory = ref(null)

const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN')
}

const openCreateModal = () => {
    isCreateModalOpen.value = true
}

const openUpdateModal = (category) => {
    selectedCategory.value = category
    isUpdateModalOpen.value = true
}

const closeUpdateModal = () => {
    isUpdateModalOpen.value = false
    selectedCategory.value = null
}

const confirmDelete = (cat) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`)) {
        deleteCategory(cat.articleCategoryId)
    }
}
</script>


<template>
    <div class="p-6 bg-slate-50 min-h-screen font-sans text-slate-900">
        <!-- Header Page -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
                <h1 class="text-2xl font-bold flex items-center gap-2">
                    <FolderTree class="w-8 h-8 text-amber-600" />
                    Quản lý Danh mục Bài viết
                </h1>
                <p class="text-slate-500 text-sm mt-1">Tạo và cấu hình các nhóm tin tức cho hệ thống gia phả</p>
            </div>
            <button @click="openCreateModal"
                class="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md shadow-amber-100">
                <Plus class="w-5 h-5" />
                Thêm danh mục
            </button>
        </div>

        <!-- Filter & Search Bar -->
        <div
            class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
            <div class="relative flex-1 w-full">
                <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input v-model="keyword" type="text" placeholder="Tìm kiếm tên danh mục hoặc slug..."
                    class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm" />
            </div>
            <div class="flex items-center gap-2 w-full md:w-auto">
                <select
                    class="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500 flex-1 md:flex-none">
                    <option>Tất cả trạng thái</option>
                    <option>Hiển thị</option>
                    <option>Ẩn</option>
                </select>
                <button class="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors">
                    <Filter class="w-5 h-5" />
                </button>
            </div>
        </div>

        <!-- Main Table -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr
                            class="bg-slate-50 text-[11px] text-slate-400 font-black uppercase tracking-widest border-b border-slate-200">
                            <th class="px-6 py-4 w-16 text-center">ID</th>
                            <th class="px-6 py-4">Tên danh mục</th>
                            <th class="px-6 py-4">Đường dẫn (Slug)</th>
                            <th class="px-6 py-4 text-center">Thứ tự hiển thị</th>
                            <th class="px-6 py-4">Ngày tạo</th>
                            <th class="px-6 py-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="cat in categories.items" :key="cat.articleCategoryId"
                            class="hover:bg-slate-50/50 transition-colors group">
                            <td class="px-6 py-4 text-center">
                                <span class="text-xs font-mono font-bold text-slate-400">#{{ cat.articleCategoryId
                                }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                                        <Hash class="w-4 h-4" />
                                    </div>
                                    <span class="text-sm font-bold text-slate-700">{{ cat.name }}</span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                    {{ cat.slug }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span class="text-sm font-bold text-slate-600">{{ cat.displayOrder }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col">
                                    <span
                                        class="text-xs font-bold text-slate-700">{{ formatDate(cat.createdAt) }}</span>
                                    <span class="text-[10px] text-slate-400 italic">bởi Admin</span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div
                                    class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button @click="openUpdateModal(cat)"
                                        class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                        title="Chỉnh sửa">
                                        <Pencil class="w-4 h-4" />
                                    </button>
                                    <button @click="confirmDelete(cat)"
                                        class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                        title="Xóa">
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="!categories.items.length">
                            <td colspan="6" class="px-6 py-10 text-center text-sm font-medium text-slate-400">
                                {{ isFetching ? 'Đang tải danh mục...' : 'Chưa có danh mục bài viết' }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Footer -->
            <div
                class="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p class="text-xs font-medium text-slate-500 italic">
                    Hiển thị từ {{ totalElements === 0 ? 0 : pagination.page * pagination.size + 1 }} đến
                    {{ Math.min((pagination.page + 1) * pagination.size, totalElements) }} trong tổng số
                    {{ totalElements }} bản ghi
                </p>
                <AppPagination :page="currentPage" :total-pages="pagination.totalPages" :has-next="hasNextPage"
                    :has-prev="hasPrevPage" @next="nextPage" @prev="prevPage" class="!mt-0" />
            </div>
        </div>

        <CreateArticleCategoryModal :show="isCreateModalOpen" :default-display-order="categories.items.length + 1"
            @close="isCreateModalOpen = false" @success="isCreateModalOpen = false" />

        <UpdateArticleCategoryModal :show="isUpdateModalOpen" :category="selectedCategory" @close="closeUpdateModal"
            @success="closeUpdateModal" />
    </div>
</template>

<style scoped>
/* Custom style for clean table borders */
table {
    border-collapse: separate;
    border-spacing: 0;
}
</style>
