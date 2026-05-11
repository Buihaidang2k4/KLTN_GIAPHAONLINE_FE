<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
    ChevronLeft,
    Shield,
    CheckCircle2,
    UserCog,
    Mail,
    Phone,
    MapPin,
    Wallet,
} from 'lucide-vue-next'
import { useMyInfoQuery } from '@/hooks/queries/account/useAccount'
import type { AccountDetailsRes } from '@/types/account/account.types'
import { formatDate } from '@/utils/format-date'
import { formatMoney } from '@/utils/format-money'
import { useSubscriptionPlanQuery } from '@/hooks/queries/subscription_plan/useSubscriptionPlan'
import { useCreateVnpayPaymentMutation } from '@/hooks/queries/vnpay/useVnpay'
import { useFamilyStore } from '@/store/family/useFamilyStore'
import { notify } from '@/utils/notify'

// get param
const route = useRoute()
// redirect
const router = useRouter()

const familyStore = useFamilyStore();
const planId = computed(() => Number(route.params.planId));
const { data: subscriptionPlanData } = useSubscriptionPlanQuery(planId.value);
const { data: accountData } = useMyInfoQuery();
const { mutateAsync: createPaymentVnpayUrl } = useCreateVnpayPaymentMutation();



// handle
const familyId = computed(() => familyStore.currentFamilyId);
const safeSubscriptionPlan = computed(() => subscriptionPlanData.value?.data);
const safeAccount = computed<AccountDetailsRes>(() => {
    return accountData.value?.data ?? {} as AccountDetailsRes;
});

const invoice = computed(() => ({
    companyName: 'Gia Phả Online',
    companySlogan: 'Gìn giữ cội nguồn, nối truyền đại tộc',
    companyEmail: 'giaphaOnline.edu',
    companyAddress: '123 Lê Lợi, Quận Hải Châu, Thành phố Hà Nội',
    companyPhone: '0123 456 789',

    customerName: safeAccount.value.fullName,
    customerEmail: safeAccount.value.email,
    customerPhone: safeAccount.value.phoneNumber,

    planName: safeSubscriptionPlan.value?.namePlan,
    planCode: safeSubscriptionPlan.value?.code,
    maxPerson: safeSubscriptionPlan.value?.maxPerson,
    maxAdmin: safeSubscriptionPlan.value?.maxAdmin,
    maxStorageMb: safeSubscriptionPlan.value?.maxStorageMb,
    durationMonth: safeSubscriptionPlan.value?.durationMonth,
    startDate: formatDate(new Date()),
    endDate: formatDate(new Date()),

    amount: formatMoney(safeSubscriptionPlan.value?.price),
    discount: 0,
    total: formatMoney(safeSubscriptionPlan.value?.price),
    currency: safeSubscriptionPlan.value?.currency
}))


const handleBack = () => {
    router.push({ name: 'FamilyService' })
}


const hanldePayment = async () => {
    if (!familyId.value) {
        notify.error('Thông báo', 'Không tìm thấy gia đình hiện tại')
        return
    }

    if (!planId.value) {
        notify.error('Thông báo', 'Không tìm thấy gói thanh toán')
        return
    }

    const res = await createPaymentVnpayUrl({
        familyId: familyId.value,
        subscriptionPlanId: planId.value,
        bankCode: "NCB"
    });

    if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
    }
}

</script>

<template>
    <div class="service-details min-h-screen bg-[#fcf9ef] p-6 md:p-10">
        <div class="max-w-[1200px] mx-auto">

            <!-- Title -->
            <div class="mb-10">
                <button @click="handleBack"
                    class="flex items-center gap-1.5 cursor-pointer text-[#50453c] hover:text-[#775a19] transition-colors text-sm font-medium mb-4 group">
                    <ChevronLeft :size="16" class="group-hover:-translate-x-0.5 transition-transform" />
                    Quay lại dịch vụ
                </button>
                <h1 class="font-serif text-[32px] font-semibold text-[#432406] leading-[40px] tracking-tight">
                    Thông tin thanh toán
                </h1>
                <div class="h-1 w-24 bg-[#775a19] mt-2"></div>
            </div>

            <!-- Invoice Card -->
            <div
                class="invoice-card bg-white border border-[#432406]/20 rounded-lg p-10 md:p-16 relative overflow-hidden shadow-sm">

                <!-- Decorative Corners -->
                <div
                    class="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-[#775a19] opacity-30 rounded-tl-lg">
                </div>
                <div
                    class="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-[#775a19] opacity-30 rounded-br-lg">
                </div>

                <!-- Card Header -->
                <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
                    <div class="flex items-center gap-4">
                        <div
                            class="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#432406] to-[#775a19] flex items-center justify-center text-[#e9c176] shadow-lg">
                            <Shield :size="48" />
                        </div>
                        <div>
                            <h2 class="font-serif text-[24px] font-medium text-[#432406] leading-[32px]">
                                {{ invoice.companyName }}
                            </h2>
                            <p class="text-sm text-[#50453c] italic mt-0.5">{{ invoice.companySlogan }}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-xs font-semibold text-[#50453c] uppercase tracking-[0.05em] mb-1">Ngày bắt đầu
                        </p>
                        <p class="font-serif text-xl font-medium text-[#432406]">{{ invoice.startDate }}</p>
                    </div>
                </div>

                <!-- Info Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                    <!-- Provider -->
                    <div class="space-y-3">
                        <h3
                            class="text-xs font-semibold text-[#775a19] uppercase tracking-[0.05em] border-b border-[#d4c3b8] pb-2">
                            Nhà cung cấp dịch vụ
                        </h3>
                        <div class="space-y-2">
                            <p class="font-bold text-[#432406] text-base">Công ty GiaPhaOnline</p>
                            <p class="text-[#50453c] text-sm flex items-center gap-2">
                                <Mail :size="14" class="text-[#775a19]/50 shrink-0" />
                                Email: {{ invoice.companyEmail }}
                            </p>
                            <p class="text-[#50453c] text-sm flex items-center gap-2">
                                <MapPin :size="14" class="text-[#775a19]/50 shrink-0" />
                                {{ invoice.companyAddress }}
                            </p>
                            <p class="text-[#50453c] text-sm flex items-center gap-2">
                                <Phone :size="14" class="text-[#775a19]/50 shrink-0" />
                                SĐT: {{ invoice.companyPhone }}
                            </p>
                        </div>
                    </div>

                    <!-- Customer -->
                    <div class="space-y-3">
                        <h3
                            class="text-xs font-semibold text-[#775a19] uppercase tracking-[0.05em] border-b border-[#d4c3b8] pb-2">
                            Thông tin khách hàng
                        </h3>
                        <div class="space-y-2">
                            <p class="font-bold text-[#432406] text-base">Họ và tên: {{ invoice.customerName }}</p>
                            <p class="text-[#50453c] text-sm flex items-center gap-2">
                                Email: {{ invoice.customerEmail }}
                            </p>
                            <p class="text-[#50453c] text-sm flex items-center gap-2">
                                SĐT: {{ invoice.customerPhone }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Order Table -->
                <div class="overflow-x-auto mb-10">
                    <table class="w-full border-collapse">
                        <thead>
                            <tr class="bg-[#ebe8de] border-t-2 border-b-2 border-[#432406]/20">
                                <th
                                    class="px-4 py-3 text-left text-xs font-semibold text-[#432406] uppercase tracking-[0.05em]">
                                    Nâng cấp Dịch vụ</th>
                                <th
                                    class="px-4 py-3 text-center text-xs font-semibold text-[#432406] uppercase tracking-[0.05em]">
                                    Thời gian</th>
                                <th
                                    class="px-4 py-3 text-right text-xs font-semibold text-[#432406] uppercase tracking-[0.05em]">
                                    Phí nâng cấp</th>
                                <th
                                    class="px-4 py-3 text-right text-xs font-semibold text-[#432406] uppercase tracking-[0.05em]">
                                    Chiết khấu</th>
                                <th
                                    class="px-4 py-3 text-right text-xs font-semibold text-[#432406] uppercase tracking-[0.05em]">
                                    Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="border-b border-[#d4c3b8]/30 hover:bg-[#f7f4e9] transition-colors">
                                <td class="px-4 py-6 align-top">
                                    <p class="font-serif text-xl font-bold text-[#432406] mb-2">{{ invoice.planName }}
                                    </p>
                                    <ul class="text-[#50453c] text-sm space-y-1.5">
                                        <li class="flex items-center gap-2">
                                            <CheckCircle2 :size="14" class="text-[#775a19]/60" />
                                            {{ invoice.maxPerson }} thành viên
                                        </li>
                                        <li class="flex items-center gap-2">
                                            <CheckCircle2 :size="14" class="text-[#775a19]/60" />
                                            {{ invoice.maxAdmin }} người quản lý
                                        </li>
                                        <li class="flex items-center gap-2">
                                            <CheckCircle2 :size="14" class="text-[#775a19]/60" />
                                            {{ (invoice.maxStorageMb / 1024).toFixed(0) }}GB dung lượng lưu trữ
                                        </li>
                                    </ul>
                                </td>
                                <td class="px-4 py-6 align-top text-center text-[#50453c] text-base italic">
                                    {{ invoice.startDate }} –<br />{{ invoice.endDate }}
                                </td>
                                <td class="px-4 py-6 align-top text-right">
                                    <span class="font-serif text-xl text-[#50453c]">{{ invoice.amount }}</span>
                                </td>
                                <td class="px-4 py-6 align-top text-right">
                                    <span class="font-serif text-xl text-[#50453c]">{{ invoice.discount }}</span>
                                </td>
                                <td class="px-4 py-6 align-top text-right">
                                    <span class="font-serif text-[24px] font-bold text-[#432406]">
                                        {{ invoice.total }} {{ invoice.currency }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Footer: Note + CTA -->
                <div
                    class="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-[#d4c3b8] pt-10 mt-6">
                    <p class="text-[#50453c] text-sm italic max-w-md text-center md:text-left">
                        <span class="font-bold text-[#432406] not-italic">Lưu ý:</span>
                        Quý khách vui lòng liên hệ Gia Phả Đại Việt để nhận hóa đơn. Xin cảm ơn quý khách!
                    </p>
                    <button @click="hanldePayment"
                        class="flex items-center gap-2 px-10 py-4 bg-[#432406] cursor-pointer text-[#e9c176] font-bold uppercase tracking-[0.05em] text-sm hover:bg-[#432406]/90 transition-all active:scale-95 shadow-md">
                        <Wallet :size="20" />
                        Tiến hành thanh toán
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Be+Vietnam+Pro:wght@300;400;500;600;700;800&display=swap');

.service-details {
    font-family: 'Be Vietnam Pro', sans-serif;
}

.font-serif {
    font-family: 'EB Garamond', Georgia, serif;
}

/* Scrollbar styling for table */
.overflow-x-auto::-webkit-scrollbar {
    height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background: #d4c3b8;
    border-radius: 10px;
}
</style>
