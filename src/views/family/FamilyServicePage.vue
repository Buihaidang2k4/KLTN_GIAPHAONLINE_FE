<script setup lang="ts">
import { ref } from 'vue';
import { BookOpen, ShieldCheck, Sparkles, ArrowRight } from 'lucide-vue-next';
import { PlanName, type SubscriptionPlanRes } from '@/types/family/subscription.types';
import PackageCard from '@/components/family_service/PackageCard.vue';

const MOCK_PLANS: SubscriptionPlanRes[] = [
    {
        subscriptionPlanId: 1,
        namePlan: PlanName.FREE,
        code: 'FREE_01',
        description: 'Bản miễn phí dành cho gia đình bắt đầu tìm hiểu về cội nguồn.',
        price: 0,
        currency: 'VNĐ',
        maxPerson: 20,
        maxStorageMb: 50,
        durationMonth: 12,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        subscriptionPlanId: 2,
        namePlan: PlanName.BASIC,
        code: 'BASIC_01',
        description: 'Phù hợp cho gia đình nhỏ muốn lưu trữ đầy đủ kỷ niệm.',
        price: 199000,
        currency: 'VNĐ',
        maxPerson: 100,
        maxStorageMb: 512,
        durationMonth: 12,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        subscriptionPlanId: 3,
        namePlan: PlanName.PREMIUM,
        code: 'PREMIUM_01',
        description: 'Giải pháp tối ưu cho dòng tộc lớn với không gian lưu trữ không giới hạn.',
        price: 499000,
        currency: 'VNĐ',
        maxPerson: 500,
        maxStorageMb: 2048,
        durationMonth: 12,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        subscriptionPlanId: 4,
        namePlan: PlanName.ENTERPRISE,
        code: 'ENT_01',
        description: 'Dành cho các dòng họ có nhu cầu tùy chỉnh đặc biệt và bảo mật cao.',
        price: 999000,
        currency: 'VNĐ',
        maxPerson: 2000,
        maxStorageMb: 10240,
        durationMonth: 12,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

const plans = ref<SubscriptionPlanRes[]>(MOCK_PLANS);

const handleSelectPlan = (plan: SubscriptionPlanRes) => {
    console.log('Selected plan:', plan.namePlan);
    alert(`Cảm ơn bạn đã quan tâm đến gói ${plan.namePlan}!`);
};
</script>

<template>
    <div class="min-h-screen bg-[#fbfaf5] text-slate-900 selection:bg-slate-200 mb-16 px-4 sm:px-6">
        <!-- Header Section -->
        <header class="max-w-6xl mx-auto pt-16 pb-12 text-center">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 mb-6">
                <Sparkles class="w-4 h-4 text-slate-500" />
                <span class="text-[10px] font-semibold text-slate-600 uppercase tracking-[0.24em]">Dịch vụ gia
                    phả</span>
            </div>

            <h1 class="text-4xl md:text-5xl font-semibold tracking-tight leading-tight mb-5">
                Chọn gói dịch vụ phù hợp
            </h1>

            <p class="max-w-2xl mx-auto text-slate-600 text-base leading-7 mb-8">
                Các gói được thiết kế để gia đình dễ bắt đầu, dễ mở rộng và giữ mọi thông tin gia phả ở một nơi rõ ràng.
            </p>

            <div
                class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
                <div class="flex items-center gap-3">
                    <ShieldCheck class="w-4 h-4 text-slate-500" /> Bảo mật rõ ràng
                </div>
                <div class="flex items-center gap-3">
                    <BookOpen class="w-4 h-4 text-slate-500" /> Dễ sử dụng
                </div>
            </div>
        </header>

        <!-- Plans Grid -->
        <main class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <PackageCard v-for="plan in plans" :key="plan.subscriptionPlanId" :plan="plan"
                :isPopular="plan.namePlan === PlanName.PREMIUM" @select="handleSelectPlan" />
        </main>

        <!-- Footer Promo -->
        <section class="max-w-6xl mx-auto mt-14 p-8 md:p-10 bg-white rounded-3xl border border-slate-200">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div class="max-w-md text-center md:text-left">
                    <h2 class="text-2xl font-semibold text-slate-900 mb-3">Bạn cần gói tùy chỉnh?</h2>
                    <p class="text-slate-600 leading-7">
                        Nếu dòng họ có quy mô lớn hoặc cần quy trình riêng, có thể liên hệ để được tư vấn gói phù hợp.
                    </p>
                </div>
                <button
                    class="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl border border-slate-300 bg-slate-900 text-white font-semibold text-[11px] uppercase tracking-[0.18em] hover:bg-slate-800 transition-colors">
                    Liên hệ tư vấn
                    <ArrowRight class="w-4 h-4" />
                </button>
            </div>
        </section>
    </div>
</template>

<style scoped>
/* Any view-specific minor styles */
</style>
