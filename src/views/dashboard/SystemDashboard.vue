<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDashboardSystemQuery } from '@/hooks/queries/dashboard/useDashboard'
import {
  LayoutDashboard, Users, TrendingUp, TrendingDown, 
  CreditCard, UserCheck, ShieldAlert, LineChart, GitFork,
  HeartHandshake, Package, Landmark, RefreshCw
} from 'lucide-vue-next'
import { formatMoney } from '@/utils/format-money'
import GrowthChartSystem from '@/components/charts_dashboard/GrowthChartSystem.vue'

const { data: responseData, isPending: isLoading, refetch } = useDashboardSystemQuery();

// Active tab for chart visualization
const activeTab = ref<'both' | 'revenue' | 'accounts'>('both')

// Safe Dashboard stats extractor
const stats = computed(() => {
  const data = responseData.value?.data
  return {
    totalAccounts: data?.totalAccounts ?? 0,
    totalAccountsActive: data?.totalAccountsActive ?? 0,
    totalAccountsLocked: data?.totalAccountsLocked ?? 0,
    totalFamilies: data?.totalFamilies ?? 0,
    totalFamiliesWithActiveSub: data?.totalFamiliesWithActiveSub ?? 0,
    totalActiveSubscriptions: data?.totalActiveSubscriptions ?? 0,
    totalExpiredSubscriptions: data?.totalExpiredSubscriptions ?? 0,
    revenueThisMonth: data?.revenueThisMonth ?? 0,
    revenueLastMonth: data?.revenueLastMonth ?? 0,
    revenueTotal: data?.revenueTotal ?? 0,
    totalPayments: data?.totalPayments ?? 0,
    totalPaymentsSuccess: data?.totalPaymentsSuccess ?? 0,
    totalPaymentsFailed: data?.totalPaymentsFailed ?? 0,
    accountGrowth: data?.accountGrowth ?? [],
    revenueGrowth: data?.revenueGrowth ?? []
  }
})

// Trend calculation
const revenueTrend = computed(() => {
  const thisMonth = stats.value.revenueThisMonth
  const lastMonth = stats.value.revenueLastMonth
  if (lastMonth === 0) return { val: 100, up: true }
  const diff = ((thisMonth - lastMonth) / lastMonth) * 100
  return {
    val: Math.abs(Math.round(diff * 10) / 10),
    up: diff >= 0
  }
})

const activeSubPercentage = computed(() => {
  if (stats.value.totalFamilies === 0) return 0
  return Math.round((stats.value.totalFamiliesWithActiveSub / stats.value.totalFamilies) * 100)
})

const paymentSuccessRate = computed(() => {
  if (stats.value.totalPayments === 0) return 0
  return Math.round((stats.value.totalPaymentsSuccess / stats.value.totalPayments) * 100)
})

// Dynamic charts computation
const chartData = computed(() => {
  const accGrowth = stats.value.accountGrowth
  const revGrowth = stats.value.revenueGrowth

  // Combine unique months
  const monthsSet = new Set<string>()
  accGrowth.forEach(item => monthsSet.add(item.month))
  revGrowth.forEach(item => monthsSet.add(item.month))
  const labels = Array.from(monthsSet).sort()

  if (labels.length === 0) {
    return {
      labels: ['Chưa có dữ liệu'],
      accounts: [0],
      revenue: [0]
    }
  }

  const accounts = labels.map(m => {
    const found = accGrowth.find(item => item.month === m)
    return found ? (found.count ?? 0) : 0
  })

  const revenue = labels.map(m => {
    const found = revGrowth.find(item => item.month === m)
    return found ? (found.value ?? 0) : 0
  })

  return {
    labels,
    accounts,
    revenue
  }
})

const handleRefresh = () => {
  refetch()
}
</script>

<template>
  <div class="p-6 bg-slate-50 min-h-screen font-sans">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-black text-slate-900 flex items-center gap-2">
          <LayoutDashboard class="w-8 h-8 text-amber-600" />
          Bảng điều khiển Hệ thống
        </h1>
        <p class="text-slate-500 mt-1">Tổng quan hoạt động, giao dịch và biến động người dùng</p>
      </div>
      <div class="flex gap-3 mt-4 md:mt-0">
        <button
          @click="handleRefresh"
          :disabled="isLoading"
          class="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-all shadow-md flex items-center gap-2 active:scale-95">
          <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
          Làm mới
        </button>
      </div>
    </div>

    <!-- Loading overlay or state -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center h-96 bg-white rounded-2xl shadow-sm border border-slate-100 mb-8">
      <div class="w-10 h-10 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
      <span class="mt-4 text-sm font-semibold text-slate-500">Đang tải dữ liệu dashboard...</span>
    </div>

    <div v-else>
      <!-- Quick Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Doanh Thu Tháng -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 bg-amber-500"></div>
          <div class="flex items-start justify-between relative z-10">
            <div>
              <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Doanh thu tháng này</p>
              <h3 class="text-2xl font-black text-slate-800">{{ formatMoney(stats.revenueThisMonth, 'VND') }}</h3>
              <div
                :class="['flex items-center gap-1 text-[11px] mt-2 font-bold', revenueTrend.up ? 'text-emerald-600' : 'text-rose-600']">
                <component :is="revenueTrend.up ? TrendingUp : TrendingDown" class="w-3 h-3" />
                {{ revenueTrend.val }}% so với tháng trước
              </div>
            </div>
            <div class="p-3 rounded-xl bg-amber-500 shadow-lg shadow-amber-100">
              <CreditCard class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <!-- Người Dùng (Accounts) -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 bg-blue-500"></div>
          <div class="flex items-start justify-between relative z-10">
            <div>
              <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Tổng số tài khoản</p>
              <h3 class="text-2xl font-black text-slate-800">{{ stats.totalAccounts }}</h3>
              <div class="flex items-center gap-2 text-[11px] mt-2 font-bold text-slate-500">
                <span class="text-emerald-600">{{ stats.totalAccountsActive }} active</span>
                <span>•</span>
                <span class="text-rose-600">{{ stats.totalAccountsLocked }} khóa</span>
              </div>
            </div>
            <div class="p-3 rounded-xl bg-blue-500 shadow-lg shadow-blue-100">
              <Users class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <!-- Gia Phả -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 bg-emerald-500"></div>
          <div class="flex items-start justify-between relative z-10">
            <div>
              <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Tổng gia phả</p>
              <h3 class="text-2xl font-black text-slate-800">{{ stats.totalFamilies }}</h3>
              <div class="flex items-center gap-1.5 text-[11px] mt-2 font-bold text-emerald-600">
                <ShieldAlert class="w-3.5 h-3.5" />
                {{ activeSubPercentage }}% đã đăng ký gói
              </div>
            </div>
            <div class="p-3 rounded-xl bg-emerald-500 shadow-lg shadow-emerald-100">
              <GitFork class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <!-- Giao Dịch & Gói Cước -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div class="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 bg-rose-500"></div>
          <div class="flex items-start justify-between relative z-10">
            <div>
              <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Gói hoạt động</p>
              <h3 class="text-2xl font-black text-slate-800">{{ stats.totalActiveSubscriptions }}</h3>
              <div class="flex items-center gap-1.5 text-[11px] mt-2 font-bold text-rose-600">
                <HeartHandshake class="w-3.5 h-3.5" />
                GD thành công: {{ paymentSuccessRate }}%
              </div>
            </div>
            <div class="p-3 rounded-xl bg-rose-500 shadow-lg shadow-rose-100">
              <Package class="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <!-- Charts & Visualizations -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <!-- Biểu đồ biến động tăng trưởng -->
        <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-6">
              <h3 class="font-bold text-slate-800 flex items-center gap-2">
                <LineChart class="w-5 h-5 text-blue-500" />
                Biểu đồ Tăng trưởng & Doanh thu
              </h3>
              <div class="flex gap-2 bg-slate-100 p-0.5 rounded-lg">
                <button
                  @click="activeTab = 'both'"
                  :class="['px-3 py-1 text-xs font-bold rounded-md transition-all', activeTab === 'both' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800']">
                  Tất cả
                </button>
                <button
                  @click="activeTab = 'revenue'"
                  :class="['px-3 py-1 text-xs font-bold rounded-md transition-all', activeTab === 'revenue' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800']">
                  Doanh thu
                </button>
                <button
                  @click="activeTab = 'accounts'"
                  :class="['px-3 py-1 text-xs font-bold rounded-md transition-all', activeTab === 'accounts' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800']">
                  Người dùng
                </button>
              </div>
            </div>

            <!-- GrowthChartSystem component -->
            <div class="relative w-full bg-slate-50/50 rounded-2xl border border-slate-100 p-4">
              <GrowthChartSystem
                :labels="chartData.labels"
                :accounts="chartData.accounts"
                :revenue="chartData.revenue"
                :active-tab="activeTab"
              />
            </div>
          </div>
        </div>

        <!-- Sơ đồ luồng hoạt động -->
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 class="font-bold text-slate-800 flex items-center gap-2 mb-6">
              <GitFork class="w-5 h-5 text-emerald-500" />
              Tổng quan Phân bổ
            </h3>
            <div class="space-y-4">
              <!-- Doanh thu tổng hợp -->
              <div class="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-amber-100 text-amber-700">
                    <Landmark class="w-4 h-4" />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-700">Doanh thu tích lũy</h4>
                    <p class="text-[10px] text-slate-400">Từ trước đến nay</p>
                  </div>
                </div>
                <span class="text-sm font-black text-slate-800">{{ formatMoney(stats.revenueTotal, 'VND') }}</span>
              </div>

              <!-- Gia phả Active Subscription -->
              <div class="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                    <UserCheck class="w-4 h-4" />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-700">Gia phả có gói cước</h4>
                    <p class="text-[10px] text-slate-400">Đang kích hoạt</p>
                  </div>
                </div>
                <span class="text-sm font-black text-slate-800">{{ stats.totalFamiliesWithActiveSub }} / {{ stats.totalFamilies }}</span>
              </div>

              <!-- Giao dịch thành công -->
              <div class="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-lg bg-blue-100 text-blue-700">
                    <Package class="w-4 h-4" />
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-700">Giao dịch thành công</h4>
                    <p class="text-[10px] text-slate-400">Ghi nhận từ cổng thanh toán</p>
                  </div>
                </div>
                <span class="text-sm font-black text-slate-800">{{ stats.totalPaymentsSuccess }} / {{ stats.totalPayments }}</span>
              </div>
            </div>
          </div>

          <div class="text-[10px] text-slate-400 text-center font-bold tracking-wider uppercase border-t border-slate-100 pt-4 mt-6">
            Hệ thống an toàn & bảo mật
          </div>
        </div>
      </div>

      <!-- Hoạt động & Giao dịch -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-5 border-b border-slate-50 flex items-center justify-between">
            <h3 class="font-bold text-slate-800">Hoạt động Hệ thống</h3>
          </div>
          <div class="divide-y divide-slate-50">
            <div class="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
              <div class="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                <Users class="w-5 h-5 text-indigo-600" />
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-bold text-slate-800">Tài khoản người dùng</p>
                  <span class="text-[10px] text-slate-400 font-bold">Thời gian thực</span>
                </div>
                <p class="text-xs text-slate-500 mt-1">
                  Đang ghi nhận <span class="text-blue-600 font-bold">{{ stats.totalAccountsActive }}</span> tài khoản hoạt động bình thường trên hệ thống.
                </p>
              </div>
            </div>

            <div class="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
              <div class="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                <GitFork class="w-5 h-5 text-emerald-600" />
              </div>
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <p class="text-xs font-bold text-slate-800">Cây Gia Phả</p>
                  <span class="text-[10px] text-slate-400 font-bold">Thời gian thực</span>
                </div>
                <p class="text-xs text-slate-500 mt-1">
                  Tổng số <span class="text-emerald-600 font-bold">{{ stats.totalFamilies }}</span> dòng họ đã được khởi tạo và ghi phả hệ thành công.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Thống kê tài chính & Giao dịch -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-5 border-b border-slate-50 flex items-center justify-between">
            <h3 class="font-bold text-slate-800">Chi tiết Giao dịch</h3>
            <span
              class="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-black uppercase">
              Thanh toán trực tuyến
            </span>
          </div>
          <div class="p-5 space-y-4">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div class="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Tổng hóa đơn</div>
                <div class="text-lg font-black text-slate-800 mt-1">{{ stats.totalPayments }}</div>
              </div>
              <div class="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/30">
                <div class="text-emerald-500 text-[10px] font-bold uppercase tracking-wider">Thành công</div>
                <div class="text-lg font-black text-emerald-700 mt-1">{{ stats.totalPaymentsSuccess }}</div>
              </div>
              <div class="p-3 bg-rose-50/50 rounded-xl border border-rose-100/30">
                <div class="text-rose-500 text-[10px] font-bold uppercase tracking-wider">Thất bại</div>
                <div class="text-lg font-black text-rose-700 mt-1">{{ stats.totalPaymentsFailed }}</div>
              </div>
            </div>

            <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
              <span class="font-semibold text-slate-500">Doanh thu tích lũy:</span>
              <span class="text-base font-black text-slate-800">{{ formatMoney(stats.revenueTotal, 'VND') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cursor-pointer {
  transition: all 0.2s ease;
}
.cursor-pointer:hover {
  r: 8;
}
</style>
