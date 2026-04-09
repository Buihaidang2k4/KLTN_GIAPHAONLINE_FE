<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { reactive, watch } from 'vue';

const props = defineProps<{
    isOpen: boolean;
    member: any;
}>();

const emit = defineEmits(['close', 'save']);

interface Member {
    name: string;
    gender: 'male' | 'female';
    birthYear: string;
    photo: string;
    role: string;
}

const initialData: Member = {
    name: '',
    gender: 'male',
    birthYear: '',
    photo: '',
    role: ''
};

const newMember = reactive<Member>({ ...initialData });

watch(
    () => props.isOpen,
    (newVal) => {
        if (newVal) {
            Object.assign(newMember, initialData);
        }
    }
);

const closeModal = () => {
    emit('close');
};

const handleSave = () => {
    if (!newMember.name.trim()) {
        alert("Vui lòng nhập họ và tên thành viên");
        return;
    }
    emit('save', { ...newMember });
};

const promptPhotoUrl = () => {
    const url = window.prompt("Nhập đường dẫn (URL) ảnh chân dung:");
    if (url) {
        newMember.photo = url;
    }
};
</script>

<template>
    <!-- Modal sử dụng Transition của Vue -->
    <Transition name="fade">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <!-- Lớp nền mờ -->
            <div class="absolute inset-0 bg-stone-900/70 backdrop-blur-md" @click="closeModal"></div>

            <!-- Nội dung Modal -->
            <div
                class="relative w-full max-w-lg bg-stone-50 rounded-[3rem] shadow-2xl border border-white/20 overflow-hidden animate-pop-in">

                <!-- Thanh trang trí phong cách hoàng gia -->
                <div class="h-2.5 bg-gradient-to-r from-red-900 via-amber-500 to-red-900"></div>

                <!-- Nút đóng góc phải -->
                <button @click="closeModal"
                    class="absolute top-8 right-8 p-2 rounded-full bg-stone-200/50 text-stone-500 hover:bg-red-100 hover:text-red-700 transition-colors z-20">
                    <X />
                </button>

                <div class="px-8 pt-8 pb-6">
                    <!-- Phần tiêu đề -->
                    <div class="text-center mb-6">
                        <span class="text-[10px] font-black text-red-900 tracking-[0.4em] uppercase opacity-60">Gia
                            Phả Đại Việt</span>
                        <h2 class="text-2xl font-bold text-stone-800 font-serif italic mt-1">Khai Báo Thành Viên
                        </h2>
                        <div class="flex justify-center mt-3">
                            <div class="h-1 w-16 bg-red-900/20 rounded-full flex items-center justify-center">
                                <div class="h-1 w-6 bg-red-900 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Khu vực ảnh đại diện (Avatar) -->
                    <div class="flex justify-center mb-6">
                        <div class="relative group cursor-pointer" @click="promptPhotoUrl">
                            <div
                                class="absolute inset-0 bg-red-900 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity">
                            </div>
                            <div
                                class="relative h-24 w-24 rounded-full border-4 border-white shadow-xl overflow-hidden ring-1 ring-stone-200 bg-stone-200 flex items-center justify-center">
                                <img v-if="newMember.photo" :src="newMember.photo" class="h-full w-full object-cover" />
                                <svg v-else class="text-stone-400" xmlns="http://www.w3.org/2000/svg" width="36"
                                    height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>

                                <!-- Lớp phủ khi hover -->
                                <div
                                    class="absolute inset-0 bg-red-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path
                                            d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                                        <circle cx="12" cy="13" r="3" />
                                    </svg>
                                    <span class="text-[10px] font-bold mt-1 uppercase tracking-tighter">Đổi
                                        ảnh</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Form nhập liệu -->
                    <div class="space-y-4">
                        <!-- Nhập Họ Tên -->
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Họ
                                và Tên</label>
                            <div class="relative">
                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <input v-model="newMember.name" type="text" placeholder="Nhập tên thành viên..."
                                    class="w-full pl-12 pr-5 py-3 bg-white border border-stone-200 rounded-xl focus:ring-4 focus:ring-red-900/5 focus:border-red-900 outline-none transition-all text-stone-800 placeholder:text-stone-300 text-sm font-medium" />
                            </div>
                        </div>

                        <!-- Hàng giới tính và năm sinh -->
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-1.5">
                                <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Giới
                                    tính</label>
                                <div class="relative">
                                    <select v-model="newMember.gender"
                                        class="w-full pl-5 pr-10 py-3 bg-white border border-stone-200 rounded-xl focus:ring-4 focus:ring-red-900/5 focus:border-red-900 outline-none transition-all text-stone-800 appearance-none text-sm cursor-pointer font-medium">
                                        <option value="male">Nam (Tộc)</option>
                                        <option value="female">Nữ (Thị)</option>
                                    </select>
                                    <span
                                        class="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <path d="m6 9 6 6 6-6" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Năm
                                    sinh</label>
                                <input v-model="newMember.birthYear" type="text" placeholder="VD: 1990"
                                    class="w-full px-5 py-3 bg-white border border-stone-200 rounded-xl focus:ring-4 focus:ring-red-900/5 focus:border-red-900 outline-none transition-all text-stone-800 placeholder:text-stone-300 text-sm font-medium" />
                            </div>
                        </div>

                        <!-- Nhập Vai vế -->
                        <div class="space-y-1.5">
                            <label class="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">Vai
                                vế / Chức vụ</label>
                            <input v-model="newMember.role" type="text" placeholder="VD: Trưởng họ, Con thứ..."
                                class="w-full px-5 py-3 bg-white border border-stone-200 rounded-xl focus:ring-4 focus:ring-red-900/5 focus:border-red-900 outline-none transition-all text-stone-800 placeholder:text-stone-300 text-sm font-medium" />
                        </div>
                    </div>

                    <!-- Nút điều hướng -->
                    <div class="mt-8 flex flex-col sm:flex-row gap-3">
                        <button @click="closeModal"
                            class="order-2 sm:order-1 flex-1 px-6 py-3 rounded-xl font-bold text-stone-500 bg-stone-200/50 hover:bg-stone-200 transition-colors uppercase text-xs tracking-widest">
                            Bỏ qua
                        </button>
                        <button @click="handleSave"
                            class="order-1 sm:order-2 flex-[2] px-6 py-3 rounded-xl font-bold text-white bg-red-900 hover:bg-red-800 shadow-xl shadow-red-900/20 transition-all active:scale-95 uppercase text-xs tracking-widest">
                            Xác nhận thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
/* Hiệu ứng làm mờ nền khi Modal xuất hiện */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Hiệu ứng phóng to nhẹ cho Modal */
@keyframes pop-in {
    from {
        opacity: 0;
        transform: scale(0.92) translateY(30px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.animate-pop-in {
    animation: pop-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Hiệu ứng ánh sáng chạy qua nút bấm */
@keyframes shine {
    100% {
        transform: translateX(250%) skewX(-25deg);
    }
}

.group-hover\:animate-shine {
    animation: shine 0.8s ease-in-out forwards;
}

/* Tích hợp font serif sang trọng */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,700&display=swap');

.font-serif {
    font-family: 'Playfair Display', serif;
}

/* Đảm bảo giao diện không bị giật khi mở modal */
body.modal-open {
    overflow: hidden;
}
</style>