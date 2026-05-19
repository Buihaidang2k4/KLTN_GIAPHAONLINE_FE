<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Search, Filter, Download, ExternalLink,
  CheckCircle2, Clock, ArrowUpRight,
  CreditCard, Calendar, RefreshCcw, Eye
} from 'lucide-vue-next'
import AppPagination from '@/components/forms/common/AppPagination.vue'
import { usePagination } from '@/composables/common/usePagination'
import { usePaymentsQuery } from '@/hooks/queries/payments/usePayments'
import ViewPaymentModal from '@/components/forms/payment/ViewPaymentModal.vue'

const searchQuery = ref('')
const selectedStatus = ref('all')

const selectedPayment = ref<any>(null)
const showDetailModal = ref(false)

const openDetail = (payment: any) => {
  selectedPayment.value = payment
  showDetailModal.value = true
}

const {
  pagination,
  currentPage,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
  setTotalPages
} = usePagination(10, 0)

const paymentParams = computed(() => ({
  page: pagination.page,
  size: pagination.size,
  sort: 'createdAt,desc'
}))

const { data: paymentsData, isLoading } = usePaymentsQuery(paymentParams)

const pageData = computed(() => paymentsData.value?.data)
const payments = computed(() => pageData.value?.items ?? [])

const filteredPayments = computed(() => {
  const keyword = searchQuery.value.trim().toLowerCase()
  const status = selectedStatus.value

  return payments.value.filter(payment => {
    const matchesKeyword = !keyword
      || payment.merchantTransactionId.toLowerCase().includes(keyword)
      || payment.bankCode?.toLowerCase().includes(keyword)
      || payment.status.toLowerCase().includes(keyword)
      || payment.planName?.toLowerCase().includes(keyword)

    const matchesStatus = status === 'all' || payment.status === status

    return matchesKeyword && matchesStatus
  })
})

watch(
  () => pageData.value?.totalPages,
  totalPages => setTotalPages(totalPages ?? 1),
  { immediate: true }
)

const totalAmount = computed(() =>
  payments.value
    .filter(payment => payment.status === 'SUCCESS')
    .reduce((sum, payment) => sum + payment.amount, 0)
)

const stats = computed(() => [
  { label: 'Tổng doanh thu', value: formatCurrency(totalAmount.value), icon: ArrowUpRight, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Tổng giao dịch', value: String(pageData.value?.totalElements ?? 0), icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Đang chờ xử lý', value: String(payments.value.filter(payment => payment.status === 'PENDING').length), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Hoàn tiền', value: String(payments.value.filter(payment => payment.status === 'REFUNDED').length), icon: RefreshCcw, color: 'text-red-600', bg: 'bg-red-50' },
])

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'success': return 'bg-green-50 text-green-700 border-green-200'
    case 'SUCCESS': return 'bg-green-50 text-green-700 border-green-200'
    case 'failed': return 'bg-red-50 text-red-700 border-red-200'
    case 'FAILED': return 'bg-red-50 text-red-700 border-red-200'
    case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'EXPIRED': return 'bg-slate-50 text-slate-700 border-slate-200'
    case 'refunded': return 'bg-slate-50 text-slate-700 border-slate-200'
    case 'REFUNDED': return 'bg-slate-50 text-slate-700 border-slate-200'
    default: return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'success': return 'Thành công'
    case 'SUCCESS': return 'Thành công'
    case 'failed': return 'Thất bại'
    case 'FAILED': return 'Thất bại'
    case 'pending': return 'Chờ xử lý'
    case 'PENDING': return 'Chờ xử lý'
    case 'EXPIRED': return 'Hết hạn'
    case 'refunded': return 'Đã hoàn tiền'
    case 'REFUNDED': return 'Đã hoàn tiền'
    default: return status
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

const formatDateTime = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return { date: value, time: '' }
  }

  return {
    date: date.toLocaleDateString('vi-VN'),
    time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#F1F5F9] p-4 md:p-8 font-sans">
    <div class="max-w-7xl mx-auto">

      <!-- Header Area -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div class="p-2 bg-indigo-600 rounded-lg">
              <CreditCard class="text-white" :size="24" />
            </div>
            Lịch sử giao dịch VNPay
          </h1>
          <p class="text-slate-500 text-sm mt-1 font-medium">Theo dõi và đối soát các dòng tiền thanh toán qua cổng
            VNPay.</p>
        </div>

        <div class="flex items-center gap-3">
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar :size="18" /> Chọn khoảng ngày
          </button>
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Download :size="18" /> Xuất Excel
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="stat in stats" :key="stat.label" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{{ stat.label }}</p>
              <h3 class="text-xl font-black text-slate-800">{{ stat.value }}</h3>
            </div>
            <div :class="['p-2 rounded-xl', stat.bg]">
              <component :is="stat.icon" :class="stat.color" :size="20" />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Table Card -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <!-- Filter Header -->
        <div
          class="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
          <div class="relative w-full md:w-96">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
            <input v-model="searchQuery" type="text" placeholder="Tìm theo mã giao dịch, phương thức hoặc gói..."
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
          </div>

          <div class="flex items-center gap-3 w-full md:w-auto">
            <select v-model="selectedStatus"
              class="flex-1 md:w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none">
              <option value="all">Tất cả trạng thái</option>
              <option value="SUCCESS">Thành công</option>
              <option value="PENDING">Đang chờ</option>
              <option value="FAILED">Thất bại</option>
              <option value="EXPIRED">Hết hạn</option>
              <option value="REFUNDED">Đã hoàn tiền</option>
            </select>
            <button class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400">
              <Filter :size="18" />
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50/50">
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Thời gian</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Giao dịch</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Gói dịch vụ</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Số tiền</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Phương
                  thức</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Hành
                  động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="isLoading">
                <td colspan="7" class="px-6 py-10 text-center text-sm font-bold text-slate-400">Đang tải giao dịch...
                </td>
              </tr>
              <tr v-else-if="filteredPayments.length === 0">
                <td colspan="7" class="px-6 py-10 text-center text-sm font-bold text-slate-400">Không tìm thấy giao dịch
                </td>
              </tr>
              <template v-else>
                <tr v-for="payment in filteredPayments" :key="payment.paymentId"
                  class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="text-sm font-medium text-slate-700">{{ formatDateTime(payment.createdAt).date }}</div>
                    <div class="text-[11px] text-slate-400 font-bold">{{ formatDateTime(payment.createdAt).time }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{{ payment.merchantTransactionId }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-bold text-slate-800">{{ payment.planName }}</div>
                    <div class="text-xs text-slate-400 truncate max-w-45">Family #{{ payment.familyId }} · Account #{{
                      payment.accountId }}</div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm font-black text-slate-800">{{ formatCurrency(payment.amount) }}</div>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      class="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded uppercase border border-slate-200">
                      {{ payment.bankCode || '---' }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div
                      :class="['px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5', getStatusStyle(payment.status)]">
                      <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {{ getStatusLabel(payment.status) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        @click="openDetail(payment)"
                        class="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all"
                        title="Xem chi tiết Log">
                        <Eye :size="18" />
                      </button>
                      <button v-if="payment.status === 'SUCCESS'"
                        class="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-all"
                        title="Hoàn tiền">
                        <RefreshCcw :size="18" />
                      </button>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

      </div>

      <AppPagination :page="currentPage" :total-pages="pagination.totalPages" :has-next="hasNextPage"
        :has-prev="hasPrevPage" @next="nextPage" @prev="prevPage" />

      <!-- View transaction details modal -->
      <ViewPaymentModal
        :show="showDetailModal"
        :payment="selectedPayment"
        @close="showDetailModal = false"
      />

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.font-sans {
  font-family: 'Inter', sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
