<script setup lang="ts">
import { ref } from 'vue'
import { Search, Bell, Sun, Moon, ChevronDown, Settings, User, LogOut } from 'lucide-vue-next'

const isDark = ref(false)
const showDropdown = ref(false)
const searchQuery = ref('')
const notificationCount = ref(3)

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
}

// Đóng dropdown khi click bên ngoài
const closeDropdown = () => {
    showDropdown.value = false
}
</script>

<template>
    <header class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 py-3 sticky top-0 z-40">
        <div class="flex items-center justify-between">

            <!-- Search -->
            <div class="relative max-w-md w-full">
                <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input v-model="searchQuery" type="text" placeholder="Tìm kiếm thành viên, gia phả..." class="w-full pl-10 pr-4 py-2.5 bg-gray-100/80 border border-gray-200/50 rounded-xl 
                           text-sm text-gray-700 placeholder:text-gray-400
                           focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 focus:bg-white
                           transition-all duration-300" />
            </div>

            <!-- Right actions -->
            <div class="flex items-center gap-2">

                <!-- Theme toggle -->
                <button @click="isDark = !isDark" class="relative w-10 h-10 rounded-xl flex items-center justify-center
                           text-gray-500 hover:bg-gray-100 hover:text-gray-700
                           transition-all duration-200">
                    <Sun v-if="!isDark" :size="18" />
                    <Moon v-else :size="18" />
                </button>

                <!-- Notifications -->
                <button class="relative w-10 h-10 rounded-xl flex items-center justify-center
                               text-gray-500 hover:bg-gray-100 hover:text-gray-700
                               transition-all duration-200">
                    <Bell :size="18" />
                    <span v-if="notificationCount > 0" class="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full
                               flex items-center justify-center text-[10px] font-bold text-white
                               ring-2 ring-white">
                        {{ notificationCount }}
                    </span>
                </button>

                <!-- Divider -->
                <div class="w-px h-8 bg-gray-200 mx-2"></div>

                <!-- User dropdown -->
                <div class="relative" @blur="closeDropdown">
                    <button @click="toggleDropdown" class="flex items-center gap-3 px-3 py-1.5 rounded-xl
                               hover:bg-gray-100 transition-all duration-200 group">
                        <!-- Avatar -->
                        <div
                            class="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 
                                    flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-amber-400/30">
                            A
                        </div>
                        <div class="text-left hidden sm:block">
                            <p class="text-sm font-semibold text-gray-800 leading-tight">Admin</p>
                            <p class="text-[11px] text-gray-400 leading-tight">Quản trị viên</p>
                        </div>
                        <ChevronDown :size="14"
                            class="text-gray-400 group-hover:text-gray-600 transition-transform duration-200"
                            :class="{ 'rotate-180': showDropdown }" />
                    </button>

                    <!-- Dropdown menu -->
                    <Transition enter-active-class="transition ease-out duration-200"
                        enter-from-class="opacity-0 translate-y-1 scale-95"
                        enter-to-class="opacity-100 translate-y-0 scale-100"
                        leave-active-class="transition ease-in duration-150"
                        leave-from-class="opacity-100 translate-y-0 scale-100"
                        leave-to-class="opacity-0 translate-y-1 scale-95">
                        <div v-if="showDropdown" class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/50
                                   border border-gray-100 py-2 z-50">

                            <div class="px-4 py-3 border-b border-gray-100">
                                <p class="text-sm font-semibold text-gray-800">Admin User</p>
                                <p class="text-xs text-gray-400">admin@giaphaonline.com</p>
                            </div>

                            <div class="py-1">
                                <a href="#"
                                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                    <User :size="16" class="text-gray-400" />
                                    Hồ sơ cá nhân
                                </a>
                                <a href="#"
                                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                                    <Settings :size="16" class="text-gray-400" />
                                    Cài đặt hệ thống
                                </a>
                            </div>

                            <div class="border-t border-gray-100 py-1">
                                <a href="#"
                                    class="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                                    <LogOut :size="16" />
                                    Đăng xuất
                                </a>
                            </div>
                        </div>
                    </Transition>
                </div>

            </div>
        </div>
    </header>
</template>