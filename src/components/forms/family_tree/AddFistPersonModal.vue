<script setup lang="ts">
import { ref, watch } from "vue";
import { X, Camera, Trash2, User, Phone, MapPin, BookOpen, Calendar, ChevronDown, AlertCircle } from 'lucide-vue-next';
import type { PersonReq } from "@/types/family/family_tree.types";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";
import { formatDate } from "@/utils/format-date";

const props = defineProps<{ isOpen: boolean }>();
const emit = defineEmits<{ close: []; save: [data: PersonReq] }>();

// Validation Schema
const schema = toTypedSchema(
    zod.object({
        fullName: zod.string().min(1, "Họ và tên không được để trống"),
        gender: zod.enum(["MALE", "FEMALE"]),
        lifeStatus: zod.enum(["ALIVE", "DECEASED"]),
        birthDate: zod.string().optional().nullable(),
        deathDate: zod.string().optional().nullable(),
        phoneNumber: zod.string().optional(),
        originPlace: zod.string().optional(),
        placeOfResidence: zod.string().optional(),
        biography: zod.string().optional(),
        graveLocation: zod.string().optional(),
        birthOrder: zod.number(),
    })
);

const { values, errors, defineField, handleSubmit, resetForm } = useForm({
    validationSchema: schema,
    initialValues: {
        fullName: "",
        gender: "MALE",
        lifeStatus: "ALIVE",
        birthOrder: 1,
        biography: "",
        birthDate: "",
        deathDate: "",
        phoneNumber: "",
        originPlace: "",
        graveLocation: "",
        placeOfResidence: "",
    }
});

const [fullName] = defineField("fullName");
const [gender] = defineField("gender");
const [lifeStatus] = defineField("lifeStatus");
const [birthDate] = defineField("birthDate");
const [deathDate] = defineField("deathDate");
const [phoneNumber] = defineField("phoneNumber");
const [originPlace] = defineField("originPlace");
const [placeOfResidence] = defineField("placeOfResidence");
const [biography] = defineField("biography");
const [graveLocation] = defineField("graveLocation");

const avatarFile = ref<File | undefined>();
const avatarPreview = ref<string | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

const handleFileChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
        avatarFile.value = file;
        avatarPreview.value = URL.createObjectURL(file);
    }
};

const removeAvatar = () => {
    avatarFile.value = undefined;
    avatarPreview.value = null;
    if (fileInputRef.value) fileInputRef.value.value = "";
};

const triggerFileInput = () => {
    fileInputRef.value?.click();
};

const onSave = handleSubmit((values) => {
    const payload: PersonReq = {
        ...values,
        birthDate: values.birthDate || undefined,
        deathDate: values.lifeStatus === 'DECEASED' ? (values.deathDate || undefined) : undefined,
        graveLocation: values.lifeStatus === 'DECEASED' ? (values.graveLocation || undefined) : undefined,
        avatar: avatarFile.value,
        generation: 1,
    };
    emit("save", payload);
    handleClose();
});

const handleClose = () => {
    resetForm();
    avatarFile.value = undefined;
    avatarPreview.value = null;
    emit("close");
};

watch(() => props.isOpen, (open) => {
    if (!open) {
        resetForm();
        avatarFile.value = undefined;
        avatarPreview.value = null;
    }
});
</script>

<template>
    <Transition name="fade">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" @click="handleClose"></div>

            <div
                class="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl border border-stone-200 overflow-hidden animate-pop-in max-h-[90vh] flex flex-col font-sans">
                <!-- Header trang trí -->
                <div class="h-2 bg-gradient-to-r from-red-800 via-amber-500 to-red-800 flex-shrink-0"></div>

                <!-- Nút đóng -->
                <button @click="handleClose"
                    class="absolute top-6 right-6 p-2 rounded-full bg-stone-100 text-stone-400 hover:bg-red-50 hover:text-red-600 transition-all z-20 shadow-sm">
                    <X :size="18" />
                </button>

                <div class="overflow-y-auto custom-scrollbar flex-1">
                    <div class="px-10 py-10">
                        <!-- Tiêu đề -->
                        <div class="text-center mb-12">
                            <span
                                class="text-[10px] font-bold text-red-800 tracking-[0.5em] uppercase opacity-50 block mb-2">Gia
                                Phả Đại Việt</span>
                            <h2 class="text-3xl font-bold text-stone-800 font-serif italic">Khai Báo Thành Viên</h2>
                            <div class="flex justify-center mt-4">
                                <div class="h-0.5 w-20 bg-amber-200 rounded-full relative">
                                    <div
                                        class="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-red-800 rounded-full">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col lg:flex-row gap-12">
                            <!-- Cột trái: Ảnh đại diện -->
                            <div class="flex flex-col items-center flex-shrink-0 lg:w-48 pt-2">
                                <div class="relative group">
                                    <div
                                        class="absolute inset-0 bg-amber-500 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity">
                                    </div>
                                    <div @click="triggerFileInput"
                                        class="relative h-40 w-40 rounded-full border-4 border-white shadow-2xl overflow-hidden ring-1 ring-stone-100 bg-stone-50 flex items-center justify-center cursor-pointer transition-transform hover:scale-[1.02]">
                                        <img v-if="avatarPreview" :src="avatarPreview"
                                            class="h-full w-full object-cover" />
                                        <div v-else class="flex flex-col items-center text-stone-300">
                                            <User :size="48" stroke-width="1.5" />
                                            <span class="text-[10px] font-bold mt-2 uppercase tracking-tighter">Thêm
                                                ảnh</span>
                                        </div>

                                        <div
                                            class="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-[2px]">
                                            <Camera :size="24" />
                                            <span class="text-[10px] font-bold mt-1 uppercase">Thay đổi</span>
                                        </div>
                                    </div>

                                    <button v-if="avatarPreview" @click.stop="removeAvatar"
                                        class="absolute top-0 right-0 p-2 bg-white text-red-500 rounded-full shadow-lg hover:bg-red-50 transition-colors border border-stone-100">
                                        <Trash2 :size="14" />
                                    </button>
                                </div>
                                <input ref="fileInputRef" type="file" accept="image/*" class="hidden"
                                    @change="handleFileChange" />
                                <p class="text-[10px] text-stone-400 mt-4 uppercase tracking-widest font-bold">Ảnh chân
                                    dung</p>
                            </div>

                            <!-- Cột phải: Form nhập liệu (Bố cục ngang hoàn toàn) -->
                            <div class="flex-1 space-y-5">
                                <!-- Group: Thông tin cơ bản -->
                                <div class="space-y-4">
                                    <h3
                                        class="text-[11px] font-bold text-red-800 uppercase tracking-widest border-b border-stone-100 pb-2 mb-4">
                                        Thông tin cơ bản</h3>

                                    <!-- Họ và Tên -->
                                    <div class="grid grid-cols-[150px_1fr] gap-6 items-start">
                                        <label
                                            class="text-[12px] font-bold text-stone-500 uppercase tracking-widest pt-3 flex items-center gap-2">
                                            Họ và Tên <span class="text-red-500">*</span>
                                        </label>
                                        <div class="space-y-1">
                                            <div class="relative">
                                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300">
                                                    <User :size="16" />
                                                </span>
                                                <input v-model="fullName" type="text"
                                                    placeholder="Nhập tên thành viên..."
                                                    :class="['w-full pl-11 pr-5 py-3 bg-stone-50 border rounded-2xl focus:ring-4 focus:ring-red-900/5 focus:border-red-800 outline-none transition-all text-sm font-medium', errors.fullName ? 'border-red-300 bg-red-50/30' : 'border-stone-100']" />
                                            </div>
                                            <div v-if="errors.fullName"
                                                class="flex items-center gap-1 text-[10px] text-red-500 font-bold ml-1">
                                                <AlertCircle :size="12" />
                                                {{ errors.fullName }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Giới tính -->
                                    <div class="grid grid-cols-[150px_1fr] gap-6 items-center">
                                        <label
                                            class="text-[12px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                                            Giới tính
                                        </label>
                                        <div class="relative">
                                            <select v-model="gender"
                                                class="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-red-900/5 focus:border-red-800 outline-none transition-all text-stone-800 text-sm font-medium appearance-none cursor-pointer">
                                                <option value="MALE">Nam (Tộc)</option>
                                                <option value="FEMALE">Nữ (Thị)</option>
                                            </select>
                                            <ChevronDown
                                                class="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none"
                                                :size="16" />
                                        </div>
                                    </div>

                                    <!-- Ngày sinh -->
                                    <div class="grid grid-cols-[150px_1fr] gap-6 items-center">
                                        <label
                                            class="text-[12px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                                            Ngày sinh
                                        </label>
                                        <div class="relative">
                                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300">
                                                <Calendar :size="16" />
                                            </span>
                                            <input v-model="birthDate" type="date"
                                                class="w-full pl-11 pr-4 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-red-900/5 focus:border-red-800 outline-none transition-all text-sm font-medium text-stone-800" />
                                        </div>
                                    </div>

                                    <!-- Tình trạng -->
                                    <div class="grid grid-cols-[150px_1fr] gap-6 items-center">
                                        <label
                                            class="text-[12px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                                            Tình trạng
                                        </label>
                                        <div class="relative">
                                            <select v-model="lifeStatus"
                                                class="w-full px-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-red-900/5 focus:border-red-800 outline-none transition-all text-stone-800 text-sm font-medium appearance-none cursor-pointer">
                                                <option value="ALIVE">Còn sống</option>
                                                <option value="DEAD">Đã mất</option>
                                            </select>
                                            <ChevronDown
                                                class="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none"
                                                :size="16" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Group: Khi Đã mất (Animation) -->
                                <Transition name="expand">
                                    <div v-if="values.lifeStatus === 'DEAD'"
                                        class="space-y-4 pt-4 border-t border-red-50 bg-red-50/10 p-5 rounded-2xl">
                                        <div class="grid grid-cols-[130px_1fr] gap-6 items-center">
                                            <label
                                                class="text-[11px] font-bold text-red-800 uppercase tracking-widest">Ngày
                                                mất</label>
                                            <div class="relative">
                                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-red-200">
                                                    <Calendar :size="16" />
                                                </span>
                                                <input v-model="deathDate" type="date"
                                                    class="w-full pl-11 pr-4 py-3 bg-white border border-red-100 rounded-2xl focus:ring-4 focus:ring-red-900/5 focus:border-red-800 outline-none transition-all text-sm font-medium text-stone-800" />
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-[130px_1fr] gap-6 items-center">
                                            <label
                                                class="text-[11px] font-bold text-red-800 uppercase tracking-widest">Nơi
                                                an táng</label>
                                            <div class="relative">
                                                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-red-200">
                                                    <MapPin :size="16" />
                                                </span>
                                                <input v-model="graveLocation" type="text"
                                                    placeholder="Nhập địa chỉ an táng..."
                                                    class="w-full pl-11 pr-5 py-3 bg-white border border-red-100 rounded-2xl focus:ring-4 focus:ring-red-900/5 focus:border-red-800 outline-none transition-all text-sm font-medium text-stone-800 placeholder:text-red-100" />
                                            </div>
                                        </div>
                                    </div>
                                </Transition>

                                <!-- Group: Liên hệ & Địa chỉ -->
                                <div class="space-y-4 pt-4">
                                    <h3
                                        class="text-[11px] font-bold text-stone-400 uppercase tracking-widest border-b border-stone-100 pb-2 mb-4">
                                        Liên hệ & Địa chỉ</h3>

                                    <div class="grid grid-cols-[150px_1fr] gap-6 items-center">
                                        <label class="text-[12px] font-bold text-stone-500 uppercase tracking-widest">Số
                                            điện thoại</label>
                                        <div class="relative">
                                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300">
                                                <Phone :size="16" />
                                            </span>
                                            <input v-model="phoneNumber" type="tel" placeholder="Nhập số điện thoại..."
                                                class="w-full pl-11 pr-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-red-900/5 focus:border-red-800 outline-none transition-all text-sm font-medium text-stone-800" />
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-[150px_1fr] gap-6 items-center">
                                        <label
                                            class="text-[12px] font-bold text-stone-500 uppercase tracking-widest">Quê
                                            quán</label>
                                        <div class="relative">
                                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300">
                                                <MapPin :size="16" />
                                            </span>
                                            <input v-model="originPlace" type="text" placeholder="Nhập nguyên quán..."
                                                class="w-full pl-11 pr-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-red-900/5 focus:border-red-800 outline-none transition-all text-sm font-medium text-stone-800" />
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-[150px_1fr] gap-6 items-center">
                                        <label
                                            class="text-[12px] font-bold text-stone-500 uppercase tracking-widest">Nơi ở
                                            hiện tại</label>
                                        <div class="relative">
                                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300">
                                                <MapPin :size="16" />
                                            </span>
                                            <input v-model="placeOfResidence" type="text"
                                                placeholder="Nhập địa chỉ hiện tại..."
                                                class="w-full pl-11 pr-5 py-3 bg-stone-50 border border-stone-100 rounded-2xl focus:ring-4 focus:ring-red-900/5 focus:border-red-800 outline-none transition-all text-sm font-medium text-stone-800" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Tiểu sử -->
                                <div class="grid grid-cols-[150px_1fr] gap-6 items-start pt-4">
                                    <label
                                        class="text-[12px] font-bold text-stone-500 uppercase tracking-widest pt-3">Tiểu
                                        sử</label>
                                    <div class="relative">
                                        <span class="absolute left-4 top-4 text-stone-300">
                                            <BookOpen :size="16" />
                                        </span>
                                        <textarea v-model="biography" rows="3"
                                            placeholder="Ghi chú thêm về cuộc đời và sự nghiệp..."
                                            class="w-full pl-11 pr-5 py-4 bg-stone-50 border border-stone-100 rounded-[1.5rem] focus:ring-4 focus:ring-red-900/5 focus:border-red-800 outline-none transition-all text-sm font-medium text-stone-800 resize-none"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Footer: Nút bấm -->
                        <div class="mt-12 flex items-center justify-end gap-4 pt-8 border-t border-stone-100">
                            <button @click="handleClose"
                                class="px-8 py-3.5 rounded-2xl font-bold text-stone-400 bg-stone-100 hover:bg-stone-200 transition-all uppercase text-[10px] tracking-[0.2em]">
                                Hủy bỏ
                            </button>
                            <button @click="onSave"
                                class="px-10 py-3.5 rounded-2xl font-bold text-white bg-red-900 hover:bg-red-800 shadow-xl shadow-red-900/20 transition-all active:scale-[0.98] uppercase text-[10px] tracking-[0.2em] flex items-center gap-3 group">
                                <span>Khởi tạo thành viên</span>
                                <div class="w-1.5 h-1.5 bg-amber-400 rounded-full group-hover:animate-ping"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@keyframes pop-in {
    from {
        opacity: 0;
        transform: scale(0.96) translateY(20px);
    }

    to {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

.animate-pop-in {
    animation: pop-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.expand-enter-active,
.expand-leave-active {
    transition: all 0.3s ease;
    max-height: 400px;
    opacity: 1;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-10px);
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #f1f1f1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #e5e5e5;
}

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,700&display=swap');

.font-serif {
    font-family: 'Playfair Display', serif;
}
</style>
