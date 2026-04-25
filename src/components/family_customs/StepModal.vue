<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, Save, Plus } from 'lucide-vue-next';
import type { CeremonyTimelineRes, CeremonyTimelinePreparationRes } from '@/types/ceremony/ceremony';

interface Props {
    show: boolean;
    editingStep: CeremonyTimelineRes | null;
}

const props = defineProps<Props>();
const emit = defineEmits(['close', 'save']);

const stepForm = ref<Partial<CeremonyTimelineRes>>({
    stepName: '',
    stepDescription: '',
    stepGuideline: '',
    timelinePreparations: []
});

watch(() => props.show, (newVal) => {
    if (newVal) {
        if (props.editingStep) {
            stepForm.value = JSON.parse(JSON.stringify(props.editingStep));
        } else {
            stepForm.value = {
                stepName: '',
                stepDescription: '',
                stepGuideline: '',
                timelinePreparations: []
            };
        }
    }
});

const addPreparation = () => {
    if (!stepForm.value.timelinePreparations) stepForm.value.timelinePreparations = [];
    stepForm.value.timelinePreparations.push({
        preparationId: Date.now(),
        timelineId: 0,
        itemName: '',
        itemType: 'Lễ vật',
        quantity: 1,
        unit: '',
        note: '',
        required: true,
        createdAt: null,
        updatedAt: null
    });
};

const removePreparation = (id: number) => {
    stepForm.value.timelinePreparations = stepForm.value.timelinePreparations?.filter(p => p.preparationId !== id);
};

const handleSave = () => {
    emit('save', stepForm.value);
};
</script>

<template>
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
        <div v-if="show"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div
                class="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
                <div class="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <h3 class="text-lg font-bold text-slate-900">
                        {{ editingStep ? 'Sửa bước hướng dẫn' : 'Thêm bước mới' }}
                    </h3>
                    <button @click="$emit('close')" class="p-1.5 hover:bg-white rounded-md transition-colors mr-1">
                        <X class="w-4 h-4 text-slate-400" />
                    </button>
                </div>

                <div class="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    <div class="grid grid-cols-1 gap-5">
                        <div>
                            <label
                                class="block text-[8px] font-bold text-slate-700 uppercase mb-2 ml-1 tracking-widest opacity-60">Tên
                                bước thực hiện</label>
                            <input v-model="stepForm.stepName" type="text" placeholder="Ví dụ: Lễ dâng hương..."
                                class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-700/20 focus:border-slate-700 outline-none transition-all font-semibold placeholder:font-medium placeholder:text-slate-300" />
                        </div>
                        <div>
                            <label
                                class="block text-[8px] font-bold text-slate-700 uppercase mb-2 ml-1 tracking-widest opacity-60">Mô
                                tả ngắn</label>
                            <input v-model="stepForm.stepDescription" type="text" placeholder="Tóm tắt ý nghĩa bước này"
                                class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-700/20 focus:border-slate-700 outline-none transition-all font-semibold placeholder:font-medium placeholder:text-slate-300" />
                        </div>
                        <div>
                            <label
                                class="block text-[8px] font-bold text-slate-700 uppercase mb-2 ml-1 tracking-widest opacity-60">Hướng
                                dẫn chi tiết</label>
                            <textarea v-model="stepForm.stepGuideline" rows="4"
                                placeholder="Nhập chi tiết các bước cần làm..."
                                class="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-slate-700/20 focus:border-slate-700 outline-none transition-all resize-none font-medium text-slate-700 leading-relaxed"></textarea>
                        </div>
                    </div>

                    <!-- DANH SÁCH CHUẨN BỊ -->
                    <div class="pt-5 border-t border-slate-200">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-2">
                                <label
                                    class="block text-[8px] font-bold text-slate-700 uppercase ml-1 tracking-widest opacity-60">Danh
                                    sách chuẩn bị</label>
                            </div>
                            <button type="button" @click="addPreparation"
                                class="text-xs font-bold text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-slate-700/20">
                                <Plus class="w-4 h-4" /> Thêm lễ vật
                            </button>
                        </div>

                        <div class="space-y-3">
                            <div v-for="item in stepForm.timelinePreparations" :key="item.preparationId"
                                class="p-5 bg-slate-50/50 border border-slate-200 rounded-lg relative group">
                                <button @click="removePreparation(item.preparationId)"
                                    class="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-red-500 shadow-sm opacity-100 transition-opacity hover:bg-red-50">
                                    <X class="w-3 h-3" />
                                </button>

                                <div class="grid grid-cols-12 gap-3">
                                    <div class="col-span-12 md:col-span-6">
                                        <input v-model="item.itemName" type="text" placeholder="Tên lễ vật..."
                                            class="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-slate-700 outline-none bg-white font-bold" />
                                    </div>
                                    <div class="col-span-6 md:col-span-3">
                                        <input v-model="item.quantity" type="number" placeholder="SL"
                                            class="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-slate-700 outline-none bg-white font-bold" />
                                    </div>
                                    <div class="col-span-6 md:col-span-3">
                                        <input v-model="item.unit" type="text" placeholder="Đơn vị..."
                                            class="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-slate-700 outline-none bg-white font-bold" />
                                    </div>
                                    <div class="col-span-12 flex flex-col md:flex-row gap-3">
                                        <input v-model="item.note" type="text" placeholder="Ghi chú thêm..."
                                            class="flex-1 px-3 py-2 bg-white text-sm rounded-lg border border-slate-200 focus:ring-1 focus:ring-slate-700 outline-none font-medium" />
                                        <label
                                            class="flex items-center gap-2 text-[8px] text-slate-600 font-bold uppercase tracking-widest cursor-pointer shrink-0 bg-white px-3 py-2 border border-slate-200 rounded-lg">
                                            <input type="checkbox" v-model="item.required"
                                                class="w-3 h-3 text-slate-700 rounded border-slate-300 focus:ring-slate-700 accent-slate-700" />
                                            Bắt buộc
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div v-if="!stepForm.timelinePreparations?.length"
                                class="text-center py-6 bg-slate-50 border border-slate-200 border-dashed rounded-lg">
                                <p class="text-[8px] text-slate-400 font-bold uppercase tracking-[0.15em]">Chưa có lễ
                                    vật nào</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-5 bg-slate-50 border-t border-slate-200 flex gap-3 shrink-0">
                    <button @click="$emit('close')"
                        class="flex-1 py-3 font-bold text-slate-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 uppercase tracking-widest text-[8px]">Hủy
                        bỏ</button>
                    <button @click="handleSave"
                        class="flex-[2] py-3 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-700/20 uppercase tracking-widest text-[8px]">
                        <Save class="w-4 h-4" /> Lưu bước này
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3a3a2820;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #3a3a2840;
}
</style>
