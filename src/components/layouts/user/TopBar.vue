<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
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

const selectedFamily = computed(() =>
  safeFamilies.value.find(family => family.familyId === familyStore.currentFamilyId) ?? null
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
    class="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-50 font-sans shadow-[0_1px_2px_rgba(0,0,0,0,02)]">
    <div class="flex min-w-0 flex-1 items-center gap-4 md:gap-5">
      <nav class="hidden lg:flex items-center gap-2 text-sm font-medium">
        <button class="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors">
          <Home :size="16" />
        </button>
        <ChevronRight :size="14" class="text-slate-300" />
        <span class="text-slate-400 cursor-pointer hover:text-slate-600">Trang chủ</span>
      </nav>

      <!-- Family Selection -->
      <div ref="familyDropdownRef" class="relative hidden md:block w-full max-w-52">
        <div
          class="rounded-xl border border-slate-200/90 bg-linear-to-br from-white to-slate-50/80 px-3 py-1.5 shadow-[0_6px_18px_rgba(15,23,42,0.05)] transition-all hover:border-indigo-200 hover:shadow-[0_10px_24px_rgba(79,70,229,0.08)] focus-within:border-indigo-400 focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.10)]">
          <div class="flex items-center gap-2.5">
            <div
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-violet-500 text-white shadow-sm">
              <Users :size="15" />
            </div>

            <div class="min-w-0 flex-1">
              <p class="mb-0.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Dòng họ hiện tại
              </p>
              <button type="button"
                class="flex w-full items-center justify-between gap-2 bg-transparent text-left outline-none"
                @click="toggleFamilyDropdown">
                <span class="truncate text-sm font-semibold text-slate-700">
                  {{ selectedFamily?.familyName || 'Chọn dòng họ' }}
                </span>
                <ChevronDown class="shrink-0 text-slate-400 transition-transform duration-200"
                  :class="{ 'rotate-180': isFamilyDropdownOpen }" :size="15" />
              </button>
            </div>
          </div>
        </div>

        <div
          class="absolute top-[calc(100%+8px)] left-0 right-0 z-60 origin-top overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-[0_20px_40px_rgba(15,23,42,0.14)] backdrop-blur-md transition-all duration-200"
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
              ? 'bg-indigo-50 text-indigo-600'
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

    <div class="flex shrink-0 items-center gap-3 md:gap-6">

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

        <Topbar_Notification />
      </div>

      <!-- Separator -->
      <div class="h-8 w-px bg-slate-100 mx-1"></div>

      <!-- User Profile -->
      <div ref="profileMenuRef" class="relative">
        <button type="button" @click="toggleProfileMenu"
          class="flex items-center gap-3 pl-1 cursor-pointer group relative rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200">
          <div class="flex flex-col items-end md:flex">
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
            <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full">
            </div>
          </div>

          <ChevronDown :size="14" class="text-slate-400 group-hover:text-slate-800 transition-all"
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
            class="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl text-sm text-slate-600 transition-colors">
            <Settings :size="16" class="text-slate-400" /> Cấu hình hệ thống
          </button>
          <button
            class="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded-xl text-sm text-slate-600 transition-colors">
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

.group-hover\:opacity-100 {
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.05));
}
</style>
