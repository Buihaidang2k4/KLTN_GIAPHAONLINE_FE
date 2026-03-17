<script setup lang="ts">
import { ref } from 'vue'
import { Bell, Sun, Moon } from 'lucide-vue-next'

const isDark = ref(false)
const notificationCount = ref(3)
</script>

<template>
    <header class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 py-3 sticky top-0 z-40">
        <div class="flex items-center justify-between">

            <!-- Page info -->
            <div>
                <h2 class="text-lg font-semibold text-gray-800">Quản trị hệ thống</h2>
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

            </div>
        </div>
    </header>
</template>