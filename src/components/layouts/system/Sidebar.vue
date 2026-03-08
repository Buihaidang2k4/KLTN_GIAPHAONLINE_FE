<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Receipt,
    FileText,
    FolderOpen,
    LogOut,
    TreePine,
    ChevronLeft
} from 'lucide-vue-next'
import { ref, computed } from 'vue'
import logo from '@/assets/images/Logo_GiaPha.png'

const route = useRoute()
const isCollapsed = ref(false)

const menuGroups = [
    {
        label: 'Điều hành',
        items: [
            { icon: LayoutDashboard, label: 'Dashboard', to: '/system' },
        ]
    },
    {
        label: 'Kinh doanh',
        items: [
            { icon: Users, label: 'Người dùng', to: '/system/users' },
            { icon: CreditCard, label: 'Gói thanh toán', to: '/system/subscriptions' },
            { icon: Receipt, label: 'Giao dịch', to: '/system/transactions' },
        ]
    },
    {
        label: 'Nội dung',
        items: [
            { icon: FileText, label: 'Bài viết hướng dẫn', to: '/system/posts' },
            { icon: FolderOpen, label: 'Danh mục', to: '/system/categories' },
        ]
    },
    {
        label: 'Gia phả',
        items: [
            { icon: TreePine, label: 'Quản lý gia phả', to: '/system/family-trees' },
        ]
    }
]

const isActive = (path: string) => {
    if (path === '/system') return route.path === '/system'
    return route.path.startsWith(path)
}
</script>

<template>
    <aside :class="[
        'relative flex flex-col transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-72'
    ]"
        class="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-400 min-h-screen border-r border-slate-800/50">

        <!-- Toggle button -->
        <button @click="isCollapsed = !isCollapsed"
            class="absolute -right-3 top-20 z-50 w-6 h-6 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-full flex items-center justify-center text-slate-300 transition-all shadow-lg">
            <ChevronLeft :size="14" :class="{ 'rotate-180': isCollapsed }" class="transition-transform duration-300" />
        </button>

        <!-- Logo -->
        <div class="px-5 py-6 border-b border-slate-800/50">
            <RouterLink to="/system" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-amber-500/10 flex-shrink-0">
                    <img :src="logo" alt="Logo" class="w-full h-full object-cover" />
                </div>
                <transition name="fade">
                    <div v-if="!isCollapsed" class="overflow-hidden">
                        <h1 class="text-lg font-bold text-white tracking-tight leading-tight">
                            GiaPha<span class="text-amber-400">Online</span>
                        </h1>
                        <p class="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Quản trị hệ thống
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
                        class="text-[10px] uppercase tracking-[0.15em] font-semibold text-slate-600 mb-3 px-6">
                        {{ group.label }}
                    </p>
                </transition>
                <div v-if="isCollapsed" class="w-8 h-px bg-slate-800 mx-auto mb-3"></div>

                <!-- Menu items -->
                <div class="space-y-1 px-3">
                    <RouterLink v-for="(item, ii) in group.items" :key="ii" :to="item.to" :class="[
                        'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                        isActive(item.to)
                            ? 'bg-amber-500/10 text-amber-400 shadow-sm shadow-amber-500/5'
                            : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    ]">
                        <div :class="[
                            'flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200',
                            isActive(item.to)
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-slate-800/50 text-slate-500 group-hover:bg-slate-700/50 group-hover:text-slate-300'
                        ]">
                            <component :is="item.icon" :size="18" />
                        </div>
                        <transition name="fade">
                            <span v-if="!isCollapsed" class="truncate">{{ item.label }}</span>
                        </transition>

                        <!-- Active indicator -->
                        <div v-if="isActive(item.to) && !isCollapsed"
                            class="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50">
                        </div>
                    </RouterLink>
                </div>
            </div>
        </nav>

        <!-- Footer / Logout -->
        <div class="border-t border-slate-800/50 p-3">
            <button :class="[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                'text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200'
            ]">
                <div class="flex-shrink-0 w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <LogOut :size="18" />
                </div>
                <transition name="fade">
                    <span v-if="!isCollapsed">Đăng xuất</span>
                </transition>
            </button>
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

/* Custom scrollbar */
.sidebar-scroll::-webkit-scrollbar {
    width: 4px;
}

.sidebar-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.sidebar-scroll::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.15);
    border-radius: 999px;
}

.sidebar-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(148, 163, 184, 0.3);
}
</style>