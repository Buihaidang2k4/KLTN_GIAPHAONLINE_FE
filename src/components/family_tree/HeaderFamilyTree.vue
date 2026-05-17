<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  isMiniMap: boolean;
  searchSuggestions: any[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: "toggleMiniMap"): void;
  (e: "resetView"): void;
  (e: "goToRoot"): void;
  (e: "search", query: string): void;
  (e: "clearSearch"): void;
  (e: "selectSuggestion", member: any): void;
  (e: "exportPDF"): void;
  (e: "exportPNG"): void;
  (e: "exportSVG"): void;
}>();

const searchQuery = defineModel<string>({ default: "" });
const searchInputRef = ref<HTMLInputElement | null>(null);
const showExportDropdown = ref(false);

const onSearch = () => {
  emit("search", searchQuery.value);
};

const onClearSearch = () => {
  searchQuery.value = "";
  emit("clearSearch");
  searchInputRef.value?.focus();
};

const onSelectSuggestion = (member: any) => {
  searchQuery.value = member.personName;
  emit("selectSuggestion", member);
};


const toggleExportDropdown = () => {
  showExportDropdown.value = !showExportDropdown.value;
};

const closeDropdown = () => {
  showExportDropdown.value = false;
};
// Các handler export
const handleExportPDF = () => {
  emit("exportPDF");
  closeDropdown();
};

const handleExportPNG = () => {
  emit("exportPNG");
  closeDropdown();
};

const handleExportSVG = () => {
  emit("exportSVG");
  closeDropdown();
};


</script>

<template>
  <header
    class="flex items-center justify-between border-b border-amber-200 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-5 py-2.5 shadow-sm">
    <!-- Bên trái: nút quay lại + tên trang -->
    <div class="flex items-center gap-3">
      <RouterLink to="/family/danh-sach"
        class="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-800 shadow-sm transition cursor-pointer hover:bg-amber-50 hover:border-amber-300">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Quay lại
      </RouterLink>
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
        <button @click="emit('toggleMiniMap')" :class="[
          'flex items-center gap-1.5 rounded-md cursor-pointer px-3 py-1.5 text-xs font-medium transition',
          isMiniMap
            ? 'bg-amber-100 text-amber-700 shadow-inner'
            : 'text-slate-500 hover:bg-amber-50 hover:text-amber-700',
        ]">
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <rect x="7" y="7" width="4" height="4" />
          </svg>
          {{ isMiniMap ? 'Tắt map' : 'Bật map' }}
        </button>
        <div class="h-4 w-px bg-slate-200"></div>
        <button @click="emit('resetView')"
          class="flex items-center gap-1.5 cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-amber-50 hover:text-amber-700">
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Đặt lại
        </button>
        <div class="h-4 w-px bg-slate-200"></div>
        <button @click="emit('goToRoot')"
          class="flex items-center gap-1.5 cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-amber-50 hover:text-amber-700">
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Về gốc
        </button>
        <div class="h-4 w-px bg-slate-200"></div>
        <!-- Dropdown xuất dữ liệu -->
        <div class="relative">
          <button @click="toggleExportDropdown"
            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 transition hover:bg-amber-50 hover:text-amber-700">
            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Xuất dữ liệu
            <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <div v-if="showExportDropdown" @click.stop
            class="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-lg border border-amber-100 bg-white shadow-xl">
            <div class="py-1">
              <button @click="handleExportPDF"
                class="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 transition">
                <svg class="h-4 w-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Xuất PDF
              </button>
              <button @click="handleExportPNG"
                class="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 transition">
                <svg class="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5-5 5-2-2-4 4" />
                </svg>
                Xuất PNG
              </button>
              <button @click="handleExportSVG"
                class="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-amber-50 transition">
                <svg class="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  stroke-width="2">
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7l-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z" />
                </svg>
                Xuất SVG
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Ô tìm kiếm -->
    <div class="relative flex items-center gap-1.5">
      <div class="relative">
        <svg class="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input v-model="searchQuery" ref="searchInputRef" type="text" placeholder="Tìm thành viên..."
          class="w-52 rounded-lg border border-amber-200 bg-white py-1.5 pl-8 pr-7 text-sm outline-none shadow-sm transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          @keyup.enter="onSearch" />
        <button v-if="searchQuery" @click="onClearSearch"
          class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition">
          <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <button @click="onSearch"
        class="rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600 active:scale-95">
        Tìm
      </button>

      <!-- Dropdown gợi ý -->
      <div v-if="searchSuggestions.length"
        class="absolute left-0 top-full z-10 mt-1.5 w-52 overflow-hidden rounded-xl border border-amber-100 bg-white shadow-lg">
        <div v-for="member in searchSuggestions" :key="member.id" @click="onSelectSuggestion(member)"
          class="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm transition hover:bg-amber-50">
          <img :src="member.avatar" class="h-7 w-7 rounded-full object-cover ring-1 ring-amber-200"
            @error="($event.target as HTMLImageElement).style.display = 'none'" />
          <span class="text-sm font-medium text-slate-700">{{ member.personName }}</span>
        </div>
      </div>
    </div>
  </header>
</template>
