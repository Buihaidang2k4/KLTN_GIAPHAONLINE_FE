<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  MapPin,
  Clock,
  MoreVertical,
  Bell,
  CalendarDays,
  Filter,
  ChevronRight,
  Info
} from 'lucide-vue-next'

interface FamilyEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'anniversary' | 'meeting' | 'holiday' | 'other';
  description: string;
  status: 'upcoming' | 'completed' | 'ongoing';
}

const activeTab = ref<'all' | 'recent'>('all')
const searchQuery = ref('')

const events = ref<FamilyEvent[]>([
  {
    id: 1,
    title: "Lễ giỗ Tổ họ Phan",
    date: "2024-05-15",
    time: "08:00",
    location: "Nhà thờ họ, Quảng Nam",
    type: "anniversary",
    description: "Con cháu tập trung đông đủ để làm lễ dâng hương và họp mặt.",
    status: "upcoming"
  },
  {
    id: 2,
    title: "Họp mặt con cháu đầu xuân",
    date: "2024-02-12",
    time: "10:00",
    location: "Nhà bác trưởng",
    type: "meeting",
    description: "Chúc tết và mừng thọ các cụ cao niên trong dòng họ.",
    status: "completed"
  },
  {
    id: 3,
    title: "Đại hội Gia phả 2024",
    date: "2024-06-20",
    time: "14:00",
    location: "Trung tâm hội nghị TP.HCM",
    type: "meeting",
    description: "Cập nhật thông tin thành viên mới và ra mắt chatbot AI.",
    status: "upcoming"
  },
  {
    id: 4,
    title: "Lễ mừng thọ Cụ Phan Văn Đáng",
    date: "2024-04-30",
    time: "09:30",
    location: "Gia đình cụ Đáng",
    type: "holiday",
    description: "Lễ thượng thọ 90 tuổi.",
    status: "upcoming"
  }
])

const filteredEvents = computed(() => {
  let list = events.value
  if (activeTab.value === 'recent') {
    list = list.filter(e => e.status === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5)
  }

  if (searchQuery.value) {
    list = list.filter(e => e.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }

  return list
})

const getTagClass = (type: string) => {
  switch (type) {
    case 'anniversary': return 'bg-red-50 text-red-600 border-red-100'
    case 'meeting': return 'bg-blue-50 text-blue-600 border-blue-100'
    case 'holiday': return 'bg-amber-50 text-amber-600 border-amber-100'
    default: return 'bg-slate-50 text-slate-600 border-slate-100'
  }
}

const getStatusClass = (status: string) => {
  switch (status) {
    case 'upcoming': return 'text-emerald-600 bg-emerald-50'
    case 'completed': return 'text-slate-400 bg-slate-50'
    default: return 'text-amber-600 bg-amber-50'
  }
}

const getTypeName = (type: string) => {
  const map: any = { anniversary: 'Ngày giỗ', meeting: 'Họp mặt', holiday: 'Lễ hội', other: 'Khác' }
  return map[type] || type
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>

<template>
  <div class="p-8 bg-slate-50/50 min-h-screen">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
          <CalendarIcon class="text-amber-600" :size="28" />
          Quản lý Sự kiện
        </h1>
        <p class="text-slate-500 text-sm mt-1 font-medium">Danh sách các hoạt động quan trọng của gia đình.</p>
      </div>

      <button
        class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-95 font-bold text-sm">
        <Plus :size="18" />
        Tạo sự kiện
      </button>
    </div>

    <!-- Toolbar: Tabs & Search -->
    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6">
      <div class="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div class="flex p-1 bg-slate-100 rounded-xl w-full lg:w-auto">
          <button @click="activeTab = 'all'" :class="[
            'flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all w-full lg:w-auto justify-center',
            activeTab === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          ]">
            <CalendarDays :size="16" />
            Tất cả
          </button>
          <button @click="activeTab = 'recent'" :class="[
            'flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all w-full lg:w-auto justify-center',
            activeTab === 'recent' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          ]">
            <Bell :size="16" />
            Sắp diễn ra
          </button>
        </div>

        <div class="flex items-center gap-3 w-full lg:w-auto">
          <div class="relative flex-1 lg:w-72">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
            <input v-model="searchQuery" type="text" placeholder="Tìm kiếm sự kiện..."
              class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm" />
          </div>
          <button class="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100">
            <Filter :size="18" />
          </button>
        </div>
      </div>
    </div>

    <!-- Events Table -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 border-b border-slate-200">

              <th class="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">#
              </th>
              <th class="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Tên
                sự kiện</th>
              <th class="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Sự
                kiện</th>
              <th class="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Âm
                lịch</th>
              <th class="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Dương lịch</th>
              <th class="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Trạng thái</th>
              <th class="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Lặp
                lại</th>
              <th class="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Nhắc hẹn</th>
              <th class="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
                Thời gian</th>
              <th class="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Địa
                điểm</th>
              <th class="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Địa
                điểm Map</th>
              <th class="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Địa
                điểm Map</th>

              <th class="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Ghi
                chú</th>
              <th class="px-6 py-4 text-[13px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="event in filteredEvents" :key="event.id" class="hover:bg-indigo-50/30 transition-colors group">
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span
                    class="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{{ event.title }}</span>
                  <span class="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-50">{{ event.description }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-2.5 py-1 rounded-lg text-[11px] font-bold border', getTagClass(event.type)]">
                  {{ getTypeName(event.type) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <CalendarIcon :size="14" class="text-slate-400" />
                    {{ formatDate(event.date) }}
                  </span>
                  <span class="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <Clock :size="14" />
                    {{ event.time }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-sm text-slate-600 max-w-45">
                  <MapPin :size="14" class="text-slate-400 shrink-0" />
                  <span class="truncate">{{ event.location }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-center">
                <span
                  :class="['px-2.5 py-1 rounded-full text-[11px] font-black uppercase', getStatusClass(event.status)]">
                  {{ event.status === 'upcoming' ? 'Sắp tới' : (event.status === 'completed' ? 'Đã xong' : 'Đang diễn ra') }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-indigo-100 shadow-sm transition-all"
                    title="Chi tiết">
                    <Info :size="18" />
                  </button>
                  <button
                    class="p-2 text-slate-400 hover:text-slate-800 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 shadow-sm transition-all">
                    <MoreVertical :size="18" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination / Footer Table -->
      <div
        class="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 font-medium">
        <span>Hiển thị {{ filteredEvents.length }} sự kiện</span>
        <div class="flex gap-2">
          <button
            class="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50">Trước</button>
          <button
            class="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 font-bold rounded-lg shadow-sm">1</button>
          <button class="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50">Sau</button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredEvents.length === 0" class="py-20 flex flex-col items-center justify-center">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-4">
          <CalendarIcon :size="32" />
        </div>
        <h3 class="text-lg font-bold text-slate-800">Không có dữ liệu</h3>
        <p class="text-slate-400 text-sm mt-1">Không tìm thấy sự kiện nào phù hợp với tìm kiếm của bạn.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Tùy chỉnh thanh cuộn cho bảng nếu dữ liệu quá dài */
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