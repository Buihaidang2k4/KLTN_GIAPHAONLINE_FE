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
  ShieldCheck,
  MapPin,
  ExternalLink,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family/useFamilyStore';
import { useFamilyEventsByFamilyQuery } from '@/hooks/queries/family/family_event/useFamilyEvent';
import { formatDate } from '@/utils/format-date';
import type { FamilyEventRes } from '@/types/family/family-event.types';
const router = useRouter();

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

// hook
const familyStore = useFamilyStore()
const familyId = computed(() => familyStore.currentFamilyId)

const params = ref({
  page: 0,
  size: 5,
  keyword: '',
  option: "UPCOMING"
})

const { data: familyEventsData } =
  useFamilyEventsByFamilyQuery(familyId, params);
const safeEvents = computed<FamilyEventRes[]>(() => familyEventsData.value?.data?.items ?? []);

const getEventDateLabel = (event: FamilyEventRes) => {
  if (event.nextOccurrenceDate) return formatDate(event.nextOccurrenceDate)
  if (event.day && event.month) return `${event.day}/${event.month}/${event.year || 'Hằng năm'}`
  return 'Chưa có ngày'
}

const getCalendarTypeLabel = (event: FamilyEventRes) =>
  event.calendarType === 'LUNAR' ? 'Âm lịch' : 'Dương lịch'

const serviceInfo = ref({
  website: 'bui13.giaphadaiviet.vn',
  views: 32,
  planName: 'Khởi đầu',
  price: 'Miễn phí',
  startDate: '01/01/2026',
  endDate: 'Vĩnh viễn',
  limits: {
    members: 50,
    admins: 1,
    storage: '1 GB'
  },
  current: {
    members: 28,
    admins: 1,
    storage: '0,11 GB'
  }
})

const servicePlans = ref([
  {
    name: 'Gói Cơ bản',
    price: 500000,
    features: ['200 thành viên', '1 người quản lý', '2 GB dung lượng lưu trữ', 'Website gia phả trực tuyến']
  },
  {
    name: 'Gói Đoàn viên',
    price: 1000000,
    features: ['500 thành viên', '2 người quản lý', '3 GB dung lượng lưu trữ', 'Website gia phả trực tuyến']
  },
  {
    name: 'Gói Đồng tâm',
    price: 2000000,
    features: ['2.000 thành viên', '5 người quản lý', '10 GB dung lượng lưu trữ', 'Website gia phả trực tuyến']
  }
])

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN').format(price)

const handleViewDetailEvents = () => router.push("/family/su-kien");
const handleViewServices = () => router.push("/family/dich-vu");
</script>

<template>
  <div class="min-h-screen bg-[#fbfaf5] p-4 md:p-8 text-slate-900 font-sans">
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

        <div
          class="w-full lg:w-auto bg-white p-4 rounded-[2rem] shadow-sm border border-slate-200 flex items-center gap-4">
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
            <span
              class="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[11px] font-black uppercase">
              <CheckCircle2 :size="12" /> Đang hoạt động
            </span>
          </div>
        </div>
      </section>

      <!-- STATS GRID -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="stat in stats" :key="stat.label"
          class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-md transition-all group">
          <div class="flex items-center justify-between mb-4">
            <div
              :class="[stat.color, 'w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-opacity-20']">
              <component :is="stat.icon" :size="24" />
            </div>
            <span
              class="text-[11px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">{{ stat.trend }}</span>
          </div>
          <h3 class="text-4xl font-black text-slate-900 mb-1">{{ stat.value.toLocaleString() }}</h3>
          <p class="text-slate-400 font-bold uppercase text-xs tracking-widest">{{ stat.label }}</p>
        </div>
      </div>

      <section>
        <!-- Lưu trữ info -->
        <div
          class="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="space-y-2">
            <h4 class="text-xl font-bold">Trạng thái lưu trữ dữ liệu</h4>
            <p class="text-slate-400 text-sm">Gia tộc đã sử dụng {{ familyInfo.currentPlan.storageUsed }} trên tổng số
              {{ familyInfo.currentPlan.storageLimit }}
            </p>
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
          <button @click="handleViewServices"
            class="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm hover:bg-slate-100 transition-all flex items-center gap-2">
            <ArrowUpCircle :size="18" /> Mua thêm dung lượng
          </button>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- CHI TIẾT DỊCH VỤ (BÊN TRÁI) -->
        <div class="lg:col-span-2 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div class="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <h3 class="text-sm font-black text-slate-700">Chi tiết dịch vụ</h3>
          </div>

          <div class="p-6">
            <div class="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1.2fr]">
              <div class="space-y-2 text-sm">
                <p><span class="font-bold text-slate-900">Website:</span>
                  <span class="ml-2 font-medium text-teal-700">{{ serviceInfo.website }}</span>
                </p>
                <p><span class="font-bold text-slate-900">Lượt xem:</span>
                  <span class="ml-2 font-medium text-teal-700">{{ serviceInfo.views }}</span>
                </p>
                <p>
                  <span class="font-bold text-slate-900">Gói dịch vụ:</span>
                  <span class="ml-2 font-bold text-teal-700">{{ serviceInfo.planName }}</span>
                  <span
                    class="ml-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                    Free
                  </span>
                </p>
                <p><span class="font-bold text-slate-900">Giá:</span>
                  <span class="ml-2 text-slate-600">{{ serviceInfo.price }}</span>
                </p>
                <p><span class="font-bold text-slate-900">Ngày bắt đầu:</span>
                  <span class="ml-2 text-slate-600">{{ serviceInfo.startDate }}</span>
                </p>
                <p><span class="font-bold text-slate-900">Ngày kết thúc:</span>
                  <span class="ml-2 text-slate-600">{{ serviceInfo.endDate }}</span>
                </p>
              </div>

              <div class="overflow-hidden rounded-sm border border-slate-200">
                <table class="w-full border-collapse text-sm">
                  <thead>
                    <tr class="bg-slate-100">
                      <th class="border-r border-slate-200 px-4 py-3 text-left font-bold text-slate-700"></th>
                      <th class="border-r border-slate-200 px-4 py-3 text-center font-black text-slate-900">Cho phép</th>
                      <th class="px-4 py-3 text-center font-black text-slate-900">Hiện có</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-t border-slate-200">
                      <td class="border-r border-slate-200 px-4 py-3">Số thành viên</td>
                      <td class="border-r border-slate-200 px-4 py-3 text-center">{{ serviceInfo.limits.members }}</td>
                      <td class="px-4 py-3 text-center">{{ serviceInfo.current.members }}</td>
                    </tr>
                    <tr class="border-t border-slate-200">
                      <td class="border-r border-slate-200 px-4 py-3">Số quản trị viên</td>
                      <td class="border-r border-slate-200 px-4 py-3 text-center">{{ serviceInfo.limits.admins }}</td>
                      <td class="px-4 py-3 text-center">{{ serviceInfo.current.admins }}</td>
                    </tr>
                    <tr class="border-t border-slate-200">
                      <td class="border-r border-slate-200 px-4 py-3">Dung lượng lưu trữ</td>
                      <td class="border-r border-slate-200 px-4 py-3 text-center">{{ serviceInfo.limits.storage }}</td>
                      <td class="px-4 py-3 text-center">{{ serviceInfo.current.storage }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p class="my-6 text-center text-sm font-black text-slate-600">
              Bạn muốn nâng cấp gói dịch vụ ?
              <button @click="handleViewServices" class="text-teal-700 hover:underline">Ấn dịch vụ</button>
            </p>

            <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div v-for="plan in servicePlans" :key="plan.name"
                class="rounded-lg border border-amber-100 bg-[#fff7e8] p-5 shadow-sm">
                <div class="mb-5">
                  <span class="text-2xl font-black text-amber-700">{{ formatPrice(plan.price) }} VND</span>
                  <span class="ml-1 text-xs font-bold text-slate-500">/1 năm</span>
                </div>
                <h4 class="mb-3 text-base font-bold text-amber-700">{{ plan.name }}</h4>
                <ul class="mb-5 space-y-2">
                  <li v-for="feature in plan.features" :key="feature"
                    class="flex items-center gap-3 text-xs font-medium text-slate-700">
                    <CheckCircle2 :size="16" class="shrink-0 text-amber-700" />
                    {{ feature }}
                  </li>
                </ul>
                <button @click="handleViewServices"
                  class="flex w-full items-center justify-center gap-2 rounded-md border border-amber-300 bg-amber-100/70 px-4 py-2 text-sm font-bold text-amber-800 hover:bg-amber-200">
                  <ExternalLink :size="15" /> Nâng cấp ngay
                </button>
              </div>
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

          <div v-if="safeEvents.length > 0"
            class="event-scroll relative z-10 max-h-[360px] space-y-4 overflow-y-auto pr-1">
            <div v-for="event in safeEvents" :key="event.familyEventId"
              class="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:bg-white/20 transition-all cursor-pointer group">
              <div class="flex justify-between items-start mb-2">
                <span
                  class="text-[9px] font-black px-2 py-0.5 rounded-full uppercase bg-indigo-400 text-indigo-950">
                  {{ getCalendarTypeLabel(event) }}
                </span>
                <span class="text-[11px] font-bold text-indigo-200">{{ getEventDateLabel(event) }}</span>
              </div>
              <h4 class="font-bold text-sm mb-1 group-hover:translate-x-1 transition-transform">
                {{ event.eventName }}
              </h4>
              <div class="flex items-center gap-2 text-[11px] text-indigo-200 opacity-80">
                <Clock v-if="event.eventTime" :size="13" class="shrink-0" />
                <span v-if="event.eventTime" class="shrink-0">{{ event.eventTime }}</span>
                <MapPin v-if="event.location" :size="13" class="shrink-0" />
                <span class="line-clamp-1">{{ event.location || event.note || 'Chưa có địa điểm' }}</span>
              </div>
            </div>
          </div>

          <div v-else class="relative z-10 rounded-2xl border border-white/10 bg-white/10 p-6 text-center">
            <Calendar :size="36" class="mx-auto mb-3 text-indigo-300" />
            <p class="text-sm font-bold">Chưa có sự kiện sắp tới</p>
            <p class="mt-1 text-xs text-indigo-200">Các sự kiện mới sẽ hiển thị tại đây.</p>
          </div>

          <button @click="() => handleViewDetailEvents()"
            class="w-full mt-6 py-4 bg-white cursor-pointer text-indigo-900 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-colors shadow-lg">
            Xem Lịch Sự kiện Toàn Gia Tộc
          </button>
        </div>
      </div>

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

.event-scroll::-webkit-scrollbar {
  width: 4px;
}

.event-scroll::-webkit-scrollbar-thumb {
  background: rgba(199, 210, 254, 0.5);
}
</style>
