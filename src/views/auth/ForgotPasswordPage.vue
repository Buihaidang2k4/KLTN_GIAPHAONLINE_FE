<script setup lang="ts">
import { computed, ref } from 'vue'
import { Mail } from 'lucide-vue-next'
import logo from '@/assets/images/Logo_GiaPha.png'
import { useForgotPasswordSendOtp } from '@/hooks/queries/auth/useForgotPassword'
import { validateEmail } from '@/composables/validate/useAuthValidate'
import { useRouter } from 'vue-router'

const email = ref('')
const emailError = ref('')
const isSubmitted = ref(false)
const isSubmitDisabled = computed(() => !!validateEmail(email))
const { mutate: sendOtpForgotPass } = useForgotPasswordSendOtp();
const router = useRouter();

const submit = () => {
  const error = validateEmail(email);

  if (error) {
    emailError.value = error;
    return
  }

  emailError.value = ''

  sendOtpForgotPass(email.value, {
    onSuccess: () => {
      isSubmitted.value = true
      router.replace({
        path: "/verify-account-forgot",
        query: {
          email: email.value
        }
      })
    }
  });
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
        <div class="absolute top-8 left-8 w-36 h-36 border-t-4 border-l-4 border-[#b89243] rounded-tl-[90px]"></div>
        <div class="absolute top-20 left-20 w-20 h-20 border-t-2 border-l-2 border-[#2f5a43] rounded-tl-[60px]"></div>
      </div>
    </div>

    <div class="absolute top-0 right-0 w-64 h-64 opacity-20 pointer-events-none scale-x-[-1]">
      <div class="relative w-full h-full">
        <div class="absolute top-8 left-8 w-36 h-36 border-t-4 border-l-4 border-[#b89243] rounded-tl-[90px]"></div>
        <div class="absolute top-20 left-20 w-20 h-20 border-t-2 border-l-2 border-[#2f5a43] rounded-tl-[60px]"></div>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 w-64 h-64 opacity-20 pointer-events-none scale-y-[-1]">
      <div class="relative w-full h-full">
        <div class="absolute top-8 left-8 w-36 h-36 border-t-4 border-l-4 border-[#b89243] rounded-tl-[90px]"></div>
        <div class="absolute top-20 left-20 w-20 h-20 border-t-2 border-l-2 border-[#2f5a43] rounded-tl-[60px]"></div>
      </div>
    </div>

    <div class="absolute bottom-0 right-0 w-64 h-64 opacity-20 pointer-events-none scale-x-[-1] scale-y-[-1]">
      <div class="relative w-full h-full">
        <div class="absolute top-8 left-8 w-36 h-36 border-t-4 border-l-4 border-[#b89243] rounded-tl-[90px]"></div>
        <div class="absolute top-20 left-20 w-20 h-20 border-t-2 border-l-2 border-[#2f5a43] rounded-tl-[60px]"></div>
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
                Khôi phục quyền truy cập
              </span>
            </div>

            <h1 class="text-6xl font-bold leading-[1.05] text-[#234030]">
              GiaPhaOnline
            </h1>

            <p class="mt-6 text-xl leading-relaxed text-[#49624f] max-w-xl">
              Nhập email đã đăng ký để nhận hướng dẫn đặt lại mật khẩu và tiếp tục kết nối với không gian gia phả của
              bạn.
            </p>
          </div>

          <div class="space-y-4 text-[#5b6c5f]">
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-[#b89243]"></span>
              <span>Khôi phục truy cập an toàn qua email</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="w-2.5 h-2.5 rounded-full bg-[#2f5a43]"></span>
              <span>Tiếp tục lưu giữ lịch sử và tư liệu dòng họ</span>
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
                    <img :src="logo" alt="GiaPhaOnline Logo" class="w-28 h-28 md:w-32 md:h-32 object-contain" />
                  </div>
                </div>

                <p class="uppercase tracking-[0.28em] text-xs text-[#7d6840] mb-2">
                  Lấy lại mật khẩu
                </p>
                <h2 class="text-3xl md:text-4xl font-bold text-[#234030]">
                  Quên mật khẩu
                </h2>
                <p class="mt-3 text-[#5c6e61] max-w-md leading-relaxed">
                  Chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu đến email bạn đã dùng để đăng nhập.
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
                    Email
                  </label>
                  <div
                    class="flex items-center gap-3 rounded-2xl border border-[#c8b27a]/50 bg-[#fffaf1]/80 px-4 py-3 focus-within:border-[#2f5a43] focus-within:shadow-[0_0_0_4px_rgba(47,90,67,0.08)] transition">
                    <Mail class="w-5 h-5 text-[#7a6843]" />
                    <input v-model="email" type="email" placeholder="Nhập email của bạn"
                      class="w-full bg-transparent outline-none text-[#234030] placeholder:text-[#8b8a80]"
                      @blur="emailError = validateEmail(email) || ''" />
                  </div>
                  <p v-if="emailError" class="mt-2 text-sm text-red-600">
                    {{ emailError }}
                  </p>
                </div>

                <div
                  class="rounded-2xl border border-[#c8b27a]/40 bg-[#fff9ed]/70 px-4 py-3 text-sm leading-relaxed text-[#5a6b5f]">
                  Nhập đúng email đã đăng ký để nhận liên kết khôi phục mật khẩu.
                </div>

                <button type="submit" :disabled="isSubmitDisabled"
                  class="relative w-full mt-3 overflow-hidden rounded-2xl bg-[#234030] px-6 py-4 text-white font-semibold text-lg shadow-[0_10px_30px_rgba(35,64,48,0.28)] transition enabled:hover:-translate-y-0.5 enabled:hover:bg-[#1c3326] disabled:cursor-not-allowed disabled:opacity-70">
                  <span class="relative z-10">Gửi yêu cầu đặt lại mật khẩu</span>
                  <span
                    class="absolute inset-y-0 left-0 w-20 bg-white/10 skew-x-[-20deg] translate-x-[-120%] hover:translate-x-[520%] transition-transform duration-1000"></span>
                </button>

                <p v-if="isSubmitted" class="text-sm text-center text-[#2f5a43]">
                  Yêu cầu đã được ghi nhận. Hãy kiểm tra email của bạn.
                </p>
              </form>

              <div class="mt-8 text-center">
                <p class="text-[#607264]">
                  Đã nhớ mật khẩu?
                  <RouterLink to="/login" class="font-semibold text-[#234030] hover:text-[#7d6840] transition">
                    Đăng nhập
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
