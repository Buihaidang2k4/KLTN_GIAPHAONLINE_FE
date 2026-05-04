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
        <div v-if="show"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
            <div
                class="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50/60 p-5">
                    <div>
                        <h3 class="text-lg font-bold text-slate-900">Quản lý lễ vật</h3>
                        <p class="mt-1 text-sm text-slate-500">
                            {{ timeline?.stepName || 'Bước hiện tại' }}
                        </p>
                    </div>

                    <button type="button" @click="handleClose"
                        class="rounded-md p-1.5 transition-colors hover:bg-white cursor-pointer">
                        <X class="h-4 w-4 text-slate-400" />
                    </button>
                </div>

                <div class="grid min-h-0 flex-1 grid-cols-1 gap-0 md:grid-cols-[1.1fr_0.9fr]">
                    <div class="min-h-0 border-r border-slate-200">
                        <div class="border-b border-slate-200 px-5 py-4">
                            <h4 class="text-sm font-bold text-slate-800">Danh sách lễ vật</h4>
                        </div>

                        <div class="custom-scrollbar max-h-[65vh] overflow-y-auto p-5">
                            <div v-if="!preparations.length"
                                class="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                                Chưa có lễ vật nào cho bước này.
                            </div>

                            <div v-else class="space-y-3">
                                <div v-for="item in preparations" :key="item.preparationId"
                                    class="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                                    <div class="flex items-start justify-between gap-3">
                                        <div>
                                            <p class="text-base font-bold text-slate-900">{{ item.itemName }}</p>
                                            <p class="mt-1 text-sm text-slate-500">
                                                {{ item.quantity }} {{ item.unit }} • {{ item.itemType }}
                                            </p>
                                            <p v-if="item.note" class="mt-2 text-sm text-slate-600">
                                                {{ item.note }}
                                            </p>
                                            <span
                                                class="mt-2 inline-block rounded-lg bg-slate-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700">
                                                {{ item.required ? 'Bắt buộc' : 'Tùy chọn' }}
                                            </span>
                                        </div>

                                        <div class="flex gap-2">
                                            <button type="button" @click="handleEdit(item)"
                                                class="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 transition hover:bg-slate-100">
                                                <Pencil class="h-4 w-4" />
                                            </button>
                                            <button type="button" @click="handleDelete(item.preparationId)"
                                                class="rounded-lg border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50">
                                                <Trash2 class="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="min-h-0">
                        <div class="border-b border-slate-200 px-5 py-4 ">
                            <h4 class="text-sm font-bold text-slate-800 ">
                                {{ isEditing ? 'Sửa lễ vật' : 'Thêm lễ vật' }}
                            </h4>
                        </div>

                        <div class="custom-scrollbar max-h-[65vh] overflow-y-auto p-5">
                            <div class="space-y-4">
                                <div>
                                    <label
                                        class="mb-2 block text-[11px] font-bold uppercase tracking-widest text-slate-600">Tên
                                        lễ vật</label>
                                    <input v-model="form.itemName" type="text"
                                        class="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-700/20"
                                        placeholder="Ví dụ: Trầu cau" />
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label
                                            class="mb-2 block text-[11px] font-bold uppercase tracking-widest text-slate-600">Loại</label>
                                        <input v-model="form.itemType" type="text"
                                            class="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-700/20"
                                            placeholder="Ví dụ: Lễ vật" />
                                    </div>

                                    <div>
                                        <label
                                            class="mb-2 block text-[11px] font-bold uppercase tracking-widest text-slate-600">Số
                                            lượng</label>
                                        <input v-model.number="form.quantity" type="number" min="1"
                                            class="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-700/20" />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        class="mb-2 block text-[11px] font-bold uppercase tracking-widest text-slate-600">Đơn
                                        vị</label>
                                    <input v-model="form.unit" type="text"
                                        class="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-700/20"
                                        placeholder="Ví dụ: Mâm, bộ, cái..." />
                                </div>

                                <div>
                                    <label
                                        class="mb-2 block text-[11px] font-bold uppercase tracking-widest text-slate-600">Ghi
                                        chú</label>
                                    <textarea v-model="form.note" rows="4"
                                        class="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-slate-700 focus:ring-2 focus:ring-slate-700/20"
                                        placeholder="Ghi chú thêm nếu cần..."></textarea>
                                </div>

                                <label
                                    class="inline-flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                                    <input v-model="form.required" type="checkbox" class="h-4 w-4 accent-slate-700" />
                                    Bắt buộc chuẩn bị
                                </label>
                            </div>
                        </div>

                        <div class="flex gap-3 border-t border-slate-200 bg-slate-50 p-5">
                            <button type="button" @click="resetForm"
                                class="flex-1 rounded-lg border border-slate-200 bg-white py-3 text-[11px] font-bold uppercase tracking-widest text-slate-700 transition hover:bg-slate-100 cursor-pointer">
                                Làm mới
                            </button>

                            <button type="button" @click="handleSubmit"
                                class="flex flex-[1.4] items-center justify-center gap-2 rounded-lg bg-slate-700 py-3 text-[11px] font-bold uppercase tracking-widest text-white transition hover:bg-slate-600 cursor-pointer">
                                <Save class="h-4 w-4" />
                                {{ isEditing ? 'Lưu chỉnh sửa' : 'Thêm lễ vật' }}
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
