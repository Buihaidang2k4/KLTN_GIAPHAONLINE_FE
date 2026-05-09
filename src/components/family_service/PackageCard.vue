<script setup lang="ts">
import { Zap, Users, HardDrive, Calendar, Sparkles, ShieldCheck, Crown, Landmark, Check } from 'lucide-vue-next';
import { PlanName, type SubscriptionPlanRes } from '@/types/family/subscription.types';

interface Props {
    plan: SubscriptionPlanRes;
    isPopular?: boolean;
}

const props = defineProps<Props>();
defineEmits(['select']);

const getPlanConfig = (name: PlanName) => {
    switch (name) {
        case PlanName.FREE: 
            return { 
                icon: Calendar, 
                color: 'text-emerald-600', 
                bg: 'bg-emerald-50', 
                border: 'border-emerald-100',
                accent: 'bg-emerald-600',
            };
        case PlanName.BASIC: 
            return { 
                icon: ShieldCheck, 
                color: 'text-blue-600', 
                bg: 'bg-blue-50', 
                border: 'border-blue-100',
                accent: 'bg-blue-600',
            };
        case PlanName.PREMIUM: 
            return { 
                icon: Crown, 
                color: 'text-amber-600', 
                bg: 'bg-amber-50', 
                border: 'border-amber-100',
                accent: 'bg-amber-600',
            };
        case PlanName.ENTERPRISE: 
            return { 
                icon: Landmark, 
                color: 'text-purple-600', 
                bg: 'bg-purple-50', 
                border: 'border-purple-100',
                accent: 'bg-purple-600',
            };
        default: 
            return { 
                icon: Sparkles, 
                color: 'text-slate-600', 
                bg: 'bg-slate-50', 
                border: 'border-slate-200',
                accent: 'bg-slate-600',
            };
    }
};

const config = getPlanConfig(props.plan.namePlan);

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
};
</script>

<template>
    <div class="group relative flex flex-col h-full bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:border-transparent"
        :class="[config.border, isPopular ? 'ring-2 ring-amber-500/20 shadow-lg' : 'shadow-sm']">
        
        <!-- Subtle Pattern -->
        <div class="absolute top-0 right-0 p-4 opacity-[0.03] text-slate-900 pointer-events-none">
            <component :is="config.icon" :size="80" />
        </div>

        <!-- Content -->
        <div class="relative p-6 flex flex-col h-full">
            <!-- Header -->
            <div class="mb-5 flex items-start justify-between">
                <div>
                    <div class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mb-3" :class="[config.bg, config.color]">
                        <component :is="config.icon" :size="10" />
                        <span class="text-[9px] font-black uppercase tracking-widest">{{ plan.namePlan }}</span>
                    </div>
                    <h3 class="text-xl font-black text-slate-900 tracking-tight leading-tight">
                        {{ plan.namePlan }}
                    </h3>
                </div>
                <div v-if="isPopular" class="bg-amber-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg shadow-sm">
                    Hot
                </div>
            </div>

            <p class="text-slate-500 text-[11px] font-medium leading-relaxed mb-6 line-clamp-2">
                {{ plan.description }}
            </p>

            <!-- Price -->
            <div class="mb-6 flex items-baseline gap-1 pt-4 border-t border-slate-50">
                <span class="text-3xl font-black tracking-tighter text-slate-900">
                    {{ formatPrice(plan.price) }}
                </span>
                <span class="text-sm font-bold text-slate-400">đ</span>
                <span class="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-widest">/{{ plan.durationMonth }}th</span>
            </div>

            <!-- Features (Compact) -->
            <div class="space-y-3 flex-grow mb-8">
                <div class="flex items-center gap-2.5">
                    <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0" :class="config.bg">
                        <Check :size="10" :class="config.color" />
                    </div>
                    <span class="text-[11px] font-bold text-slate-700 tracking-tight">{{ plan.maxPerson }} thành viên</span>
                </div>
                <div class="flex items-center gap-2.5">
                    <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0" :class="config.bg">
                        <Check :size="10" :class="config.color" />
                    </div>
                    <span class="text-[11px] font-bold text-slate-700 tracking-tight">{{ plan.maxStorageMb }} MB lưu trữ</span>
                </div>
                <div class="flex items-center gap-2.5">
                    <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0" :class="config.bg">
                        <Check :size="10" :class="config.color" />
                    </div>
                    <span class="text-[11px] font-bold text-slate-700 tracking-tight">Cập nhật vĩnh viễn</span>
                </div>
            </div>

            <!-- CTA -->
            <button @click="$emit('select', plan)"
                class="w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all duration-300 active:scale-[0.98]"
                :class="isPopular
                    ? 'bg-slate-900 text-white hover:bg-amber-600 shadow-md shadow-slate-200'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-900 hover:text-white'">
                {{ plan.price === 0 ? 'Bắt đầu ngay' : 'Đăng ký gói' }}
            </button>
        </div>
    </div>
</template>

<style scoped>
/* Minor refinements */
</style>
