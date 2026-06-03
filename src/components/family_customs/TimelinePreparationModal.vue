<script setup lang="ts">
import { computed, watch } from 'vue'
import { X, Save, Pencil, Trash2, Sparkles, Scroll, Gift, BookmarkCheck, AlertCircle } from 'lucide-vue-next'
import { notify } from '@/utils/notify'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'
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
import { useFamilyStore } from '@/store/family/useFamilyStore'
import { useFamilyPermissions } from '@/composables/family/useFamilyPermissions'

const props = defineProps<{
    show: boolean
    timeline: CeremonyTimelineRes | null
}>()

const emit = defineEmits<{
    close: []
}>()

const timelineId = computed(() => props.timeline?.timelineId ?? null)
const familyStore = useFamilyStore()
const familyId = computed(() => familyStore.currentFamilyId)

const { data: preparationsData } = useCeremonyTimelinePreparationsQuery(timelineId)
const { mutate: createPreparationMutation } = useCreateCeremonyTimelinePreparationMutation()
const { mutate: updatePreparationMutation } = useUpdateCeremonyTimelinePreparationMutation()
const { mutate: deletePreparationMutation } = useDeleteCeremonyTimelinePreparationMutation()
const { canManageCeremony } = useFamilyPermissions(familyId)

const preparations = computed(() => preparationsData.value?.data?.items ?? [])

// 1. Định nghĩa Validation Schema bằng Zod
const validationSchema = toTypedSchema(
    zod.object({
        preparationId: zod.number().nullable().optional(),
        itemName: zod.string().trim().min(1, 'Vui lòng nhập tên lễ vật'),
        itemType: zod.string().trim().min(1, 'Vui lòng chọn hoặc nhập loại lễ vật'),
        quantity: zod.number({ invalid_type_error: 'Số lượng phải là số' }).min(1, 'Số lượng tối thiểu là 1'),
        unit: zod.string().trim().min(1, 'Vui lòng nhập đơn vị tính'),
        note: zod.string().trim().optional().default(''),
        required: zod.boolean().default(true)
    })
)

// 2. Cấu hình Form với Vee-Validate
const { values, errors, defineField, handleSubmit: validateAndSubmit, resetForm, setValues } = useForm({
    validationSchema,
    initialValues: {
        preparationId: null,
        itemName: '',
        itemType: '',
        quantity: 1,
        unit: '',
        note: '',
        required: true
    }
})

// Sử dụng defineField để v-model đồng bộ mượt mà với Vee-Validate
const [itemName] = defineField('itemName')
const [itemType] = defineField('itemType')
const [quantity] = defineField('quantity')
const [unit] = defineField('unit')
const [note] = defineField('note')
const [required] = defineField('required')

const isEditing = computed(() => values.preparationId !== null)

// Hàm reset form về trạng thái ban đầu
const handleReset = () => {
    resetForm({
        values: {
            preparationId: null,
            itemName: '',
            itemType: '',
            quantity: 1,
            unit: '',
            note: '',
            required: true
        }
    })
}

watch(
    () => props.show,
    (show) => {
        if (show) handleReset()
    }
)

watch(
    () => props.timeline,
    () => {
        handleReset()
    }
)

// 3. Xử lý Submit Form sau khi qua bộ lọc Validation
const onSubmit = validateAndSubmit((formValues) => {
    if (!canManageCeremony.value) {
        notify.error("Thông báo", "Bạn không có quyền thực hiện thao tác này")
        return
    }

    if (!timelineId.value) {
        notify.error('Thông báo', 'Không tìm thấy bước cần quản lý lễ vật')
        return
    }

    const payload: CeremonyTimelinePreparationReq = {
        itemName: formValues.itemName,
        itemType: formValues.itemType,
        quantity: Number(formValues.quantity),
        unit: formValues.unit,
        note: formValues.note || '',
        required: formValues.required
    }

    if (isEditing.value && formValues.preparationId) {
        updatePreparationMutation(
            { preparationId: formValues.preparationId, data: payload },
            {
                onSuccess: () => {
                    notify.success('Thông báo', 'Cập nhật lễ vật thành công')
                    handleReset()
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
                handleReset()
            },
            onError: (error: any) => {
                console.error('create preparation error', error?.response?.data ?? error)
                notify.error('Thông báo', 'Thêm lễ vật thất bại')
            }
        }
    )
})

const handleEdit = (item: CeremonyTimelinePreparationRes) => {
    if (!canManageCeremony.value) {
        notify.error("Thông báo", "Bạn không có quyền thực hiện thao tác này")
        return
    }
    // Gán dữ liệu vào form thông qua setValues của vee-validate
    setValues({
        preparationId: item.preparationId,
        itemName: item.itemName,
        itemType: item.itemType,
        quantity: item.quantity,
        unit: item.unit,
        note: item.note ?? '',
        required: item.required
    })
}

const handleDelete = (preparationId: number) => {
    if (!canManageCeremony.value) {
        notify.error("Thông báo", "Bạn không có quyền thực hiện thao tác này")
        return
    }

    if (!window.confirm('Bạn có chắc muốn xóa lễ vật này không?')) return

    deletePreparationMutation(preparationId, {
        onSuccess: () => {
            notify.success('Thông báo', 'Xóa lễ vật thành công')
            if (values.preparationId === preparationId) {
                handleReset()
            }
        },
        onError: (error: any) => {
            console.error('delete preparation error', error?.response?.data ?? error)
            notify.error('Thông báo', 'Xóa lễ vật thất bại')
        }
    })
}

const handleClose = () => {
    handleReset()
    emit('close')
}
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <div
                    class="relative w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden rounded-[2.5rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30 animate-in fade-in zoom-in duration-300">

                    <div
                        class="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(180,83,9,0.03),transparent)] pointer-events-none">
                    </div>
                    <div class="absolute top-6 left-6 text-amber-900/[0.02] pointer-events-none">
                        <Gift :size="120" />
                    </div>

                    <div class="relative shrink-0 px-8 pt-8 pb-4 text-center border-b border-amber-100/50">
                        <div
                            class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Lễ vật truyền
                                thống</span>
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

                    <div class="flex min-h-0 flex-1 flex-col md:flex-row">

                        <div
                            class="flex min-h-0 flex-col md:w-[55%] border-b md:border-b-0 md:border-r border-amber-100/50">
                            <div class="shrink-0 px-6 py-4 bg-amber-50/20">
                                <div class="flex items-center gap-2">
                                    <div class="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                                    <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Danh mục cần
                                        chuẩn bị</h4>
                                </div>
                            </div>

                            <div class="custom-scrollbar flex-1 overflow-y-auto p-6 bg-amber-50/10">
                                <div v-if="!preparations.length"
                                    class="flex flex-col items-center justify-center h-full py-12 opacity-40">
                                    <Scroll :size="48" class="text-amber-900 mb-3" />
                                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Chưa có lễ vật
                                        nào</p>
                                </div>

                                <div v-else class="space-y-4">
                                    <div v-for="item in preparations" :key="item.preparationId" :class="[
                                        'relative rounded-[1.25rem] border p-5 transition-all duration-300 group',
                                        values.preparationId === item.preparationId
                                            ? 'border-amber-400 bg-white shadow-lg ring-4 ring-amber-500/5'
                                            : 'border-amber-200/40 bg-white hover:border-amber-300 hover:shadow-md'
                                    ]">
                                        <div class="flex items-start justify-between gap-4">
                                            <div class="min-w-0 flex-1">
                                                <div class="flex items-start gap-2 mb-2">
                                                    <p
                                                        class="font-black text-slate-900 text-base leading-none pt-1 truncate">
                                                        {{ item.itemName }}
                                                    </p>
                                                    <span :class="[
                                                        'shrink-0 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter',
                                                        item.required
                                                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                                                    ]">
                                                        {{ item.required ? 'Bắt buộc' : 'Tùy chọn' }}
                                                    </span>
                                                </div>

                                                <div class="flex flex-wrap items-center gap-y-2 gap-x-4">
                                                    <div
                                                        class="flex items-center gap-1.5 px-2 py-1 bg-amber-50 rounded-lg border border-amber-100">
                                                        <span
                                                            class="text-[10px] font-black text-amber-800">{{ item.quantity }}</span>
                                                        <span
                                                            class="text-[9px] font-bold text-amber-600 uppercase tracking-tighter">{{ item.unit }}</span>
                                                    </div>
                                                    <div
                                                        class="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                                                        <BookmarkCheck :size="10" class="text-slate-400" />
                                                        <span
                                                            class="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{{ item.itemType }}</span>
                                                    </div>
                                                </div>

                                                <div v-if="item.note" class="mt-3 pl-3 border-l-2 border-amber-200/50">
                                                    <p
                                                        class="text-xs text-slate-500 font-medium leading-relaxed italic">
                                                        "{{ item.note }}"
                                                    </p>
                                                </div>
                                            </div>

                                            <div
                                                class="flex shrink-0 gap-1.5 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
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
                                    <div class="space-y-1.5">
                                        <label
                                            class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            <BookmarkCheck :size="14" class="text-amber-600/70" />
                                            Tên lễ vật <span class="text-red-400">*</span>
                                        </label>
                                        <input v-model="itemName" type="text"
                                            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                                            :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-500/5': errors.itemName }"
                                            placeholder="Ví dụ: Trầu cau" />
                                        <div v-if="errors.itemName"
                                            class="flex items-center gap-1 text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <AlertCircle :size="12" />
                                            {{ errors.itemName }}
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-4">
                                        <div class="space-y-1.5">
                                            <label
                                                class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                                Loại <span class="text-red-400">*</span>
                                            </label>
                                            <input v-model="itemType" type="text"
                                                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                                                :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-500/5': errors.itemType }"
                                                placeholder="Lễ vật" />
                                            <div v-if="errors.itemType"
                                                class="flex items-center gap-1 text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                                <AlertCircle :size="12" />
                                                {{ errors.itemType }}
                                            </div>
                                        </div>

                                        <div class="space-y-1.5">
                                            <label
                                                class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                                Số lượng <span class="text-red-400">*</span>
                                            </label>
                                            <input v-model.number="quantity" type="number" min="1"
                                                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                                                :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-500/5': errors.quantity }" />
                                            <div v-if="errors.quantity"
                                                class="flex items-center gap-1 text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                                <AlertCircle :size="12" />
                                                {{ errors.quantity }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="space-y-1.5">
                                        <label
                                            class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Đơn vị tính <span class="text-red-400">*</span>
                                        </label>
                                        <input v-model="unit" type="text"
                                            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                                            :class="{ 'border-red-400 focus:border-red-400 focus:ring-red-500/5': errors.unit }"
                                            placeholder="Mâm, bộ, cái..." />
                                        <div v-if="errors.unit"
                                            class="flex items-center gap-1 text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <AlertCircle :size="12" />
                                            {{ errors.unit }}
                                        </div>
                                    </div>

                                    <div class="space-y-1.5">
                                        <label
                                            class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Ghi chú
                                        </label>
                                        <textarea v-model="note" rows="3"
                                            class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all leading-relaxed shadow-sm"
                                            placeholder="Thêm hướng dẫn chuẩn bị..."></textarea>
                                    </div>

                                    <label
                                        class="flex items-center gap-3 p-3 rounded-xl border border-amber-100 bg-amber-50/30 cursor-pointer hover:bg-amber-50 transition group">
                                        <div class="relative flex items-center justify-center">
                                            <input v-model="required" type="checkbox"
                                                class="peer h-5 w-5 opacity-0 absolute z-10 cursor-pointer" />
                                            <div
                                                class="h-5 w-5 bg-white border-2 border-amber-200 rounded-md peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all flex items-center justify-center">
                                                <X :size="14" class="text-white rotate-45" v-if="required" />
                                            </div>
                                        </div>
                                        <span class="text-xs font-bold text-amber-800/80 uppercase tracking-wider">Bắt
                                            buộc chuẩn bị</span>
                                    </label>
                                </div>
                            </div>

                            <div class="shrink-0 flex gap-3 px-6 py-5 border-t border-amber-100/30 bg-white/50">
                                <button v-if="isEditing" type="button" @click="handleReset"
                                    class="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all">
                                    Hủy bỏ
                                </button>
                                <button type="button" @click="onSubmit"
                                    class="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98]">
                                    <Save :size="14" />
                                    <span>{{ isEditing ? 'Lưu thay đổi' : 'Thêm lễ vật' }}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        class="h-1.5 w-full bg-[linear-gradient(90deg,transparent_0%,#d97706_50%,transparent_100%)] opacity-10">
                    </div>
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