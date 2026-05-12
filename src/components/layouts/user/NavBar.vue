<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue"
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
  Hash,
  Columns3Cog,
  UserPen,
  ShieldCheck,
  History,
  BadgeDollarSign,
  Zap,
} from "lucide-vue-next"

import background from '@/assets/images/bg_familyTree.jpg'

const route = useRoute()
const open = ref(true)
const userCollapsed = ref(false)
const collapseBreakpoint = 1024

type MenuItem = {
  name: string
  path: string
  icon: any
  badge?: string | number
}

type MenuGroup = {
  title: string
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    title: "Tổng quan",
    items: [
      { name: "Tổng quan", path: "/family/tong-quan", icon: LayoutDashboard },
    ],
  },
  {
    title: "Nội dung gia đình",
    items: [
      { name: "Danh sách gia phả", path: "/family/danh-sach", icon: TreePine },
      { name: "Chuyên mục bài viết", path: "/family/danh-muc-bai-viet", icon: Hash },
      { name: "Bài viết", path: "/family/bai-viet", icon: FileText },
      { name: "Sự kiện", path: "/family/su-kien", icon: CalendarDays },
      { name: "Album", path: "/family/thu-vien-anh", icon: Image },
      { name: "Thành tích / giải thưởng", path: "/family/thanh-tich", icon: Medal },
      { name: "Sổ tay phong tục", path: "/family/phong-tuc", icon: Columns3Cog },
    ],
  },
  {
    title: "Quản lý",
    items: [
      { name: "Quản lí lời mời", path: "/family/quan-li-loi-moi", icon: Mail, badge: 2 },
      { name: "Quản lí thành viên", path: "/family/quan-li-thanh-vien", icon: ShieldCheck },
      { name: "Quản lí gói dịch vụ", path: "/family/dich-vu", icon: Zap },
      { name: "Lịch sử thanh toán", path: "/family/lich-su-thanh-toan", icon: BadgeDollarSign },
    ],
  },
  {
    title: "Tài khoản",
    items: [
      { name: "Tài khoản", path: "/family/tai-khoan", icon: UserPen },
      { name: "Lịch sử hoạt động", path: "/family/lich-su-hoat-dong", icon: History },
      { name: "Cài đặt", path: "/family/cau-hinh", icon: Settings },
    ],
  },
]

const isActive = (path: string) =>
  route.path === path || route.path.startsWith(path + "/")

const syncNavbarByScreen = () => {
  const shouldCollapse = window.innerWidth < collapseBreakpoint

  if (shouldCollapse) {
    open.value = false
    return
  }

  if (!userCollapsed.value) {
    open.value = true
  }
}

const collapseNavbar = () => {
  userCollapsed.value = true
  open.value = false
}

const expandNavbar = () => {
  userCollapsed.value = false
  open.value = true
}

onMounted(() => {
  syncNavbarByScreen()
  window.addEventListener("resize", syncNavbarByScreen)
})

onBeforeUnmount(() => {
  window.removeEventListener("resize", syncNavbarByScreen)
})
</script>
<template>
  <aside :class="open ? 'w-68' : 'w-16 lg:w-21'"
    class="navbar-vintage relative h-screen sticky top-0 flex flex-col transition-all duration-300 ease-out overflow-hidden">

    <!-- Background image layer -->
    <div class="navbar-bg-image" :style="{ backgroundImage: `url(${background})` }"></div>

    <!-- Overlay for readability -->
    <div class="navbar-overlay"></div>

    <!-- Decorative top ornament -->
    <div class="navbar-ornament-top"></div>

    <!-- Header -->
    <div class="relative z-10 h-19 px-4 flex items-center navbar-header-border">
      <div class="flex items-center w-full" :class="open ? 'justify-between' : 'justify-center'">
        <RouterLink to="/" class="flex items-center gap-3 min-w-0 group">
          <div
            class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-700 to-yellow-600 text-amber-50 flex items-center justify-center font-black shadow-lg ring-2 ring-amber-900/20">
            GP
          </div>

          <Transition name="nav-fade">
            <div v-if="open" class="min-w-0">
              <h1 class="text-[16px] font-extrabold tracking-tight leading-none text-amber-950">
                GiaPha<span class="text-amber-700">Online</span>
              </h1>
              <p class="text-[10px] mt-1 font-semibold uppercase tracking-[0.18em] text-amber-700/50">
                User Panel
              </p>
            </div>
          </Transition>
        </RouterLink>

        <button v-if="open" @click="collapseNavbar"
          class="w-8 h-8 rounded-xl flex items-center justify-center text-amber-800/50 hover:text-amber-900 hover:bg-amber-900/10 transition">
          <PanelLeftClose :size="18" />
        </button>
      </div>

      <button v-if="!open" @click="expandNavbar"
        class="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border border-amber-300 bg-amber-50 shadow-md flex items-center justify-center text-amber-700 hover:text-amber-900 hover:border-amber-500 transition z-10">
        <ChevronRight :size="15" />
      </button>
    </div>

    <!-- Decorative scrollwork divider -->
    <div v-if="open" class="navbar-scrollwork relative z-10">
      <svg viewBox="0 0 200 12" class="w-full h-3 opacity-30">
        <path d="M0,6 Q25,0 50,6 T100,6 T150,6 T200,6" fill="none" stroke="#78350f" stroke-width="0.8" />
        <circle cx="100" cy="6" r="2" fill="#78350f" opacity="0.5" />
        <circle cx="60" cy="6" r="1" fill="#78350f" opacity="0.3" />
        <circle cx="140" cy="6" r="1" fill="#78350f" opacity="0.3" />
      </svg>
    </div>

    <!-- Menu -->
    <div class="relative z-10 flex-1 overflow-y-auto nav-scroll px-3 py-5 space-y-5">
      <div v-for="(group, gIdx) in menuGroups" :key="group.title" class="space-y-2">
        <!-- Group divider ornament (not on first group) -->
        <div v-if="gIdx > 0 && open" class="navbar-group-divider">
          <span class="navbar-divider-line"></span>
          <span class="navbar-divider-diamond">◆</span>
          <span class="navbar-divider-line"></span>
        </div>

        <Transition name="nav-fade">
          <p v-if="open" class="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-900/80">
            {{ group.title }}
          </p>
        </Transition>

        <nav class="space-y-1.5">
          <RouterLink v-for="m in group.items" :key="m.path" :to="m.path" :class="[
            'group relative flex items-center rounded-2xl transition-all duration-200',
            open ? 'px-3 py-2.5 gap-3' : 'px-0 py-2 justify-center lg:py-2.5',
            isActive(m.path)
              ? 'navbar-item-active'
              : 'navbar-item-default'
          ]">
            <div v-if="isActive(m.path)"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-amber-700" />

            <div :class="[
              'shrink-0 rounded-xl flex items-center justify-center transition',
              open ? 'w-10 h-10' : 'w-9 h-9 lg:w-10 lg:h-10',
              isActive(m.path)
                ? 'bg-white/80 text-amber-800 shadow-sm border border-amber-300/50'
                : 'bg-amber-900/10 text-amber-800 group-hover:bg-white/60 group-hover:text-amber-900 group-hover:border group-hover:border-amber-300/30'
            ]">
              <component :is="m.icon" :size="18" :stroke-width="isActive(m.path) ? 2.4 : 2" />
            </div>

            <Transition name="nav-fade">
              <div v-if="open" class="min-w-0 flex-1 flex items-center justify-between gap-2">
                <span class="truncate text-sm font-semibold tracking-tight">
                  {{ m.name }}
                </span>

                <span v-if="m.badge"
                  class="min-w-5 h-5 px-1.5 rounded-full bg-amber-800/15 text-amber-800 text-[10px] font-bold flex items-center justify-center">
                  {{ m.badge }}
                </span>
              </div>
            </Transition>

            <div v-if="!open"
              class="pointer-events-none absolute left-18 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all whitespace-nowrap rounded-lg bg-amber-950 text-amber-50 text-[11px] font-semibold px-3 py-1.5 shadow-lg z-50">
              {{ m.name }}
            </div>
          </RouterLink>
        </nav>
      </div>
    </div>

    <!-- Decorative bottom ornament -->
    <div class="navbar-ornament-bottom relative z-10"></div>
  </aside>
</template>
<style scoped>
/* === Background & Overlay === */
.navbar-vintage {
  border-right: 1px solid rgba(120, 53, 15, 0.15);
}

.navbar-bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 0;
}

.navbar-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
      rgba(254, 249, 235, 0.96) 0%,
      rgba(252, 243, 214, 0.94) 40%,
      rgba(248, 235, 195, 0.88) 70%,
      rgba(254, 249, 235, 0.96) 100%);
  backdrop-filter: blur(2px);
  z-index: 1;
}

/* === Decorative Top Ornament === */
.navbar-ornament-top {
  position: relative;
  z-index: 2;
  height: 4px;
  background: linear-gradient(90deg,
      transparent 0%,
      rgba(120, 53, 15, 0.3) 15%,
      rgba(180, 83, 9, 0.5) 50%,
      rgba(120, 53, 15, 0.3) 85%,
      transparent 100%);
}

.navbar-ornament-top::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg,
      transparent,
      rgba(120, 53, 15, 0.15) 30%,
      rgba(120, 53, 15, 0.15) 70%,
      transparent);
}

/* === Header Border === */
.navbar-header-border {
  border-bottom: 1px solid rgba(120, 53, 15, 0.1);
}

.navbar-header-border::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 15%;
  right: 15%;
  height: 1px;
  background: linear-gradient(90deg,
      transparent,
      rgba(180, 83, 9, 0.2),
      transparent);
}

/* === Scrollwork Divider === */
.navbar-scrollwork {
  padding: 4px 16px;
}

/* === Group Dividers === */
.navbar-group-divider {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px 8px;
}

.navbar-divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg,
      transparent,
      rgba(120, 53, 15, 0.15),
      transparent);
}

.navbar-divider-diamond {
  font-size: 6px;
  color: rgba(120, 53, 15, 0.25);
  line-height: 1;
}

/* === Menu Item States === */
.navbar-item-active {
  background: linear-gradient(135deg, rgba(180, 83, 9, 0.12), rgba(245, 158, 11, 0.1));
  color: #78350f;
  box-shadow: 0 1px 3px rgba(120, 53, 15, 0.08);
  border: 1px solid rgba(180, 83, 9, 0.12);
}

.navbar-item-default {
  color: rgba(120, 53, 15, 0.78);
}

.navbar-item-default:hover {
  background: rgba(180, 83, 9, 0.06);
  color: #78350f;
}

/* === Bottom Ornament === */
.navbar-ornament-bottom {
  height: 40px;
  flex-shrink: 0;
  background:
    linear-gradient(180deg,
      transparent 0%,
      rgba(120, 53, 15, 0.03) 100%);
  border-top: 1px solid rgba(120, 53, 15, 0.08);
  position: relative;
}

.navbar-ornament-bottom::before {
  content: '❧';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  color: rgba(120, 53, 15, 0.18);
}

.navbar-ornament-bottom::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg,
      transparent 0%,
      rgba(120, 53, 15, 0.2) 15%,
      rgba(180, 83, 9, 0.35) 50%,
      rgba(120, 53, 15, 0.2) 85%,
      transparent 100%);
}

/* === Transitions === */
.nav-fade-enter-active,
.nav-fade-leave-active {
  transition: all 0.22s ease;
}

.nav-fade-enter-from,
.nav-fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

/* === Custom Scrollbar === */
.nav-scroll::-webkit-scrollbar {
  width: 6px;
}

.nav-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.nav-scroll::-webkit-scrollbar-thumb {
  background: rgba(120, 53, 15, 0.12);
  border-radius: 999px;
}

.nav-scroll:hover::-webkit-scrollbar-thumb {
  background: rgba(120, 53, 15, 0.25);
}
</style>
