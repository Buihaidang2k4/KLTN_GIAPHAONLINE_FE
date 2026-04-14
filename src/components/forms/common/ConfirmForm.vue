<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { X, AlertTriangle, Info, AlertCircle, CheckCircle2 } from 'lucide-vue-next'

interface Props {
    show: boolean
    isLoading?: boolean
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    variant?: 'danger' | 'warning' | 'info' | 'success'
}

const props = withDefaults(defineProps<Props>(), {
    show: false,
    isLoading: false,
    title: 'Xác nhận hành động',
    description: '',
    confirmText: 'Xác nhận',
    cancelText: 'Hủy bỏ',
    variant: 'danger'
})

const emit = defineEmits(['close', 'confirm'])

// Cấu hình UI theo Variant
const variantConfig = {
    danger: {
        icon: AlertCircle,
        iconBg: 'bg-rose-50',
        iconColor: 'text-rose-500',
        btnBg: 'bg-rose-500 hover:bg-rose-600 shadow-rose-200',
        animate: 'animate-bounce-short'
    },
    warning: {
        icon: AlertTriangle,
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
        btnBg: 'bg-amber-500 hover:bg-amber-600 shadow-amber-200',
        animate: 'animate-pulse'
    },
    info: {
        icon: Info,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500',
        btnBg: 'bg-blue-500 hover:bg-blue-600 shadow-blue-200',
        animate: ''
    },
    success: {
        icon: CheckCircle2,
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-500',
        btnBg: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200',
        animate: ''
    }
}

const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.show) emit('close')
}

onMounted(() => window.addEventListener('keydown', handleEsc))
onUnmounted(() => window.removeEventListener('keydown', handleEsc))
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100"
            leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="show"
                class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-100 flex items-center justify-center p-4"
                @click="emit('close')">
                <Transition enter-active-class="duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95 translate-y-4"
                    enter-to-class="opacity-100 scale-100 translate-y-0" leave-active-class="duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-y-0"
                    leave-to-class="opacity-0 scale-95 translate-y-4">
                    <div v-if="show"
                        class="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
                        @click.stop>
                        <!-- Nút đóng nhanh -->
                        <button @click="emit('close')"
                            class="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10">
                            <X :size="20" />
                        </button>

                        <!-- Nội dung chính -->
                        <div class="pt-10 pb-6 flex flex-col items-center px-6">
                            <!-- Icon linh hoạt theo variant hoặc slot -->
                            <div :class="[
                                'w-20 h-20 rounded-3xl flex items-center justify-center mb-6 transition-all',
                                variantConfig[variant].iconBg,
                                variantConfig[variant].iconColor,
                                variantConfig[variant].animate
                            ]">
                                <slot name="icon">
                                    <component :is="variantConfig[variant].icon" :size="40" />
                                </slot>
                            </div>

                            <!-- Title (Dùng slot để tùy biến cao hơn hoặc prop title) -->
                            <h3 class="text-2xl font-black text-slate-800 text-center leading-tight mb-2">
                                <slot name="title">{{ title }}</slot>
                            </h3>

                            <!-- Description -->
                            <p v-if="description || $slots.description"
                                class="text-slate-500 text-sm text-center px-4 leading-relaxed">
                                <slot name="description">{{ description }}</slot>
                            </p>
                        </div>

                        <!-- Footer Action Buttons -->
                        <div class="p-6 bg-slate-50/80 border-t border-slate-100 flex flex-col gap-3">
                            <button @click="emit('confirm')" :disabled="isLoading" :class="[
                                'w-full py-4 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98]',
                                variantConfig[variant].btnBg
                            ]">
                                <span v-if="isLoading"
                                    class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                {{ isLoading ? 'Đang xử lý...' : confirmText }}
                            </button>

                            <button @click="emit('close')" :disabled="isLoading"
                                class="w-full py-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]">
                                {{ cancelText }}
                            </button>
                        </div>
                    </div>
                </Transition>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
@keyframes bounce-short {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-6px);
    }
}

.animate-bounce-short {
    animation: bounce-short 2s ease-in-out infinite;
}
</style>