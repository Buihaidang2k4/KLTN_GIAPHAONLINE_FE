<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
    Search,
    Filter,
    Download,
    CreditCard,
    CheckCircle2,
    XCircle,
    Clock,
    History,
    Receipt,
    ExternalLink,
    Banknote
} from 'lucide-vue-next'
import { formatMoney } from '@/utils/format-money';
import { formatDate } from '@/utils/format-date';
import { usePaymentsByFamilyQuery } from '@/hooks/queries/payments/usePayments';
import { usePagination } from '@/composables/common/usePagination';
import { useFamilyStore } from '@/store/family/useFamilyStore';
import AppPagination from '@/components/forms/common/AppPagination.vue';
import type { PaymentRes } from '@/types/payment/payment.types';

const searchQuery = ref('')
const statusFilter = ref('ALL')

const getStatusConfig = (status: PaymentRes['status']) => {
    switch (status) {
        case 'SUCCESS': return { label: 'Đã thanh toán', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' }
        case 'FAILED': return { label: 'Chưa thanh toán', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-100' }
        case 'PENDING': return { label: 'Chờ xử lý', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' }
        case 'EXPIRED': return { label: 'Hết hạn', icon: Clock, color: 'text-slate-600 bg-slate-50 border-slate-100' }
        case 'REFUNDED': return { label: 'Đã hoàn tiền', icon: Receipt, color: 'text-slate-600 bg-slate-50 border-slate-100' }
    }
}

const {
    pagination,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    currentPage,
    setTotalPages
} = usePagination(10, 0);

const familyStore = useFamilyStore();
const familyId = computed(() => familyStore.currentFamilyId);

const paymentParams = computed(() => ({
    page: pagination.page,
    size: pagination.size,
    sort: 'createdAt,desc'
}))

const { data: paymentsData, isLoading } = usePaymentsByFamilyQuery(
    familyId,
    paymentParams
);

watch(
    () => paymentsData.value?.data?.totalPages,
    (total) => setTotalPages(total ?? 1),
    { immediate: true }
)

const pageData = computed(() => paymentsData.value?.data);
const payments = computed(() => pageData.value?.items ?? []);

const filteredPayments = computed(() => {
    const keyword = searchQuery.value.trim().toLowerCase()

    return payments.value.filter(p => {
        const matchesSearch = !keyword
            || p.merchantTransactionId.toLowerCase().includes(keyword)
            || p.providerTransactionId?.toLowerCase().includes(keyword)
            || p.bankCode?.toLowerCase().includes(keyword)
            || p.status.toLowerCase().includes(keyword)
            || p.planName?.toLowerCase().includes(keyword)
        const matchesStatus = statusFilter.value === 'ALL' || p.status === statusFilter.value
        return matchesSearch && matchesStatus
    })
})

const totalSpent = computed(() =>
    payments.value
        .filter(payment => payment.status === 'SUCCESS')
        .reduce((sum, payment) => sum + payment.amount, 0)
)

const currentMonthTransactions = computed(() => {
    const now = new Date()

    return payments.value.filter(payment => {
        const createdAt = new Date(payment.createdAt)
        return createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear()
    }).length
})
</script>

<template>
    <div class="min-h-screen bg-[#fefaf6] px-3 py-4 sm:p-6 md:p-8 font-sans overflow-x-hidden">
        <div class="max-w-7xl mx-auto space-y-5 md:space-y-8">

            <!-- Header Section -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                <div class="space-y-2">
                    <div
                        class="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/50 rounded-full border border-amber-200/50">
                        <Banknote :size="12" class="text-amber-600" />
                        <span class="text-[10px] font-black text-amber-700 uppercase tracking-widest">Quản lý tài
                            chính</span>
                    </div>
                    <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <History :size="28" class="text-amber-600 shrink-0" />
                        Lịch sử thanh toán
                    </h1>
                    <p class="text-slate-500 text-sm font-medium">Theo dõi và quản lý tất cả các giao dịch nâng cấp gói
                        dịch vụ của gia đình.</p>
                </div>
            </div>

            <!-- Stats Overview -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                <div class="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4 md:gap-5 min-w-0">
                    <div class="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                        <CheckCircle2 :size="24" />
                    </div>
                    <div class="min-w-0">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng chi tiêu
                        </p>
                        <p class="text-xl md:text-2xl font-black text-slate-900 tracking-tight truncate">
                            {{ formatMoney(totalSpent) }}
                        </p>
                    </div>
                </div>
                <div class="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4 md:gap-5 min-w-0">
                    <div class="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                        <CreditCard :size="24" />
                    </div>
                    <div class="min-w-0">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Giao dịch tháng
                            này</p>
                        <p class="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{{ currentMonthTransactions }}
                            <span class="text-sm font-bold text-slate-400">giao dịch</span>
                        </p>
                    </div>
                </div>
                <div class="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-4 md:gap-5 min-w-0 sm:col-span-2 lg:col-span-1">
                    <div class="w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                        <Receipt :size="24" />
                    </div>
                    <div class="min-w-0">
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gói hiện tại</p>
                        <p class="text-xl md:text-2xl font-black text-amber-600 tracking-tight truncate">PREMIUM</p>
                    </div>
                </div>
            </div>

            <!-- Table & Filters -->
            <div class="bg-white rounded-2xl md:rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">

                <!-- Filter Bar -->
                <div
                    class="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center justify-between bg-slate-50/30">
                    <div class="relative flex-1 w-full md:max-w-md">
                        <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
                        <input v-model="searchQuery" type="text" placeholder="Tìm theo mã đơn hàng hoặc giao dịch..."
                            class="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 rounded-2xl transition-all text-sm font-bold outline-none shadow-sm" />
                    </div>

                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <div
                            class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm w-full md:w-auto">
                            <Filter class="text-slate-400" :size="16" />
                            <select v-model="statusFilter"
                                class="bg-transparent text-xs font-bold outline-none min-w-0 flex-1 md:min-w-[120px]">
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="SUCCESS">Thành công</option>
                                <option value="PENDING">Chờ xử lý</option>
                                <option value="FAILED">Thất bại</option>
                                <option value="EXPIRED">Hết hạn</option>
                                <option value="REFUNDED">Đã hoàn tiền</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Table Content -->
                <div class="relative min-h-[320px] md:min-h-[400px]">
                    <!-- Loading Overlay -->
                    <div v-if="isLoading"
                        class="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                        <div class="flex flex-col items-center gap-3">
                            <div
                                class="w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin">
                            </div>
                            <span class="text-xs font-black text-amber-700 uppercase tracking-widest">Đang tải dữ
                                liệu...</span>
                        </div>
                    </div>

                    <div class="lg:hidden divide-y divide-slate-100">
                        <div v-for="payment in filteredPayments" :key="payment.paymentId"
                            class="p-4 space-y-4 hover:bg-amber-50/30 transition-colors">
                            <div class="flex items-start justify-between gap-3">
                                <div class="min-w-0">
                                    <p class="font-black text-slate-900 text-sm truncate">#{{ payment.merchantTransactionId }}</p>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate">
                                        {{ payment.planName }}
                                    </p>
                                </div>
                                <div class="inline-flex shrink-0 items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest"
                                    :class="getStatusConfig(payment.status).color">
                                    <component :is="getStatusConfig(payment.status).icon" :size="11" />
                                    {{ getStatusConfig(payment.status).label }}
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Số tiền</p>
                                    <p class="mt-1 font-black text-slate-900">{{ formatMoney(payment.amount) }}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phương thức</p>
                                    <p class="mt-1 font-black text-slate-900">{{ payment.bankCode || '---' }}</p>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase">{{ payment.provider }}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày tạo</p>
                                    <p class="mt-1 font-bold text-slate-700">{{ formatDate(payment.createdAt) }}</p>
                                </div>
                                <div>
                                    <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thanh toán</p>
                                    <p class="mt-1 font-bold text-slate-700">{{ payment.paidAt ? formatDate(payment.paidAt) : '---' }}</p>
                                </div>
                            </div>
                        </div>

                        <div v-if="filteredPayments.length === 0 && !isLoading" class="px-4 py-14 text-center">
                            <div class="flex flex-col items-center gap-4">
                                <div
                                    class="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                    <Search :size="28" />
                                </div>
                                <div>
                                    <p class="text-sm font-black text-slate-900 uppercase tracking-widest">Không tìm thấy giao dịch</p>
                                    <p class="text-xs text-slate-400 font-medium mt-1">Hãy thử thay đổi từ khóa hoặc bộ lọc.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="hidden lg:block overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr
                                class="bg-slate-50/50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-black tracking-[0.1em]">
                                <th class="px-8 py-5">Giao dịch</th>
                                <th class="px-8 py-5">Số tiền</th>
                                <th class="px-8 py-5">Phương thức</th>
                                <th class="px-8 py-5">Trạng thái</th>
                                <th class="px-8 py-5">Thời gian tạo</th>
                                <th class="px-8 py-5 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50">
                            <tr v-for="payment in filteredPayments" :key="payment.paymentId"
                                class="group hover:bg-amber-50/30 transition-colors">
                                <td class="px-8 py-5">
                                    <div class="flex flex-col">
                                        <span class="font-black text-slate-900 text-sm tracking-tight">#{{
                                            payment.merchantTransactionId }}</span>
                                        <span
                                            class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{{
                                                payment.planName }}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5">
                                    <div class="flex items-baseline gap-1">
                                        <span
                                            class="font-black text-slate-900 text-base tracking-tight">{{ formatMoney(payment.amount) }}</span>
                                        <span class="text-[10px] font-bold text-slate-400">{{ payment.currency }}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-3">
                                        <div class="p-2 bg-slate-100 rounded-xl group-hover:bg-white transition-colors">
                                            <CreditCard :size="16" class="text-slate-600" />
                                        </div>
                                        <div>
                                            <p class="text-xs font-black text-slate-700 leading-none">
                                                {{ payment.bankCode || '---' }}
                                            </p>
                                            <p
                                                class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                                                {{ payment.provider }}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-8 py-5">
                                    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest"
                                        :class="getStatusConfig(payment.status).color">
                                        <component :is="getStatusConfig(payment.status).icon" :size="12" />
                                        {{ getStatusConfig(payment.status).label }}
                                    </div>
                                </td>
                                <td class="px-8 py-5">
                                    <div class="flex flex-col">
                                        <span
                                            class="text-xs font-black text-slate-700">{{ formatDate(payment.createdAt) }}</span>
                                        <span
                                            class="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">Thanh
                                            toán: {{ payment.paidAt ? formatDate(payment.paidAt) : '---' }}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5 text-right">
                                    <button
                                        class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-100/50 rounded-xl transition-all active:scale-90"
                                        title="Chi tiết">
                                        <ExternalLink :size="18" />
                                    </button>
                                </td>
                            </tr>

                            <!-- Empty State -->
                            <tr v-if="filteredPayments.length === 0 && !isLoading">
                                <td colspan="6" class="px-8 py-20 text-center">
                                    <div class="flex flex-col items-center gap-4">
                                        <div
                                            class="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                            <Search :size="32" />
                                        </div>
                                        <div>
                                            <p class="text-sm font-black text-slate-900 uppercase tracking-widest">Không
                                                tìm thấy giao dịch</p>
                                            <p class="text-xs text-slate-400 font-medium mt-1">Hãy thử thay đổi từ khóa
                                                hoặc bộ lọc của bạn.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                </div>


            </div>

            <AppPagination :page="currentPage" :total-pages="pagination.totalPages" :has-next="hasNextPage"
                :has-prev="hasPrevPage" @next="nextPage" @prev="prevPage" />
        </div>
    </div>
</template>

<style scoped>
/* Table scrollbar */
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

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}

/* Animations */
.animate-in {
    animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
