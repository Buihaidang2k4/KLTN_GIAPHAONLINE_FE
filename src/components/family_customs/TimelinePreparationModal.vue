<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { X, Save, Pencil, Trash2 } from 'lucide-vue-next'
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
        <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <!-- Overlay -->
            <div class="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm" @click="handleClose"></div>

            <!-- Modal -->
            <div
                class="relative z-50 flex max-h-[85vh] w-full max-w-4xl flex-col rounded-2xl border border-white/10 bg-white shadow-2xl">
                <!-- Header -->
                <div class="shrink-0 flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <h3 class="text-lg font-bold text-slate-900">Quản lý lễ vật</h3>
                        <p class="text-sm text-slate-500">{{ timeline?.stepName || 'Bước hiện tại' }}</p>
                    </div>
                    <button type="button" @click="handleClose"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100">
                        <X :size="18" />
                    </button>
                </div>

                <!-- Content -->
                <div class="flex min-h-0 flex-1 flex-col md:flex-row">
                    <!-- Left: List -->
                    <div class="flex min-h-0 flex-col border-b border-slate-200 md:w-[55%] md:border-b-0 md:border-r">
                        <div class="shrink-0 border-b border-slate-200 px-5 py-3">
                            <h4 class="text-sm font-bold text-slate-800">Danh sách lễ vật</h4>
                        </div>

                        <div class="custom-scrollbar flex-1 overflow-y-auto p-4">
                            <div v-if="!preparations.length" class="flex h-full items-center justify-center">
                                <p class="text-sm text-slate-400">Chưa có lễ vật nào cho bước này</p>
                            </div>

                            <div v-else class="space-y-2">
                                <div v-for="item in preparations" :key="item.preparationId" :class="[
                                    'rounded-lg border p-3 transition-all',
                                    editingPreparationId === item.preparationId
                                        ? 'border-indigo-400 bg-indigo-50/50 shadow-sm'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                ]">
                                    <div class="flex items-start justify-between gap-2">
                                        <div class="min-w-0 flex-1">
                                            <div class="flex items-center gap-2">
                                                <p class="font-semibold text-slate-900 truncate">{{ item.itemName }}</p>
                                                <span :class="[
                                                    'shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase',
                                                    item.required
                                                        ? 'bg-rose-100 text-rose-700'
                                                        : 'bg-slate-100 text-slate-500'
                                                ]">
                                                    {{ item.required ? 'Bắt buộc' : 'Tùy chọn' }}
                                                </span>
                                            </div>
                                            <p class="mt-1 text-sm text-slate-500">
                                                {{ item.quantity }} {{ item.unit }} • {{ item.itemType }}
                                            </p>
                                            <p v-if="item.note" class="mt-1 text-xs text-slate-400 line-clamp-2">
                                                {{ item.note }}
                                            </p>
                                        </div>

                                        <div class="flex shrink-0 gap-1">
                                            <button type="button" @click="handleEdit(item)"
                                                class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                                                <Pencil :size="14" />
                                            </button>
                                            <button type="button" @click="handleDelete(item.preparationId)"
                                                class="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600">
                                                <Trash2 :size="14" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Form -->
                    <div class="flex min-h-0 flex-col md:w-[45%]">
                        <div class="shrink-0 border-b border-slate-200 px-5 py-3">
                            <h4 class="text-sm font-bold text-slate-800">
                                {{ isEditing ? 'Chỉnh sửa lễ vật' : 'Thêm lễ vật mới' }}
                            </h4>
                        </div>

                        <div class="custom-scrollbar flex-1 overflow-y-auto p-4">
                            <div class="space-y-3">
                                <div>
                                    <label class="mb-1.5 block text-xs font-semibold text-slate-600">
                                        Tên lễ vật <span class="text-red-400">*</span>
                                    </label>
                                    <input v-model="form.itemName" type="text"
                                        class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                                        placeholder="Ví dụ: Trầu cau" />
                                </div>

                                <div class="grid grid-cols-2 gap-3">
                                    <div>
                                        <label class="mb-1.5 block text-xs font-semibold text-slate-600">
                                            Loại <span class="text-red-400">*</span>
                                        </label>
                                        <input v-model="form.itemType" type="text"
                                            class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                                            placeholder="Ví dụ: Lễ vật" />
                                    </div>
                                    <div>
                                        <label class="mb-1.5 block text-xs font-semibold text-slate-600">
                                            Số lượng <span class="text-red-400">*</span>
                                        </label>
                                        <input v-model.number="form.quantity" type="number" min="1"
                                            class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20" />
                                    </div>
                                </div>

                                <div>
                                    <label class="mb-1.5 block text-xs font-semibold text-slate-600">
                                        Đơn vị <span class="text-red-400">*</span>
                                    </label>
                                    <input v-model="form.unit" type="text"
                                        class="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                                        placeholder="Ví dụ: Mâm, bộ, cái..." />
                                </div>

                                <div>
                                    <label class="mb-1.5 block text-xs font-semibold text-slate-600">
                                        Ghi chú
                                    </label>
                                    <textarea v-model="form.note" rows="3"
                                        class="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20"
                                        placeholder="Ghi chú thêm nếu cần..."></textarea>
                                </div>

                                <label
                                    class="inline-flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-100 transition">
                                    <input v-model="form.required" type="checkbox"
                                        class="h-4 w-4 rounded accent-indigo-600" />
                                    Bắt buộc chuẩn bị
                                </label>
                            </div>
                        </div>

                        <!-- Form Actions - Fixed at bottom -->
                        <div class="shrink-0 flex gap-2 border-t border-slate-200 px-4 py-3">
                            <button v-if="isEditing" type="button" @click="resetForm"
                                class="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                                Hủy chỉnh sửa
                            </button>
                            <button type="button" @click="handleSubmit"
                                class="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-indigo-600 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98]">
                                <Save :size="14" />
                                {{ isEditing ? 'Lưu thay đổi' : 'Thêm lễ vật' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>