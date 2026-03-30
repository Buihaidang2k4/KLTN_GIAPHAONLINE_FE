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
            <button @click="openModal('create')"
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
                <input type="text" placeholder="Tìm kiếm tên danh mục hoặc slug..."
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
                                    <button @click="openModal('edit', cat)"
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
                    </tbody>
                </table>
            </div>

            <!-- Pagination Footer -->
            <div
                class="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p class="text-xs font-medium text-slate-500 italic">
                    Hiển thị từ 1 đến {{ categories.items.length }} trong tổng số {{ categories.totalElements }} bản ghi
                </p>
                <div class="flex items-center gap-1">
                    <button
                        class="p-2 border border-slate-300 rounded bg-white text-slate-400 disabled:opacity-50 hover:bg-slate-50"
                        :disabled="categories.first">
                        <ChevronLeft class="w-4 h-4" />
                    </button>
                    <button class="px-3 py-1 bg-amber-600 text-white rounded font-bold shadow-sm">1</button>
                    <button
                        class="px-3 py-1 bg-white border border-slate-300 text-slate-600 rounded hover:bg-slate-50 transition-colors">2</button>
                    <button
                        class="p-2 border border-slate-300 rounded bg-white text-slate-400 disabled:opacity-50 hover:bg-slate-50"
                        :disabled="categories.last">
                        <ChevronRight class="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Modal Create/Edit (Giả lập) -->
        <div v-if="isModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
                <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 class="font-black text-slate-800 uppercase tracking-tight text-lg">
                        {{ modalMode === 'create' ? 'Thêm danh mục mới' : 'Cập nhật danh mục' }}
                    </h3>
                    <button @click="isModalOpen = false" class="text-slate-400 hover:text-slate-600">
                        <X class="w-6 h-6" />
                    </button>
                </div>

                <div class="p-6 space-y-4">
                    <div>
                        <label class="block text-xs font-black text-slate-500 uppercase mb-1.5">Tên danh mục <span
                                class="text-rose-500">*</span></label>
                        <input v-model="form.name" type="text" placeholder="VD: Tin tức dòng họ"
                            class="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-medium" />
                    </div>
                    <div>
                        <label class="block text-xs font-black text-slate-500 uppercase mb-1.5">Đường dẫn (Slug)</label>
                        <div class="relative">
                            <span
                                class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">giapha/</span>
                            <input v-model="form.slug" type="text"
                                class="w-full p-3 pl-16 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-mono text-blue-600 bg-slate-50" />
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-black text-slate-500 uppercase mb-1.5">Thứ tự hiển thị</label>
                        <input v-model="form.displayOrder" type="number"
                            class="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm font-bold" />
                    </div>
                </div>

                <div class="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button @click="isModalOpen = false"
                        class="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all">
                        Hủy bỏ
                    </button>
                    <button @click="saveForm"
                        class="flex-2 px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg">
                        Xác nhận lưu
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
    FolderTree, Plus, Search, Filter, Hash, Pencil, Trash2,
    ChevronLeft, ChevronRight, X
} from 'lucide-vue-next'

// Initial Data from your JSON
const categories = ref({
    page: 0,
    size: 20,
    totalElements: 2,
    totalPages: 1,
    first: true,
    last: true,
    items: [
        {
            articleCategoryId: 2,
            name: "Tin tức 1",
            slug: "tin-tuc-1",
            description: null,
            displayOrder: 1,
            createdAt: "2026-03-29T16:43:39.251347Z"
        },
        {
            articleCategoryId: 3,
            name: "Tin tức 2",
            slug: "tin-tuc-2",
            description: null,
            displayOrder: 2,
            createdAt: "2026-03-29T16:44:42.445855Z"
        }
    ]
})

// Modal State
const isModalOpen = ref(false)
const modalMode = ref('create') // 'create' or 'edit'
const form = reactive({
    id: null,
    name: '',
    slug: '',
    displayOrder: 0
})

const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN')
}

const openModal = (mode, data = null) => {
    modalMode.value = mode
    if (mode === 'edit' && data) {
        form.id = data.articleCategoryId
        form.name = data.name
        form.slug = data.slug
        form.displayOrder = data.displayOrder
    } else {
        form.id = null
        form.name = ''
        form.slug = ''
        form.displayOrder = categories.value.items.length + 1
    }
    isModalOpen.value = true
}

const saveForm = () => {
    // Logic xử lý lưu dữ liệu ở đây
    console.log('Saving data:', form)
    isModalOpen.value = false
}

const confirmDelete = (cat) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${cat.name}"?`)) {
        console.log('Deleting ID:', cat.articleCategoryId)
    }
}
</script>

<style scoped>
/* Custom style for clean table borders */
table {
    border-collapse: separate;
    border-spacing: 0;
}
</style>