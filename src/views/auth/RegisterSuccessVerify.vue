<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
    ShieldCheck,
    ArrowLeft,
    RefreshCcw,
    KeyRound,
    ClipboardCheck
} from 'lucide-vue-next'
import logo from '@/assets/images/Logo_GiaPha.png'
import { useVerifyAccountMutation } from '@/hooks/queries/auth/useVerifyAccountMutation'
import { useReSendTokenVerifyAccountMutation } from '@/hooks/queries/auth/useReSendTokenVerifyAccountMutation';
import { useRoute } from 'vue-router';


const { verifyAccountAsync } = useVerifyAccountMutation();
const { reSendTokenVerifyAsync } = useReSendTokenVerifyAccountMutation();

const token = ref('')
const isVerifying = ref(false)
const countdown = ref(60)
const isPasted = ref(false)
const route = useRoute();
const emailParam = ref<string | string[]>('');

let timer: ReturnType<typeof setInterval>;

// Xử lý đếm ngược gửi lại mã
onMounted(() => {
    const email = route.params.email || route.query.email;
    emailParam.value = email as string || '';

    timer = setInterval(() => {
        if (countdown.value > 0) countdown.value--
    }, 1000)
})

onUnmounted(() => {
    clearInterval(timer)
})

const handleVerify = async () => {
    if (!token.value) return
    isVerifying.value = true
    try {
        await verifyAccountAsync(token.value);
    } catch (error) {
        console.error('Error occurred while verifying account:', error);
    } finally {
        isVerifying.value = false
    }
}

const handleResend = async () => {
    if (countdown.value === 0) {
        try {
            await reSendTokenVerifyAsync(emailParam.value as string);
            countdown.value = 60

        } catch (error) {
            console.error('Error occurred while resending verification token:', error);
        }
    }
}

const onInput = () => {
    isPasted.value = token.value.length > 20
}
</script>

<template>
    <div class="min-h-screen relative overflow-hidden bg-[#f5efe2] text-[#234030]">
        <!-- Lớp nền họa tiết đồng bộ -->
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(194,161,92,0.18),_transparent_35%)]"></div>
        <div class="absolute inset-5 md:inset-8 border border-[#c8b27a]/60 rounded-4xl"></div>
        <div class="absolute inset-7 md:inset-10 border border-[#2f5a43]/20 rounded-[28px]"></div>

        <!-- Hoa văn góc (giữ style cổ điển) -->
        <div class="absolute top-0 left-0 w-48 h-48 opacity-10 pointer-events-none">
            <div class="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-[#b89243] rounded-tl-[60px]">
            </div>
        </div>

        <div class="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
            <div class="w-full max-w-xl">
                <div
                    class="relative bg-white/60 backdrop-blur-lg rounded-[40px] border border-[#c6b07b]/50 shadow-[0_30px_100px_rgba(56,42,17,0.2)] overflow-hidden">
                    <div class="h-2 bg-linear-to-r from-[#2f5a43] via-[#c9a85c] to-[#2f5a43]"></div>

                    <div class="px-8 md:px-12 py-12">
                        <!-- Header thông báo -->
                        <div class="flex flex-col items-center text-center mb-10">
                            <div class="relative mb-8">
                                <div class="absolute inset-0 rounded-full bg-[#c9a85c]/20 blur-2xl scale-125"></div>
                                <div
                                    class="relative w-32 h-32 rounded-full bg-[#f8f2e7] border-2 border-[#c8b27a]/60 flex items-center justify-center shadow-xl">
                                    <img :src="logo" alt="GiaPhaOnline" class="w-24 h-24 object-contain" />
                                </div>
                                <div
                                    class="absolute -bottom-2 -right-2 bg-[#2f5a43] text-[#f5efe2] p-2.5 rounded-full border-4 border-white shadow-lg">
                                    <ShieldCheck :size="24" />
                                </div>
                            </div>

                            <h2 class="text-3xl md:text-4xl font-bold text-[#234030] tracking-tight">Xác thực đăng ký
                            </h2>
                            <p class="mt-4 text-[#5c6e61] leading-relaxed max-w-sm">
                                Chúng tôi đã gửi một mã định danh duy nhất đến email của bạn. Vui lòng sao chép và dán
                                mã vào bên dưới.
                            </p>
                        </div>

                        <!-- Trường nhập mã Token dài -->
                        <form @submit.prevent="handleVerify" class="space-y-8">
                            <div class="space-y-3">
                                <div class="flex items-center justify-between px-2">
                                    <label class="text-xs uppercase tracking-[0.2em] font-bold text-[#7a6843]">
                                        Mã xác thực (Security Token)
                                    </label>
                                    <span v-if="isPasted"
                                        class="flex items-center gap-1 text-[10px] text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded-full">
                                        <ClipboardCheck :size="12" /> Đã dán mã
                                    </span>
                                </div>

                                <div class="relative group">
                                    <div
                                        class="absolute left-5 top-1/2 -translate-y-1/2 text-[#c8b27a] group-focus-within:text-[#2f5a43] transition-colors">
                                        <KeyRound :size="22" />
                                    </div>
                                    <input v-model="token" type="text" placeholder="Dán mã token tại đây..."
                                        @input="onInput"
                                        class="w-full bg-[#fffaf1]/90 border-2 border-[#c8b27a]/30 rounded-2xl pl-14 pr-5 py-5 text-sm md:text-base font-mono text-[#234030] shadow-inner outline-none focus:border-[#2f5a43] focus:ring-4 focus:ring-[#2f5a43]/5 transition-all placeholder:text-[#c8b27a]/60" />
                                </div>
                                <p class="text-[11px] text-[#8b8a80] italic px-2">
                                    * Mã có định dạng chuỗi ký tự dài (VD: 7ff06eb7-8296...)
                                </p>
                            </div>

                            <!-- Nút hành động -->
                            <button type="submit" :disabled="isVerifying || !token"
                                class="w-full relative overflow-hidden rounded-2xl bg-[#234030] py-5 text-white font-bold text-lg shadow-2xl transition-all active:scale-[0.98] disabled:opacity-40 hover:bg-[#1a3024]">
                                <div class="relative z-10 flex items-center justify-center gap-3">
                                    <span v-if="!isVerifying">Kích hoạt tài khoản</span>
                                    <template v-else>
                                        <RefreshCcw class="animate-spin" :size="20" />
                                        <span>Đang xác thực...</span>
                                    </template>
                                </div>
                                <div
                                    class="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:animate-[shimmer_2s_infinite]">
                                </div>
                            </button>
                        </form>

                        <!-- Footer & Gửi lại -->
                        <div class="mt-10 pt-8 border-t border-[#c8b27a]/20 flex flex-col items-center gap-5">
                            <div class="text-sm">
                                <span class="text-[#607264]">Không tìm thấy email?</span>
                                <button @click="handleResend" :disabled="countdown > 0"
                                    class="ml-2 font-bold text-[#b89243] hover:underline disabled:opacity-50 disabled:no-underline">
                                    Gửi lại mã {{ countdown > 0 ? `(${countdown}s)` : '' }}
                                </button>
                            </div>

                            <RouterLink to="/register"
                                class="flex items-center gap-2 text-sm font-semibold text-[#234030] opacity-70 hover:opacity-100 transition-opacity">
                                <ArrowLeft :size="16" /> Quay lại trang đăng ký
                            </RouterLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}

input::placeholder {
    font-family: sans-serif;
    letter-spacing: normal;
}

input {
    /* Đảm bảo mã token dài không bị che khuất */
    word-break: break-all;
}
</style>