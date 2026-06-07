<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import {
    Sun, Moon, User, LogOut, Settings,
    ChevronDown, ShieldCheck
} from 'lucide-vue-next'
import { useLogoutMutation } from '@/hooks/queries/auth/useLogoutMutation';
import ConfirmForm from '@/components/forms/common/ConfirmForm.vue';
import NotificationDropdown from '@/components/notification/NotificationDropdown.vue';

const isDark = ref(false)
const isProfileOpen = ref(false)
const isConfirmLogoutOpen = ref(false)
const profileRef = ref<HTMLElement | null>(null)

const userProfile = ref({
    name: 'Admin',
    role: 'Quản trị viên',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
})

const toggleProfile = () => {
    isProfileOpen.value = !isProfileOpen.value
}

const handleClickOutside = (event: MouseEvent) => {
    if (profileRef.value && !profileRef.value.contains(event.target as Node)) {
        isProfileOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

const { logout, isLoggingOut } = useLogoutMutation();

const handleLogout = () => {
    isProfileOpen.value = false;
    isConfirmLogoutOpen.value = true;
}
</script>

<template>
    <!-- TOPBAR -->
    <header
        class="sticky top-0 z-30 flex w-full shrink-0 items-center justify-between gap-3 overflow-visible border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md shadow-sm">

        <!-- LEFT -->
        <div class="flex min-w-0 items-center gap-2">
            <div
                class="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-amber-500 to-orange-400 shadow-sm shadow-amber-200">
                <ShieldCheck class="text-white" :size="18" />
            </div>

            <div class="flex min-w-0 flex-col leading-tight">
                <h2 class="truncate text-sm font-semibold text-slate-800">Quản trị hệ thống</h2>
                <span class="truncate text-[10px] uppercase tracking-[0.18em] text-slate-400">Hệ thống Gia phả
                    Online</span>
            </div>
        </div>

        <!-- RIGHT -->
        <div class="flex min-w-0 flex-wrap items-center justify-end gap-2">

            <!-- DARK MODE -->
            <button @click="isDark = !isDark"
                class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700">
                <Sun v-if="!isDark" :size="17" />
                <Moon v-else :size="17" />
            </button>

            <!-- NOTIFICATION -->
            <NotificationDropdown />

            <!-- DIVIDER -->
            <div class="w-px h-4 bg-gray-200"></div>

            <!-- PROFILE -->
            <div class="relative" ref="profileRef">
                <button @click="toggleProfile"
                    class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 shadow-sm transition hover:bg-slate-50">
                    <img :src="userProfile.avatar" class="h-9 w-9 rounded-xl border border-slate-200 object-cover" />

                    <div class="hidden md:flex flex-col leading-tight text-left">
                        <span class="text-xs font-semibold text-gray-700">
                            {{ userProfile.name }}
                        </span>
                        <span class="text-[10px] text-gray-400 uppercase">
                            {{ userProfile.role }}
                        </span>
                    </div>

                    <ChevronDown :size="14" class="text-gray-400 transition" :class="{ 'rotate-180': isProfileOpen }" />
                </button>

                <!-- DROPDOWN -->
                <div v-if="isProfileOpen"
                    class="absolute right-0 top-full z-60 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-1 shadow-xl shadow-slate-200/70">
                    <div
                        class="border-b border-slate-100 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Tài khoản
                    </div>

                    <!-- ITEM -->
                    <button class="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">
                        <User :size="14" />
                        Hồ sơ cá nhân
                    </button>

                    <button class="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">
                        <Settings :size="14" />
                        Cài đặt
                    </button>

                    <div class="h-px bg-gray-100 my-1"></div>

                    <button @click="handleLogout"
                        class="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-red-500 transition hover:bg-red-50">
                        <LogOut :size="14" />
                        Đăng xuất
                    </button>
                </div>
            </div>
        </div>
    </header>

    <ConfirmForm :show="isConfirmLogoutOpen" :is-loading="isLoggingOut" title="Xác nhận đăng xuất"
        description="Bạn có chắc muốn đăng xuất khỏi hệ thống không?" confirm-text="Đăng xuất" cancel-text="Hủy bỏ"
        variant="danger" @close="isConfirmLogoutOpen = false" @confirm="logout" />
</template>

<style scoped>
/* animation dropdown nhẹ */
</style>