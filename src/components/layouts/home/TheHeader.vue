<script setup lang="ts">
import { RouterLink, useRouter, useRoute } from 'vue-router'
import logo from '@/assets/images/Logo_GiaPha.png'

const router = useRouter()
const route = useRoute()

// xử lý cuộn trang
const scrollToSection = (sectionId: string) => {
    if (route.path === '/') {
        const el = document.getElementById(sectionId)
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' })
        }
    } else {
        router.push('/').then(() => {
            setTimeout(() => {
                const el = document.getElementById(sectionId)
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' })
                }
            }, 300)
        })
    }
}
</script>

<template>
    <nav class="sticky top-0 z-50 
              bg-amber-100/80 backdrop-blur-md
              border-b border-amber-300/40
              px-8 py-3">

        <div class="max-w-7xl mx-auto flex items-center justify-between">

            <!-- Logo -->
            <div class="flex items-center gap-3">
                <img :src="logo" alt="Logo"
                    class="w-12 h-12 rounded-full object-cover border border-amber-300 shadow-sm" />

                <span class="text-2xl font-semibold tracking-tight text-amber-900">
                    <span class="text-amber-800">GiaPha</span>
                    <span class="text-amber-600">Online</span>
                </span>
            </div>

            <!-- Menu -->
            <ul class="flex items-center gap-8 text-amber-900 font-medium">

                <li>
                    <RouterLink to="/" class="hover:text-amber-700 transition-colors">
                        Trang chủ
                    </RouterLink>
                </li>

                <li>
                    <RouterLink to="/post" class="hover:text-amber-700 transition-colors">
                        Bài viết
                    </RouterLink>
                </li>


                <li>
                    <a href="#price" @click.prevent="scrollToSection('price')"
                        class="hover:text-amber-700 transition-colors cursor-pointer">
                        Gói dịch vụ
                    </a>
                </li>

                <li>
                    <a href="#feature" @click.prevent="scrollToSection('feature')"
                        class="hover:text-amber-700 transition-colors cursor-pointer">
                        Tính năng
                    </a>
                </li>

                <li>
                    <a href="#cta" @click.prevent="scrollToSection('cta')"
                        class="hover:text-amber-700 transition-colors cursor-pointer">
                        Liên hệ
                    </a>
                </li>

                <!-- Divider -->
                <div class="h-6 w-px bg-amber-400/40"></div>

                <!-- Auth -->
                <li>
                    <RouterLink target="_blank" to="/login" class="hover:text-amber-700 transition-colors">
                        Đăng nhập
                    </RouterLink>
                </li>

                <li>
                    <RouterLink target="_blank" to="/register" class="bg-amber-800 text-white
                   px-5 py-2 rounded-xl
                   hover:bg-amber-900
                   transition-all duration-300
                   shadow-sm hover:shadow-md">
                        Đăng ký
                    </RouterLink>
                </li>

            </ul>

        </div>
    </nav>
</template>