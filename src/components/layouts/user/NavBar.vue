<script setup lang="ts">
import { ref } from "vue"
import { RouterLink, useRoute } from "vue-router"
import logo_giapha from "@/assets/images/Logo_GiaPha.png"
import {
    LayoutDashboard, TreePine, Image, FileText,
    Mail, Settings, PanelLeftClose, PanelLeft
} from 'lucide-vue-next'

const open = ref(true)
const route = useRoute()

const menus = [
    { name: "Tổng quan", path: "/user/dashboard", icon: LayoutDashboard },
    { name: "Gia phả", path: "/family/chart", icon: TreePine },
    { name: "Album", path: "/user/album", icon: Image },
    { name: "Bài viết", path: "/user/posts", icon: FileText },
    { name: "Email", path: "/user/email", icon: Mail },
    { name: "Cài đặt", path: "/user/settings", icon: Settings }
]

const isActive = (path: string) => route.path === path
</script>

<template>
    <aside :class="open ? 'w-[280px]' : 'w-[76px]'"
        class="h-screen sticky top-0 flex flex-col bg-white border-r border-stone-200/80 transition-all duration-300 ease-in-out">

        <!-- Header -->
        <div class="px-5 py-5 border-b border-stone-100">
            <div class="flex items-center" :class="open ? 'justify-between' : 'justify-center'">
                <RouterLink to="/" class="flex items-center gap-3 min-w-0">
                    <img :src="logo_giapha" alt="Logo"
                        class="w-11 h-11 rounded-xl object-cover shadow-sm ring-1 ring-stone-200 flex-shrink-0" />
                    <Transition name="fade">
                        <div v-if="open" class="min-w-0">
                            <h1 class="text-lg font-bold text-stone-800 truncate leading-tight">
                                GiaPha<span class="text-amber-600">Online</span>
                            </h1>
                            <p class="text-xs text-stone-400 mt-0.5">Quản lý gia phả</p>
                        </div>
                    </Transition>
                </RouterLink>

                <button v-if="open" @click="open = !open"
                    class="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors">
                    <PanelLeftClose :size="18" />
                </button>
            </div>

            <button v-if="!open" @click="open = !open"
                class="w-full mt-3 flex justify-center text-stone-400 hover:text-stone-600 transition-colors">
                <PanelLeft :size="18" />
            </button>
        </div>

        <!-- Label -->
        <div class="px-5 pt-5 pb-2">
            <Transition name="fade">
                <p v-if="open" class="text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400">
                    Menu chính
                </p>
            </Transition>
        </div>

        <!-- Menu -->
        <nav class="flex-1 px-3 space-y-1 overflow-y-auto nav-scroll">
            <RouterLink v-for="m in menus" :key="m.path" :to="m.path" :class="[
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(m.path)
                    ? 'bg-stone-800 text-white shadow-sm'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
            ]">
                <div :class="[
                    'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200',
                    isActive(m.path)
                        ? 'bg-white/15 text-white'
                        : 'bg-stone-100 text-stone-400 group-hover:bg-stone-200 group-hover:text-stone-600'
                ]">
                    <component :is="m.icon" :size="18" />
                </div>

                <Transition name="fade">
                    <span v-if="open" class="truncate">{{ m.name }}</span>
                </Transition>

                <!-- Active dot -->
                <div v-if="isActive(m.path) && open"
                    class="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50">
                </div>
            </RouterLink>
        </nav>

        <!-- Footer -->
        <div class="border-t border-stone-100 p-3">
            <div :class="[
                'flex items-center gap-3 rounded-xl transition-all duration-200',
                open ? 'bg-stone-50 px-4 py-3' : 'justify-center py-3'
            ]">
                <div
                    class="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
                    A
                </div>
                <Transition name="fade">
                    <div v-if="open" class="min-w-0">
                        <p class="text-sm font-semibold text-stone-700 truncate leading-tight">Admin</p>
                        <p class="text-[11px] text-stone-400 leading-tight">admin@giaphaonline.com</p>
                    </div>
                </Transition>
            </div>
        </div>

    </aside>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.nav-scroll::-webkit-scrollbar {
    width: 3px;
}

.nav-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.nav-scroll::-webkit-scrollbar-thumb {
    background: rgba(120, 113, 108, 0.15);
    border-radius: 999px;
}
</style>