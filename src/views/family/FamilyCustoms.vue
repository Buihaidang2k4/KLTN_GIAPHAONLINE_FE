<script setup>
import { ref, computed } from 'vue';
import {
    BookOpen, Plus, MapPin, ChevronRight, Edit3, Trash2,
    ArrowLeft, CheckCircle2, Info, ListOrdered, Save, X, AlertCircle
} from 'lucide-vue-next';

// --- MOCK DATA ---
const ceremonies = ref([
    {
        ceremony_id: 1,
        ceremony_type: 'Hỷ sự',
        ceremony_name: 'Đám Cưới Truyền Thống',
        description: 'Quy trình tổ chức lễ cưới theo phong tục dòng tộc, tập trung vào các nghi thức gia tiên và tiếp đón.',
        location: 'Nhà thờ họ & Nhà riêng',
        created_at: '2024-01-01'
    },
    {
        ceremony_id: 2,
        ceremony_type: 'Tang lễ',
        ceremony_name: 'Nghi Thức Tang Lễ Dòng Tộc',
        description: 'Quy trình tổ chức tang lễ trang nghiêm, hiếu nghĩa, đảm bảo các bước tẩm liệm và di quan đúng đạo lý.',
        location: 'Tại gia',
        created_at: '2024-01-05'
    }
]);

const timelineData = ref([
    {
        timeline_id: 1,
        ceremony_id: 1,
        step_order: 1,
        step_name: 'Lễ dạm ngõ',
        step_description: 'Nhà trai mang trầu cau sang đặt vấn đề chính thức.',
        step_guideline: 'Chuẩn bị: 1 cơi trầu, 1 chai rượu, chè. Đại diện nhà trai thưa chuyện với nhà gái tại bàn thờ gia tiên.'
    },
    {
        timeline_id: 2,
        ceremony_id: 1,
        step_order: 2,
        step_name: 'Lễ ăn hỏi',
        step_description: 'Nghi lễ khẳng định sự gắn kết giữa hai gia đình.',
        step_guideline: 'Đội bê tráp thực hiện trao lễ. Đại diện hai bên giới thiệu thành phần gia đình.'
    }
]);

// --- STATE MANAGEMENT ---
const activeTab = ref('list'); // 'list' or 'detail'
const selectedCeremony = ref(null);
const showStepModal = ref(false);
const editingStep = ref(null);

// Form step mới/sửa
const stepForm = ref({
    step_name: '',
    step_description: '',
    step_guideline: '',
    preparations: []
});

// Thêm vật phẩm mới vào list chuẩn bị
const addPreparation = () => {
    if (!stepForm.value.preparations) {
        stepForm.value.preparations = [];
    }
    stepForm.value.preparations.push({
        itemName: '',
        itemType: '',
        quantity: 1,
        unit: '',
        note: '',
        required: true
    });
};

// Xoá vật phẩm khỏi list chuẩn bị
const removePreparation = (index) => {
    stepForm.value.preparations.splice(index, 1);
};

// --- COMPUTED ---
const currentSteps = computed(() => {
    if (!selectedCeremony.value) return [];
    return timelineData.value
        .filter(t => t.ceremony_id === selectedCeremony.value.ceremony_id)
        .sort((a, b) => a.step_order - b.step_order);
});

// --- METHODS ---
const viewDetail = (ceremony) => {
    selectedCeremony.value = ceremony;
    activeTab.value = 'detail';
};

const goBack = () => {
    activeTab.value = 'list';
    selectedCeremony.value = null;
};

// Mở modal thêm bước (tự động tính max step + 1)
const openAddStep = () => {
    editingStep.value = null;
    stepForm.value = {
        step_name: '',
        step_description: '',
        step_guideline: '',
        preparations: []
    };
    showStepModal.value = true;
};

const openEditStep = (step) => {
    editingStep.value = step;
    stepForm.value = { ...step };
    // Khởi tạo mảng preparations nếu bước đó chưa có
    if (!stepForm.value.preparations) {
        stepForm.value.preparations = [];
    }
    showStepModal.value = true;
};

const saveStep = () => {
    if (editingStep.value) {
        // Logic Sửa
        const index = timelineData.value.findIndex(t => t.timeline_id === editingStep.value.timeline_id);
        timelineData.value[index] = { ...timelineData.value[index], ...stepForm.value };
    } else {
        // Logic Thêm (Tự động tính order cuối cùng)
        const maxOrder = currentSteps.value.length > 0
            ? Math.max(...currentSteps.value.map(s => s.step_order))
            : 0;

        const newStep = {
            timeline_id: Date.now(),
            ceremony_id: selectedCeremony.value.ceremony_id,
            step_order: maxOrder + 1,
            ...stepForm.value
        };
        timelineData.value.push(newStep);
    }
    showStepModal.value = false;
};

const deleteStep = (timeline_id) => {
    const deletedStep = timelineData.value.find(t => t.timeline_id === timeline_id);
    const deletedOrder = deletedStep.step_order;

    // Xóa
    timelineData.value = timelineData.value.filter(t => t.timeline_id !== timeline_id);

    // Tự động cập nhật lại step_order cho các bước sau (Dồn hàng)
    timelineData.value.forEach(t => {
        if (t.ceremony_id === selectedCeremony.value.ceremony_id && t.step_order > deletedOrder) {
            t.step_order -= 1;
        }
    });
};

const getTypeColor = (type) => {
    switch (type) {
        case 'Hỷ sự': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'Tang lễ': return 'bg-slate-100 text-slate-700 border-slate-200';
        case 'Lễ Tết': return 'bg-amber-50 text-amber-700 border-amber-100';
        default: return 'bg-blue-50 text-blue-700 border-blue-100';
    }
};
</script>

<template>
    <div class="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
        <!-- MODAL THÊM/SỬA BƯỚC -->
        <div v-if="showStepModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div
                class="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <h3 class="text-xl font-bold text-slate-800">
                        {{ editingStep ? 'Sửa bước hướng dẫn' : 'Thêm bước mới' }}</h3>
                    <button @click="showStepModal = false" class="p-2 hover:bg-white rounded-full transition-colors">
                        <X class="w-5 h-5" />
                    </button>
                </div>
                <div class="p-5 space-y-4 overflow-y-auto custom-scrollbar">
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Tên bước thực
                            hiện</label>
                        <input v-model="stepForm.step_name" type="text" placeholder="Ví dụ: Lễ dâng hương..."
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Mô tả ngắn</label>
                        <input v-model="stepForm.step_description" type="text" placeholder="Tóm tắt ý nghĩa bước này"
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all" />
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-400 uppercase mb-1.5 ml-1">Hướng dẫn chi tiết (Văn khấn/Quy trình)</label>
                        <textarea v-model="stepForm.step_guideline" rows="4"
                            placeholder="Nhập chi tiết các bước cần làm..."
                            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 outline-none transition-all resize-none"></textarea>
                    </div>

                    <!-- DANH SÁCH VẬT PHẨM CHUẨN BỊ -->
                    <div class="pt-2 border-t border-slate-100">
                        <div class="flex items-center justify-between mb-3">
                            <label class="block text-xs font-bold text-slate-400 uppercase ml-1">Danh sách chuẩn bị (Vật phẩm/Lễ vật)</label>
                            <button type="button" @click="addPreparation" class="text-xs font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                <Plus class="w-3.5 h-3.5" /> Thêm lễ vật
                            </button>
                        </div>
                        
                        <!-- List Items -->
                        <div v-if="stepForm.preparations?.length > 0" class="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            <div v-for="(item, index) in stepForm.preparations" :key="index" class="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                                <button @click="removePreparation(index)" class="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                                    <X class="w-3.5 h-3.5" />
                                </button>
                                
                                <div class="grid grid-cols-12 gap-3">
                                    <div class="col-span-12 md:col-span-6">
                                        <input v-model="item.itemName" type="text" placeholder="Tên lễ vật (VD: Gà trống hoa)..." class="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div class="col-span-6 md:col-span-3">
                                        <input v-model="item.quantity" type="number" min="1" placeholder="SL" class="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-amber-500 outline-none" />
                                    </div>
                                    <div class="col-span-6 md:col-span-3">
                                        <input v-model="item.unit" type="text" placeholder="Đơn vị..." class="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-amber-500 outline-none" />
                                    </div>
                                    
                                    <!-- Advanced options expand -->
                                    <div class="col-span-12 flex gap-3 mt-1">
                                        <input v-model="item.note" type="text" placeholder="Ghi chú thêm..." class="flex-1 px-3 py-2 bg-white text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-amber-500 outline-none" />
                                        <label class="flex items-center gap-2 text-sm text-slate-500 font-medium cursor-pointer shrink-0 bg-white px-3 border border-slate-200 rounded-lg">
                                            <input type="checkbox" v-model="item.required" class="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500 accent-amber-500">
                                            Bắt buộc
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center py-6 bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                            <p class="text-xs text-slate-400 font-medium">Chưa có vật phẩm nào được thêm.</p>
                        </div>
                    </div>
                </div>
                <div class="p-5 bg-slate-50 border-t border-slate-100 flex gap-3 shrink-0">
                    <button @click="showStepModal = false"
                        class="flex-1 py-3 font-bold text-slate-500 hover:bg-white rounded-xl transition-all">Hủy</button>
                    <button @click="saveStep"
                        class="flex-2 px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200">
                        <Save class="w-4 h-4" /> Lưu bước này
                    </button>
                </div>
            </div>
        </div>

        <!-- MAIN APP -->
        <header class="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div class="flex items-center gap-3 mb-2">
                    <div class="p-2.5 bg-amber-600 rounded-2xl shadow-lg shadow-amber-200">
                        <BookOpen class="text-white w-6 h-6" />
                    </div>
                    <h1 class="text-3xl font-black tracking-tight text-slate-800">Sổ Tay <span
                            class="text-amber-600">Nghi Lễ</span></h1>
                </div>
                <p class="text-slate-500 font-medium ml-1">Cẩm nang hướng dẫn phong tục dòng họ</p>
            </div>

            <div class="flex items-center gap-3">
                <button v-if="activeTab === 'list'" class="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-xl shadow-slate-200 flex items-center gap-2 group">
                    <Plus class="w-5 h-5 group-hover:rotate-90 transition-transform" /> Thêm Phong Tục Mới
                </button>
                <button v-else @click="goBack" class="bg-white hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-bold transition-all border border-slate-200 shadow-sm flex items-center gap-2">
                    <ArrowLeft class="w-5 h-5" /> Quay lại danh sách
                </button>
            </div>
        </header>

        <main class="max-w-6xl mx-auto">
            <!-- LIST VIEW -->
            <div v-if="activeTab === 'list'"
                class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                <div v-for="item in ceremonies" :key="item.ceremony_id" @click="viewDetail(item)"
                    class="group bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm hover:shadow-2xl hover:border-amber-200 transition-all cursor-pointer flex flex-col h-full">
                    <div class="flex justify-between items-start mb-6">
                        <span
                            :class="['text-[10px] uppercase font-black px-3 py-1 rounded-full border tracking-wider', getTypeColor(item.ceremony_type)]">
                            {{ item.ceremony_type }}
                        </span>
                        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                class="p-2 hover:bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-colors">
                                <Edit3 class="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <h3
                        class="text-xl font-bold text-slate-800 mb-3 group-hover:text-amber-600 transition-colors leading-snug">
                        {{ item.ceremony_name }}
                    </h3>

                    <p class="text-slate-500 text-sm line-clamp-3 mb-8 leading-relaxed italic">"{{ item.description }}"
                    </p>

                    <div class="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                        <div class="flex items-center gap-2 text-xs text-slate-400 font-semibold">
                            <MapPin class="w-3.5 h-3.5" /> {{ item.location }}
                        </div>
                        <div class="flex items-center gap-1 text-amber-600 font-bold text-xs uppercase tracking-wider">
                            Chi tiết
                            <ChevronRight class="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- DETAIL & TIMELINE VIEW -->
            <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
                <!-- Sidebar Info -->
                <aside class="lg:col-span-4 space-y-6">
                    <div class="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm sticky top-8">
                        <span
                            :class="['inline-block text-[10px] uppercase font-black px-3 py-1 rounded-lg border mb-4', getTypeColor(selectedCeremony.ceremony_type)]">
                            {{ selectedCeremony.ceremony_type }}
                        </span>
                        <h2 class="text-3xl font-black text-slate-800 mb-4 leading-tight">
                            {{ selectedCeremony.ceremony_name }}</h2>
                        <p class="text-slate-500 text-sm leading-relaxed mb-8">{{ selectedCeremony.description }}</p>

                        <div class="space-y-4 pt-6 border-t border-slate-100">
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <MapPin class="w-5 h-5" />
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase">Địa điểm tổ chức</p>
                                    <p class="text-sm font-bold text-slate-700">{{ selectedCeremony.location }}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-4">
                                <div
                                    class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                    <ListOrdered class="w-5 h-5" />
                                </div>
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase">Tổng số bước</p>
                                    <p class="text-sm font-bold text-slate-700">{{ currentSteps.length }} bước hướng dẫn
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Main Timeline Content -->
                <div class="lg:col-span-8 space-y-6">
                    <div
                        class="flex items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-200/50">
                        <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
                            Trình tự các bước thực hiện
                            <AlertCircle class="w-4 h-4 text-slate-300" />
                        </h3>
                        <button @click="openAddStep"
                            class="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-amber-100 hover:bg-amber-700 transition-all active:scale-95">
                            <Plus class="w-4 h-4" /> Thêm Bước Mới
                        </button>
                    </div>

                    <!-- Empty State -->
                    <div v-if="currentSteps.length === 0"
                        class="bg-white rounded-3xl p-20 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                        <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <ListOrdered class="w-10 h-10 text-slate-300" />
                        </div>
                        <h4 class="text-slate-400 font-bold">Chưa có hướng dẫn nào</h4>
                        <p class="text-slate-400 text-sm">Hãy nhấn nút "Thêm Bước Mới" để bắt đầu soạn thảo cẩm nang.
                        </p>
                    </div>

                    <!-- Timeline Vertical -->
                    <div v-else class="relative space-y-4">
                        <div v-for="(step, index) in currentSteps" :key="step.timeline_id"
                            class="group bg-white rounded-3xl border border-slate-200/60 p-6 hover:shadow-xl hover:border-amber-200 transition-all">
                            <div class="flex gap-6">
                                <!-- Order Circle -->
                                <div class="flex flex-col items-center gap-2">
                                    <div
                                        class="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg shadow-lg group-hover:bg-amber-600 transition-colors">
                                        {{ step.step_order }}
                                    </div>
                                    <div v-if="index !== currentSteps.length - 1"
                                        class="w-0.5 h-full bg-slate-100 rounded-full"></div>
                                </div>

                                <!-- Content -->
                                <div class="flex-grow pb-2">
                                    <div class="flex justify-between items-start mb-2">
                                        <h4
                                            class="text-xl font-bold text-slate-800 group-hover:text-amber-600 transition-colors">
                                            {{ step.step_name }}</h4>
                                        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button @click="openEditStep(step)"
                                                class="p-2 hover:bg-slate-50 text-blue-500 rounded-lg transition-colors">
                                                <Edit3 class="w-4 h-4" />
                                            </button>
                                            <button @click="deleteStep(step.timeline_id)"
                                                class="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                                                <Trash2 class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <p class="text-sm font-bold text-slate-400 uppercase tracking-tighter mb-4">
                                        {{ step.step_description }}</p>

                                    <div class="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                        <p class="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                                            {{ step.step_guideline }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Final Marker -->
                        <div class="flex items-center gap-6 px-4 py-8 opacity-40">
                            <div
                                class="w-12 h-12 rounded-full border-4 border-slate-200 flex items-center justify-center">
                                <CheckCircle2 class="w-6 h-6 text-slate-300" />
                            </div>
                            <span class="text-slate-400 font-bold uppercase tracking-widest text-sm">Hoàn tất quy
                                trình</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>


/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #E2E8F0;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #CBD5E1;
}

/* Animations */
.animate-in {
    animation-duration: 0.4s;
    animation-timing-function: ease-out;
    animation-fill-mode: both;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes slideInFromBottom {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.fade-in {
    animation-name: fadeIn;
}

.slide-in-from-bottom-4 {
    animation-name: slideInFromBottom;
}
</style>