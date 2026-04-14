<script setup lang="ts">
import { ref } from "vue"
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
  CalendarDays,
  Medal,
  Hash
  , Columns3Cog,
} from "lucide-vue-next"

const route = useRoute()
const open = ref(true)

type MenuItem = {
  name: string
  path: string
  icon: any
  badge?: string | number
}

type ActionItem = {
  name: string
  path: string
  icon: any
}

const menus: MenuItem[] = [
  { name: "Tổng quan", path: "/family/tong-quan", icon: LayoutDashboard },
  { name: "Danh sách gia phả", path: "/family/danh-sach", icon: TreePine },
  // { name: "Sơ đồ cây", path: "/family/so-do-cay", icon: TreePine },
  { name: "Chuyên mục bài viết", path: "/family/danh-muc-bai-viet", icon: Hash },
  { name: "Bài viết", path: "/family/bai-viet", icon: FileText },
  { name: "Sự kiện", path: "/family/su-kien", icon: CalendarDays },
  { name: "Thành tích/ giải thưởng", path: "/family/thanh-tich", icon: Medal },
  { name: "Sổ tay phong tục", path: "/family/phong-tuc", icon: Columns3Cog },
  { name: "Album", path: "/family/thu-vien-anh", icon: Image },
  { name: "Email", path: "/family/hop-thu", icon: Mail, badge: 2 },
  { name: "Cài đặt", path: "/family/cau-hinh", icon: Settings },
]

const isActive = (path: string) => route.path === path || route.path.startsWith(path + "/")

</script>

<template>
  <aside :class="open ? 'w-68' : 'w-21'"
    class="relative h-screen sticky top-0 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ease-out">
    <!-- Header -->
    <div class="relative h-19 px-4 flex items-center border-b border-slate-100">
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
                class="min-w-5 h-5 px-1.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold flex items-center justify-center">
                {{ m.badge }}
              </span>
            </div>
          </Transition>

          <!-- Tooltip when collapsed -->
          <div v-if="!open"
            class="pointer-events-none absolute left-18 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all whitespace-nowrap rounded-lg bg-slate-900 text-white text-[11px] font-semibold px-3 py-1.5 shadow-lg z-50">
            {{ m.name }}
          </div>
        </RouterLink>
      </nav>
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