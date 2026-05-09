<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { X, Save, Pencil, Trash2, Sparkles, Scroll, Gift, BookmarkCheck, History } from 'lucide-vue-next'
import { notify } from '@/utils/notify'
import type {
    CeremonyTimelinePreparationReq,
    CeremonyTimelinePreparationRes,
    CeremonyTimelineRes
} from '@/types/family/ceremony.types'
import {
    useCeremonyTimelinePreparationsQuery,
    useCreateCeremonyTimelinePreparationMutation,
    useUpdateCeremonyTimelinePreparationMutation,
    useDeleteCeremonyTimelinePreparationMutation
} from '@/hooks/queries/family/ceremony/useCeremonyTimelinePreparation'

const props = defineProps<{
    show: boolean
    timeline: CeremonyTimelineRes | null
}>()

const emit = defineEmits<{
    close: []
}>()

const timelineId = computed(() => props.timeline?.timelineId ?? null)

const { data: preparationsData } = useCeremonyTimelinePreparationsQuery(timelineId)
const { mutate: createPreparationMutation } = useCreateCeremonyTimelinePreparationMutation()
const { mutate: updatePreparationMutation } = useUpdateCeremonyTimelinePreparationMutation()
const { mutate: deletePreparationMutation } = useDeleteCeremonyTimelinePreparationMutation()

const preparations = computed(() => preparationsData.value?.data?.items ?? [])
const editingPreparationId = ref<number | null>(null)

const emptyForm = (): CeremonyTimelinePreparationReq => ({
    itemName: '',
    itemType: '',
    quantity: 1,
    unit: '',
    note: '',
    required: true
})

const form = reactive<CeremonyTimelinePreparationReq>(emptyForm())
const isEditing = computed(() => editingPreparationId.value !== null)

const resetForm = () => {
    editingPreparationId.value = null
    Object.assign(form, emptyForm())
}

watch(
    () => props.show,
    (show) => {
        if (show) {
            resetForm()
        }
    }
)

watch(
    () => props.timeline,
    () => {
        resetForm()
    }
)

const validateForm = () => {
    if (!timelineId.value) {
        notify.error('Thông báo', 'Không tìm thấy bước cần quản lý lễ vật')
        return false
    }

    if (!form.itemName.trim() || !form.itemType.trim() || !form.unit.trim() || form.quantity < 1) {
        notify.error('Thông báo', 'Vui lòng nhập đầy đủ thông tin lễ vật')
        return false
    }

    return true
}

const handleSubmit = () => {
    if (!validateForm() || !timelineId.value) return

    const payload: CeremonyTimelinePreparationReq = {
        itemName: form.itemName.trim(),
        itemType: form.itemType.trim(),
        quantity: Number(form.quantity),
        unit: form.unit.trim(),
        note: form.note.trim(),
        required: form.required
    }

    if (isEditing.value && editingPreparationId.value) {
        updatePreparationMutation(
            { preparationId: editingPreparationId.value, data: payload },
            {
                onSuccess: () => {
                    notify.success('Thông báo', 'Cập nhật lễ vật thành công')
                    resetForm()
                },
                onError: (error: any) => {
                    console.error('update preparation error', error?.response?.data ?? error)
                    notify.error('Thông báo', 'Cập nhật lễ vật thất bại')
                }
            }
        )
        return
    }

    createPreparationMutation(
        { timelineId: timelineId.value, data: payload },
        {
            onSuccess: () => {
                notify.success('Thông báo', 'Thêm lễ vật thành công')
                resetForm()
            },
            onError: (error: any) => {
                console.error('create preparation error', error?.response?.data ?? error)
                notify.error('Thông báo', 'Thêm lễ vật thất bại')
            }
        }
    )
}

const handleEdit = (item: CeremonyTimelinePreparationRes) => {
    editingPreparationId.value = item.preparationId
    Object.assign(form, {
        timelineId: item.timelineId,
        itemName: item.itemName,
        itemType: item.itemType,
        quantity: item.quantity,
        unit: item.unit,
        note: item.note,
        required: item.required
    })
}

const handleDelete = (preparationId: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa lễ vật này không?')) return

    deletePreparationMutation(preparationId, {
        onSuccess: () => {
            notify.success('Thông báo', 'Xóa lễ vật thành công')
            if (editingPreparationId.value === preparationId) {
                resetForm()
            }
        },
        onError: (error: any) => {
            console.error('delete preparation error', error?.response?.data ?? error)
            notify.error('Thông báo', 'Xóa lễ vật thất bại')
        }
    })
}

const handleClose = () => {
    resetForm()
    emit('close')
}
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <!-- Modal Container -->
                <div class="relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-[2.5rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30 animate-in fade-in zoom-in duration-300">
                    
                    <!-- Subtle Ornaments -->
                    <div class="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(180,83,9,0.03),transparent)] pointer-events-none"></div>
                    <div class="absolute top-6 left-6 text-amber-900/[0.02] pointer-events-none">
                        <Gift :size="120" />
                    </div>

                    <!-- Header Section -->
                    <div class="relative shrink-0 px-8 pt-8 pb-4 text-center border-b border-amber-100/50">
                        <div class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Lễ vật truyền thống</span>
                        </div>
                        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Quản lý lễ vật</h2>
                        <p class="mt-1 text-xs text-slate-500 font-bold uppercase tracking-tighter">
                            {{ timeline?.stepName || 'Bước chuẩn bị' }}
                        </p>

                        <button @click="handleClose" 
                            class="absolute top-6 right-8 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="20" />
                        </button>
                    </div>

                    <!-- Main Content -->
                    <div class="flex min-h-0 flex-1 flex-col md:flex-row">
                        
                        <!-- Left: List View -->
                        <div class="flex min-h-0 flex-col md:w-[55%] border-b md:border-b-0 md:border-r border-amber-100/50">
                            <div class="shrink-0 px-6 py-4 bg-amber-50/20">
                                <div class="flex items-center gap-2">
                                    <div class="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                                    <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Danh mục cần chuẩn bị</h4>
                                </div>
                            </div>

                            <div class="custom-scrollbar flex-1 overflow-y-auto p-6 bg-amber-50/10">
                                <div v-if="!preparations.length" class="flex flex-col items-center justify-center h-full py-12 opacity-40">
                                    <Scroll :size="48" class="text-amber-900 mb-3" />
                                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Chưa có lễ vật nào</p>
                                </div>

                                <div v-else class="space-y-4">
                                    <div v-for="item in preparations" :key="item.preparationId" 
                                        :class="[
                                            'relative rounded-[1.25rem] border p-5 transition-all duration-300 group',
                                            editingPreparationId === item.preparationId
                                                ? 'border-amber-400 bg-white shadow-lg ring-4 ring-amber-500/5'
                                                : 'border-amber-200/40 bg-white hover:border-amber-300 hover:shadow-md'
                                        ]">
                                        <div class="flex items-start justify-between gap-4">
                                            <div class="min-w-0 flex-1">
                                                <!-- Title and Badge -->
                                                <div class="flex items-start gap-2 mb-2">
                                                    <p class="font-black text-slate-900 text-base leading-none pt-1 truncate">{{ item.itemName }}</p>
                                                    <span :class="[
                                                        'shrink-0 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter',
                                                        item.required
                                                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                    ]">
                                                        {{ item.required ? 'Bắt buộc' : 'Tùy chọn' }}
                                                    </span>
                                                </div>

                                                <!-- Metadata Grid -->
                                                <div class="flex flex-wrap items-center gap-y-2 gap-x-4">
                                                    <div class="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-lg border border-amber-100">
                                                        <span class="text-[10px] font-black text-amber-800">{{ item.quantity }}</span>
                                                        <span class="text-[9px] font-bold text-amber-600 uppercase tracking-tighter">{{ item.unit }}</span>
                                                    </div>
                                                    <div class="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                                        <BookmarkCheck :size="10" class="text-slate-400" />
                                                        <span class="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{{ item.itemType }}</span>
                                                    </div>
                                                </div>

                                                <!-- Note -->
                                                <div v-if="item.note" class="mt-3 pl-3 border-l-2 border-amber-200/50">
                                                    <p class="text-xs text-slate-500 font-medium leading-relaxed italic">
                                                        "{{ item.note }}"
                                                    </p>
                                                </div>
                                            </div>

                                            <!-- Actions -->
                                            <div class="flex shrink-0 gap-1.5 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button type="button" @click="handleEdit(item)"
                                                    class="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl border border-transparent hover:border-amber-100 transition-all shadow-sm bg-white md:bg-transparent">
                                                    <Pencil :size="16" />
                                                </button>
                                                <button type="button" @click="handleDelete(item.preparationId)"
                                                    class="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-100 transition-all shadow-sm bg-white md:bg-transparent">
                                                    <Trash2 :size="16" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Entry Form -->
                        <div class="flex min-h-0 flex-col md:w-[45%]">
                            <div class="shrink-0 px-6 py-4 bg-slate-50/60 border-b border-amber-100/30">
                                <div class="flex items-center gap-2">
                                    <div class="w-1.5 h-4 bg-slate-900 rounded-full"></div>
                                    <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        {{ isEditing ? 'Chỉnh sửa lễ vật' : 'Thêm lễ vật mới' }}
                                    </h4>
                                </div>
                            </div>

                            <div class="custom-scrollbar flex-1 overflow-y-auto p-6">
                                <div class="space-y-5">
                                    <!-- Tên lễ vật -->
                                    <div class="space-y-1.5">
                                        <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            <BookmarkCheck :size="14" class="text-amber-600/70" />
                                            Tên lễ vật <span class="text-red-400">*</span>
                                        </label>
                                        <input v-model="form.itemName" type="text"
                                            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                                            placeholder="Ví dụ: Trầu cau" />
                                    </div>

                                    <div class="grid grid-cols-2 gap-4">
                                        <div class="space-y-1.5">
                                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                                Loại <span class="text-red-400">*</span>
                                            </label>
                                            <input v-model="form.itemType" type="text"
                                                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                                                placeholder="Lễ vật" />
                                        </div>
                                        <div class="space-y-1.5">
                                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                                Số lượng <span class="text-red-400">*</span>
                                            </label>
                                            <input v-model.number="form.quantity" type="number" min="1"
                                                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                        </div>
                                    </div>

                                    <div class="space-y-1.5">
                                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Đơn vị tính <span class="text-red-400">*</span>
                                        </label>
                                        <input v-model="form.unit" type="text"
                                            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                                            placeholder="Mâm, bộ, cái..." />
                                    </div>

                                    <div class="space-y-1.5">
                                        <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Ghi chú
                                        </label>
                                        <textarea v-model="form.note" rows="3"
                                            class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all leading-relaxed shadow-sm"
                                            placeholder="Thêm hướng dẫn chuẩn bị..."></textarea>
                                    </div>

                                    <label class="flex items-center gap-3 p-3 rounded-xl border border-amber-100 bg-amber-50/30 cursor-pointer hover:bg-amber-50 transition group">
                                        <div class="relative flex items-center justify-center">
                                            <input v-model="form.required" type="checkbox"
                                                class="peer h-5 w-5 opacity-0 absolute z-10 cursor-pointer" />
                                            <div class="h-5 w-5 bg-white border-2 border-amber-200 rounded-md peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all flex items-center justify-center">
                                                <X :size="14" class="text-white rotate-45" v-if="form.required" />
                                            </div>
                                        </div>
                                        <span class="text-xs font-bold text-amber-800/80 uppercase tracking-wider">Bắt buộc chuẩn bị</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Footer Actions -->
                            <div class="shrink-0 flex gap-3 px-6 py-5 border-t border-amber-100/30 bg-white/50">
                                <button v-if="isEditing" type="button" @click="resetForm"
                                    class="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all">
                                    Hủy bỏ
                                </button>
                                <button type="button" @click="handleSubmit"
                                    class="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98]">
                                    <Save :size="14" />
                                    <span>{{ isEditing ? 'Lưu thay đổi' : 'Thêm lễ vật' }}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Decorative footer line -->
                    <div class="h-1.5 w-full bg-[linear-gradient(90deg,transparent_0%,#d97706_50%,transparent_100%)] opacity-10"></div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3a3a2815;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #3a3a2830;
}

.rounded-\[2\.5rem\]::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    width: 40px;
    height: 40px;
    border-top: 2px solid rgba(217, 119, 6, 0.08);
    border-left: 2px solid rgba(217, 119, 6, 0.08);
    border-radius: 12px 0 0 0;
    pointer-events: none;
}
</style>