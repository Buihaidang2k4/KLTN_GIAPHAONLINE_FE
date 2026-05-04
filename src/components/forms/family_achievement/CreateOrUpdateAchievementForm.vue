<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { Form, Field, ErrorMessage, useForm } from 'vee-validate'
import type {
    FamilyAchievementReq,
    FamilyAchievementRes,
    UpdateFamilyAchievementReq
} from '@/types/family/family-achievement.types'
import { formatDate } from '@/utils/format-date';
import { Camera } from 'lucide-vue-next';
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'


const props = defineProps<{
    show: boolean
    mode: 'create' | 'update'
    achievement?: FamilyAchievementRes | null
    isLoading?: boolean
}>()

const emit = defineEmits<{
    submit: [payload: {
        data: FamilyAchievementReq | UpdateFamilyAchievementReq
        evidenceFile: File | null
    }]
    close: []
}>()


const achievementTypes = [
    { value: "EDUCATION", label: "Học tập" },
    { value: "AWARD", label: "Giải thưởng" },
    { value: "CERTIFICATE", label: "Chứng chỉ" },
    { value: "TITLE", label: "Danh hiệu" },
    { value: "OTHER", label: "Khác" }
]


const initialValues = computed(() => ({
    achievementId: props.achievement?.achievementId ?? '',
    name: props.achievement?.name ?? '',
    achievementType: props.achievement?.achievementType ?? '',
    personName: props.achievement?.personName ?? '',
    rank: props.achievement?.rank ?? '',
    organization: props.achievement?.organization ?? '',
    achievedDate: props.achievement?.achievedDate ?? '',
    description: props.achievement?.description ?? '',
    evidencePath: props.achievement?.evidencePath ?? '',
    evidenceUrl: props.achievement?.evidenceUrl ?? ''
}))

// valid 
const validationSchema = toTypedSchema(
    z.object({
        achievementId: z.union([z.number(), z.string()]).optional(),

        personName: z.string().trim().min(1, "Vui lòng nhập tên người đạt thành tích")
            .max(30, 'Tên người nhập không được quá 30 ký tự'),

        name: z
            .string()
            .trim()
            .min(1, 'Vui lòng nhập tên thành tích')
            .max(255, 'Tên thành tích không được quá 255 ký tự'),

        achievementType: z
            .string()
            .min(1, 'Vui lòng chọn loại thành tích'),


        organization: z
            .string()
            .trim()
            .max(255, 'Đơn vị không được quá 255 ký tự')
            .optional()
            .or(z.literal('')),

        achievedDate: z
            .string()
            .min(1, "Vui lòng chọn ngày đạt được")
            .refine(v => !Number.isNaN(Date.parse(v)), {
                message: "Ngày không hợp lệ"
            })
        ,
        rank: z.string().trim()
            .max(100, 'Thứ hạng không được quá 100 ký tự')
            .optional()
            .or(z.literal('')),

        description: z
            .string()
            .trim()
            .max(1000, 'Mô tả không được quá 1000 ký tự')
            .optional()
            .or(z.literal('')),

        evidenceUrl: z.string().optional().or(z.literal(''))
    })
)


const { resetForm, handleSubmit, meta } = useForm({
    initialValues: initialValues.value,
    validationSchema,
})

watch(
    () => props.achievement,
    (val) => {
        resetForm({
            values: {
                achievementId: val?.achievementId ?? '',
                personName: val?.personName ?? '',
                name: val?.name ?? '',
                achievementType: val?.achievementType ?? '',
                rank: val?.rank ?? '',
                organization: val?.organization ?? '',
                achievedDate: val?.achievedDate ?? '',
                description: val?.description ?? '',
            }
        })
    },
    { immediate: true }
)


const selectedEvidenceFile = ref<File | null>(null)
const previewEvidenceUrl = ref('')

const displayImageUrl = computed(() => {
    if (previewEvidenceUrl.value) return previewEvidenceUrl.value
    if (initialValues.value.evidenceUrl) return initialValues.value.evidenceUrl
    return ''
})

onUnmounted(() => {
    if (previewEvidenceUrl.value) {
        URL.revokeObjectURL(previewEvidenceUrl.value)
    }
})

const onSelectEvidenceImage = (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]

    if (!file) return

    selectedEvidenceFile.value = file

    if (previewEvidenceUrl.value)
        URL.revokeObjectURL(previewEvidenceUrl.value)

    previewEvidenceUrl.value = URL.createObjectURL(file);
}

const removeSelectedImage = () => {
    selectedEvidenceFile.value = null
    if (previewEvidenceUrl.value)
        URL.revokeObjectURL(previewEvidenceUrl.value)
    previewEvidenceUrl.value = ''
}

const onSubmit = handleSubmit((data) => {
    emit('submit', {
        data: data as FamilyAchievementReq | UpdateFamilyAchievementReq,
        evidenceFile: selectedEvidenceFile.value
    })
})


const handleClose = () => {
    selectedEvidenceFile.value = null

    if (previewEvidenceUrl.value)
        URL.revokeObjectURL(previewEvidenceUrl.value)

    previewEvidenceUrl.value = ''

    emit('close')
}

const titleText = computed(() => props.mode === 'create' ? 'Thêm thành tích gia đình' : 'Cập nhật thành tích gia đình');


</script>

<template>
    <Teleport to="body">
        <div v-if="show">
            <div class="fixed inset-0 z-40 bg-black/50 transition opacity-20" @click="handleClose"></div>

            <div class="fixed inset-0 z-99 flex items-center justify-center px-4">
                <div class="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <div class="grid grid-cols-1 md:grid-cols-[42%_58%]">

                        <!-- LEFT IMAGE -->
                        <div class="flex min-h-105 flex-col bg-white">
                            <!-- ẢNH -->
                            <div class="p-4 pb-0">
                                <div
                                    class="group relative h-82 w-full overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                                    <img v-if="displayImageUrl" :src="displayImageUrl" alt="Ảnh minh chứng thành tích"
                                        class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />

                                    <div v-else
                                        class="flex h-full w-full flex-col items-center justify-center px-6 text-center text-slate-500">
                                        <div
                                            class="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm">
                                            🏆
                                        </div>

                                        <p class="text-base font-semibold text-slate-800">
                                            Chưa có ảnh minh chứng
                                        </p>

                                        <p class="mt-1 text-sm text-slate-500">
                                            Chọn ảnh để xem trước tại đây
                                        </p>
                                    </div>

                                    <div v-if="selectedEvidenceFile"
                                        class="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-600 shadow backdrop-blur">
                                        Ảnh mới
                                    </div>
                                </div>
                            </div>

                            <!-- INFO CARD -->
                            <div class="px-4">
                                <div
                                    class="relative z-10 -mt-9 rounded-2xl border border-slate-100 bg-white/95 p-4 shadow-lg backdrop-blur">
                                    <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                        Người đạt thành tích
                                    </p>

                                    <p class="mt-1 truncate text-lg font-bold text-slate-900">
                                        {{ achievement?.personName || 'Chưa nhập tên người đạt' }}
                                    </p>

                                    <p class="mt-2 line-clamp-2 text-sm text-slate-500">
                                        {{ achievement?.name || 'Thông tin thành tích sẽ hiển thị tại đây' }}
                                    </p>
                                </div>
                            </div>

                            <!-- ACTION CHỌN ẢNH -->
                            <div class="mt-auto space-y-3 border-t border-slate-100 bg-white p-4">
                                <label
                                    class="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600">
                                    <Camera :size="17" />
                                    {{ displayImageUrl ? 'Đổi ảnh minh chứng' : 'Chọn ảnh minh chứng' }}

                                    <input type="file" accept="image/*" class="hidden"
                                        @change="onSelectEvidenceImage" />
                                </label>

                                <div v-if="selectedEvidenceFile"
                                    class="flex items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-3 py-2">
                                    <div class="min-w-0">
                                        <p class="truncate text-sm font-semibold text-indigo-700">
                                            {{ selectedEvidenceFile.name }}
                                        </p>
                                        <p class="text-xs text-indigo-500">
                                            Ảnh sẽ lưu khi bấm {{ mode === 'create' ? 'Thêm' : 'Cập nhật' }}
                                        </p>
                                    </div>

                                    <button type="button"
                                        class="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                                        @click="removeSelectedImage">
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- RIGHT FORM -->
                        <div class="max-h-[90vh] overflow-y-auto p-6">
                            <div class="mb-6 flex items-start justify-between gap-4">
                                <div>
                                    <h2 class="text-2xl font-bold text-slate-800">
                                        {{ titleText }}
                                    </h2>
                                    <p class="mt-1 text-sm text-slate-500">
                                        Nhập thông tin thành tích, đơn vị tổ chức và minh chứng.
                                    </p>
                                </div>

                                <button type="button"
                                    class="rounded-full px-3 py-1.5 text-xl text-slate-500 hover:bg-slate-100"
                                    @click="handleClose">
                                    ×
                                </button>
                            </div>

                            <form :key="mode + (achievement?.achievementId ?? 'new')" @submit.prevent="onSubmit">
                                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                    <div class="sm:col-span-2">
                                        <label class="mb-1 block text-sm font-medium text-slate-700">
                                            Tên người đạt thành tích
                                        </label>
                                        <Field name="personName" type="text" placeholder="VD: Nguyễn Văn A"
                                            validate-on-blur
                                            class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                                        <ErrorMessage name="personName" class="mt-1 block text-sm text-red-500" />
                                    </div>


                                    <div class="sm:col-span-2">
                                        <label class="mb-1 block text-sm font-medium text-slate-700">
                                            Tên thành tích
                                        </label>
                                        <Field name="name" type="text" validate-on-blur
                                            placeholder="VD: Giải nhất học sinh giỏi cấp tỉnh"
                                            class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                                        <ErrorMessage name="name" class="mt-1 block text-sm text-red-500" />
                                    </div>


                                    <div>
                                        <label class="mb-1 block text-sm font-medium text-slate-700">
                                            Loại thành tích
                                        </label>
                                        <Field as="select" name="achievementType" validate-on-blur
                                            class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                                            <option value="">Chọn loại thành tích</option>

                                            <option v-for="item in achievementTypes" :key="item.value"
                                                :value="item.value">
                                                {{ item.label }}
                                            </option>
                                        </Field>
                                        <ErrorMessage name="achievementType" class="mt-1 block text-sm text-red-500" />
                                    </div>


                                    <div>
                                        <label class="mb-1 block text-sm font-medium text-slate-700">
                                            Thứ hạng
                                        </label>
                                        <Field name="rank" type="text" placeholder="VD: Giải nhất, Top 10..."
                                            validate-on-blur
                                            class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                                    </div>

                                    <div>
                                        <label class="mb-1 block text-sm font-medium text-slate-700">
                                            Tổ chức / Đơn vị
                                        </label>
                                        <Field name="organization" type="text" placeholder="VD: Sở Giáo dục Hà Nam"
                                            validate-on-blur
                                            class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                                    </div>

                                    <div>
                                        <label class="mb-1 block text-sm font-medium text-slate-700">
                                            Ngày đạt được
                                        </label>
                                        <Field name="achievedDate" type="date" validate-on-blur
                                            class="cursor-pointer w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                                    </div>



                                    <div class="sm:col-span-2">
                                        <label class="mb-1 block text-sm font-medium text-slate-700">
                                            Mô tả
                                        </label>
                                        <Field as="textarea" name="description" rows="4" validate-on-blur
                                            placeholder="Nhập mô tả chi tiết về thành tích..."
                                            class="w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                                    </div>
                                </div>

                                <div v-if="achievement"
                                    class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                                    <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                        <p>
                                            <span class="font-medium text-slate-700">Ngày tạo:</span>
                                            {{ formatDate(achievement.createdAt) }}
                                        </p>
                                        <p>
                                            <span class="font-medium text-slate-700">Cập nhật:</span>
                                            {{ formatDate(achievement.updatedAt) ?? 'Chưa cập nhật' }}
                                        </p>
                                    </div>
                                </div>

                                <div class="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
                                    <button type="button" @click="handleClose"
                                        class="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium cursor-pointer text-slate-700 hover:bg-slate-50">
                                        Hủy
                                    </button>

                                    <button type="submit" :disabled="isLoading || !meta.valid"
                                        class="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow cursor-pointer hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
                                        {{ isLoading ? 'Đang lưu...' : mode === 'create' ? 'Thêm' : 'Cập nhật' }}
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>