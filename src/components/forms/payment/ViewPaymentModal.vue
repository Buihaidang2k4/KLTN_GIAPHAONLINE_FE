<script setup lang="ts">
import { type PaymentRes } from '@/types/payment/payment.types'
import { X, Sparkles, Receipt, Calendar, CreditCard, User, Landmark, ShieldCheck, AlertCircle } from 'lucide-vue-next'
import { formatMoney } from '@/utils/format-money'
import { formatDate } from '@/utils/format-date'

defineProps<{
    show: boolean
    payment: PaymentRes | null
}>()

const emit = defineEmits<{
    close: []
}>()

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'SUCCESS':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
        case 'FAILED':
            return 'bg-rose-50 text-rose-700 border-rose-200/50'
        case 'PENDING':
            return 'bg-amber-50 text-amber-700 border-amber-200/50'
        case 'EXPIRED':
            return 'bg-slate-50 text-slate-600 border-slate-200/50'
        case 'REFUNDED':
            return 'bg-blue-50 text-blue-700 border-blue-200/50'
        default:
            return 'bg-slate-50 text-slate-600 border-slate-200/50'
    }
}

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'SUCCESS':
            return 'Thành công'
        case 'FAILED':
            return 'Thất bại'
        case 'PENDING':
            return 'Đang xử lý'
        case 'EXPIRED':
            return 'Đã hết hạn'
        case 'REFUNDED':
            return 'Đã hoàn tiền'
        default:
            return status
    }
}
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="emit('close')"></div>

                <!-- Modal Container -->
                <div class="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-[#fefaf6] shadow-2xl border border-indigo-200/30 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                    
                    <!-- Header Section -->
                    <div class="relative px-6 pt-8 pb-4 text-center border-b border-indigo-100/10">
                        <div class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Chi tiết Log Giao dịch</span>
                        </div>
                        <h2 class="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                            <Receipt class="w-6 h-6 text-amber-600" />
                            Chi tiết Hóa đơn #{{ payment?.paymentId }}
                        </h2>
                        
                        <button @click="emit('close')" type="button"
                            class="absolute top-5 right-5 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="18" />
                        </button>
                    </div>

                    <!-- Content -->
                    <div class="p-6 overflow-y-auto space-y-5 text-sm text-slate-600">
                        <div v-if="payment" class="space-y-4">
                            <!-- Status & Money -->
                            <div class="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center space-y-2">
                                <div :class="['px-3 py-1 rounded-full text-xs font-black uppercase border flex items-center gap-1.5', getStatusStyle(payment.status)]">
                                    <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                                    {{ getStatusLabel(payment.status) }}
                                </div>
                                <div class="text-2xl font-black text-slate-800">
                                    {{ formatMoney(payment.amount, payment.currency) }}
                                </div>
                                <p class="text-xs text-slate-400 font-medium">
                                    Gói dịch vụ: <span class="font-bold text-slate-700">{{ payment.planName }}</span>
                                </p>
                            </div>

                            <!-- Failure Reason if present -->
                            <div v-if="payment.failureReason" class="p-3.5 bg-rose-50 text-rose-800 rounded-xl border border-rose-100/50 flex items-start gap-2.5">
                                <AlertCircle class="w-4 h-4 mt-0.5 shrink-0" />
                                <div>
                                    <h4 class="text-xs font-black uppercase tracking-wider">Lý do thất bại</h4>
                                    <p class="text-xs mt-0.5 font-medium">{{ payment.failureReason }}</p>
                                </div>
                            </div>

                            <!-- Transaction Details -->
                            <div class="space-y-3">
                                <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                                    Thông tin giao dịch
                                </h3>

                                <div class="grid grid-cols-2 gap-y-3.5 text-xs font-semibold">
                                    <!-- Cổng thanh toán -->
                                    <div>
                                        <p class="text-slate-400">Phương thức</p>
                                        <div class="flex items-center gap-1.5 text-slate-700 mt-0.5">
                                            <CreditCard class="w-3.5 h-3.5 text-slate-400" />
                                            {{ payment.provider }} ({{ payment.bankCode || 'N/A' }})
                                        </div>
                                    </div>

                                    <!-- Ngày tạo -->
                                    <div>
                                        <p class="text-slate-400">Thời gian khởi tạo</p>
                                        <div class="flex items-center gap-1.5 text-slate-700 mt-0.5">
                                            <Calendar class="w-3.5 h-3.5 text-slate-400" />
                                            {{ formatDate(payment.createdAt) }}
                                        </div>
                                    </div>

                                    <!-- Ngày thanh toán -->
                                    <div v-if="payment.paidAt">
                                        <p class="text-slate-400">Thời gian thanh toán</p>
                                        <div class="flex items-center gap-1.5 text-slate-700 mt-0.5">
                                            <ShieldCheck class="w-3.5 h-3.5 text-emerald-500" />
                                            {{ formatDate(payment.paidAt) }}
                                        </div>
                                    </div>

                                    <!-- Merchant Tx ID -->
                                    <div class="col-span-2">
                                        <p class="text-slate-400">Mã đơn hàng (Merchant Transaction ID)</p>
                                        <p class="font-mono text-slate-700 mt-0.5 select-all bg-slate-100/70 p-1.5 rounded border border-slate-200/50 break-all text-[11px]">
                                            {{ payment.merchantTransactionId }}
                                        </p>
                                    </div>

                                    <!-- Provider Tx ID -->
                                    <div v-if="payment.providerTransactionId" class="col-span-2">
                                        <p class="text-slate-400">Mã giao dịch cổng (Provider Transaction ID)</p>
                                        <p class="font-mono text-slate-700 mt-0.5 select-all bg-slate-100/70 p-1.5 rounded border border-slate-200/50 break-all text-[11px]">
                                            {{ payment.providerTransactionId }}
                                        </p>
                                    </div>

                                    <!-- Bank Tran No -->
                                    <div v-if="payment.bankTransactionNo" class="col-span-2">
                                        <p class="text-slate-400">Số GD ngân hàng (Bank Transaction No)</p>
                                        <p class="font-mono text-slate-700 mt-0.5 select-all bg-slate-100/70 p-1.5 rounded border border-slate-200/50 break-all text-[11px]">
                                            {{ payment.bankTransactionNo }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- System Relations -->
                            <div class="space-y-3">
                                <h3 class="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                                    Thông tin Hệ thống
                                </h3>

                                <div class="grid grid-cols-2 gap-y-3.5 text-xs font-semibold">
                                    <!-- Account ID -->
                                    <div>
                                        <p class="text-slate-400">Mã tài khoản (User)</p>
                                        <div class="flex items-center gap-1.5 text-slate-700 mt-0.5">
                                            <User class="w-3.5 h-3.5 text-slate-400" />
                                            ID: {{ payment.accountId }}
                                        </div>
                                    </div>

                                    <!-- Family ID -->
                                    <div>
                                        <p class="text-slate-400">Mã Gia tộc (Family)</p>
                                        <div class="flex items-center gap-1.5 text-slate-700 mt-0.5">
                                            <Landmark class="w-3.5 h-3.5 text-slate-400" />
                                            ID: {{ payment.familyId }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer Section -->
                    <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                        <button @click="emit('close')" type="button"
                            class="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-all shadow-sm active:scale-95 text-xs">
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>
