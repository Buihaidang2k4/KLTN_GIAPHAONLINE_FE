<script setup lang="ts">
import { ShieldAlert, Home, ArrowLeft, LockKeyhole } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
    router.back()
}
</script>

<template>
    <div class="min-h-screen relative overflow-hidden bg-[#fdfaf5] flex items-center justify-center p-6">
        <!-- Lớp nền họa tiết cổ điển -->
        <div class="absolute inset-0 opacity-[0.03] pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#234030" stroke-width="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>

        <!-- Khung viền kép đặc trưng -->
        <div class="absolute inset-4 md:inset-8 border border-[#c8b27a]/40 rounded-[40px] pointer-events-none"></div>
        <div class="absolute inset-6 md:inset-10 border border-[#2f5a43]/10 rounded-[32px] pointer-events-none"></div>

        <div class="relative z-10 max-w-2xl w-full text-center">
            <!-- Icon Cảnh báo thiết kế nghệ thuật -->
            <div class="relative mb-12 inline-block">
                <div class="absolute inset-0 bg-red-100 rounded-full blur-3xl scale-150 opacity-50"></div>
                <div
                    class="relative w-40 h-40 md:w-48 md:h-48 rounded-full border-2 border-[#c8b27a]/30 flex items-center justify-center bg-white shadow-2xl">
                    <div
                        class="w-32 h-32 md:w-40 md:h-40 rounded-full border border-[#c8b27a]/20 flex items-center justify-center bg-[#fffcf8]">
                        <LockKeyhole :size="80" class="text-red-700 animate-bounce-slow" />
                    </div>
                </div>
                <!-- Badge 403 -->
                <div
                    class="absolute -bottom-2 -right-2 bg-red-700 text-white px-4 py-1.5 rounded-full font-black text-xl shadow-lg border-4 border-white">
                    403
                </div>
            </div>

            <!-- Nội dung thông báo -->
            <div class="space-y-6">
                <h1 class="text-4xl md:text-5xl font-black text-[#234030] tracking-tight">
                    Truy cập bị <span class="text-red-700">từ chối</span>
                </h1>
                <p class="text-lg md:text-xl text-[#5c6e61] font-medium max-w-md mx-auto leading-relaxed">
                    Rất tiếc, tài khoản của bạn không có đủ quyền hạn để xem nội dung này.
                </p>
                <div class="flex items-center justify-center gap-3 text-sm text-[#8b8a80] italic">
                    <ShieldAlert :size="16" />
                    <span>Vui lòng liên hệ Quản trị viên dòng họ nếu bạn cho rằng đây là sai sót.</span>
                </div>
            </div>

            <!-- Nút điều hướng -->
            <div class="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                <button @click="goBack"
                    class="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-[#c8b27a]/50 text-[#234030] font-bold rounded-2xl hover:bg-[#f8f2e7] hover:border-[#b89243] transition-all active:scale-95 shadow-sm">
                    <ArrowLeft :size="20" />
                    Trở lại trang trước
                </button>

                <router-link to="/"
                    class="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-[#234030] text-white font-bold rounded-2xl hover:bg-[#1a3024] transition-all active:scale-95 shadow-xl shadow-[#234030]/20">
                    <Home :size="20" />
                    Về trang chủ
                </router-link>
            </div>

            <!-- Footer trang trí -->
            <div class="mt-16 flex items-center justify-center gap-4">
                <div class="h-[1px] w-12 bg-linear-to-r from-transparent to-[#c8b27a]"></div>
                <img src="@/assets/images/Logo_GiaPha.png" alt="Logo" class="w-10 h-10 grayscale opacity-40" />
                <div class="h-[1px] w-12 bg-linear-to-l from-transparent to-[#c8b27a]"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes bounce-slow {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-10px);
    }
}

.animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
}

h1 {
    font-family: "EB Garamond", serif;
}
</style>