<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import {
    LayoutDashboard,
    Users,
    Receipt,
    FileText,
    FolderOpen,
    LogOut,
    Package,
    Settings,
    ChevronLeft,
    ShieldCheck,
    Key
} from 'lucide-vue-next'
import { ref, computed } from 'vue'
import logo from '@/assets/images/Logo_GiaPha.png'

const route = useRoute()
const isCollapsed = ref(false)

const menuGroups = [
    {
        label: 'Bảng điều khiển', // Hoặc 'Tổng quan'
        items: [
            { icon: LayoutDashboard, label: 'Thống kê hệ thống', to: '/system' },
        ]
    },
    {
        label: 'Phân quyền & Tài khoản',
        items: [
            { icon: Users, label: 'Quản lý người dùng', to: '/system/accounts' },
            { icon: ShieldCheck, label: 'Quản lý vai trò', to: '/system/roles' },
            { icon: Key, label: 'Quản lý quyền hạn', to: '/system/permissions' },
        ]
    },
    {
        label: 'Quản lý Kinh doanh',
        items: [
            { icon: Package, label: 'Gói dịch vụ', to: '/system/subscriptions' }, // Dùng Package (Gói) thay vì CreditCard
            { icon: Receipt, label: 'Lịch sử giao dịch', to: '/system/transactions' },
        ]
    },
    {
        label: 'Quản lý Nội dung',
        items: [
            { icon: FolderOpen, label: 'Danh mục bài viết', to: '/system/categories' },
            { icon: FileText, label: 'Bài viết & Hướng dẫn', to: '/system/posts' },
        ]
    },
    {
        // label: 'Cấu hình hệ thống',
        // items: [
        //     { icon: Settings, label: 'Cấu hình Website', to: '/system/web-config' }, // Dùng Settings icon chuẩn hơn TreePine
        // ]
    }
];

const isActive = (path: string) => {
    if (path === '/system') return route.path === '/system'
    return route.path.startsWith(path)
}

const classIsCollapsed = computed(() => {
    return isCollapsed.value ? 'w-22' : 'w-72'
})

</script>

<template>
    <aside :class="[
        'relative flex flex-col transition-all duration-300 ease-in-out',
        classIsCollapsed
    ]"
        class="bg-gradient-to-b from-[#0a2540] via-[#0d3b66] to-[#0a2540] text-slate-300 min-h-screen border-r border-sky-800/40">

        <!-- Toggle button -->
        <button @click="isCollapsed = !isCollapsed"
            class="absolute -right-3 top-20 z-50 w-6 h-6 bg-sky-600 hover:bg-sky-500 border border-sky-400/50 rounded-full flex items-center justify-center text-white transition-all shadow-lg">
            <ChevronLeft :size="14" :class="{ 'rotate-180': isCollapsed }" class="transition-transform duration-300" />
        </button>

        <!-- Logo -->
        <div class="px-5 py-6 border-b border-sky-800/40">
            <RouterLink to="/System" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-sky-500/20 flex-shrink-0">
                    <img :src="logo" alt="Logo" class="w-full h-full object-cover" />
                </div>
                <transition name="fade">
                    <div v-if="!isCollapsed" class="overflow-hidden">
                        <h1 class="text-lg font-bold text-white tracking-tight leading-tight">
                            GiaPha<span class="text-sky-400">Online</span>
                        </h1>
                        <p class="text-[10px] text-sky-300/70 font-medium uppercase tracking-widest">Quản trị hệ thống
                        </p>
                    </div>
                </transition>
            </RouterLink>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 py-6 overflow-y-auto sidebar-scroll">
            <div v-for="(group, gi) in menuGroups" :key="gi" class="mb-6">
                <!-- Group label -->
                <transition name="fade">
                    <p v-if="!isCollapsed"
                        class="text-[10px] uppercase tracking-[0.15em] font-semibold text-sky-400/80 mb-3 px-6">
                        {{ group.label }}
                    </p>
                </transition>
                <div v-if="isCollapsed" class="w-8 h-px bg-sky-700/50 mx-auto mb-3"></div>

                <!-- Menu items -->
                <div class="space-y-1 px-3">
                    <RouterLink v-for="(item, ii) in group.items" :key="ii" :to="item.to" :class="[
                        'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive(item.to)
                            ? 'bg-sky-500/15 text-white shadow-sm shadow-sky-500/10'
                            : 'text-slate-300 hover:bg-sky-800/30 hover:text-white'
                    ]">
                        <div :class="[
                            'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200',
                            isActive(item.to)
                                ? 'bg-sky-400/20 text-sky-300'
                                : 'bg-sky-900/50 text-slate-400 group-hover:bg-sky-800/50 group-hover:text-slate-200'
                        ]">
                            <component :is="item.icon" :size="18" />
                        </div>
                        <transition name="fade">
                            <span v-if="!isCollapsed" class="truncate">{{ item.label }}</span>
                        </transition>

                        <!-- Active indicator -->
                        <div v-if="isActive(item.to) && !isCollapsed"
                            class="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50">
                        </div>
                    </RouterLink>
                </div>
            </div>
        </nav>

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

/* Custom scrollbar */
.sidebar-scroll::-webkit-scrollbar {
    width: 4px;
}

.sidebar-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
    background: rgba(96, 165, 250, 0.15);
    border-radius: 999px;
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(96, 165, 250, 0.3);
}
</style>