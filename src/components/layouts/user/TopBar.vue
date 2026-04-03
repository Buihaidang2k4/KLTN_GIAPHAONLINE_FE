<script setup lang="ts">
import { ref } from 'vue'
import {
  Info,
  Globe,
  ChevronDown,
  Bell,
  LayoutGrid,
  Settings,
  LogOut,
  ChevronRight,
  Home,
  Circle
} from 'lucide-vue-next'

const currentUser = ref({
  name: "Bùi Hải Đăng",
  role: "Quản trị viên",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
})

const hasNotification = ref(true)
const systemStatus = ref('online')
</script>

<template>
  <header
    class="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 font-sans shadow-[0_1px_2px_rgba(0,0,0,0,02)]">
    <div class="flex items-center gap-5">
      <nav class="hidden lg:flex items-center gap-2 text-sm font-medium">
        <button class="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors">
          <Home :size="16" />
        </button>
        <ChevronRight :size="14" class="text-slate-300" />
        <span class="text-slate-400 cursor-pointer hover:text-slate-600">Trang chủ</span>
      </nav>
    </div>

    <div class="flex items-center gap-3 md:gap-6">

      <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">Hệ thống ổn định</span>
      </div>

      <!-- Quick Tools -->
      <div class="flex items-center gap-1">
        <button class="p-2.5 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all">
          <Globe :size="20" />
        </button>

        <div class="relative group">
          <button
            class="p-2.5 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-all relative">
            <Bell :size="20" />
            <span v-if="hasNotification"
              class="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      <!-- Separator -->
      <div class="h-8 w-[1px] bg-slate-100 mx-1"></div>

      <!-- User Profile -->
      <div class="flex items-center gap-3 pl-1 cursor-pointer group relative">
        <div class="flex flex-col items-end hidden md:flex">
          <p class="text-sm font-bold text-slate-800 leading-none mb-1 group-hover:text-indigo-600 transition-colors">
            {{ currentUser.name }}
          </p>
          <span
            class="text-[10px] text-slate-400 font-semibold tracking-tighter uppercase">{{ currentUser.role }}</span>
        </div>

        <div class="relative">
          <div
            class="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden ring-2 ring-white shadow-md group-hover:ring-indigo-100 transition-all">
            <img :src="currentUser.avatar" alt="User Avatar" class="w-full h-full object-cover" />
          </div>
          <!-- User status dot -->
          <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full">
          </div>
        </div>

        <ChevronDown :size="14"
          class="text-slate-400 group-hover:text-slate-800 group-hover:translate-y-0.5 transition-all" />

        <!-- Dropdown Menu -->
        <div
          class="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-[60]">
          <div class="px-3 py-2 mb-1">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tài khoản</p>
          </div>
          <button
            class="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl text-sm text-slate-600 transition-colors">
            <Settings :size="16" class="text-slate-400" /> Cấu hình hệ thống
          </button>
          <button
            class="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl text-sm text-slate-600 transition-colors">
            <Info :size="16" class="text-slate-400" /> Trung tâm trợ giúp
          </button>
          <div class="h-[1px] bg-slate-100 my-2 mx-2"></div>
          <button
            class="w-full flex items-center gap-3 px-3 py-2 hover:bg-rose-50 rounded-xl text-sm text-rose-600 transition-colors font-semibold">
            <LogOut :size="16" /> Đăng xuất
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.font-sans {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* Hiệu ứng mờ backdrop cho dropdown */
.group-hover\:opacity-100 {
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.05));
}
</style>