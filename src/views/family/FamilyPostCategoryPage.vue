<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  FolderTree, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff,
  ChevronRight,
  Hash,
  LayoutGrid
} from 'lucide-vue-next'

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  status: 'active' | 'hidden';
  color: string;
  lastUpdated: string;
}

const searchQuery = ref('')

const categories = ref<Category[]>([
  {
    id: 1,
    name: "Lịch sử dòng họ",
    slug: "lich-su-dong-ho",
    description: "Các bài viết về nguồn gốc, gia phả và các câu chuyện truyền thống.",
    postCount: 12,
    status: 'active',
    color: 'bg-amber-500',
    lastUpdated: "2024-03-15"
  },
  {
    id: 2,
    name: "Gương sáng gia đình",
    slug: "guong-sang",
    description: "Tuyên dương các thành viên có thành tích xuất sắc trong học tập và công tác.",
    postCount: 8,
    status: 'active',
    color: 'bg-blue-500',
    lastUpdated: "2024-03-10"
  },
  {
    id: 3,
    name: "Thông báo chung",
    slug: "thong-bao",
    description: "Các tin tức ngắn, thông báo họp mặt hoặc việc hiếu hỷ.",
    postCount: 25,
    status: 'active',
    color: 'bg-emerald-500',
    lastUpdated: "2024-03-18"
  },
  {
    id: 4,
    name: "Kỷ niệm & Hình ảnh",
    slug: "ky-niem-hinh-anh",
    description: "Kho lưu trữ những khoảnh khắc đáng nhớ qua các thời kỳ.",
    postCount: 45,
    status: 'hidden',
    color: 'bg-purple-500',
    lastUpdated: "2024-02-20"
  }
])

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  return categories.value.filter(c => 
    c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('vi-VN')
}
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
      
      <button class="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl transition-all shadow-lg active:scale-95 font-bold">
        <Plus :size="20" />
        Thêm danh mục
      </button>
    </div>

    <!-- Stats & Search -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
      <div class="lg:col-span-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
        <div class="relative flex-1">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" :size="20" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Tìm tên danh mục hoặc mô tả..."
            class="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
          />
        </div>
        <div class="h-10 w-px bg-slate-100 mx-2 hidden md:block"></div>
        <div class="hidden md:flex items-center gap-2 text-slate-500 font-bold px-4">
          <LayoutGrid :size="18" />
          <span class="text-sm whitespace-nowrap">{{ categories.length }} Danh mục</span>
        </div>
      </div>
      
      <div class="bg-indigo-600 p-4 rounded-3xl shadow-lg shadow-indigo-100 flex items-center justify-between text-white">
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
    <div class="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/40 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/80 border-b border-slate-100">
              <th class="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Tên danh mục</th>
              <th class="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Slug (Đường dẫn)</th>
              <th class="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] text-center">Số bài viết</th>
              <th class="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Trạng thái</th>
              <th class="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Cập nhật</th>
              <th class="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50">
            <tr 
              v-for="cat in filteredCategories" 
              :key="cat.id"
              class="hover:bg-slate-50/50 transition-all group"
            >
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div :class="['w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-white font-black text-lg', cat.color]">
                    {{ cat.name.charAt(0) }}
                  </div>
                  <div class="flex flex-col">
                    <span class="font-bold text-slate-800 text-base leading-tight">{{ cat.name }}</span>
                    <span class="text-xs text-slate-400 mt-1 line-clamp-1 italic">{{ cat.description }}</span>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <code class="px-2 py-1 bg-slate-100 text-slate-500 rounded text-xs font-mono">/{{ cat.slug }}</code>
              </td>
              <td class="px-8 py-6 text-center">
                <div class="inline-flex items-center justify-center w-10 h-10 bg-indigo-50 rounded-xl font-black text-indigo-600 text-sm">
                  {{ cat.postCount }}
                </div>
              </td>
              <td class="px-8 py-6">
                <div v-if="cat.status === 'active'" class="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  Hiển thị
                </div>
                <div v-else class="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase">
                  <div class="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  Đã ẩn
                </div>
              </td>
              <td class="px-8 py-6 text-sm text-slate-500 font-medium">
                {{ formatDate(cat.lastUpdated) }}
              </td>
              <td class="px-8 py-6">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                  <button class="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="Sửa">
                    <Edit2 :size="18" />
                  </button>
                  <button class="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors" title="Xem">
                    <Eye :size="18" />
                  </button>
                  <button class="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Xóa">
                    <Trash2 :size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Table Footer -->
      <div class="px-8 py-5 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Trang 1 của 1
        </p>
        <div class="flex items-center gap-1">
          <button class="p-2 rounded-xl text-slate-300 cursor-not-allowed">
            <ChevronRight class="rotate-180" :size="20" />
          </button>
          <button class="w-8 h-8 flex items-center justify-center bg-indigo-600 text-white rounded-xl text-xs font-black shadow-md">1</button>
          <button class="p-2 rounded-xl text-slate-400 hover:bg-white hover:text-indigo-600 transition-colors">
            <ChevronRight :size="20" />
          </button>
        </div>
      </div>
    </div>
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