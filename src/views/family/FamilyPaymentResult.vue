<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { CheckCircle, XCircle, LayoutDashboard, Sparkles, TreeDeciduous, ScrollText } from 'lucide-vue-next'
import { computed } from 'vue'
import { usePaymentByTransactionIdQuery } from '@/hooks/queries/payments/usePayments'
import { formatMoney } from '@/utils/format-money'
import { formatDate } from '@/utils/format-date'

const router = useRouter()
const route = useRoute()

const transactionId = computed(() => {
  const value = route.query.transactionId
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
})

// Kiểm tra mã phản hồi (Giả định '00' là thành công)
const responseCode = computed(() => route.query.responseCode)
const isSuccess = computed(() => responseCode.value === '00')

const { data: paymentResultData } = usePaymentByTransactionIdQuery(transactionId)
const safePaymentResultData = computed(() => paymentResultData.value?.data || null)

const goDashboard = () => {
  router.push({ name: 'FamilyService' })
}
</script>

<template>
  <main class="payment-result-wrapper min-h-screen flex items-center justify-center p-4 overflow-hidden relative">
    <div class="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#fed488] opacity-20 blur-[120px] rounded-full"></div>
    <div class="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#d6a47c] opacity-20 blur-[120px] rounded-full">
    </div>

    <TreeDeciduous
      class="absolute top-[15%] left-[10%] w-16 h-16 text-[#775a19] opacity-10 rotate-[-15deg] hidden md:block" />
    <Sparkles
      class="absolute top-[20%] right-[15%] w-12 h-12 text-[#775a19] opacity-10 rotate-[20deg] hidden md:block" />
    <ScrollText
      class="absolute bottom-[20%] left-[15%] w-14 h-14 text-[#775a19] opacity-10 rotate-[10deg] hidden md:block" />
    <TreeDeciduous
      class="absolute bottom-[15%] right-[10%] w-20 h-20 text-[#775a19] opacity-10 rotate-[15deg] hidden md:block" />

    <div class="max-w-xl w-full z-10">
      <div class="bg-white double-border p-6 md:p-10 relative shadow-[0_20px_50px_rgba(58,37,18,0.15)]">
        <div class="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#775a19] opacity-50"></div>
        <div class="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#775a19] opacity-50"></div>
        <div class="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#775a19] opacity-50"></div>
        <div class="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#775a19] opacity-50"></div>

        <div v-if="isSuccess" class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#fed488] border-2 border-[#775a19] mb-4 relative">
            <div class="absolute inset-0 rounded-full animate-ping bg-[#fed488] opacity-20"></div>
            <CheckCircle class="w-10 h-10 text-[#785a1a] relative z-10" />
          </div>
          <h1 class="font-serif text-2xl md:text-3xl text-[#432406] mb-2 font-bold">Thanh toán thành công!</h1>
          <p class="text-base text-[#50453c] max-w-md mx-auto italic font-medium">
            "Cảm ơn bạn đã góp phần gìn giữ cội nguồn và truyền thống gia tộc."
          </p>
        </div>

        <div v-else class="text-center mb-8">
          <div
            class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-100 border-2 border-rose-700 mb-4 relative">
            <div class="absolute inset-0 rounded-full animate-ping bg-rose-200 opacity-30"></div>
            <XCircle class="w-10 h-10 text-rose-700 relative z-10" />
          </div>
          <h1 class="font-serif text-2xl md:text-3xl text-rose-900 mb-2 font-bold">Thanh toán thất bại</h1>
          <p class="text-sm text-slate-500 max-w-md mx-auto font-medium">
            Giao dịch không thành công hoặc đã bị hủy bỏ. Vui lòng kiểm tra lại tài khoản hoặc thử lại sau.
          </p>
        </div>

        <div class="bg-[#f7f4e9] border border-[#d4c3b8] p-5 mb-8 relative group">
          <div
            class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#f7f4e9] px-4 text-[#775a19] text-[10px] font-bold uppercase tracking-widest border border-[#d4c3b8]">
            Chi tiết biên lai
          </div>
          <ul class="space-y-3 mt-1">
            <li class="flex justify-between border-b border-[#d4c3b8] pb-2 border-dashed">
              <span class="text-[#50453c] text-sm">Mã giao dịch</span>
              <span class="text-lg text-[#432406] font-bold">
                {{ safePaymentResultData?.merchantTransactionId || transactionId || 'N/A' }}
              </span>
            </li>
            <li class="flex justify-between border-b border-[#d4c3b8] pb-2 border-dashed">
              <span class="text-[#50453c] text-sm">Dịch vụ</span>
              <span class="text-[#1c1c16] font-medium text-sm">Gói nâng cấp thành viên</span>
            </li>
            <li v-if="safePaymentResultData?.amount"
              class="flex justify-between border-b border-[#d4c3b8] pb-2 border-dashed">
              <span class="text-[#50453c] text-sm">Số tiền</span>
              <span class="text-xl text-[#432406] font-bold">{{ formatMoney(safePaymentResultData?.amount) }}</span>
            </li>
            <li class="flex justify-between pt-1">
              <span class="text-[#50453c] text-sm">Trạng thái</span>
              <span :class="isSuccess ? 'text-emerald-700' : 'text-rose-600'" class="font-bold text-sm">
                {{ isSuccess ? 'Đã hoàn tất' : 'Lỗi giao dịch' }}
              </span>
            </li>
          </ul>
        </div>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button @click="goDashboard"
            class="bg-[#432406] cursor-pointer text-[#ffdea5] flex items-center justify-center gap-2 px-10 py-3 font-bold uppercase tracking-wider hover:bg-[#5d3a1a] transition-all active:scale-95 w-full sm:w-auto min-w-[240px] shadow-lg">
            <LayoutDashboard class="w-5 h-5" />
            Quay lại quản trị
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.payment-result-wrapper {
  background-color: #fcf9ef;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.05"/></svg>');
}

.double-border {
  border: 2px solid #5d4201;
  position: relative;
}

.double-border::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  right: 4px;
  bottom: 4px;
  border: 1px solid #775a19;
  pointer-events: none;
}

h1 {
  font-family: 'EB Garamond', serif;
}
</style>