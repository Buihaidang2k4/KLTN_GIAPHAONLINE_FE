<script setup lang="ts">
import { ref } from 'vue'
import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'
import logo from '@/assets/images/Logo_GiaPha.png'

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)

const handleLogin = () => {
    console.log({
        email: email.value,
        password: password.value,
        remember: remember.value
    })
}
</script>

<template>
    <div class="min-h-screen relative overflow-hidden bg-[#f5efe2] text-[#234030]">
        <!-- nền chính -->
        <div
            class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(194,161,92,0.18),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(35,64,48,0.12),_transparent_35%)]">
        </div>

        <!-- texture giấy -->
        <div class="absolute inset-0 opacity-[0.08] mix-blend-multiply pointer-events-none">
            <div
                class="w-full h-full bg-[linear-gradient(to_right,rgba(35,64,48,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(35,64,48,0.06)_1px,transparent_1px)] bg-[size:36px_36px]">
            </div>
        </div>

        <!-- viền khung ngoài -->
        <div class="absolute inset-5 md:inset-8 border border-[#c8b27a]/60 rounded-[32px]"></div>
        <div class="absolute inset-7 md:inset-10 border border-[#2f5a43]/20 rounded-[28px]"></div>

        <!-- hoa văn góc -->
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

        <!-- hoa văn tròn mờ sau logo -->
        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div class="w-[680px] h-[680px] rounded-full border border-[#b89243]/20"></div>
            <div class="absolute w-[560px] h-[560px] rounded-full border border-[#2f5a43]/15"></div>
            <div class="absolute w-[440px] h-[440px] rounded-full border border-[#b89243]/10"></div>
        </div>

        <div class="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
            <div class="w-full max-w-6xl grid lg:grid-cols-2 gap-10 items-center">
                <!-- cột trái -->
                <div class="hidden lg:flex flex-col justify-center pr-8">
                    <div class="mb-8">
                        <div class="inline-flex items-center gap-3 mb-5">
                            <div class="w-12 h-[2px] bg-[#b89243]"></div>
                            <span class="uppercase tracking-[0.35em] text-sm text-[#6d5a35]">
                                Nền tảng gia phả số
                            </span>
                        </div>

                        <h1 class="text-6xl font-bold leading-[1.05] text-[#234030]">
                            GiaPhaOnline
                        </h1>

                        <p class="mt-6 text-xl leading-relaxed text-[#49624f] max-w-xl">
                            Không gian lưu giữ cội nguồn, kết nối các thế hệ và bảo tồn giá trị
                            dòng tộc bằng một trải nghiệm trang trọng, cổ kính và hiện đại.
                        </p>
                    </div>

                    <div class="flex items-center gap-6 text-[#5b6c5f]">
                        <div class="flex items-center gap-3">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#b89243]"></span>
                            <span>Cây gia phả trực quan</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="w-2.5 h-2.5 rounded-full bg-[#2f5a43]"></span>
                            <span>Lưu giữ tư liệu dòng họ</span>
                        </div>
                    </div>
                </div>

                <!-- cột phải -->
                <div class="relative">
                    <!-- viền glow -->
                    <div
                        class="absolute -inset-3 rounded-[36px]  bg-linear-to-br from-[#d1b06a]/20 via-transparent to-[#2f5a43]/20 blur-xl">
                    </div>

                    <div
                        class="relative bg-white/55 backdrop-blur-md rounded-[36px] border border-[#c6b07b]/50 shadow-[0_20px_80px_rgba(56,42,17,0.18)] overflow-hidden">
                        <!-- dải trang trí top -->
                        <div class="h-2 bg-gradient-to-r from-[#2f5a43] via-[#c9a85c] to-[#2f5a43]"></div>

                        <div class="px-8 md:px-12 py-10 md:py-12">
                            <!-- logo -->
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
                                    Chào mừng trở lại
                                </p>
                                <h2 class="text-3xl md:text-4xl font-bold text-[#234030]">
                                    Đăng nhập hệ thống
                                </h2>
                                <p class="mt-3 text-[#5c6e61] max-w-md leading-relaxed">
                                    Truy cập không gian gia phả của bạn để tiếp tục lưu giữ lịch sử,
                                    hình ảnh và câu chuyện của dòng họ.
                                </p>
                            </div>

                            <!-- hoa văn phân cách -->
                            <div class="flex items-center justify-center gap-4 my-8">
                                <div class="w-16 h-px bg-[#c8b27a]"></div>
                                <div class="w-3 h-3 rounded-full border border-[#b89243]"></div>
                                <div class="w-24 h-px bg-[#2f5a43]/40"></div>
                                <div class="w-3 h-3 rounded-full border border-[#b89243]"></div>
                                <div class="w-16 h-px bg-[#c8b27a]"></div>
                            </div>

                            <!-- form -->
                            <form class="space-y-5" @submit.prevent="handleLogin">
                                <div>
                                    <label class="block mb-2 text-sm font-medium text-[#355340]">
                                        Email
                                    </label>
                                    <div
                                        class="flex items-center gap-3 rounded-2xl border border-[#c8b27a]/50 bg-[#fffaf1]/80 px-4 py-3 focus-within:border-[#2f5a43] focus-within:shadow-[0_0_0_4px_rgba(47,90,67,0.08)] transition">
                                        <Mail class="w-5 h-5 text-[#7a6843]" />
                                        <input v-model="email" type="email" placeholder="Nhập email của bạn"
                                            class="w-full bg-transparent outline-none text-[#234030] placeholder:text-[#8b8a80]" />
                                    </div>
                                </div>

                                <div>
                                    <label class="block mb-2 text-sm font-medium text-[#355340]">
                                        Mật khẩu
                                    </label>
                                    <div
                                        class="flex items-center gap-3 rounded-2xl border border-[#c8b27a]/50 bg-[#fffaf1]/80 px-4 py-3 focus-within:border-[#2f5a43] focus-within:shadow-[0_0_0_4px_rgba(47,90,67,0.08)] transition">
                                        <Lock class="w-5 h-5 text-[#7a6843]" />
                                        <input v-model="password" :type="showPassword ? 'text' : 'password'"
                                            placeholder="Nhập mật khẩu"
                                            class="w-full bg-transparent outline-none text-[#234030] placeholder:text-[#8b8a80]" />
                                        <button type="button" class="text-[#6c5a37] hover:text-[#234030] transition"
                                            @click="showPassword = !showPassword">
                                            <EyeOff v-if="showPassword" class="w-5 h-5" />
                                            <Eye v-else class="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div class="flex items-center justify-between gap-4 pt-1">
                                    <label class="flex items-center gap-3 text-sm text-[#486050] cursor-pointer">
                                        <input v-model="remember" type="checkbox"
                                            class="w-4 h-4 rounded border-[#b89243] text-[#2f5a43] focus:ring-[#2f5a43]" />
                                        <span>Ghi nhớ đăng nhập</span>
                                    </label>

                                    <RouterLink to="/forgot-password"
                                        class="text-sm text-[#7d6840] hover:text-[#234030] transition font-medium">
                                        Quên mật khẩu?
                                    </RouterLink>
                                </div>

                                <button type="submit"
                                    class="relative w-full mt-3 overflow-hidden rounded-2xl bg-[#234030] px-6 py-4 text-white font-semibold text-lg shadow-[0_10px_30px_rgba(35,64,48,0.28)] transition hover:-translate-y-0.5 hover:bg-[#1c3326]">
                                    <span class="relative z-10">Đăng nhập vào GiaPhaOnline</span>
                                    <span
                                        class="absolute inset-y-0 left-0 w-20 bg-white/10 skew-x-[-20deg] translate-x-[-120%] hover:translate-x-[520%] transition-transform duration-1000"></span>
                                </button>
                            </form>

                            <!-- footer -->
                            <div class="mt-8 text-center">
                                <p class="text-[#607264]">
                                    Chưa có tài khoản?
                                    <RouterLink to="/register"
                                        class="font-semibold text-[#234030] hover:text-[#7d6840] transition">
                                        Đăng ký ngay
                                    </RouterLink>
                                </p>
                            </div>
                        </div>

                        <!-- dải trang trí bottom -->
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

        <!-- họa tiết dưới cùng -->
        <div class="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-4 opacity-40">
            <span class="w-20 h-px bg-[#b89243]"></span>
            <span class="w-2.5 h-2.5 rounded-full border border-[#2f5a43]"></span>
            <span class="w-28 h-px bg-[#2f5a43]"></span>
            <span class="w-2.5 h-2.5 rounded-full border border-[#2f5a43]"></span>
            <span class="w-20 h-px bg-[#b89243]"></span>
        </div>
    </div>
</template>