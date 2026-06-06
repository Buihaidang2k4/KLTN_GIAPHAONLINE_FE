<script setup lang="ts">
import { ref } from 'vue'
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

const userProfile = ref({
    name: 'Admin',
    role: 'Quản trị viên',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
})

const toggleProfile = () => {
    isProfileOpen.value = !isProfileOpen.value
}

const { logout, isLoggingOut } = useLogoutMutation();

const handleLogout = () => {
    isProfileOpen.value = false;
    isConfirmLogoutOpen.value = true;
}
</script>

<template>
    <!-- TOPBAR -->
    <header class="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">

        <!-- LEFT -->
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-sm">
                <ShieldCheck class="text-white" :size="18" />
            </div>

            <div class="flex flex-col leading-tight">
                <h2 class="text-sm font-bold text-gray-800">Quản trị hệ thống</h2>
                <span class="text-[10px] text-gray-400">Hệ thống Gia phả Online</span>
            </div>
        </div>

        <!-- RIGHT -->
        <div class="flex items-center gap-2">

            <!-- DARK MODE -->
            <button
                @click="isDark = !isDark"
                class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
            >
                <Sun v-if="!isDark" :size="17" />
                <Moon v-else :size="17" />
            </button>

            <!-- NOTIFICATION -->
            <NotificationDropdown />

            <!-- DIVIDER -->
            <div class="w-px h-4 bg-gray-200"></div>

            <!-- PROFILE -->
            <div class="relative">
                <button
                    @click="toggleProfile"
                    class="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
                >
                    <img
                        :src="userProfile.avatar"
                        class="w-8 h-8 rounded-lg object-cover border"
                    />

                    <div class="hidden md:flex flex-col leading-tight text-left">
                        <span class="text-xs font-semibold text-gray-700">
                            {{ userProfile.name }}
                        </span>
                        <span class="text-[10px] text-gray-400 uppercase">
                            {{ userProfile.role }}
                        </span>
                    </div>

                    <ChevronDown
                        :size="14"
                        class="text-gray-400 transition"
                        :class="{ 'rotate-180': isProfileOpen }"
                    />
                </button>

                <!-- DROPDOWN -->
                <div
                    v-if="isProfileOpen"
                    class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                >
                    <div class="px-3 py-2 border-b text-[10px] text-gray-400 font-bold uppercase">
                        Tài khoản
                    </div>

                    <!-- ITEM -->
                    <button
                        class="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
                    >
                        <User :size="14" />
                        Hồ sơ cá nhân
                    </button>

                    <button
                        class="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
                    >
                        <Settings :size="14" />
                        Cài đặt
                    </button>

                    <div class="h-px bg-gray-100 my-1"></div>

                    <button @click="handleLogout"
                        class="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50">
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