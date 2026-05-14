<script setup lang="ts">
import { ref, computed } from "vue";
import router from "@/app/router";

interface Props {
  isMiniMap: boolean;
  searchSuggestions: any[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "toggleMiniMap"): void;
  (e: "resetView"): void;
  (e: "search", query: string): void;
  (e: "clearSearch"): void;
  (e: "selectSuggestion", member: any): void;
}>();

const searchQuery = defineModel<string>({ default: "" });
const searchInputRef = ref<HTMLInputElement | null>(null);

const onSearch = () => {
  emit("search", searchQuery.value);
};

const onClearSearch = () => {
  searchQuery.value = "";
  emit("clearSearch");
  searchInputRef.value?.focus();
};

const onSelectSuggestion = (member: any) => {
  searchQuery.value = member.name;
  emit("selectSuggestion", member);
};

const goBack = () => {
  router.go(-1);
};
</script>

<template>
  <header
    class="flex items-center justify-between border-b border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-5 py-2.5 shadow-sm"
  >
    <!-- Bên trái: nút quay lại + tên trang -->
    <div class="flex items-center gap-3">
      <button
        @click="goBack"
        class="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-800 shadow-sm transition cursor-pointer hover:bg-amber-50 hover:border-amber-300"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Quay lại
      </button>
      <div class="hidden h-6 w-px bg-amber-200 sm:block"></div>
      <div class="hidden items-center gap-2 sm:flex">
        <svg class="h-5 w-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        <span class="text-sm font-semibold text-amber-900 tracking-wide">Gia Phả</span>
      </div>
    </div>

    <!-- Bên phải: thanh công cụ + tìm kiếm -->
    <div class="flex items-center gap-2">
      <!-- Nhóm nút chức năng -->
      <div class="flex items-center gap-1 rounded-lg border border-amber-100 bg-white p-1 shadow-sm">
        <button
          @click="emit('toggleMiniMap')"
          :class="[
            'flex items-center gap-1.5 rounded-md cursor-pointer px-3 py-1.5 text-xs font-medium transition',
            isMiniMap
              ? 'bg-amber-100 text-amber-700 shadow-inner'
              : 'text-slate-500 hover:bg-amber-50 hover:text-amber-700',
          ]"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <rect x="7" y="7" width="4" height="4" />
          </svg>
          {{ isMiniMap ? 'Tắt map' : 'Bật map' }}
        </button>
        <div class="h-4 w-px bg-slate-200"></div>
        <button
          @click="emit('resetView')"
          class="flex items-center gap-1.5 cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-amber-50 hover:text-amber-700"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Đặt lại
        </button>
        <div class="h-4 w-px bg-slate-200"></div>
        <router-link
          to="/family/xuat-file"
          class="flex items-center gap-1.5 rounded-md px-3 cursor-pointer py-1.5 text-xs font-medium text-slate-500 transition hover:bg-amber-50 hover:text-amber-700"
        >
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Xuất ảnh
        </router-link>
      </div>

      <!-- Ô tìm kiếm -->
      <div class="relative flex items-center gap-1.5">
        <div class="relative">
          <svg
            class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            v-model="searchQuery"
            ref="searchInputRef"
            type="text"
            placeholder="Tìm thành viên..."
            class="w-52 rounded-lg border border-amber-200 bg-white py-1.5 pl-8 pr-7 text-sm outline-none shadow-sm transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
            @keyup.enter="onSearch"
          />
          <button
            v-if="searchQuery"
            @click="onClearSearch"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition"
          >
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button
          @click="onSearch"
          class="rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-95"
        >
          Tìm
        </button>

        <!-- Dropdown gợi ý -->
        <div
          v-if="searchSuggestions.length"
          class="absolute left-0 top-full z-10 mt-1.5 w-52 overflow-hidden rounded-xl border border-amber-100 bg-white shadow-lg"
        >
          <div
            v-for="member in searchSuggestions"
            :key="member.id"
            @click="onSelectSuggestion(member)"
            class="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm transition hover:bg-amber-50"
          >
            <img :src="member.photo" class="h-7 w-7 rounded-full object-cover ring-1 ring-amber-200" />
            <span class="text-slate-700">{{ member.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
