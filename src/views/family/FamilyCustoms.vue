<script setup>
import { ref, computed } from 'vue';
import {
    BookOpen,
    Plus,
    Calendar,
    MapPin,
    Clock,
    ChevronRight,
    Edit3,
    Trash2,
    ArrowLeft,
    GripVertical,
    CheckCircle2,
    Info
} from 'lucide-vue-next';

// --- MOCK DATA DỰA TRÊN DATABASE ---
const ceremonies = ref([
    {
        ceremony_id: 1,
        ceremony_type: 'Hỷ sự',
        ceremony_name: 'Đám Cưới Truyền Thống',
        description: 'Các bước tổ chức lễ cưới theo phong tục dòng họ Nguyễn, đảm bảo giữ gìn nét đẹp văn hóa xưa.',
        location: 'Nhà thờ họ & Nhà riêng',
        start_date: '2024-05-20',
        created_at: '2024-01-01'
    },
    {
        ceremony_id: 2,
        ceremony_type: 'Tang lễ',
        ceremony_name: 'Nghi Thức Tang Lễ Dòng Tộc',
        description: 'Quy trình tổ chức tang lễ trang nghiêm, hiếu nghĩa cho người quá cố.',
        location: 'Tại gia',
        start_date: null,
        created_at: '2024-01-05'
    },
    {
        ceremony_id: 3,
        ceremony_type: 'Lễ Tết',
        ceremony_name: 'Lễ Tế Tổ Đầu Năm',
        description: 'Nghi thức dâng hương bái tổ vào sáng mùng 1 Tết hàng năm.',
        location: 'Từ đường dòng họ',
        start_date: '2024-02-10',
        created_at: '2024-01-10'
    }
]);

const timelineData = ref([
    {
        timeline_id: 1,
        ceremony_id: 1,
        event_order: 1,
        event_name: 'Lễ dạm ngõ',
        event_description: 'Nhà trai mang trầu cau sang đặt vấn đề chính thức với nhà gái.',
        event_time: '08:00',
        location: 'Nhà gái'
    },
    {
        timeline_id: 2,
        ceremony_id: 1,
        event_order: 2,
        event_name: 'Lễ ăn hỏi (Đính hôn)',
        event_description: 'Nghi lễ quan trọng khẳng định sự gắn kết giữa hai gia đình.',
        event_time: '09:30',
        location: 'Nhà gái'
    },
    {
        timeline_id: 3,
        ceremony_id: 1,
        event_order: 3,
        event_name: 'Lễ rước dâu',
        event_description: 'Đón cô dâu về nhà chồng, làm lễ gia tiên tại nhà trai.',
        event_time: '14:00',
        location: 'Nhà trai'
    }
]);

// --- STATE MANAGEMENT ---
const selectedCeremony = ref(null);
const isEditing = ref(false);
const activeTab = ref('list'); // 'list' or 'detail'

// --- METHODS ---
const viewDetail = (ceremony) => {
    selectedCeremony.value = ceremony;
    activeTab.value = 'detail';
};

const goBack = () => {
    activeTab.value = 'list';
    selectedCeremony.value = null;
};

const currentTimeline = computed(() => {
    if (!selectedCeremony.value) return [];
    return timelineData.value
        .filter(t => t.ceremony_id === selectedCeremony.value.ceremony_id)
        .sort((a, b) => a.event_order - b.event_order);
});

const getTypeColor = (type) => {
    switch (type) {
        case 'Hỷ sự': return 'bg-pink-100 text-pink-700 border-pink-200';
        case 'Tang lễ': return 'bg-slate-100 text-slate-700 border-slate-200';
        case 'Lễ Tết': return 'bg-amber-100 text-amber-700 border-amber-200';
        default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
};
</script>

<template>
    <div class="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
        <!-- HEADER -->
        <header class="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
                <div class="flex items-center gap-2 mb-2">
                    <div class="p-2 bg-amber-600 rounded-lg shadow-lg">
                        <BookOpen class="text-white w-6 h-6" />
                    </div>
                    <h1 class="text-2xl md:text-3xl font-black tracking-tight text-slate-800">Sổ Tay <span
                            class="text-amber-600">Phong Tục</span></h1>
                </div>
                <p class="text-slate-500 font-medium">Lưu giữ nghi lễ và nét đẹp văn hóa dòng họ</p>
            </div>

            <button v-if="activeTab === 'list'"
                class="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg">
                <Plus class="w-5 h-5" />
                Thêm Phong Tục
            </button>

            <button v-else @click="goBack"
                class="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl font-bold transition-all border border-slate-200 shadow-sm">
                <ArrowLeft class="w-5 h-5" />
                Quay lại danh sách
            </button>
        </header>

        <main class="max-w-5xl mx-auto">
            <!-- DANH SÁCH PHONG TỤC (LIST VIEW) -->
            <div v-if="activeTab === 'list'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="item in ceremonies" :key="item.ceremony_id" @click="viewDetail(item)"
                    class="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden">
                    <div class="absolute top-0 right-0 p-4">
                        <span
                            :class="['text-[10px] uppercase font-bold px-2.5 py-1 rounded-full border', getTypeColor(item.ceremony_type)]">
                            {{ item.ceremony_type }}
                        </span>
                    </div>

                    <h3
                        class="text-lg font-bold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors pr-16 leading-tight">
                        {{ item.ceremony_name }}
                    </h3>

                    <p class="text-slate-500 text-sm line-clamp-2 mb-6 italic">
                        "{{ item.description }}"
                    </p>

                    <div class="space-y-2 mb-6">
                        <div class="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <MapPin class="w-3.5 h-3.5" />
                            {{ item.location || 'Chưa xác định' }}
                        </div>
                        <div class="flex items-center gap-2 text-xs text-slate-400 font-medium">
                            <Calendar class="w-3.5 h-3.5" />
                            Ngày tạo: {{ new Date(item.created_at).toLocaleDateString('vi-VN') }}
                        </div>
                    </div>

                    <div class="flex items-center justify-between pt-4 border-t border-slate-50">
                        <span
                            class="text-xs font-bold text-slate-400 group-hover:text-amber-600 flex items-center gap-1 transition-colors">
                            Xem chi tiết timeline
                            <ChevronRight class="w-3 h-3" />
                        </span>
                        <div class="flex gap-2">
                            <button
                                class="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors">
                                <Edit3 class="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CHI TIẾT VÀ TIMELINE (DETAIL VIEW) -->
            <div v-else class="space-y-6">
                <!-- Thông tin tóm tắt -->
                <div class="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                    <div class="flex flex-col md:flex-row justify-between gap-6">
                        <div class="flex-grow">
                            <span
                                :class="['inline-block text-[10px] uppercase font-black px-3 py-1 rounded-lg border mb-4', getTypeColor(selectedCeremony.ceremony_type)]">
                                {{ selectedCeremony.ceremony_type }}
                            </span>
                            <h2 class="text-3xl font-black text-slate-800 mb-3">{{ selectedCeremony.ceremony_name }}
                            </h2>
                            <p class="text-slate-600 leading-relaxed max-w-2xl">{{ selectedCeremony.description }}</p>
                        </div>
                        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[240px]">
                            <h4 class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Thông tin chung
                            </h4>
                            <div class="space-y-4">
                                <div class="flex items-start gap-3">
                                    <MapPin class="w-5 h-5 text-amber-600 shrink-0" />
                                    <span
                                        class="text-sm font-semibold text-slate-700">{{ selectedCeremony.location }}</span>
                                </div>
                                <div class="flex items-start gap-3">
                                    <Info class="w-5 h-5 text-amber-600 shrink-0" />
                                    <span class="text-sm font-semibold text-slate-700">Gồm {{ currentTimeline.length }}
                                        bước thực hiện</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Timeline Section -->
                <div class="flex items-center justify-between px-2">
                    <h3 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                        Trình tự thực hiện
                        <span class="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">Timeline</span>
                    </h3>
                    <button
                        class="flex items-center gap-1.5 text-amber-600 hover:text-amber-700 font-bold text-sm bg-amber-50 px-4 py-2 rounded-xl transition-all">
                        <Plus class="w-4 h-4" /> Thêm bước
                    </button>
                </div>

                <div class="relative pl-8 md:pl-0">
                    <!-- Đường line trung tâm (Chỉ hiện trên desktop) -->
                    <div class="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2">
                    </div>

                    <!-- Đường line bên trái (Hiện trên mobile) -->
                    <div class="md:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>

                    <div class="space-y-12">
                        <div v-for="(event, index) in currentTimeline" :key="event.timeline_id" class="relative group">
                            <!-- Điểm mốc (Dot) -->
                            <div class="absolute left-[-26px] md:left-1/2 md:-translate-x-1/2 top-0 z-10">
                                <div
                                    class="w-10 h-10 rounded-full bg-white border-4 border-amber-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <span class="text-xs font-black text-slate-800">{{ index + 1 }}</span>
                                </div>
                            </div>

                            <!-- Nội dung Item -->
                            <div class="flex flex-col md:flex-row items-start">
                                <!-- Bên trái (Chỉ dành cho index chẵn trên desktop) -->
                                <div
                                    :class="['w-full md:w-1/2 pr-0 md:pr-12 md:text-right', index % 2 === 0 ? 'md:block' : 'md:invisible opacity-0 h-0 overflow-hidden md:h-auto']">
                                    <div
                                        class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-amber-200 transition-all relative">
                                        <div class="flex items-center gap-3 mb-2 md:justify-end">
                                            <Clock class="w-4 h-4 text-amber-600" />
                                            <span class="text-sm font-bold text-slate-800">{{ event.event_time }}</span>
                                            <span class="text-xs font-medium text-slate-400">|
                                                {{ event.location }}</span>
                                        </div>
                                        <h4 class="text-lg font-black text-slate-800 mb-2">{{ event.event_name }}</h4>
                                        <p class="text-sm text-slate-500 leading-relaxed">{{ event.event_description }}
                                        </p>

                                        <div
                                            class="mt-4 flex gap-2 md:justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                class="p-2 hover:bg-slate-50 rounded-lg text-blue-500 border border-slate-100">
                                                <Edit3 class="w-4 h-4" />
                                            </button>
                                            <button
                                                class="p-2 hover:bg-red-50 rounded-lg text-red-500 border border-slate-100">
                                                <Trash2 class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Bên phải (Chỉ dành cho index lẻ trên desktop) -->
                                <div
                                    :class="['w-full md:w-1/2 pl-0 md:pl-12', index % 2 !== 0 ? 'md:block' : 'md:invisible opacity-0 h-0 overflow-hidden md:h-auto']">
                                    <div
                                        class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-amber-200 transition-all">
                                        <div class="flex items-center gap-3 mb-2">
                                            <Clock class="w-4 h-4 text-amber-600" />
                                            <span class="text-sm font-bold text-slate-800">{{ event.event_time }}</span>
                                            <span class="text-xs font-medium text-slate-400">|
                                                {{ event.location }}</span>
                                        </div>
                                        <h4 class="text-lg font-black text-slate-800 mb-2">{{ event.event_name }}</h4>
                                        <p class="text-sm text-slate-500 leading-relaxed">{{ event.event_description }}
                                        </p>

                                        <div
                                            class="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                class="p-2 hover:bg-slate-50 rounded-lg text-blue-500 border border-slate-100">
                                                <Edit3 class="w-4 h-4" />
                                            </button>
                                            <button
                                                class="p-2 hover:bg-red-50 rounded-lg text-red-500 border border-slate-100">
                                                <Trash2 class="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- End Point -->
                        <div class="flex justify-start md:justify-center relative">
                            <div
                                class="w-10 h-10 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center ml-[-26px] md:ml-0 z-10">
                                <CheckCircle2 class="w-5 h-5 text-slate-400" />
                            </div>
                            <div
                                class="hidden md:block absolute top-10 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                                Hoàn tất nghi lễ</div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <!-- FOOTER INFO -->
        <footer class="max-w-5xl mx-auto mt-20 pt-8 border-t border-slate-200 text-center">
            <p class="text-slate-400 text-xs font-medium">© 2024 Gia Phả Online - Gìn giữ giá trị nguồn cội</p>
        </footer>
    </div>
</template>

<style scoped>
/* Tùy chỉnh thanh cuộn */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Hiệu ứng mượt mà khi đổi view */
main {
    animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>