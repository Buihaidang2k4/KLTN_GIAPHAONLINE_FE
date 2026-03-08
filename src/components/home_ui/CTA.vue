<script setup lang="ts">
import { ArrowRight, Check } from 'lucide-vue-next'

const benefits = [
    'Miễn phí mãi mãi',
    'Không cần thẻ tín dụng',
    'Thiết lập trong 5 phút'
]
</script>

<template>
    <section class="py-28 bg-stone-800 relative overflow-hidden">

        <!-- Trang trí nền -->
        <div class="absolute inset-0 opacity-10">
            <div
                class="absolute top-0 left-0 w-96 h-96 bg-amber-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2">
            </div>
            <div
                class="absolute bottom-0 right-0 w-80 h-80 bg-stone-400 rounded-full blur-3xl translate-x-1/3 translate-y-1/3">
            </div>
        </div>

        <div class="max-w-4xl mx-auto px-6 text-center relative z-10">

            <!-- Divider -->
            <div class="w-14 h-[2px] bg-amber-400 mx-auto mb-8"></div>

            <!-- Heading -->
            <h2 class="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight leading-tight">
                Bắt đầu xây dựng <br class="hidden sm:block" />
                <span class="text-amber-400">gia phả của bạn</span>
            </h2>

            <p class="text-lg text-stone-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Miễn phí cho 50 thành viên đầu tiên. Không cần thẻ tín dụng.
                Hãy bắt đầu hành trình kết nối các thế hệ ngay hôm nay.
            </p>

            <!-- Buttons -->
            <div class="flex flex-col sm:flex-row gap-5 justify-center mb-12">
                <button class="group bg-amber-500 text-stone-900 px-10 py-4 rounded-2xl 
                         font-bold text-lg
                         hover:bg-amber-400 
                         transition-all duration-300 
                         shadow-lg shadow-amber-500/20
                         hover:shadow-xl hover:shadow-amber-400/30
                         hover:-translate-y-0.5
                         flex items-center justify-center gap-3">
                    Tạo tài khoản miễn phí
                    <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button class="border-2 border-stone-500 text-stone-200 px-10 py-4 
                         rounded-2xl font-semibold text-lg
                         hover:bg-stone-700 hover:border-stone-400
                         transition-all duration-300">
                    Xem demo
                </button>
            </div>

            <!-- Benefits -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-8 text-stone-400 text-sm">
                <div v-for="(benefit, i) in benefits" :key="i" class="flex items-center gap-2">
                    <div class="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Check class="w-3 h-3 text-amber-400" />
                    </div>
                    <span>{{ benefit }}</span>
                </div>
            </div>

        </div>
    </section>
</template>