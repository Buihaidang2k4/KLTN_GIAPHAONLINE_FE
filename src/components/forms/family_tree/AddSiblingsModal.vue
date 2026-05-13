<script setup lang="ts">
import { reactive, watch } from 'vue';

const props = defineProps<{
    isOpen: boolean;
    member?: any;   // node hiện tại (để biết quan hệ, nếu cần)
}>();

const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'save', data: any): void;
}>();

// Form data
const form = reactive({
    name: '',
    gender: 'male',
    title: '',
    photo: '',
});

// Reset form khi mở modal
watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        form.name = '';
        form.gender = 'male';
        form.title = '';
        form.photo = '';
    }
});

const handleClose = () => {
    emit('close');
};

const handleSave = () => {
    if (!form.name.trim()) {
        alert('Vui lòng nhập họ tên');
        return;
    }
    // Tạo object dữ liệu phù hợp với FamilyTree
    const newMember = {
        name: form.name.trim(),
        gender: form.gender,
        title: form.title.trim() || '???',
        photo: form.photo.trim() || 'https://cdn.balkan.app/shared/m60/1.jpg', // avatar mặc định
        // Các trường khác (id, fid, mid, pids, generation) sẽ do component cha xử lý
    };
    emit('save', newMember);
    handleClose();
};
</script>


<template>
    <!-- Modal overlay -->
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <div class="w-full max-w-md rounded-xl bg-white shadow-2xl transition-all">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                <h3 class="text-xl font-semibold text-slate-800">Thêm thành viên mới</h3>
                <button @click="handleClose" class="text-slate-400 hover:text-slate-600 transition">
                    ✕
                </button>
            </div>

            <!-- Form Body -->
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Họ và tên *</label>
                    <input v-model="form.name" type="text"
                        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                        placeholder="VD: Nguyễn Văn A" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Giới tính</label>
                    <div class="flex gap-4">
                        <label class="flex items-center gap-2">
                            <input type="radio" value="male" v-model="form.gender" class="text-amber-500" />
                            <span>Nam</span>
                        </label>
                        <label class="flex items-center gap-2">
                            <input type="radio" value="female" v-model="form.gender" class="text-amber-500" />
                            <span>Nữ</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Năm sinh / Thế hệ</label>
                    <input v-model="form.title" type="text"
                        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                        placeholder="VD: 1970 hoặc Thế hệ thứ 3" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-slate-700 mb-1">Ảnh đại diện (URL)</label>
                    <input v-model="form.photo" type="text"
                        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                        placeholder="https://example.com/avatar.jpg" />
                </div>
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
                <button @click="handleClose"
                    class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                    Hủy
                </button>
                <button @click="handleSave"
                    class="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-amber-600">
                    Thêm thành viên
                </button>
            </div>
        </div>
    </div>
</template>


<style scoped>
/* Không cần thêm css nếu dùng Tailwind */
</style>