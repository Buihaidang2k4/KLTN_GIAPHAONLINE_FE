<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
    ShieldCheck,
    ArrowLeft,
    RefreshCcw,
    Mail
} from 'lucide-vue-next'
import logo from '@/assets/images/Logo_GiaPha.png'

// Giả sử mã xác thực gồm 6 số
const token = ref('')
const isVerifying = ref(false)
const countdown = ref(60)

// Xử lý đếm ngược gửi lại mã
onMounted(() => {
    const timer = setInterval(() => {
        if (countdown.value > 0) countdown.value--
    }, 1000)
    return () => clearInterval(timer)
})

const handleVerify = async () => {
    if (token.value.length < 6) return
    isVerifying.value = true
    // Gọi API verify ở đây
    console.log('Verifying token:', token.value)
    // Sau khi gọi xong: isVerifying.value = false
}

const handleResend = () => {
    if (countdown.value === 0) {
        countdown.value = 60
        // Logic gửi lại mã
        console.log('Resending token...')
    }
}
</script>

<template>
    <div class="min-h-screen relative overflow-hidden bg-[#f5efe2] text-[#234030]">
        <!-- Nền & Họa tiết (Giữ nguyên từ RegisterPage để đồng bộ) -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(194,161,92,0.18),_transparent_35%)]"></div>
        <div class="absolute inset-5 md:inset-8 border border-[#c8b27a]/60 rounded-4xl"></div>
        <div class="absolute inset-7 md:inset-10 border border-[#2f5a43]/20 rounded-[28px]"></div>

        <div class="relative z-10 min-h-screen flex items-center justify-center px-6">
            <div class="w-full max-w-md">
                <!-- Card xác thực -->
                <div
                    class="relative bg-white/55 backdrop-blur-md rounded-[36px] border border-[#c6b07b]/50 shadow-[0_20px_80px_rgba(56,42,17,0.18)] overflow-hidden">
                    <div class="h-2 bg-linear-to-r from-[#2f5a43] via-[#c9a85c] to-[#2f5a43]"></div>

                    <div class="px-8 py-10 md:py-12">
                        <!-- Header -->
                        <div class="flex flex-col items-center text-center mb-8">
                            <div class="relative mb-6">
                                <div class="absolute inset-0 rounded-full bg-[#c9a85c]/20 blur-2xl scale-110"></div>
                                <div
                                    class="relative w-28 h-28 rounded-full bg-[#f8f2e7] border-2 border-[#c8b27a]/60 flex items-center justify-center shadow-lg">
                                    <img :src="logo" alt="Logo" class="w-20 h-20 object-contain" />
                                </div>
                                <div
                                    class="absolute -bottom-2 -right-2 bg-[#234030] text-white p-2 rounded-full shadow-lg">
                                    <ShieldCheck :size="20" />
                                </div>
                            </div>

                            <h2 class="text-3xl font-bold text-[#234030]">Xác thực tài khoản</h2>
                            <p class="mt-3 text-[#5c6e61] leading-relaxed">
                                Chúng tôi đã gửi mã xác thực đến email của bạn. Vui lòng kiểm tra hộp thư.
                            </p>
                        </div>

                        <!-- Form -->
                        <form @submit.prevent="handleVerify" class="space-y-6">
                            <div>
                                <label
                                    class="block mb-3 text-sm font-medium text-[#355340] text-center uppercase tracking-widest">
                                    Mã xác thực (Token)
                                </label>
                                <div class="relative group">
                                    <input v-model="token" type="text" maxlength="6" placeholder="0 0 0 0 0 0"
                                        class="w-full bg-[#fffaf1]/80 border-2 border-[#c8b27a]/40 rounded-2xl px-4 py-5 text-center text-3xl font-black tracking-[0.5em] text-[#234030] outline-none focus:border-[#2f5a43] focus:shadow-[0_0_0_4px_rgba(47,90,67,0.08)] transition-all placeholder:text-[#c8b27a]/50" />
                                </div>
                            </div>

                            <button type="submit" :disabled="isVerifying || token.length < 6"
                                class="w-full relative overflow-hidden rounded-2xl bg-[#234030] px-6 py-4 text-white font-semibold text-lg shadow-lg transition hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:translate-y-0">
                                <span v-if="!isVerifying">Xác nhận mã</span>
                                <span v-else class="flex items-center justify-center gap-2">
                                    <RefreshCcw class="animate-spin" :size="20" /> Đang kiểm tra...
                                </span>
                            </button>
                        </form>

                        <!-- Resend & Back -->
                        <div class="mt-8 space-y-4 text-center">
                            <p class="text-sm text-[#607264]">
                                Không nhận được mã?
                                <button @click="handleResend" :disabled="countdown > 0"
                                    class="font-bold text-[#b89243] hover:text-[#234030] transition disabled:opacity-50">
                                    Gửi lại mã {{ countdown > 0 ? `(${countdown}s)` : '' }}
                                </button>
                            </p>

                            <RouterLink to="/register"
                                class="inline-flex items-center gap-2 text-sm font-medium text-[#234030] hover:text-[#b89243] transition">
                                <ArrowLeft :size="16" /> Quay lại trang đăng ký
                            </RouterLink>
                        </div>
                    </div>
                </div>

                <!-- Footer Decoration -->
                <div class="mt-8 flex items-center justify-center gap-3 text-[#7a6843]/60 opacity-60">
                    <span class="w-8 h-px bg-[#c8b27a]"></span>
                    <Mail :size="14" />
                    <span class="text-[10px] tracking-[0.3em] uppercase">Bảo mật - Gia tộc</span>
                    <span class="w-8 h-px bg-[#c8b27a]"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Hiệu ứng focus input mượt hơn */
input {
    font-variant-numeric: tabular-nums;
}
</style>