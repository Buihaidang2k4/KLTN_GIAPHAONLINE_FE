<script setup lang="ts">
import { Zap, Users, HardDrive, Calendar } from 'lucide-vue-next';
import { SubscriptionPlan, PlanName } from '@/types/subscription/subscription';

interface Props {
    plan: SubscriptionPlan;
    isPopular?: boolean;
}

defineProps<Props>();
defineEmits(['select']);

const getPlanIcon = (name: PlanName) => {
    switch (name) {
        case PlanName.FREE: return Calendar;
        case PlanName.BASIC: return Users;
        case PlanName.PREMIUM: return Zap;
        case PlanName.ENTERPRISE: return HardDrive;
        default: return Calendar;
    }
};

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
};
</script>

<template>
    <div class="relative bg-white rounded-3xl p-6 border border-slate-200 transition-colors flex flex-col h-full"
        :class="{ 'border-slate-900': isPopular }">
        <!-- Popular Badge -->
        <div v-if="isPopular" class="absolute top-4 right-4">
            <div
                class="bg-slate-900 text-white text-[10px] font-semibold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full">
                Đề xuất
            </div>
        </div>

        <!-- Header -->
        <div class="mb-8 pr-20">
            <div
                class="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 mb-5">
                <component :is="getPlanIcon(plan.namePlan)" class="w-5 h-5" />
            </div>
            <h3 class="text-2xl font-semibold text-slate-900 mb-2 tracking-tight">
                {{ plan.namePlan }}
            </h3>
            <p class="text-slate-600 text-sm leading-6">
                {{ plan.description }}
            </p>
        </div>

        <!-- Price -->
        <div class="mb-8 flex items-end gap-2 border-t border-slate-100 pt-6">
            <span class="text-4xl font-semibold tracking-tight text-slate-900 leading-none">
                {{ formatPrice(plan.price) }}
            </span>
            <span class="text-xs font-medium text-slate-500 uppercase tracking-[0.16em] pb-1">
                {{ plan.currency }}/{{ plan.durationMonth }}th
            </span>
        </div>

        <!-- Features -->
        <ul class="space-y-4 mb-8 flex-grow">
            <li class="flex items-start gap-4">
                <div class="mt-0.5 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Users class="w-4 h-4 text-slate-600" />
                </div>
                <div>
                    <p class="text-sm font-semibold text-slate-900">Tối đa {{ plan.maxPerson }} thành viên</p>
                    <p class="text-xs text-slate-500">Quản lý cây gia phả tập trung
                    </p>
                </div>
            </li>
            <li class="flex items-start gap-4">
                <div class="mt-0.5 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <HardDrive class="w-4 h-4 text-slate-600" />
                </div>
                <div>
                    <p class="text-sm font-semibold text-slate-900">Lưu trữ {{ plan.maxStorageMb }} MB</p>
                    <p class="text-xs text-slate-500">Hình ảnh và tư liệu gia đình</p>
                </div>
            </li>
            <li class="flex items-start gap-4">
                <div class="mt-0.5 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <Calendar class="w-4 h-4 text-slate-600" />
                </div>
                <div>
                    <p class="text-sm font-semibold text-slate-900">Thời hạn {{ plan.durationMonth }} tháng</p>
                    <p class="text-xs text-slate-500">Gia hạn theo nhu cầu</p>
                </div>
            </li>
        </ul>

        <!-- Action -->
        <button @click="$emit('select', plan)"
            class="w-full py-3.5 rounded-xl font-semibold text-[11px] uppercase tracking-[0.18em] transition-colors"
            :class="isPopular
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-white text-slate-700 border border-slate-300 hover:border-slate-400 hover:bg-slate-50'">
            {{ plan.price === 0 ? 'Bắt đầu ngay' : 'Đăng ký gói' }}
        </button>
    </div>
</template>
