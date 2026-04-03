<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Users, 
  FileText, 
  Calendar, 
  Crown, 
  CheckCircle2, 
  ArrowUpCircle, 
  Clock, 
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Star
} from 'lucide-vue-next'

// --- THÔNG TIN GIA PHẢ & QUẢN TRỊ ---
const familyInfo = ref({
  name: "Gia Tộc Nguyễn Tộc - Từ Liêm",
  admin: {
    name: "Nguyễn Văn Hùng",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    role: "Trưởng tộc / Quản trị viên"
  },
  currentPlan: {
    name: "Premium Plan",
    status: "Active",
    expiryDate: "2025-12-31",
    storageUsed: "45GB",
    storageLimit: "100GB"
  }
})

// --- THỐNG KÊ TỔNG QUAN ---
const stats = ref([
  { label: 'Thành viên', value: 128, icon: Users, color: 'bg-blue-500', trend: '+5 trong tháng này' },
  { label: 'Bài viết', value: 456, icon: FileText, color: 'bg-emerald-500', trend: '+12 tuần này' },
  { label: 'Sự kiện', value: 24, icon: Calendar, color: 'bg-amber-500', trend: '3 sự kiện sắp tới' }
])

// --- SỰ KIỆN SẮP DIỄN RA ---
const upcomingEvents = ref([
  { id: 1, title: 'Giỗ Tổ Dòng Họ', date: '2024-04-15', location: 'Nhà Thờ Tổ, Hà Nội', priority: 'High' },
  { id: 2, title: 'Họp Mặt Thường Niên', date: '2024-05-01', location: 'Online Zoom', priority: 'Medium' },
  { id: 3, title: 'Mừng Thọ Cụ Cố', date: '2024-06-20', location: 'Nhà riêng', priority: 'High' }
])

// --- DANH SÁCH GÓI DỊCH VỤ ---
const servicePlans = ref([
  { 
    name: 'Cơ bản', 
    price: '0đ', 
    features: ['50 thành viên', '5GB Lưu trữ', 'Gia phả 3 đời'],
    isCurrent: false 
  },
  { 
    name: 'Nâng cao', 
    price: '199k/tháng', 
    features: ['200 thành viên', '100GB Lưu trữ', 'Gia phả không giới hạn', 'Ưu tiên hỗ trợ'],
    isCurrent: true 
  },
  { 
    name: 'Chuyên nghiệp', 
    price: '499k/tháng', 
    features: ['Thành viên vô hạn', '1TB Lưu trữ', 'Tên miền riêng gia tộc', 'Số hóa tài liệu cổ'],
    isCurrent: false 
  }
])

// Giả lập dữ liệu biểu đồ đóng góp (7 tháng gần nhất)
const chartData = [40, 65, 55, 85, 70, 95, 110]
const maxVal = Math.max(...chartData)

</script>

<template>
  <div class="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans">
    <div class="max-w-7xl mx-auto space-y-8">
      
      <!-- HEADER & ADMIN INFO -->
      <section class="flex flex-col lg:flex-row gap-6 items-start justify-between">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <ShieldCheck :size="32" />
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-black text-slate-900">{{ familyInfo.name }}</h1>
            <p class="text-slate-500 font-medium flex items-center gap-2">
              Bảng điều khiển quản trị hệ thống
            </p>
          </div>
        </div>

        <div class="w-full lg:w-auto bg-white p-4 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-4">
          <img :src="familyInfo.admin.avatar" class="w-12 h-12 rounded-full border-2 border-indigo-100" />
          <div class="pr-8">
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Quản trị viên</p>
            <h4 class="font-black text-slate-800 flex items-center gap-1">
              {{ familyInfo.admin.name }} 
              <Crown :size="14" class="text-amber-500" />
            </h4>
          </div>
          <div class="h-10 w-[1px] bg-slate-100"></div>
          <div class="pl-4">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-black uppercase">
              <CheckCircle2 :size="12" /> Đang hoạt động
            </span>
          </div>
        </div>
      </section>

      <!-- STATS GRID -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div :class="[stat.color, 'w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-opacity-20']">
              <component :is="stat.icon" :size="24" />
            </div>
            <span class="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{{ stat.trend }}</span>
          </div>
          <h3 class="text-4xl font-black text-slate-900 mb-1">{{ stat.value.toLocaleString() }}</h3>
          <p class="text-slate-400 font-bold uppercase text-xs tracking-widest">{{ stat.label }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- BIỂU ĐỒ HOẠT ĐỘNG (BÊN TRÁI) -->
        <div class="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="text-xl font-black text-slate-900">Hoạt động Gia tộc</h3>
              <p class="text-sm text-slate-400 font-medium">Thống kê bài viết & đóng góp 7 tháng qua</p>
            </div>
            <button class="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl">
              <TrendingUp :size="16" /> Chi tiết
            </button>
          </div>
          
          <!-- GIẢ LẬP BIỂU ĐỒ CỘT -->
          <div class="flex items-end justify-between h-48 gap-3 px-2">
            <div v-for="(val, idx) in chartData" :key="idx" class="flex-1 flex flex-col items-center group">
              <div 
                class="w-full bg-slate-100 rounded-t-xl transition-all duration-500 group-hover:bg-indigo-500 relative"
                :style="{ height: `${(val / maxVal) * 100}%` }"
              >
                <div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {{ val }}
                </div>
              </div>
              <span class="text-[10px] font-bold text-slate-400 mt-3">Tháng {{ idx + 1 }}</span>
            </div>
          </div>
        </div>

        <!-- SỰ KIỆN SẮP DIỄN RA (BÊN PHẢI) -->
        <div class="bg-indigo-900 text-white p-8 rounded-[3rem] shadow-xl shadow-indigo-100 relative overflow-hidden">
          <div class="absolute top-0 right-0 p-8 opacity-10">
            <Calendar :size="120" />
          </div>
          
          <h3 class="text-xl font-black mb-6 flex items-center gap-2">
            <Clock :size="20" class="text-indigo-300" /> Sự kiện sắp tới
          </h3>
          
          <div class="space-y-4 relative z-10">
            <div v-for="event in upcomingEvents" :key="event.id" class="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer group">
              <div class="flex justify-between items-start mb-2">
                <span :class="[
                  'text-[9px] font-black px-2 py-0.5 rounded-full uppercase',
                  event.priority === 'High' ? 'bg-rose-500 text-white' : 'bg-indigo-400 text-indigo-900'
                ]">
                  {{ event.priority }}
                </span>
                <span class="text-[11px] font-bold text-indigo-200">{{ event.date }}</span>
              </div>
              <h4 class="font-bold text-sm mb-1 group-hover:translate-x-1 transition-transform">{{ event.title }}</h4>
              <p class="text-[11px] text-indigo-200 line-clamp-1 opacity-80">{{ event.location }}</p>
            </div>
          </div>
          
          <button class="w-full mt-6 py-4 bg-white text-indigo-900 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-colors shadow-lg">
            Xem Lịch Toàn Gia Tộc
          </button>
        </div>
      </div>

      <!-- QUẢN LÝ GÓI DỊCH VỤ -->
      <section>
        <div class="flex items-center gap-3 mb-8 px-2">
          <div class="w-1.5 h-8 bg-indigo-600 rounded-full"></div>
          <div>
            <h3 class="text-2xl font-black text-slate-900">Dịch vụ & Lưu trữ</h3>
            <p class="text-slate-500 text-sm font-medium">Nâng cấp để bảo vệ di sản gia đình tốt hơn</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div 
            v-for="plan in servicePlans" 
            :key="plan.name"
            :class="[
              'p-8 rounded-[3rem] border-2 transition-all relative overflow-hidden',
              plan.isCurrent 
                ? 'bg-white border-indigo-600 shadow-xl shadow-indigo-100 ring-4 ring-indigo-50' 
                : 'bg-white border-slate-100 hover:border-slate-200 shadow-sm'
            ]"
          >
            <!-- Badge Current -->
            <div v-if="plan.isCurrent" class="absolute top-6 right-6 flex items-center gap-1 text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">
              <Star :size="12" /> Gói hiện tại
            </div>

            <h4 class="text-lg font-black text-slate-900 mb-2">{{ plan.name }}</h4>
            <div class="flex items-baseline gap-1 mb-8">
              <span class="text-3xl font-black text-slate-900">{{ plan.price }}</span>
            </div>

            <ul class="space-y-4 mb-10">
              <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3 text-sm font-medium text-slate-600">
                <CheckCircle2 :size="18" class="text-indigo-500 shrink-0" />
                {{ feature }}
              </li>
            </ul>

            <button 
              :disabled="plan.isCurrent"
              :class="[
                'w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2',
                plan.isCurrent 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-95'
              ]"
            >
              <Zap v-if="!plan.isCurrent" :size="18" />
              {{ plan.isCurrent ? 'Đang sử dụng' : 'Nâng cấp ngay' }}
            </button>
          </div>
        </div>

        <!-- Lưu trữ info -->
        <div class="mt-8 bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="space-y-2">
            <h4 class="text-xl font-bold">Trạng thái lưu trữ dữ liệu</h4>
            <p class="text-slate-400 text-sm">Gia tộc đã sử dụng {{ familyInfo.currentPlan.storageUsed }} trên tổng số {{ familyInfo.currentPlan.storageLimit }}</p>
          </div>
          <div class="flex-1 w-full max-w-md space-y-3">
            <div class="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full bg-indigo-500 rounded-full" style="width: 45%"></div>
            </div>
            <div class="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span>0 GB</span>
              <span>45% ĐÃ DÙNG</span>
              <span>100 GB</span>
            </div>
          </div>
          <button class="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all flex items-center gap-2">
            <ArrowUpCircle :size="18" /> Mua thêm dung lượng
          </button>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.font-sans {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Hiệu ứng mượt cho các thẻ */
.transition-all {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Tùy chỉnh thanh cuộn nếu cần */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>