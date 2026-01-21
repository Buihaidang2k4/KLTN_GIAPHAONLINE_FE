<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  isOpen: boolean;
  member: any;
}>();

const emit = defineEmits(["close", "save"]);

// Khởi tạo an toàn: nếu member undefined thì gán object rỗng
const localMember = ref({});

watch(
  () => props.member,
  (newVal) => {
    if (newVal) {
      localMember.value = JSON.parse(JSON.stringify(newVal));
    } else {
      localMember.value = {};
    }
  },
  { immediate: true, deep: true },
);

const handleSave = () => {
  // Kiểm tra nếu có ID mới cho phép lưu để tránh lỗi updateNode(undefined)
  if (localMember.value && (localMember.value as any).id) {
    emit("save", localMember.value);
  } else {
    console.error("Không có dữ liệu thành viên để lưu!");
  }
};
</script>

<template>
  <!-- Modal Container: Khung to nhất, tạo lớp phủ mờ -->
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">

    <!-- Khung modal - Thiết kế Rồng Phượng/Gia Phả -->
    <div class="w-full max-w-lg overflow-hidden rounded-lg shadow-2xl 
             border-8 border-red-900  bg-yellow-50 text-red-900
             shadow-[0_0_20px_rgba(139,0,0,0.8)]">
      <!-- Header - Bảng hiệu chạm khắc -->
      <div class="relative h-20 bg-red-900 flex items-center justify-center border-b-4 border-yellow-600">
        <h2 class="text-3xl font-extrabold text-yellow-300 tracking-wider font-serif uppercase drop-shadow-lg">
          Gia phả - Thông tin thành viên
        </h2>
        <!-- Nút đóng -->
        <button @click="$emit('close')"
          class="absolute top-2 right-4 text-yellow-300 hover:text-white text-4xl font-light leading-none">
          &times;
        </button>
      </div>

      <!-- Nội dung - Mô phỏng trên giấy lụa -->
      <div class="px-8 py-6">
        <!-- Avatar -->
        <div class="flex justify-center mb-8">
          <img :src="localMember.photo || 'https://cdn.balkan.app/shared/m30/5.jpg'" class="h-28 w-28 rounded-full border-6 border-red-900 object-cover shadow-xl 
                   ring-4 ring-yellow-600 p-1" />
        </div>

        <!-- Form -->
        <div class="grid grid-cols-1 gap-5 md:grid-cols-2">

          <!-- Họ và Tên -->
          <div class="md:col-span-2">
            <label class="block text-sm font-extrabold text-red-900 mb-1 font-serif">Họ và Tên</label>
            <input v-model="localMember.name" type="text" class="w-full rounded-lg border-2 border-red-400 bg-yellow-100 p-3 
                     outline-none focus:ring-4 focus:ring-red-600 transition-all 
                     text-red-900 font-medium font-serif" />
          </div>

          <!-- Giới tính -->
          <div>
            <label class="block text-sm font-extrabold text-red-900 mb-1 font-serif">Giới tính</label>
            <select v-model="localMember.gender" class="w-full rounded-lg border-2 border-red-400 bg-yellow-100 p-3 
                     outline-none focus:ring-4 focus:ring-red-600 
                     text-red-900 font-medium font-serif">
              <option value="male">Nam (Thứ)</option>
              <option value="female">Nữ (Thị)</option>
            </select>
          </div>

          <!-- Năm sinh -->
          <div>
            <label class="block text-sm font-extrabold text-red-900 mb-1 font-serif">Năm sinh</label>
            <input v-model="localMember.title" type="text" placeholder="VD: 1990" class="w-full rounded-lg border-2 border-red-400 bg-yellow-100 p-3 
                     outline-none focus:ring-4 focus:ring-red-600
                     text-red-900 font-medium font-serif" />
          </div>

          <!-- Link ảnh chân dung -->
          <div class="md:col-span-2">
            <label class="block text-sm font-extrabold text-red-900 mb-1 font-serif">Link ảnh chân dung</label>
            <input v-model="localMember.photo" type="text" class="w-full rounded-lg border-2 border-red-400 bg-yellow-100 p-3 
                     outline-none focus:ring-4 focus:ring-red-600
                     text-red-900 font-medium font-serif" />
          </div>
        </div>

        <!-- Nút bấm - Màu sắc uy nghiêm -->
        <div class="mt-10 flex gap-4">
          <button @click="handleSave" class="flex-1 rounded-xl bg-red-800 py-3 font-extrabold text-yellow-100 shadow-xl 
                   hover:bg-red-900 active:scale-95 transition-all uppercase tracking-widest 
                   border-4 border-yellow-600 font-serif">
            Lưu Thông Tin
          </button>
          <button @click="$emit('close')" class="flex-1 rounded-xl bg-yellow-600 py-3 font-extrabold text-red-900 
                   hover:bg-yellow-700 transition-all uppercase tracking-wide
                   border-4 border-red-900 font-serif">
            Hủy Bỏ
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
