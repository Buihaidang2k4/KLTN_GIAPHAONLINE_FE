<script setup lang="ts">
import { computed } from 'vue';
import { ShieldCheck, Sparkles, ArrowRight, History, Scroll, Landmark } from 'lucide-vue-next';
import { type SubscriptionPlanRes } from '@/types/family/subscription.types';
import PackageCard from '@/components/family_service/PackageCard.vue';
import { useSubscriptionPlansQuery } from '@/hooks/queries/subscription_plan/useSubscriptionPlan';
import { useRouter } from 'vue-router';
import { useFamilyStore } from '@/store/family/useFamilyStore';
import { useFamilySubscriptionByFamilyQuery } from '@/hooks/queries/family/family_subscription/useFamilySubscription';

const router = useRouter();
const familyStore = useFamilyStore();
const familyId = computed(() => familyStore.currentFamilyId);

const { data: familySubData } = useFamilySubscriptionByFamilyQuery(familyId);
const { data: plansData } = useSubscriptionPlansQuery({ isActive: true });

const safePlan = computed(() => plansData.value?.data?.items || []);
const safeFamilySub = computed(() => familySubData.value?.data || null);

const handleSelectPlan = (plan: SubscriptionPlanRes) => {
    router.push({
        name: 'FamilyPaymentDetails',
        params: {
            planId: plan.subscriptionPlanId
        }
    })
}

</script>

<template>
    <div class="min-h-screen bg-[#fefaf6] text-slate-900 font-sans pb-24 overflow-x-hidden relative">

        <!-- Background Decorations (Subtle) -->
        <div class="absolute inset-0 pointer-events-none opacity-[0.01]">
            <div class="absolute top-20 left-10 rotate-12">
                <Landmark :size="400" />
            </div>
            <div class="absolute bottom-20 right-10 -rotate-12">
                <History :size="400" />
            </div>
        </div>

        <!-- Header Section (Compact) -->
        <header class="relative max-w-6xl mx-auto pt-20 pb-12 px-6 text-center">
            <div
                class="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-200/50 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                <Sparkles :size="12" class="text-amber-600" />
                <span class="text-[9px] font-black text-amber-700 uppercase tracking-widest">Hệ sinh thái dịch vụ</span>
            </div>

            <h1 class="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-5 uppercase">
                Gói dịch vụ <span class="text-amber-600">gia tộc</span>
            </h1>

            <p class="max-w-xl mx-auto text-slate-500 text-xs md:text-sm font-bold leading-relaxed mb-10">
                Dễ dàng bắt đầu, linh hoạt mở rộng để lưu giữ di sản dòng họ vĩnh cửu.
            </p>

            <div
                class="flex flex-wrap items-center justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div class="flex items-center gap-2">
                    <ShieldCheck :size="16" class="text-emerald-500" /> Bảo mật
                </div>
                <div class="flex items-center gap-2">
                    <Scroll :size="16" class="text-blue-500" /> Di sản
                </div>
                <div class="flex items-center gap-2">
                    <History :size="16" class="text-amber-500" /> Truyền thừa
                </div>
            </div>
        </header>

        <!-- Plans Grid (Optimized for multiple items) -->
        <main class="relative max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <PackageCard v-for="plan in safePlan" :key="plan.subscriptionPlanId" :plan="plan"
                :current-family-sub="safeFamilySub" @select="handleSelectPlan" />
        </main>

        <!-- Footer Promo (More compact) -->
        <section class="max-w-6xl mx-auto mt-20 px-6">
            <div class="bg-white border border-slate-200 p-8 rounded-3xl relative overflow-hidden group shadow-sm">
                <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h2 class="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                            Bạn cần giải pháp riêng?
                        </h2>
                        <p class="text-slate-500 text-xs font-bold leading-relaxed max-w-md">
                            Chúng tôi cung cấp các tùy chỉnh đặc biệt về bảo mật và máy chủ riêng cho các dòng họ lớn.
                        </p>
                    </div>

                    <button
                        class="flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-amber-600 transition-all duration-300 active:scale-95">
                        Liên hệ tư vấn
                        <ArrowRight :size="16" />
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
/* Page-specific entrance animations */
main {
    animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slideUpFade {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
