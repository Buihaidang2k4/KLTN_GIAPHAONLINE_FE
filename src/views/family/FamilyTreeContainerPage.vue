<script setup lang="ts">
import { ref, computed } from 'vue';
import { Users, GitBranch, BookOpen, Pencil, Trash2, Plus, X } from 'lucide-vue-next';
import TreeBanner from '@/assets/images/TreeBanner.png';
import router from '@/app/router';

interface Family {
    id: number;
    name: string;
    members: number;
    generations: number;
    capacity: number;
    image: string;
}

const families = ref<Family[]>([
    { id: 1, name: "Nguyễn Tộc - Nhà Thờ Tổ", members: 342, generations: 14, capacity: 1204, image: TreeBanner },
    { id: 2, name: "Lê Văn Chi Họ Cầu Giấy", members: 89, generations: 6, capacity: 450, image: TreeBanner },
    { id: 3, name: "Gia Đình Phạm Minh", members: 12, generations: 3, capacity: 120, image: TreeBanner }
]);

const isModalOpen = ref(false);
const modalType = ref<'add' | 'edit'>('add');
const formData = ref<Partial<Family>>({ id: undefined, name: '', members: 0, generations: 0, image: '' });
const toast = ref({ show: false, message: '' });

const totalMembers = computed(() => families.value.reduce((sum, f) => sum + f.members, 0));
const totalCapacityUsed = computed(() => families.value.reduce((sum, f) => sum + f.capacity, 0));

const openModal = (type: 'add' | 'edit', data: Partial<Family> | null = null) => {
    modalType.value = type;
    formData.value = type === 'edit' && data ? { ...data } : { id: undefined, name: '', members: 0, generations: 0, image: '' };
    isModalOpen.value = true;
};

const closeModal = () => { isModalOpen.value = false; };

const showToast = (msg: string) => {
    toast.value = { show: true, message: msg };
    setTimeout(() => toast.value.show = false, 3000);
};

const saveFamily = () => {
    if (!formData.value.name) return;

    if (modalType.value === 'edit') {
        const index = families.value.findIndex(f => f.id === formData.value.id);
        if (index !== -1) {
            families.value[index] = { ...(families.value[index]), ...formData.value } as Family;
        }
        showToast("Đã cập nhật gia phả");
    } else {
        families.value.push({
            id: Date.now(),
            name: formData.value.name,
            members: formData.value.members || 0,
            generations: formData.value.generations || 0,
            capacity: Math.floor(Math.random() * 300) + 100,
            image: formData.value.image || TreeBanner
        });
        showToast("Thêm gia phả thành công");
    }
    closeModal();
};

const deleteFamily = (id: number) => {
    families.value = families.value.filter(f => f.id !== id);
    showToast("Đã xóa dữ liệu");
};

const viewDetail = (f: Family) => {
    showToast(`Đang mở: ${f.name}`);
    // router.push(`/family/chart/${f.id}`);
    router.push({ name: "FamilyChart" });
};

</script>

<template>
    <div id="app" class="min-h-screen bg-[#fbfaf5] p-6 md:p-8">
        <main class="max-w-7xl mx-auto">
            <!-- Header -->
            <div class="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-extrabold text-slate-900 tracking-tight">Thư viện Gia Phả</h1>
                    <p class="text-sm text-slate-500 font-medium">Hệ thống lưu trữ và số hóa phả hệ dòng tộc</p>
                </div>
                <div class="bg-white px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-3 shadow-sm">
                    <div class="flex flex-col border-r border-slate-100 pr-3">
                        <span class="text-[9px] font-bold text-slate-400 uppercase">Dung lượng đã dùng</span>
                        <span class="text-xs font-bold text-slate-700">{{ totalCapacityUsed }} MB / 5120 MB</span>
                    </div>
                    <div class="flex flex-col">
                        <span class="text-[9px] font-bold text-slate-400 uppercase">Tổng nhân khẩu</span>
                        <span class="text-xs font-bold text-slate-700">{{ totalMembers }} người</span>
                    </div>
                </div>
            </div>

            <!-- Grid of Family Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-16">
                <div v-for="family in families" :key="family.id"
                    class="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm card-hover flex flex-col group">
                    <!-- Family Image -->
                    <div class="relative h-36 overflow-hidden">
                        <img :src="family.image" :alt="family.name"
                            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent">
                        </div>
                        <div class="absolute bottom-3 left-4 right-4">
                            <span
                                class="bg-red-600/90 backdrop-blur-md text-[8px] font-bold text-white px-1.5 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">
                                {{ family.capacity }} MB
                            </span>
                            <h3 class="text-base font-bold text-white leading-tight drop-shadow-md">{{ family.name }}
                            </h3>
                        </div>
                    </div>

                    <!-- Family Info -->
                    <div class="p-4 flex-grow flex flex-col">
                        <div class="flex justify-between items-center mb-4">
                            <div class="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-full">
                                <Users class="w-3 h-3 text-slate-400" />
                                <span class="text-[10px] font-bold text-slate-600">{{ family.members }} thành
                                    viên</span>
                            </div>
                            <div class="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-full">
                                <GitBranch class="w-3 h-3 text-slate-400" />
                                <span class="text-[10px] font-bold text-slate-600">{{ family.generations }} đời</span>
                            </div>
                        </div>

                        <!-- Storage Bar -->
                        <div class="mb-4">
                            <div class="flex justify-between text-[9px] font-bold text-slate-400 uppercase mb-1.5">
                                <span>Tỷ lệ lưu trữ</span>
                                <span>{{ ((family.capacity / 1024) * 100).toFixed(1) }}%</span>
                            </div>
                            <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-red-500 transition-all duration-1000 ease-out"
                                    :style="{ width: (family.capacity / 1024) * 100 + '%' }"></div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="mt-auto flex items-center gap-2">
                            <button @click="viewDetail(family)"
                                class="flex-grow bg-slate-900 hover:bg-red-700 text-white py-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-slate-200">
                                <BookOpen class="w-3 h-3" />
                                Mở Gia Phả
                            </button>
                            <button @click="openModal('edit', family)"
                                class="bg-white text-slate-600 hover:text-amber-600 p-2 rounded-xl border border-slate-200 transition-all active:scale-90 shadow-sm">
                                <Pencil class="w-4 h-4" />
                            </button>
                            <button @click="deleteFamily(family.id)"
                                class="bg-white text-slate-600 hover:text-red-600 p-2 rounded-xl border border-slate-200 transition-all active:scale-90 shadow-sm">
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- Floating Action Button -->
        <button @click="openModal('add')"
            class="fab-button fixed bottom-6 right-6 w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center z-40 hover:bg-red-700 active:scale-90 shadow-lg">
            <Plus class="w-6 h-6" />
        </button>

        <!-- Modal -->
        <transition name="modal">
            <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-slate-950/60 backdrop-blur-md" @click="closeModal"></div>
                <div class="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative z-10 border border-white/20">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-black text-slate-900">
                            {{ modalType === 'add' ? 'Thêm Gia Phả' : 'Sửa Thông Tin' }}
                        </h2>
                        <button @click="closeModal"
                            class="p-1.5 bg-slate-100 rounded-full text-slate-500 hover:bg-red-100 hover:text-red-600 transition-colors">
                            <X class="w-4 h-4" />
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Tên Dòng
                                Họ</label>
                            <input v-model="formData.name" type="text" placeholder="Ví dụ: Nguyễn Tộc"
                                class="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-transparent focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-50 outline-none transition-all font-semibold">
                        </div>

                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Nhân
                                    Khẩu</label>
                                <input v-model.number="formData.members" type="number"
                                    class="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-transparent focus:bg-white focus:border-red-500 outline-none transition-all font-semibold">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">Số Thế
                                    Hệ</label>
                                <input v-model.number="formData.generations" type="number"
                                    class="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-transparent focus:bg-white focus:border-red-500 outline-none transition-all font-semibold">
                            </div>
                        </div>

                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">URL Ảnh
                                Bìa</label>
                            <input v-model="Tr" type="text" placeholder="https://..."
                                class="w-full px-4 py-2.5 rounded-xl text-sm bg-slate-50 border border-transparent focus:bg-white focus:border-red-500 outline-none transition-all font-semibold">
                        </div>
                    </div>

                    <button @click="saveFamily"
                        class="w-full mt-6 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-xl shadow-red-200 transition-all active:scale-95 text-sm">
                        {{ modalType === 'add' ? 'Khởi Tạo Ngay' : 'Cập Nhật' }}
                    </button>
                </div>
            </div>
        </transition>

        <!-- Toast Notification -->
        <transition name="modal">
            <div v-if="toast.show"
                class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50">
                <div class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                <span class="font-bold text-xs">{{ toast.message }}</span>
            </div>
        </transition>
    </div>
</template>
