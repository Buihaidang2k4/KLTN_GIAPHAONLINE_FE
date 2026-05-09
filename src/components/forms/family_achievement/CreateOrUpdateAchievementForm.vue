<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { Field, ErrorMessage, useForm } from 'vee-validate'
import type {
    FamilyAchievementReq,
    FamilyAchievementRes,
    UpdateFamilyAchievementReq
} from '@/types/family/family-achievement.types'
import { formatDate } from '@/utils/format-date';
import { Camera, X, Save, Sparkles, Scroll, Trophy, BookmarkCheck, History, User } from 'lucide-vue-next';
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

const titleText = computed(() => props.mode === 'create' ? 'Tôn vinh thành tích' : 'Cập nhật vinh danh');

</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <!-- Modal Container -->
                <div class="relative w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden rounded-[2.5rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30 animate-in fade-in zoom-in duration-300">
                    
                    <div class="grid grid-cols-1 md:grid-cols-[40%_60%] flex-1 overflow-hidden">

                        <!-- LEFT: PREVIEW & IMAGE -->
                        <div class="relative flex flex-col bg-amber-50/20 border-b md:border-b-0 md:border-r border-amber-100/50 h-full overflow-hidden">
                            <!-- Subtle Ornament -->
                            <div class="absolute top-12 left-12 text-amber-900/[0.03] pointer-events-none">
                                <Trophy :size="160" />
                            </div>

                            <div class="flex-1 flex flex-col p-6 min-h-0 overflow-y-auto custom-scrollbar">
                                <!-- Image Card -->
                                <div class="relative group min-h-[300px] flex-1 rounded-3xl overflow-hidden bg-white shadow-inner border border-amber-200/40 shrink-0 mb-6">
                                    <img v-if="displayImageUrl" :src="displayImageUrl" alt="Minh chứng"
                                        class="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                                    
                                    <div v-else class="flex h-full w-full flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05),transparent)]">
                                        <div class="w-20 h-20 mb-4 bg-amber-50 rounded-2xl flex items-center justify-center shadow-sm">
                                            <Trophy :size="32" class="text-amber-500" />
                                        </div>
                                        <p class="text-sm font-black text-slate-800 uppercase tracking-widest">Chưa có minh chứng</p>
                                        <p class="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Hình ảnh bằng khen hoặc kỷ niệm</p>
                                    </div>

                                    <!-- Upload Overlay -->
                                    <label class="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/40 transition-all cursor-pointer flex flex-col items-center justify-center opacity-0 hover:opacity-100">
                                        <Camera :size="32" class="text-white mb-2" />
                                        <span class="text-white text-xs font-bold uppercase tracking-widest">Thay đổi ảnh</span>
                                        <input type="file" accept="image/*" class="hidden" @change="onSelectEvidenceImage" />
                                    </label>

                                    <div v-if="selectedEvidenceFile"
                                        class="absolute top-4 right-4 px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                        Ảnh mới
                                    </div>
                                </div>

                                <!-- Preview Info -->
                                <div class="p-5 bg-white rounded-2xl border border-amber-100/50 shadow-sm relative overflow-hidden shrink-0">
                                    <div class="absolute top-0 right-0 p-3 opacity-5">
                                        <Scroll :size="48" />
                                    </div>
                                    <span class="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1 block">Người đạt được</span>
                                    <h4 class="text-lg font-black text-slate-900 truncate leading-tight">
                                        {{ achievement?.personName || 'Tên thành viên' }}
                                    </h4>
                                    <div class="mt-2 flex items-center gap-2">
                                        <div class="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                        <p class="text-xs font-bold text-slate-500 italic truncate">
                                            {{ achievement?.name || 'Vinh danh thành tích dòng tộc' }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Image Management Footer -->
                            <div v-if="selectedEvidenceFile" class="p-4 bg-white/50 border-t border-amber-100/30 shrink-0">
                                <div class="flex items-center justify-between gap-3 bg-white p-2 rounded-xl border border-amber-100">
                                    <div class="min-w-0 px-1">
                                        <p class="text-[10px] font-bold text-slate-700 truncate">{{ selectedEvidenceFile.name }}</p>
                                    </div>
                                    <button @click="removeSelectedImage" class="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                        <X :size="14" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- RIGHT: FORM SECTION -->
                        <div class="flex flex-col h-full overflow-hidden">
                            <!-- Header -->
                            <div class="relative shrink-0 px-8 pt-8 pb-4 text-center md:text-left">
                                <div class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                                    <Sparkles :size="12" class="text-amber-600" />
                                    <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Bảng vàng vinh danh</span>
                                </div>
                                <h2 class="text-2xl font-black text-slate-900 tracking-tight">
                                    {{ titleText }}
                                </h2>
                                <p class="mt-1 text-xs text-slate-500 font-medium leading-relaxed">
                                    Lưu giữ những nỗ lực và đóng góp xuất sắc của con cháu vào truyền thống dòng họ.
                                </p>

                                <button @click="handleClose" 
                                    class="absolute top-8 right-8 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                                    <X :size="20" />
                                </button>
                            </div>

                            <!-- Scrollable Form Body -->
                            <div class="custom-scrollbar flex-1 overflow-y-auto px-8 pb-4">
                                <form id="achievementForm" :key="mode + (achievement?.achievementId ?? 'new')" @submit.prevent="onSubmit" class="space-y-5 pt-2">
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        
                                        <!-- Tên người đạt -->
                                        <div class="sm:col-span-2 space-y-1.5">
                                            <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                                <User :size="14" class="text-amber-600/70" />
                                                Tên người đạt thành tích <span class="text-red-400">*</span>
                                            </label>
                                            <Field name="personName" type="text" placeholder="VD: Nguyễn Văn A"
                                                validate-on-blur
                                                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                            <ErrorMessage name="personName" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                        </div>

                                        <!-- Tên thành tích -->
                                        <div class="sm:col-span-2 space-y-1.5">
                                            <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                                <BookmarkCheck :size="14" class="text-amber-600/70" />
                                                Tên thành tích <span class="text-red-400">*</span>
                                            </label>
                                            <Field name="name" type="text" validate-on-blur
                                                placeholder="VD: Giải nhất học sinh giỏi cấp tỉnh"
                                                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                            <ErrorMessage name="name" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                        </div>

                                        <!-- Loại thành tích -->
                                        <div class="space-y-1.5">
                                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                                Phân loại <span class="text-red-400">*</span>
                                            </label>
                                            <Field as="select" name="achievementType" validate-on-blur
                                                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm appearance-none cursor-pointer">
                                                <option value="">Chọn loại thành tích</option>
                                                <option v-for="item in achievementTypes" :key="item.value" :value="item.value">
                                                    {{ item.label }}
                                                </option>
                                            </Field>
                                            <ErrorMessage name="achievementType" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                        </div>

                                        <!-- Thứ hạng -->
                                        <div class="space-y-1.5">
                                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                                Thứ hạng / Danh hiệu
                                            </label>
                                            <Field name="rank" type="text" placeholder="VD: Giải nhất, Top 10..."
                                                validate-on-blur
                                                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                        </div>

                                        <!-- Tổ chức -->
                                        <div class="space-y-1.5">
                                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                                Đơn vị tổ chức
                                            </label>
                                            <Field name="organization" type="text" placeholder="VD: Sở Giáo dục Hà Nam"
                                                validate-on-blur
                                                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                        </div>

                                        <!-- Ngày đạt được -->
                                        <div class="space-y-1.5">
                                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                                Thời điểm đạt được <span class="text-red-400">*</span>
                                            </label>
                                            <Field name="achievedDate" type="date" validate-on-blur
                                                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm cursor-pointer" />
                                            <ErrorMessage name="achievedDate" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                        </div>

                                        <!-- Mô tả -->
                                        <div class="sm:col-span-2 space-y-1.5">
                                            <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                                Ý nghĩa & Chi tiết
                                            </label>
                                            <Field as="textarea" name="description" rows="3" validate-on-blur
                                                placeholder="Chia sẻ thêm về quá trình nỗ lực hoặc ý nghĩa của thành tích này..."
                                                class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all leading-relaxed shadow-sm" />
                                        </div>
                                    </div>

                                    <!-- Audit Info -->
                                    <div v-if="achievement"
                                        class="flex items-center justify-between p-4 bg-amber-50/40 rounded-2xl border border-amber-100/30">
                                        <div class="flex items-center gap-3">
                                            <div class="p-2 bg-white rounded-xl shadow-sm">
                                                <History :size="16" class="text-amber-600" />
                                            </div>
                                            <div class="flex flex-col">
                                                <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Lịch sử vinh danh</span>
                                                <span class="text-[11px] font-bold text-slate-700">{{ formatDate(achievement.updatedAt || achievement.createdAt) }}</span>
                                            </div>
                                        </div>
                                        <span class="text-[10px] font-bold text-amber-700/60 uppercase">Đã lưu hồ sơ</span>
                                    </div>
                                </form>
                            </div>

                            <!-- Fixed Footer Actions -->
                            <div class="shrink-0 flex items-center justify-end gap-3 px-8 py-5 border-t border-amber-100/30 bg-[#fefaf6]/80 backdrop-blur-sm">
                                <button type="button" @click="handleClose"
                                    class="px-8 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all">
                                    Quay lại
                                </button>

                                <button type="submit" form="achievementForm" :disabled="isLoading || !meta.valid"
                                    class="flex items-center gap-2 px-10 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-40">
                                    <Save :size="14" />
                                    <span>{{ isLoading ? 'Đang lưu...' : mode === 'create' ? 'Tôn vinh ngay' : 'Cập nhật' }}</span>
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

select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2392400e' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E");
    background-position: right 1rem center;
    background-repeat: no-repeat;
    background-size: 0.85rem;
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