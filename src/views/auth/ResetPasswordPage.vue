<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Eye, EyeOff, KeyRound, Lock } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import logo from '@/assets/images/Logo_GiaPha.png'
import { validateConfirmPassword, validatePassword } from '@/composables/validate/useResetPasswordValidate'
import { useResetPassword } from '@/hooks/queries/auth/useForgotPassword'

type ResetForm = {
    otp: string
    newPassword: string
    confirmPassword: string
}

type ResetErrors = {
    otp: string
    newPassword: string
    confirmPassword: string
}

const route = useRoute()
const otpFromUrl = typeof route.query.otp === 'string'
    ? route.query.otp
    : typeof route.params.otp === 'string'
        ? route.params.otp
        : ''

const form = reactive<ResetForm>({
    otp: String(otpFromUrl).replace(/[^a-zA-Z0-9]/g, '').toUpperCase(),
    newPassword: '',
    confirmPassword: '',
})

const errors = reactive<ResetErrors>({
    otp: '',
    newPassword: '',
    confirmPassword: '',
})

const touched = reactive({
    otp: false,
    newPassword: false,
    confirmPassword: false,
})


const router = useRouter();

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitted = ref(false)
const { mutate: resetPasswordMutation } = useResetPassword();



const validateField = (field: keyof ResetForm) => {

    if (field === 'newPassword') {
        errors.newPassword = validatePassword(form.newPassword)
    }

    if (field === 'confirmPassword') {
        errors.confirmPassword = validateConfirmPassword(
            form.newPassword,
            form.confirmPassword
        )
    }
}

const handleInput = (field: keyof ResetForm) => {
    if (touched[field]) validateField(field)
}

const handleBlur = (field: keyof ResetForm) => {
    touched[field] = true
    validateField(field)
}

const validateAll = () => {
    touched.newPassword = true
    touched.confirmPassword = true

    validateField('newPassword')
    validateField('confirmPassword')
}

watch(() => form.newPassword, () => {
    if (touched.confirmPassword) {
        validateField('confirmPassword')
    }
})

const isSubmitDisabled = computed(() =>
    !form.otp.trim() || !form.newPassword || !form.confirmPassword
)

const submit = () => {
    validateAll()

    if (errors.newPassword || errors.confirmPassword) return

    resetPasswordMutation(form, {
        onSuccess: () => {
            isSubmitted.value = true
            router.replace("/login")
        }
    })
}
</script>

<template>
    <div class="min-h-screen relative overflow-hidden bg-[#f5efe2] text-[#234030]">
        <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(194,161,92,0.18),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(35,64,48,0.12),_transparent_35%)]">
        </div>

        <div class="absolute inset-0 opacity-[0.08] mix-blend-multiply pointer-events-none">
            <div
                class="w-full h-full bg-[linear-gradient(to_right,rgba(35,64,48,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(35,64,48,0.06)_1px,transparent_1px)] bg-position-[36px_36px]">
            </div>
        </div>

        <div class="absolute inset-5 md:inset-8 border border-[#c8b27a]/60 rounded-4xl"></div>
        <div class="absolute inset-7 md:inset-10 border border-[#2f5a43]/20 rounded-[28px]"></div>

        <div class="absolute top-0 left-0 w-64 h-64 opacity-20 pointer-events-none">
            <div class="relative w-full h-full">
                <div class="absolute top-8 left-8 w-36 h-36 border-t-4 border-l-4 border-[#b89243] rounded-tl-[90px]">
                </div>
                <div class="absolute top-20 left-20 w-20 h-20 border-t-2 border-l-2 border-[#2f5a43] rounded-tl-[60px]">
                </div>
            </div>
        </div>

        <div class="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none scale-x-[-1]">
            <div class="relative w-full h-full">
                <div class="absolute top-8 left-8 w-36 h-36 border-t-4 border-l-4 border-[#b89243] rounded-tl-[90px]">
                </div>
                <div class="absolute top-20 left-20 w-20 h-20 border-t-2 border-l-2 border-[#2f5a43] rounded-tl-[60px]">
                </div>
            </div>
        </div>

        <div class="absolute bottom-0 left-0 w-64 h-64 opacity-20 pointer-events-none scale-y-[-1]">
            <div class="relative w-full h-full">
                <div class="absolute top-8 left-8 w-36 h-36 border-t-4 border-l-4 border-[#b89243] rounded-tl-[90px]">
                </div>
                <div class="absolute top-20 left-20 w-20 h-20 border-t-2 border-l-2 border-[#2f5a43] rounded-tl-[60px]">
                </div>
            </div>
        </div>

        <div class="absolute bottom-0 right-0 w-64 h-64 opacity-20 pointer-events-none scale-x-[-1] scale-y-[-1]">
            <div class="relative w-full h-full">
                <div class="absolute top-8 left-8 w-36 h-36 border-t-4 border-l-4 border-[#b89243] rounded-tl-[90px]">
                </div>
                <div class="absolute top-20 left-20 w-20 h-20 border-t-2 border-l-2 border-[#2f5a43] rounded-tl-[60px]">
                </div>
            </div>
        </div>

        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-[680px] h-[680px] rounded-full border border-[#b89243]/20"></div>
            <div class="absolute w-[560px] h-[560px] rounded-full border border-[#2f5a43]/15"></div>
            <div class="absolute w-[440px] h-[440px] rounded-full border border-[#b89243]/10"></div>
        </div>

        <div class="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
            <div class="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
                <div class="hidden lg:flex flex-col justify-center pr-8">
                    <div class="mb-8">
                        <div class="inline-flex items-center gap-3 mb-5">
                            <div class="w-12 h-[2px] bg-[#b89243]"></div>
                            <span class="uppercase tracking-[0.35em] text-sm text-[#6d5a35]">
                                Thiết lập bảo mật mới
                            </span>
                        </div>

                        <h1 class="text-6xl font-bold leading-[1.05] text-[#234030]">
                            GiaPhaOnline
                        </h1>

                        <p class="mt-6 text-xl leading-relaxed text-[#49624f] max-w-xl">
                            Xác nhận mã OTP hợp lệ và tạo mật khẩu mới để khôi phục quyền truy cập vào không gian gia
                            phả của bạn.
                        </p>
                    </div>

                    <div class="space-y-4 text-[#5b6c5f]">
                        <div class="flex items-center gap-3">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#b89243]"></span>
                            <span>Mã OTP được lấy tự động từ liên kết khôi phục nếu có</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#2f5a43]"></span>
                            <span>Thiết lập mật khẩu mạnh để bảo vệ tài khoản và dữ liệu dòng họ</span>
                        </div>
                    </div>
                </div>

                <div class="relative">
                    <div
                        class="absolute -inset-3 rounded-[36px] bg-linear-to-br from-[#d1b06a]/20 via-transparent to-[#2f5a43]/20 blur-xl">
                    </div>

                    <div
                        class="relative bg-white/55 backdrop-blur-md rounded-[36px] border border-[#c6b07b]/50 shadow-[0_20px_80px_rgba(56,42,17,0.18)] overflow-hidden">
                        <div class="h-2 bg-linear-to-r from-[#2f5a43] via-[#c9a85c] to-[#2f5a43]"></div>

                        <div class="px-8 md:px-12 py-10 md:py-12">
                            <div class="flex flex-col items-center text-center">
                                <div class="relative mb-6">
                                    <div class="absolute inset-0 rounded-full bg-[#c9a85c]/20 blur-2xl scale-110"></div>
                                    <div
                                        class="relative w-36 h-36 md:w-40 md:h-40 rounded-full bg-[#f8f2e7] border-2 border-[#c8b27a]/60 flex items-center justify-center shadow-[0_10px_40px_rgba(68,52,23,0.18)]">
                                        <img :src="logo" alt="GiaPhaOnline Logo"
                                            class="w-28 h-28 md:w-32 md:h-32 object-contain" />
                                    </div>
                                </div>

                                <p class="uppercase tracking-[0.28em] text-xs text-[#7d6840] mb-2">
                                    Đặt lại mật khẩu
                                </p>
                                <h2 class="text-3xl md:text-4xl font-bold text-[#234030]">
                                    Tạo mật khẩu mới
                                </h2>
                                <p class="mt-3 text-[#5c6e61] max-w-md leading-relaxed">
                                    Nhập mã OTP và thiết lập mật khẩu mới để hoàn tất quá trình khôi phục tài khoản.
                                </p>
                            </div>

                            <div class="flex items-center justify-center gap-4 my-8">
                                <div class="w-16 h-px bg-[#c8b27a]"></div>
                                <div class="w-3 h-3 rounded-full border border-[#b89243]"></div>
                                <div class="w-24 h-px bg-[#2f5a43]/40"></div>
                                <div class="w-3 h-3 rounded-full border border-[#b89243]"></div>
                                <div class="w-16 h-px bg-[#c8b27a]"></div>
                            </div>

                            <form class="space-y-5" @submit.prevent="submit">
                                <div>
                                    <label class="block mb-2 text-sm font-medium text-[#355340]">
                                        Mã OTP
                                    </label>
                                    <div
                                        class="flex items-center gap-3 rounded-2xl border border-[#c8b27a]/50 bg-[#fffaf1]/80 px-4 py-3 focus-within:border-[#2f5a43] focus-within:shadow-[0_0_0_4px_rgba(47,90,67,0.08)] transition">
                                        <KeyRound class="w-5 h-5 text-[#7a6843]" />
                                        <input v-model="form.otp" type="text" readonly disabled
                                            class="w-full bg-transparent outline-none text-[#234030] uppercase placeholder:text-[#8b8a80]" />
                                    </div>
                                    <p v-if="errors.otp" class="mt-2 text-sm text-red-600">
                                        {{ errors.otp }}
                                    </p>
                                </div>

                                <div>
                                    <label class="block mb-2 text-sm font-medium text-[#355340]">
                                        Mật khẩu mới
                                    </label>
                                    <div
                                        class="flex items-center gap-3 rounded-2xl border border-[#c8b27a]/50 bg-[#fffaf1]/80 px-4 py-3 focus-within:border-[#2f5a43] focus-within:shadow-[0_0_0_4px_rgba(47,90,67,0.08)] transition">
                                        <Lock class="w-5 h-5 text-[#7a6843]" />
                                        <input v-model="form.newPassword" :type="showPassword ? 'text' : 'password'"
                                            autocomplete="new-password" placeholder="Nhập mật khẩu mới"
                                            class="w-full bg-transparent outline-none text-[#234030] placeholder:text-[#8b8a80]"
                                            @input="handleInput('newPassword')" @blur="handleBlur('newPassword')" />
                                        <button type="button"
                                            class="text-[#6c5a37] hover:text-[#234030] transition cursor-pointer"
                                            @click="showPassword = !showPassword">
                                            <EyeOff v-if="showPassword" class="w-5 h-5" />
                                            <Eye v-else class="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p v-if="errors.newPassword" class="mt-2 text-sm text-red-600">
                                        {{ errors.newPassword }}
                                    </p>
                                </div>

                                <div>
                                    <label class="block mb-2 text-sm font-medium text-[#355340]">
                                        Xác nhận mật khẩu mới
                                    </label>
                                    <div
                                        class="flex items-center gap-3 rounded-2xl border border-[#c8b27a]/50 bg-[#fffaf1]/80 px-4 py-3 focus-within:border-[#2f5a43] focus-within:shadow-[0_0_0_4px_rgba(47,90,67,0.08)] transition">
                                        <Lock class="w-5 h-5 text-[#7a6843]" />
                                        <input v-model="form.confirmPassword"
                                            :type="showConfirmPassword ? 'text' : 'password'"
                                            placeholder="Nhập lại mật khẩu mới"
                                            class="w-full bg-transparent outline-none text-[#234030] placeholder:text-[#8b8a80]"
                                            @input="handleInput('confirmPassword')"
                                            @blur="handleBlur('confirmPassword')" />
                                        <button type="button"
                                            class="text-[#6c5a37] hover:text-[#234030] transition cursor-pointer"
                                            @click="showConfirmPassword = !showConfirmPassword">
                                            <EyeOff v-if="showConfirmPassword" class="w-5 h-5" />
                                            <Eye v-else class="w-5 h-5" />
                                        </button>
                                    </div>
                                    <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-600">
                                        {{ errors.confirmPassword }}
                                    </p>
                                </div>

                                <div
                                    class="rounded-2xl border border-[#c8b27a]/40 bg-[#fff9ed]/70 px-4 py-3 text-sm leading-relaxed text-[#5a6b5f]">
                                    Mật khẩu cần tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.
                                </div>

                                <button type="submit" :disabled="isSubmitDisabled"
                                    class="relative w-full mt-3 overflow-hidden rounded-2xl bg-[#234030] px-6 py-4 text-white font-semibold text-lg shadow-[0_10px_30px_rgba(35,64,48,0.28)] transition enabled:hover:-translate-y-0.5 enabled:hover:bg-[#1c3326] disabled:cursor-not-allowed disabled:opacity-70">
                                    <span class="relative z-10">Xác nhận đặt lại mật khẩu</span>
                                    <span
                                        class="absolute inset-y-0 left-0 w-20 bg-white/10 skew-x-[-20deg] translate-x-[-120%] hover:translate-x-[520%] transition-transform duration-1000"></span>
                                </button>

                                <p v-if="isSubmitted" class="text-sm text-center text-[#2f5a43]">
                                    Thông tin hợp lệ. Bạn có thể tiếp tục gọi API đặt lại mật khẩu.
                                </p>
                            </form>

                            <div class="mt-8 text-center">
                                <p class="text-[#607264]">
                                    Cần xác minh lại mã?
                                    <RouterLink to="/verify-account-forgot"
                                        class="font-semibold text-[#234030] hover:text-[#7d6840] transition">
                                        Quay lại OTP
                                    </RouterLink>
                                </p>
                            </div>
                        </div>

                        <div class="px-8 pb-6">
                            <div class="flex items-center justify-center gap-3 text-[#7a6843]/80">
                                <span class="w-10 h-px bg-[#c8b27a]"></span>
                                <span class="text-xs tracking-[0.28em] uppercase">
                                    Gia phả - Cội nguồn - Kết nối
                                </span>
                                <span class="w-10 h-px bg-[#c8b27a]"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-4 opacity-40">
            <span class="w-20 h-px bg-[#b89243]"></span>
            <span class="w-2.5 h-2.5 rounded-full border border-[#2f5a43]"></span>
            <span class="w-28 h-px bg-[#2f5a43]"></span>
            <span class="w-2.5 h-2.5 rounded-full border border-[#2f5a43]"></span>
            <span class="w-20 h-px bg-[#b89243]"></span>
        </div>
    </div>
</template>
