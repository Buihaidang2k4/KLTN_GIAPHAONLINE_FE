<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <!-- Lớp phủ mờ nền -->
    <div class="absolute inset-0 bg-stone-900/60 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>

    <!-- Thân Modal -->
    <div
      class="relative w-full max-w-lg bg-stone-50 rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-modal-in">

      <!-- Đường viền trang trí phía trên -->
      <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-800 via-amber-500 to-red-800"></div>

      <!-- Nút đóng -->
      <button @click="$emit('close')"
        class="absolute top-6 right-6 p-2 rounded-full bg-stone-200/50 text-stone-600 hover:bg-red-100 hover:text-red-600 transition-colors z-20">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>

      <div class="px-8 pt-12 pb-10">
        <!-- Tiêu đề -->
        <div class="text-center mb-10">
          <h2 class="text-2xl font-bold text-stone-800 tracking-tight font-serif italic">Thông Tin Thành Viên</h2>
          <div class="w-16 h-1 bg-red-800 mx-auto mt-2 rounded-full opacity-20"></div>
        </div>

        <!-- Khu vực ảnh đại diện -->
        <div class="flex justify-center mb-10">
          <div class="relative group">
            <div
              class="absolute inset-0 bg-red-200 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity">
            </div>
            <div class="relative">
              <img :src="localMember.photo || 'https://cdn.balkan.app/shared/m30/5.jpg'" alt="Avatar"
                class="h-28 w-28 rounded-full border-4 border-white object-cover shadow-2xl ring-1 ring-stone-200" />
              <div
                class="absolute bottom-0 right-0 bg-red-800 p-2 rounded-full shadow-lg border-2 border-white text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Các trường nhập liệu -->
        <div class="space-y-6">
          <!-- Họ và Tên -->
          <div>
            <label class="flex items-center gap-2 text-sm font-semibold text-stone-600 mb-1.5 ml-1">
              <svg class="text-red-800" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Họ và Tên
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input v-model="localMember.name" type="text" placeholder="Nhập đầy đủ họ tên..."
                class="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-stone-800 placeholder:text-stone-400 shadow-sm" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <!-- Giới tính -->
            <div>
              <label class="flex items-center gap-2 text-sm font-semibold text-stone-600 mb-1.5 ml-1">
                <svg class="text-red-800" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                Giới tính
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </span>
                <select v-model="localMember.gender"
                  class="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-stone-800 shadow-sm appearance-none">
                  <option value="male">Nam (Thứ)</option>
                  <option value="female">Nữ (Thị)</option>
                </select>
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
            </div>

            <!-- Năm sinh -->
            <div>
              <label class="flex items-center gap-2 text-sm font-semibold text-stone-600 mb-1.5 ml-1">
                <svg class="text-red-800" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                Năm sinh
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 z-10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </span>
                <input v-model="localMember.title" type="text" placeholder="VD: 1990"
                  class="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-stone-800 placeholder:text-stone-400 shadow-sm" />
              </div>
            </div>
          </div>

          <!-- Link ảnh chân dung -->
          <div>
            <label class="flex items-center gap-2 text-sm font-semibold text-stone-600 mb-1.5 ml-1">
              <svg class="text-red-800" xmlns="http://www.w3.org/2000/vue" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
              </svg>
              Link ảnh chân dung
            </label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
              </span>
              <input v-model="localMember.photo" type="text" placeholder="https://link-anh-cua-ban.jpg"
                class="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all text-stone-800 placeholder:text-stone-400 shadow-sm" />
            </div>
          </div>
        </div>

        <!-- Các nút hành động -->
        <div class="mt-12 flex flex-col sm:flex-row gap-4">
          <button @click="handleSave"
            class="flex-1 bg-red-800 hover:bg-red-900 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-red-900/20 active:scale-[0.98] transition-all tracking-wide">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            LƯU THÔNG TIN
          </button>
          <button @click="$emit('close')"
            class="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold py-4 px-6 rounded-2xl active:scale-[0.98] transition-all">
            HỦY BỎ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  member: Object
});

const emit = defineEmits(['close', 'save']);

const localMember = ref({});

// Đồng bộ hóa dữ liệu khi prop member thay đổi
watch(() => props.member, (newVal) => {
  if (newVal) {
    localMember.value = { ...newVal };
  } else {
    localMember.value = {
      name: '',
      gender: 'male',
      title: '',
      photo: ''
    };
  }
}, { immediate: true });

const handleSave = () => {
  if (localMember.value.name) {
    emit('save', { ...localMember.value });
  } else {
    // Thông báo lỗi đơn giản (nên thay bằng toast)
    console.warn("Vui lòng nhập tên thành viên");
  }
};
</script>

<style scoped>
@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modal-in 0.3s ease-out forwards;
}

/* Tùy chỉnh thanh cuộn cho modal nếu nội dung quá dài */
.max-h-lg {
  max-height: 90vh;
  overflow-y: auto;
}
</style>