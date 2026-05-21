<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  Info,
  Globe,
  ChevronDown,
  Settings,
  LogOut,
  ChevronRight,
  Home,
  Users,
} from 'lucide-vue-next'
import Topbar_Notification from '@/components/family_tree/topbar/Topbar_Notification.vue'
import { useProfileQuery } from '@/hooks/queries/auth/useProfileQuery'
import { useLogoutMutation } from '@/hooks/queries/auth/useLogoutMutation';
import ConfirmForm from '@/components/forms/common/ConfirmForm.vue';
import { notify } from '@/utils/notify';
import { useAccount } from '@/composables/accounts/useAccount';
import { useFamilyStore } from '@/store/family/useFamilyStore';
import { useFamiliesCurrentAccountQuery } from '@/hooks/queries/family/family/useFamily';
import background from '@/assets/images/bg_familyTree.jpg'

const { user: profileData } = useProfileQuery();
const accountId = computed(() => profileData?.value?.accountId ?? null)
const { account } = useAccount(accountId);
const currentUser = computed(() => ({
  name: account.value?.fullName || "User",
  role: account.value?.roles[0] || "Quản trị viên",
  avatar: account.value?.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
}))

// show profile menu
const isProfileMenuOpen = ref(false)
const profileMenuRef = ref<HTMLElement | null>(null)

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

const closeProfileMenu = () => {
  isProfileMenuOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node | null

  if (profileMenuRef.value && target && !profileMenuRef.value.contains(target)) {
    closeProfileMenu()
  }

  if (familyDropdownRef.value && target && !familyDropdownRef.value.contains(target)) {
    isFamilyDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// logout
const { logout, isLoggingOut } = useLogoutMutation();
const isConfirmingLogout = ref(false);

const confirmLogout = () => {
  isConfirmingLogout.value = true;
}

const handleLogout = async () => {
  try {
    await logout();
    isConfirmingLogout.value = false;
  } catch (error) {
    notify.error("Đăng xuất thất bại. Vui lòng thử lại.");
    isConfirmingLogout.value = false;
  }
}

// Select family full app
const { data: familiesData } = useFamiliesCurrentAccountQuery();
const safeFamilies = computed(() => familiesData.value?.data?.items || []);

const familyStore = useFamilyStore();
const isFamilyDropdownOpen = ref(false)
const familyDropdownRef = ref<HTMLElement | null>(null)

const selectedFamily = computed(() => {
  return safeFamilies.value.find(family => family.familyId === familyStore.currentFamilyId)
    ?? safeFamilies.value[0]
    ?? null
})

const hasInitializedDefaultFamily = ref(false)

watch(
  safeFamilies,
  (families) => {
    if (hasInitializedDefaultFamily.value || !families.length) return

    const firstFamily = families[0]
    if (!firstFamily?.familyId) return

    familyStore.setFamily(firstFamily.familyId)
    hasInitializedDefaultFamily.value = true
  },
  { immediate: true }
)

const toggleFamilyDropdown = () => {
  isFamilyDropdownOpen.value = !isFamilyDropdownOpen.value
}

const selectFamily = (familyId: number) => {
  familyStore.setFamily(familyId)
  isFamilyDropdownOpen.value = false
}

</script>

<template>
  <header
    class="topbar-vintage relative h-16 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 font-sans">

    <!-- Background image layer -->
    <div class="topbar-bg-image" :style="{ backgroundImage: `url(${background})` }"></div>

    <!-- Overlay for readability -->
    <div class="topbar-overlay"></div>

    <!-- Decorative bottom border -->
    <div class="topbar-ornament-bottom"></div>

    <div class="relative z-10 flex min-w-0 flex-1 items-center gap-4 md:gap-5">
      <nav class="hidden lg:flex items-center gap-2 text-sm font-medium">
        <button class="p-1.5 hover:bg-amber-900/8 rounded-md text-amber-700/60 hover:text-amber-900 transition-colors">
          <Home :size="16" />
        </button>
        <ChevronRight :size="14" class="text-amber-600/30" />
        <span class="text-amber-800/60 cursor-pointer hover:text-amber-900">Trang chủ</span>
      </nav>

      <!-- Family Selection -->
      <div ref="familyDropdownRef" class="relative hidden md:block w-full max-w-52">
        <div
          class="rounded-xl border border-amber-400/30 bg-white/50 px-3 py-1.5 shadow-[0_4px_12px_rgba(120,53,15,0.06)] transition-all hover:border-amber-500/40 hover:shadow-[0_6px_18px_rgba(120,53,15,0.1)] focus-within:border-amber-600/50 focus-within:shadow-[0_0_0_4px_rgba(180,83,9,0.08)]">
          <div class="flex items-center gap-2.5">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-700 to-yellow-600 text-amber-50 shadow-sm">
              <Users :size="15" />
            </div>

            <div class="min-w-0 flex-1">
              <p class="mb-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-amber-700/50">
                Dòng họ hiện tại
              </p>
              <button type="button"
                class="flex w-full items-center justify-between gap-2 bg-transparent text-left outline-none"
                @click="toggleFamilyDropdown">
                <span class="truncate text-sm font-semibold text-amber-950">
                  {{ selectedFamily?.familyName || 'Chọn dòng họ' }}
                </span>
                <ChevronDown class="shrink-0 text-amber-600/50 transition-transform duration-200"
                  :class="{ 'rotate-180': isFamilyDropdownOpen }" :size="15" />
              </button>
            </div>
          </div>
        </div>

        <div
          class="absolute top-[calc(100%+8px)] left-0 right-0 z-60 origin-top overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl transition-all duration-200"
          :class="isFamilyDropdownOpen
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-2 opacity-0'">
          <div class="mb-2 px-2 pt-1">
            <p class="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
              Danh sách dòng họ
            </p>
          </div>

          <button v-for="family in safeFamilies" :key="family.familyId" type="button"
            class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-50"
            :class="family.familyId === familyStore.currentFamilyId
              ? 'bg-slate-50 text-indigo-600'
              : 'text-slate-600'" @click="selectFamily(family.familyId)">
            <div class="h-2.5 w-2.5 rounded-full"
              :class="family.familyId === familyStore.currentFamilyId ? 'bg-indigo-500' : 'bg-slate-300'"></div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold">
                {{ family.familyName + (family.slug ? ` (${family.slug})` : '') }}
              </p>
            </div>
          </button>

          <p v-if="!safeFamilies.length" class="px-3 py-3 text-sm text-slate-400">
            Chưa có dòng họ nào để lựa chọn.
          </p>
        </div>
      </div>
    </div>

    <div class="relative z-10 flex shrink-0 items-center gap-3 md:gap-6">

      <div
        class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50/80 border border-emerald-200/50 rounded-full">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span class="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">Hệ thống ổn định</span>
      </div>

      <!-- Quick Tools -->
      <div class="flex items-center gap-1">
        <button class="p-2.5 text-amber-700/60 hover:bg-amber-900/8 hover:text-amber-900 rounded-xl transition-all">
          <Globe :size="20" />
        </button>

        <Topbar_Notification />
      </div>

      <!-- Separator -->
      <div class="h-8 w-px bg-amber-400/20 mx-1"></div>

      <!-- User Profile -->
      <div ref="profileMenuRef" class="relative">
        <button type="button" @click="toggleProfileMenu"
          class="flex items-center gap-3 pl-1 cursor-pointer group relative rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/40">
          <div class="flex flex-col items-end md:flex">
            <p class="text-sm font-bold text-amber-950 leading-none mb-1 group-hover:text-amber-700 transition-colors">
              {{ currentUser.name }}
            </p>
          </div>

          <div class="relative">
            <div
              class="w-10 h-10 rounded-xl bg-amber-200 overflow-hidden ring-2 ring-amber-100/60 shadow-md group-hover:ring-amber-300/60 transition-all">
              <img :src="currentUser.avatar" alt="User Avatar" class="w-full h-full object-cover" />
            </div>
            <div
              class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-amber-50 rounded-full">
            </div>
          </div>

          <ChevronDown :size="14" class="text-amber-600/50 group-hover:text-amber-900 transition-all"
            :class="{ 'rotate-180': isProfileMenuOpen }" />
        </button>

        <div
          class="absolute top-full right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 transition-all duration-200 z-60"
          :class="isProfileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'">
          <div class="px-3 py-2 mb-1">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tài khoản</p>
          </div>
          <button
            class="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl text-sm text-slate-700 transition-colors">
            <Settings :size="16" class="text-slate-400" /> Cấu hình hệ thống
          </button>
          <button
            class="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl text-sm text-slate-700 transition-colors">
            <Info :size="16" class="text-slate-400" /> Trung tâm trợ giúp
          </button>
          <div class="h-px bg-slate-100 my-2 mx-2"></div>
          <button @click="confirmLogout"
            class="w-full flex items-center gap-3 px-3 py-2 hover:bg-rose-50 rounded-xl text-sm text-rose-600 transition-colors font-semibold">
            <LogOut :size="16" /> Đăng xuất
          </button>
        </div>

        <!--  confirn logout -->
        <ConfirmForm :show="isConfirmingLogout" variant="danger" title="Xác nhận đăng xuất"
          description="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?" confirmText="Đăng xuất"
          cancelText="Hủy" :isLoading="isLoggingOut" @confirm="handleLogout" @close="isConfirmingLogout = false" />
      </div>
    </div>
  </header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.font-sans {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

/* === Background & Overlay === */
.topbar-vintage {
  border-bottom: none;
}

.topbar-bg-image {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  z-index: 0;
  pointer-events: none;
}

.topbar-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
      rgba(254, 249, 235, 0.96) 0%,
      rgba(252, 243, 214, 0.94) 30%,
      rgba(248, 235, 195, 0.88) 70%,
      rgba(254, 249, 235, 0.96) 100%);
  backdrop-filter: blur(2px);
  z-index: 1;
  pointer-events: none;
}

/* === Decorative Bottom Border === */
.topbar-ornament-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(90deg,
      transparent 0%,
      rgba(120, 53, 15, 0.15) 10%,
      rgba(180, 83, 9, 0.3) 30%,
      rgba(180, 83, 9, 0.35) 50%,
      rgba(180, 83, 9, 0.3) 70%,
      rgba(120, 53, 15, 0.15) 90%,
      transparent 100%);
}

.topbar-ornament-bottom::after {
  content: '';
  position: absolute;
  bottom: 3px;
  left: 15%;
  right: 15%;
  height: 1px;
  background: linear-gradient(90deg,
      transparent,
      rgba(120, 53, 15, 0.1),
      transparent);
}
</style>
