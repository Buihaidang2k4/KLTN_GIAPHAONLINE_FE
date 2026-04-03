<script setup lang="ts">
import { computed, ref } from "vue"
import { RouterLink, useRoute } from "vue-router"
import {
  LayoutDashboard,
  TreePine,
  Image,
  FileText,
  Mail,
  Settings,
  PanelLeftClose,
  ChevronRight,
  LogOut,
  CalendarDays,
  Sparkles,
  Medal,
  Hash,
} from "lucide-vue-next"

const route = useRoute()
const open = ref(true)

type MenuItem = {
  name: string
  path: string
  icon: any
  badge?: string | number
}

const menus: MenuItem[] = [
  { name: "Tổng quan", path: "/family/dashboard", icon: LayoutDashboard },
  { name: "Gia phả", path: "/family/chart", icon: TreePine },
  { name: "Bài viết", path: "/family/posts", icon: FileText },
  { name: "Chuyên mục", path: "/family/categories", icon: Hash },
  { name: "Sự kiện", path: "/family/events", icon: CalendarDays },
  { name: "Thành tích/ giải thưởng", path: "/family/achievements", icon: Medal },
  { name: "Album", path: "/family/album", icon: Image },
  { name: "Email", path: "/family/email", icon: Mail, badge: 2 },
  { name: "Cài đặt", path: "/family/settings", icon: Settings },
]

const isActive = (path: string) => route.path === path || route.path.startsWith(path + "/")

const userInfo = computed(() => ({
  name: "Phan Dũng",
  role: "Quản trị viên",
  initials: "PD",
}))
</script>

<template>
  <aside :class="open ? 'w-[272px]' : 'w-[84px]'"
    class="relative h-screen sticky top-0 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-out">
    <!-- Header -->
    <div class="relative h-[76px] px-4 flex items-center border-b border-slate-100">
      <div class="flex items-center w-full" :class="open ? 'justify-between' : 'justify-center'">
        <RouterLink to="/" class="flex items-center gap-3 min-w-0 group">
          <div
            class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-black shadow-sm ring-1 ring-orange-200/50">
            GP
          </div>

          <Transition name="nav-fade">
            <div v-if="open" class="min-w-0">
              <h1 class="text-[16px] font-extrabold text-slate-800 tracking-tight leading-none">
                GiaPha<span class="text-amber-600">Online</span>
              </h1>
              <p class="text-[10px] mt-1 font-semibold uppercase tracking-[0.18em] text-slate-400">
                User Panel
              </p>
            </div>
          </Transition>
        </RouterLink>

        <button v-if="open" @click="open = false"
          class="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition">
          <PanelLeftClose :size="18" />
        </button>
      </div>

      <button v-if="!open" @click="open = true"
        class="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition z-10">
        <ChevronRight :size="15" />
      </button>
    </div>

    <!-- Workspace card -->
    <div class="px-3 pt-4">
      <div :class="open ? 'px-3 py-3' : 'px-0 py-3 justify-center'"
        class="rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200/80 flex items-center gap-3 transition-all">
        <div
          class="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-indigo-600">
          <Sparkles :size="18" />
        </div>

        <Transition name="nav-fade">
          <div v-if="open" class="min-w-0">
            <p class="text-sm font-bold text-slate-800 truncate">Khu vực quản lý</p>
            <p class="text-[11px] text-slate-500 truncate">Quản lý nội dung và dữ liệu</p>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Menu -->
    <div class="flex-1 overflow-y-auto nav-scroll px-3 py-5">
      <div class="mb-3">
        <Transition name="nav-fade">
          <p v-if="open" class="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Điều hướng
          </p>
        </Transition>
      </div>

      <nav class="space-y-1.5">
        <RouterLink v-for="m in menus" :key="m.path" :to="m.path" :class="[
          'group relative flex items-center rounded-2xl transition-all duration-200',
          open ? 'px-3 py-2.5 gap-3' : 'px-0 py-2.5 justify-center',
          isActive(m.path)
            ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        ]">
          <!-- Active dot -->
          <div v-if="isActive(m.path)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-indigo-600" />

          <!-- Icon -->
          <div :class="[
            'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition',
            isActive(m.path)
              ? 'bg-white text-indigo-600 shadow-sm border border-indigo-100'
              : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-indigo-500 group-hover:border group-hover:border-slate-200'
          ]">
            <component :is="m.icon" :size="18" :stroke-width="isActive(m.path) ? 2.4 : 2" />
          </div>

          <!-- Label -->
          <Transition name="nav-fade">
            <div v-if="open" class="min-w-0 flex-1 flex items-center justify-between gap-2">
              <span class="truncate text-sm font-semibold tracking-tight">{{ m.name }}</span>

              <span v-if="m.badge"
                class="min-w-[20px] h-5 px-1.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                {{ m.badge }}
              </span>
            </div>
          </Transition>

          <!-- Tooltip when collapsed -->
          <div v-if="!open"
            class="pointer-events-none absolute left-[72px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all whitespace-nowrap rounded-lg bg-slate-900 text-white text-[11px] font-semibold px-3 py-1.5 shadow-lg z-50">
            {{ m.name }}
          </div>
        </RouterLink>
      </nav>
    </div>

    <!-- Footer user -->
    <div class="p-3 border-t border-slate-100 bg-slate-50/70">
      <div :class="open ? 'px-3 py-3' : 'px-0 py-2 justify-center'"
        class="rounded-2xl bg-white border border-slate-200/70 flex items-center gap-3 transition-all">
        <div
          class="relative shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold shadow-sm">
          {{ userInfo.initials }}
          <span
            class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
        </div>

        <Transition name="nav-fade">
          <div v-if="open" class="min-w-0 flex-1">
            <p class="text-sm font-bold text-slate-800 truncate leading-none">
              {{ userInfo.name }}
            </p>
            <p class="text-[11px] text-slate-500 truncate mt-1">
              {{ userInfo.role }}
            </p>
          </div>
        </Transition>

        <Transition name="nav-fade">
          <button v-if="open"
            class="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition">
            <LogOut :size="17" />
          </button>
        </Transition>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.nav-fade-enter-active,
.nav-fade-leave-active {
  transition: all 0.22s ease;
}

.nav-fade-enter-from,
.nav-fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

.nav-scroll::-webkit-scrollbar {
  width: 6px;
}

.nav-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.nav-scroll::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.18);
  border-radius: 999px;
}

.nav-scroll:hover::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.35);
}
</style>