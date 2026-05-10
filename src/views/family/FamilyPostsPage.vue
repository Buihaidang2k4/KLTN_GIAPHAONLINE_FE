<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  FileText,
  Plus,
  Search,
  Filter,
  User,
  Calendar,
  Eye,
  MessageSquare,
  Heart,
  Edit2,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'

interface Post {
  id: number;
  title: string;
  author: string;
  category: string;
  categoryColor: string;
  publishDate: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  comments: number;
  likes: number;
}

const router = useRouter()
const posts = ref<Post[]>([
  {
    id: 1,
    title: "Chuyện cụ tổ đời thứ 5 định cư tại đất này",
    author: "Bác Cả Hùng",
    category: "Lịch sử dòng họ",
    categoryColor: "text-amber-600 bg-amber-50 border-amber-200",
    publishDate: "2024-03-20 14:30",
    status: 'published',
    views: 156,
    comments: 12,
    likes: 45
  },
  {
    id: 2,
    title: "Thông báo ngày giỗ tổ rằm tháng Giêng",
    author: "Anh Trưởng Tộc",
    category: "Thông báo",
    categoryColor: "text-blue-600 bg-blue-50 border-blue-200",
    publishDate: "2024-03-18 09:15",
    status: 'published',
    views: 342,
    comments: 24,
    likes: 89
  },
  {
    id: 3,
    title: "Gương sáng học tập: Cháu Nguyễn Văn A đỗ thủ khoa",
    author: "Cô Ba",
    category: "Gương sáng",
    categoryColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    publishDate: "2024-03-15 16:45",
    status: 'draft',
    views: 89,
    comments: 5,
    likes: 32
  },
  {
    id: 4,
    title: "Album ảnh họp mặt đầu xuân Giáp Thìn",
    author: "Anh Nam",
    category: "Kỷ niệm & Hình ảnh",
    categoryColor: "text-purple-600 bg-purple-50 border-purple-200",
    publishDate: "2024-02-10 20:45",
    status: 'published',
    views: 342,
    comments: 28,
    likes: 120
  }
])

const categories = ['Tất cả', 'Lịch sử dòng họ', 'Thông báo', 'Tin tức', 'Gương sáng', 'Kỷ niệm']
const searchQuery = ref('')
const selectedCategory = ref('Tất cả')

const filteredPosts = computed(() => {
  return posts.value.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'Tất cả' || post.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

const getStatusDetails = (status: string) => {
  switch (status) {
    case 'published': return { label: 'Đã đăng', class: 'bg-emerald-100 text-emerald-700' }
    case 'draft': return { label: 'Bản nháp', class: 'bg-slate-100 text-slate-600' }
    case 'archived': return { label: 'Lưu trữ', class: 'bg-amber-100 text-amber-700' }
    default: return { label: '---', class: 'bg-slate-50 text-slate-400' }
  }
}

const handleOpenEditer = () => {
  router.push({ name: 'FamilyPostEditor' })
}
</script>

<template>
  <div class="p-6 bg-[#fbfaf5] min-h-screen font-sans text-slate-900">
    <!-- Header Section -->
    <div class="max-w-350 mx-auto space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold flex items-center gap-2">
            <FileText class="text-indigo-600" :size="28" />
            Quản lý Bài viết
          </h1>
          <p class="text-slate-500 text-sm mt-1">Danh sách tất cả nội dung được chia sẻ trong gia đình.</p>
        </div>
        <button @click="handleOpenEditer"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 font-semibold text-sm active:scale-95">
          <Plus :size="18" />
          Tạo bài viết mới
        </button>
      </div>

      <!-- Filters & Search -->
      <div
        class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div class="relative flex-1 w-full">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
          <input v-model="searchQuery" type="text" placeholder="Tìm theo tiêu đề hoặc người đăng..."
            class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 rounded-xl transition-all text-sm outline-none" />
        </div>
        <div class="flex items-center gap-2 w-full md:w-auto">
          <Filter class="text-slate-400" :size="18" />
          <select v-model="selectedCategory"
            class="bg-slate-50 border border-slate-100 text-sm rounded-xl px-4 py-2 focus:ring-4 focus:ring-indigo-100 outline-none flex-1 md:w-48">
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>

      <!-- Table Container -->
      <div class="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="bg-slate-50/50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                <th class="px-6 py-4 w-12 text-center">ID</th>
                <th class="px-6 py-4 min-w-75">
                  <div class="flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors">
                    Tiêu đề bài viết
                    <ArrowUpDown :size="12" />
                  </div>
                </th>
                <th class="px-6 py-4">Chuyên mục</th>
                <th class="px-6 py-4">Người đăng</th>
                <th class="px-6 py-4">Ngày đăng</th>
                <th class="px-6 py-4">Thống kê</th>
                <th class="px-6 py-4 text-center">Trạng thái</th>
                <th class="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="post in filteredPosts" :key="post.id" class="hover:bg-indigo-50/30 transition-colors group">
                <td class="px-6 py-4 text-center font-medium text-slate-400 text-sm">#{{ post.id }}</td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span
                      class="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1">
                      {{ post.title }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span :class="['px-2.5 py-1 rounded-lg text-[11px] font-bold border', post.categoryColor]">
                    {{ post.category }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User :size="14" />
                    </div>
                    <span class="text-sm font-medium text-slate-600">{{ post.author }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col text-[13px] text-slate-500">
                    <span class="flex items-center gap-1 font-medium">
                      <Calendar :size="12" /> {{ post.publishDate.split(' ')[0] }}
                    </span>
                    <span class="text-[11px] opacity-70 ml-4">{{ post.publishDate.split(' ')[1] }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3 text-slate-400">
                    <div class="flex items-center gap-1" title="Lượt xem">
                      <Eye :size="14" />
                      <span class="text-xs font-semibold">{{ post.views }}</span>
                    </div>
                    <div class="flex items-center gap-1" title="Bình luận">
                      <MessageSquare :size="14" />
                      <span class="text-xs font-semibold">{{ post.comments }}</span>
                    </div>
                    <div class="flex items-center gap-1" title="Yêu thích">
                      <Heart :size="14" />
                      <span class="text-xs font-semibold">{{ post.likes }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    :class="['px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight', getStatusDetails(post.status).class]">
                    {{ getStatusDetails(post.status).label }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button
                      class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      title="Xem">
                      <ExternalLink :size="16" />
                    </button>
                    <button
                      class="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      title="Sửa">
                      <Edit2 :size="16" />
                    </button>
                    <button class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Xóa">
                      <Trash2 :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Footer -->
        <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
          <p class="text-sm text-slate-500 font-medium">
            Hiển thị <span class="text-slate-900 font-bold">{{ filteredPosts.length }}</span> bài viết
          </p>
          <div class="flex items-center gap-2">
            <button
              class="p-2 border border-slate-200 rounded-lg bg-white text-slate-400 hover:text-slate-600 disabled:opacity-50"
              disabled>
              <ChevronLeft :size="18" />
            </button>
            <div class="flex items-center">
              <button class="w-9 h-9 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm">1</button>
              <button
                class="w-9 h-9 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-bold transition-colors">2</button>
            </div>
            <button class="p-2 border border-slate-200 rounded-lg bg-white text-slate-400 hover:text-slate-600">
              <ChevronRight :size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Tuỳ chỉnh thanh cuộn cho bảng nếu dữ liệu quá dài trên mobile */
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