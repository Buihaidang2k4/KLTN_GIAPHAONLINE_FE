<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Users, Calendar, Crown, ArrowUpCircle, Bell,
  HardDrive, Images, Trophy, BookOpen, Cloud,
  ChevronRight, UserCog, FolderOpen, Sparkles, Scroll,
  LayoutDashboard
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useFamilyStore } from '@/store/family/useFamilyStore'
import { useFamilyEventsByFamilyQuery } from '@/hooks/queries/family/family_event/useFamilyEvent'
import { useActiveSubscriptionPlansQuery } from '@/hooks/queries/subscription_plan/useSubscriptionPlan'
import { useFamilySubscriptionByFamilyQuery } from '@/hooks/queries/family/family_subscription/useFamilySubscription'
import { useDashboardQuery } from '@/hooks/queries/dashboard/useDashboard'
import PackageCard from '@/components/family_service/PackageCard.vue'
import { formatDate } from '@/utils/format-date'
import type { FamilyEventRes } from '@/types/family/family-event.types'
import { formatMoney } from '@/utils/format-money'

const router = useRouter()
const familyStore = useFamilyStore()
const familyId = computed(() => familyStore.currentFamilyId)

const { data: dashboardData } = useDashboardQuery(familyId)
const dashboardInfo = computed(() => dashboardData.value?.data)

const stats = computed(() => [
  { label: 'Thành viên', value: dashboardInfo.value?.totalMembersInFamilyTree || 0, icon: Users, iconColor: 'text-blue-600', iconBg: 'bg-blue-50' },
  { label: 'Albums', value: dashboardInfo.value?.totalAlbumMedias || 0, icon: Images, iconColor: 'text-emerald-600', iconBg: 'bg-emerald-50' },
  { label: 'Sự kiện', value: dashboardInfo.value?.totalEvents || 0, icon: Calendar, iconColor: 'text-amber-600', iconBg: 'bg-amber-50' },
  { label: 'Thành tích', value: dashboardInfo.value?.totalAchievement || 0, icon: Trophy, iconColor: 'text-rose-500', iconBg: 'bg-rose-50' },
  { label: 'Phong tục', value: dashboardInfo.value?.totalCustoms || 0, icon: BookOpen, iconColor: 'text-violet-600', iconBg: 'bg-violet-50' },
])

const quickActions = [
  { label: 'Gia phả', icon: UserCog, color: 'text-blue-600', bg: 'bg-blue-50', route: '/family/danh-sach' },
  { label: 'Albums', icon: FolderOpen, color: 'text-emerald-600', bg: 'bg-emerald-50', route: '/family/thu-vien-anh' },
  { label: 'Sự kiện', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', route: '/family/su-kien' },
  { label: 'Phong tục', icon: Scroll, color: 'text-violet-600', bg: 'bg-violet-50', route: '/family/phong-tuc' },
]

const params = ref({ page: 0, size: 5, keyword: '', option: 'UPCOMING' })
const { data: familyEventsData } = useFamilyEventsByFamilyQuery(familyId, params)
const safeEvents = computed<FamilyEventRes[]>(() => familyEventsData.value?.data?.items ?? [])

const { data: plansData } = useActiveSubscriptionPlansQuery()
const servicePlans = computed(() => plansData.value?.data || [])

const { data: familySubData } = useFamilySubscriptionByFamilyQuery(familyId)
const safeFamilySub = computed(() => familySubData.value?.data || null)

const currentPlanDetails = computed(() =>
  servicePlans.value.find(p => p.namePlan === dashboardInfo.value?.currentSubscriptionPlanName) || null
)

const formatStorage = (mb: number | undefined) => {
  if (!mb) return '0 MB'
  return mb >= 1024 ? (mb / 1024).toFixed(1) + ' GB' : mb.toFixed(0) + ' MB'
}

const storagePercentage = computed(() => {
  const used = dashboardInfo.value?.totalUsedStorages || 0
  const total = currentPlanDetails.value?.maxStorageMb || 1
  return Math.min(100, Math.round((used / total) * 100))
})

const storageBarColor = computed(() => {
  if (storagePercentage.value > 80) return 'from-rose-400 to-rose-500'
  if (storagePercentage.value > 60) return 'from-amber-400 to-amber-500'
  return 'from-teal-400 to-emerald-500'
})

const getEventDateLabel = (event: FamilyEventRes) => {
  if (event.nextOccurrenceDate) return formatDate(event.nextOccurrenceDate)
  if (event.day && event.month) return `${event.day}/${event.month}`
  return '—'
}

const handleViewServices = () => router.push('/family/dich-vu')
const handleViewEvents = () => router.push('/family/su-kien')
const handleRoute = (route: string) => router.push(route)
</script>

<template>
  <div class="min-h-screen bg-[#f8f8f6] font-outfit">

    <!-- HEADER -->
    <header class="bg-white/80 backdrop-blur border-b border-slate-100 sticky top-0 z-20">
      <div class="max-w-[1320px] mx-auto px-6 h-[58px] flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <LayoutDashboard class="text-white" :size="15" />
          </div>
          <div class="flex flex-col">
            <span class="text-[13px] font-bold text-slate-900 leading-none">{{ dashboardInfo?.currentFamilyName }}</span>
            <span class="text-[11px] text-slate-400 mt-0.5">Bảng điều khiển quản trị</span>
          </div>
        </div>
        <div class="flex items-center gap-2.5">
          <button
            class="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-colors">
            <Bell :size="14" />
          </button>
          <div
            class="flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-700 px-3 py-1.5 rounded-lg">
            <Crown :size="12" class="text-amber-500" />
            <span class="text-[11px] font-bold">{{ dashboardInfo?.currentSubscriptionPlanName || 'Free' }}</span>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-[1320px] mx-auto px-6 py-5 space-y-4">

      <!-- STATS ROW -->
      <div class="grid grid-cols-5 gap-3">
        <div v-for="(stat, i) in stats" :key="stat.label"
          class="bg-white rounded-xl border border-slate-100 px-4 py-3.5 flex items-center gap-3 hover:shadow-sm hover:-translate-y-px transition-all duration-200">
          <div
            :class="[stat.iconBg, stat.iconColor, 'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0']">
            <component :is="stat.icon" :size="18" />
          </div>
          <div>
            <p class="text-[22px] font-bold text-slate-900 leading-none">{{ stat.value.toLocaleString() }}</p>
            <p class="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- MAIN GRID -->
      <div class="grid grid-cols-3 gap-4 items-start">

        <!-- LEFT COL (2/3) -->
        <div class="col-span-2 space-y-4">

          <!-- ROW: Storage + Quick actions -->
          <div class="grid grid-cols-2 gap-4">

            <!-- STORAGE -->
            <div class="bg-white rounded-xl border border-slate-100 p-5">
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-2">
                  <div class="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Cloud class="text-slate-500" :size="14" />
                  </div>
                  <span class="text-[13px] font-semibold text-slate-700">Lưu trữ</span>
                </div>
                <button @click="handleViewServices"
                  class="flex items-center gap-1 text-[11px] font-semibold text-teal-600 bg-teal-50 hover:bg-teal-100 border border-teal-100 px-2.5 py-1 rounded-lg transition-colors">
                  <ArrowUpCircle :size="11" /> Nâng cấp
                </button>
              </div>

              <div class="flex items-baseline gap-1.5 mb-1">
                <span
                  class="text-[26px] font-bold text-slate-900">{{ formatStorage(dashboardInfo?.totalUsedStorages) }}</span>
                <span class="text-sm text-slate-400 font-medium">/
                  {{ formatStorage(currentPlanDetails?.maxStorageMb) }}</span>
              </div>
              <p class="text-xs text-slate-400 mb-3">Đã dùng {{ storagePercentage }}% dung lượng</p>

              <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-gradient-to-r transition-all duration-700" :class="storageBarColor"
                  :style="{ width: storagePercentage + '%' }" />
              </div>
              <div class="flex justify-between mt-1.5">
                <span class="text-[10px] text-slate-300">0 MB</span>
                <span class="text-[10px] text-slate-300">{{ formatStorage(currentPlanDetails?.maxStorageMb) }}</span>
              </div>
            </div>

            <!-- QUICK ACTIONS -->
            <div class="bg-white rounded-xl border border-slate-100 p-5">
              <p class="text-[13px] font-semibold text-slate-700 mb-3.5">Thao tác nhanh</p>
              <div class="grid grid-cols-2 gap-2">
                <button v-for="action in quickActions" :key="action.label" @click="handleRoute(action.route)"
                  class="flex flex-col items-center gap-2 py-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150 group">
                  <div
                    :class="[action.bg, action.color, 'w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-150']">
                    <component :is="action.icon" :size="16" />
                  </div>
                  <span class="text-[11px] font-semibold text-slate-500">{{ action.label }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- SERVICE DETAIL -->
          <div class="bg-white rounded-xl border border-slate-100 p-5">
            <div class="flex items-center justify-between mb-4">
              <p class="text-[13px] font-semibold text-slate-700">Chi tiết dịch vụ</p>
              <span
                class="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                {{ dashboardInfo?.currentSubscriptionPlanName || '—' }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <!-- Left meta -->
              <div class="space-y-0">
                <div v-for="item in [
                  { label: 'Giá dịch vụ', value: formatMoney(dashboardInfo?.currentSubscriptionPlanPrice, 'VNĐ') },
                  { label: 'Ngày bắt đầu', value: dashboardInfo?.currentSubscriptionStartDate ? formatDate(dashboardInfo.currentSubscriptionStartDate) : '—' },
                  { label: 'Ngày kết thúc', value: dashboardInfo?.currentSubscriptionEndDate ? formatDate(dashboardInfo.currentSubscriptionEndDate) : '—' },
                ]" :key="item.label"
                  class="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                  <span class="text-xs text-slate-400">{{ item.label }}</span>
                  <span class="text-xs font-semibold text-slate-700">{{ item.value }}</span>
                </div>
              </div>

              <!-- Right quota -->
              <div class="bg-slate-50 rounded-xl p-3.5">
                <div class="grid grid-cols-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">
                  <span>Hạng mục</span>
                  <span class="text-center">Giới hạn</span>
                  <span class="text-center">Hiện có</span>
                </div>
                <div v-for="row in [
                  { label: 'Thành viên', limit: currentPlanDetails?.maxPerson, cur: dashboardInfo?.totalMembersInFamilyTree },
                  { label: 'Quản trị', limit: currentPlanDetails?.maxAdmin, cur: dashboardInfo?.totalAdmin },
                  { label: 'Dung lượng', limit: formatStorage(currentPlanDetails?.maxStorageMb), cur: formatStorage(dashboardInfo?.totalUsedStorages) },
                ]" :key="row.label" class="grid grid-cols-3 text-xs py-2 border-b border-white/70 last:border-0 px-1">
                  <span class="text-slate-500 font-medium">{{ row.label }}</span>
                  <span
                    class="text-center text-slate-400">{{ row.limit?.toLocaleString?.() ?? row.limit ?? '—' }}</span>
                  <span
                    class="text-center font-bold text-emerald-600">{{ row.cur?.toLocaleString?.() ?? row.cur ?? 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COL (1/3): EVENTS -->
        <div class="bg-white rounded-xl border border-slate-100 overflow-hidden flex flex-col">
          <div class="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
                <Calendar class="text-amber-500" :size="13" />
              </div>
              <span class="text-[13px] font-semibold text-slate-700">Sự kiện sắp tới</span>
            </div>
            <button @click="handleViewEvents"
              class="flex items-center gap-0.5 text-[11px] font-semibold text-blue-500 hover:text-blue-700 transition-colors">
              Tất cả
              <ChevronRight :size="13" />
            </button>
          </div>

          <div v-if="safeEvents.length" class="divide-y divide-slate-50">
            <div v-for="event in safeEvents" :key="event.familyEventId"
              class="px-5 py-3.5 hover:bg-slate-50/60 transition-colors cursor-pointer group">
              <div class="flex items-start justify-between gap-2 mb-1">
                <p
                  class="text-[13px] font-semibold text-slate-800 leading-snug line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {{ event.eventName }}
                </p>
                <span class="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                  :class="event.calendarType === 'LUNAR' ? 'bg-blue-50 text-blue-500' : 'bg-amber-50 text-amber-500'">
                  {{ event.calendarType === 'LUNAR' ? 'ÂL' : 'DL' }}
                </span>
              </div>
              <div class="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span class="font-medium text-slate-500">{{ getEventDateLabel(event) }}</span>
                <span v-if="event.eventTime">· {{ event.eventTime }}</span>
                <span v-if="event.location" class="truncate">· {{ event.location }}</span>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div class="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
              <Calendar class="text-slate-300" :size="22" />
            </div>
            <p class="text-sm font-semibold text-slate-400">Chưa có sự kiện</p>
            <p class="text-xs text-slate-300 mt-1">Sự kiện mới sẽ xuất hiện ở đây</p>
          </div>
        </div>
      </div>

      <!-- SERVICE PLANS -->
      <div class="bg-white rounded-xl border border-slate-100 p-5">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-[13px] font-bold text-slate-800">Các gói dịch vụ</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Nâng cấp để mở khóa thêm tính năng và dung lượng</p>
          </div>
          <div class="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Sparkles :size="12" class="text-amber-400" />
            <span>Ưu đãi đặc biệt</span>
          </div>
        </div>
        <div class="grid grid-cols-4 gap-3">
          <PackageCard v-for="plan in servicePlans" :key="plan.subscriptionPlanId" :plan="plan"
            :current-family-sub="safeFamilySub" @select="handleViewServices" />
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

.font-outfit {
  font-family: 'Outfit', sans-serif;
}

.grid>* {
  animation: fadeUp 0.3s ease both;
}

.grid>*:nth-child(1) {
  animation-delay: 0ms;
}

.grid>*:nth-child(2) {
  animation-delay: 50ms;
}

.grid>*:nth-child(3) {
  animation-delay: 100ms;
}

.grid>*:nth-child(4) {
  animation-delay: 150ms;
}

.grid>*:nth-child(5) {
  animation-delay: 200ms;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>