<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
    Search, 
    Filter, 
    Download, 
    CreditCard, 
    CheckCircle2, 
    XCircle, 
    Clock, 
    ArrowUpDown, 
    ChevronLeft, 
    ChevronRight,
    History,
    Receipt,
    ExternalLink,
    Banknote
} from 'lucide-vue-next'

// Types based on PaymentRes
type PaymentStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED'
type PaymentProvider = 'VNPAY' | 'MOMO' | 'STRIPE' | 'BANK_TRANSFER'

interface PaymentRes {
    paymentId: number;
    amount: number;
    currency: string;
    provider: PaymentProvider;
    providerTransactionId: string;
    merchantTransactionId: string;
    status: PaymentStatus;
    bankCode: string;
    paidAt: string;
    createdAt: string;
    failureReason?: string;
}

// Mock Data
const payments = ref<PaymentRes[]>([
    {
        paymentId: 1001,
        amount: 499000,
        currency: 'VNĐ',
        provider: 'VNPAY',
        providerTransactionId: 'VNP12345678',
        merchantTransactionId: 'ORD-99281',
        status: 'SUCCESS',
        bankCode: 'NCB',
        paidAt: '2024-03-20T14:30:00Z',
        createdAt: '2024-03-20T14:25:00Z'
    },
    {
        paymentId: 1002,
        amount: 199000,
        currency: 'VNĐ',
        provider: 'MOMO',
        providerTransactionId: 'MOM8827112',
        merchantTransactionId: 'ORD-99285',
        status: 'SUCCESS',
        bankCode: 'MOMO',
        paidAt: '2024-03-15T09:15:00Z',
        createdAt: '2024-03-15T09:10:00Z'
    },
    {
        paymentId: 1003,
        amount: 999000,
        currency: 'VNĐ',
        provider: 'BANK_TRANSFER',
        providerTransactionId: 'VCB-771822',
        merchantTransactionId: 'ORD-99300',
        status: 'FAILED',
        bankCode: 'VCB',
        paidAt: '',
        createdAt: '2024-03-10T16:45:00Z',
        failureReason: 'Giao dịch bị hủy bởi người dùng'
    },
    {
        paymentId: 1004,
        amount: 499000,
        currency: 'VNĐ',
        provider: 'VNPAY',
        providerTransactionId: '',
        merchantTransactionId: 'ORD-99310',
        status: 'PENDING',
        bankCode: 'BIDV',
        paidAt: '',
        createdAt: '2024-03-05T10:00:00Z'
    }
])

const isLoading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('ALL')

const filteredPayments = computed(() => {
    return payments.value.filter(p => {
        const matchesSearch = p.merchantTransactionId.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                             p.providerTransactionId.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesStatus = statusFilter.value === 'ALL' || p.status === statusFilter.value
        return matchesSearch && matchesStatus
    })
})

const getStatusConfig = (status: PaymentStatus) => {
    switch (status) {
        case 'SUCCESS': return { label: 'Thành công', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' }
        case 'FAILED': return { label: 'Thất bại', icon: XCircle, color: 'text-red-600 bg-red-50 border-red-100' }
        case 'PENDING': return { label: 'Chờ xử lý', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-100' }
        case 'REFUNDED': return { label: 'Đã hoàn tiền', icon: Receipt, color: 'text-slate-600 bg-slate-50 border-slate-100' }
    }
}

const formatDate = (dateStr: string) => {
    if (!dateStr) return '---'
    return new Date(dateStr).toLocaleString('vi-VN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    })
}

const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount)
}

</script>

<template>
    <div class="min-h-screen bg-[#fefaf6] p-6 md:p-8 font-sans">
        <div class="max-w-7xl mx-auto space-y-8">
            
            <!-- Header Section -->
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div class="space-y-2">
                    <div class="inline-flex items-center gap-2 px-3 py-1 bg-amber-100/50 rounded-full border border-amber-200/50">
                        <Banknote :size="12" class="text-amber-600" />
                        <span class="text-[10px] font-black text-amber-700 uppercase tracking-widest">Quản lý tài chính</span>
                    </div>
                    <h1 class="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <History :size="32" class="text-amber-600" />
                        Lịch sử thanh toán
                    </h1>
                    <p class="text-slate-500 text-sm font-medium">Theo dõi và quản lý tất cả các giao dịch nâng cấp gói dịch vụ của gia đình.</p>
                </div>

                <div class="flex items-center gap-3">
                    <button class="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold text-xs hover:bg-slate-50 transition-all shadow-sm active:scale-95">
                        <Download :size="16" />
                        Xuất báo cáo
                    </button>
                </div>
            </div>

            <!-- Stats Overview -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-5">
                    <div class="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CheckCircle2 :size="28" />
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng chi tiêu</p>
                        <p class="text-2xl font-black text-slate-900 tracking-tight">1.697.000 <span class="text-sm font-bold text-slate-400">đ</span></p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-5">
                    <div class="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <CreditCard :size="28" />
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Giao dịch tháng này</p>
                        <p class="text-2xl font-black text-slate-900 tracking-tight">02 <span class="text-sm font-bold text-slate-400">giao dịch</span></p>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm flex items-center gap-5">
                    <div class="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                        <Receipt :size="28" />
                    </div>
                    <div>
                        <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gói hiện tại</p>
                        <p class="text-2xl font-black text-amber-600 tracking-tight">PREMIUM</p>
                    </div>
                </div>
            </div>

            <!-- Table & Filters -->
            <div class="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-sm overflow-hidden flex flex-col">
                
                <!-- Filter Bar -->
                <div class="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
                    <div class="relative flex-1 w-full max-w-md">
                        <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
                        <input v-model="searchQuery" type="text" placeholder="Tìm theo mã đơn hàng hoặc giao dịch..."
                            class="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 rounded-2xl transition-all text-sm font-bold outline-none shadow-sm" />
                    </div>
                    
                    <div class="flex items-center gap-3 w-full md:w-auto">
                        <div class="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
                            <Filter class="text-slate-400" :size="16" />
                            <select v-model="statusFilter" class="bg-transparent text-xs font-bold outline-none min-w-[120px]">
                                <option value="ALL">Tất cả trạng thái</option>
                                <option value="SUCCESS">Thành công</option>
                                <option value="PENDING">Chờ xử lý</option>
                                <option value="FAILED">Thất bại</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Table Content -->
                <div class="overflow-x-auto relative min-h-[400px]">
                    <!-- Loading Overlay -->
                    <div v-if="isLoading" class="absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px] flex items-center justify-center">
                        <div class="flex flex-col items-center gap-3">
                            <div class="w-10 h-10 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin"></div>
                            <span class="text-xs font-black text-amber-700 uppercase tracking-widest">Đang tải dữ liệu...</span>
                        </div>
                    </div>

                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-slate-50/50 border-b border-slate-100 text-slate-400 uppercase text-[10px] font-black tracking-[0.1em]">
                                <th class="px-8 py-5">Giao dịch</th>
                                <th class="px-8 py-5">Số tiền</th>
                                <th class="px-8 py-5">Phương thức</th>
                                <th class="px-8 py-5">Trạng thái</th>
                                <th class="px-8 py-5">Thời gian</th>
                                <th class="px-8 py-5 text-right">Hành động</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50">
                            <tr v-for="payment in filteredPayments" :key="payment.paymentId" class="group hover:bg-amber-50/30 transition-colors">
                                <td class="px-8 py-5">
                                    <div class="flex flex-col">
                                        <span class="font-black text-slate-900 text-sm tracking-tight">#{{ payment.merchantTransactionId }}</span>
                                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {{ payment.providerTransactionId || '---' }}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5">
                                    <div class="flex items-baseline gap-1">
                                        <span class="font-black text-slate-900 text-base tracking-tight">{{ formatAmount(payment.amount) }}</span>
                                        <span class="text-[10px] font-bold text-slate-400">{{ payment.currency }}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5">
                                    <div class="flex items-center gap-3">
                                        <div class="p-2 bg-slate-100 rounded-xl group-hover:bg-white transition-colors">
                                            <CreditCard :size="16" class="text-slate-600" />
                                        </div>
                                        <div>
                                            <p class="text-xs font-black text-slate-700 leading-none">{{ payment.provider }}</p>
                                            <p class="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{{ payment.bankCode }}</p>
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
                                        <span class="text-xs font-black text-slate-700">{{ formatDate(payment.paidAt || payment.createdAt) }}</span>
                                        <span class="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">Ngày tạo: {{ formatDate(payment.createdAt) }}</span>
                                    </div>
                                </td>
                                <td class="px-8 py-5 text-right">
                                    <button class="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-100/50 rounded-xl transition-all active:scale-90" title="Chi tiết">
                                        <ExternalLink :size="18" />
                                    </button>
                                </td>
                            </tr>

                            <!-- Empty State -->
                            <tr v-if="filteredPayments.length === 0 && !isLoading">
                                <td colspan="6" class="px-8 py-20 text-center">
                                    <div class="flex flex-col items-center gap-4">
                                        <div class="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                            <Search :size="32" />
                                        </div>
                                        <div>
                                            <p class="text-sm font-black text-slate-900 uppercase tracking-widest">Không tìm thấy giao dịch</p>
                                            <p class="text-xs text-slate-400 font-medium mt-1">Hãy thử thay đổi từ khóa hoặc bộ lọc của bạn.</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Pagination Footer -->
                <div class="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/10">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                        Hiển thị <span class="text-slate-900">{{ filteredPayments.length }}</span> / <span class="text-slate-900">{{ payments.length }}</span> giao dịch
                    </p>
                    <div class="flex items-center gap-2">
                        <button class="p-2 border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-amber-600 transition-all disabled:opacity-30 active:scale-90" disabled>
                            <ChevronLeft :size="18" />
                        </button>
                        <div class="flex items-center gap-1">
                            <button class="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 text-white text-xs font-black shadow-lg">1</button>
                            <button class="w-9 h-9 flex items-center justify-center rounded-xl bg-white text-slate-500 text-xs font-black hover:bg-slate-100 transition-all">2</button>
                        </div>
                        <button class="p-2 border border-slate-200 rounded-xl bg-white text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <ChevronRight :size="18" />
                        </button>
                    </div>
                </div>
            </div>
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
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>