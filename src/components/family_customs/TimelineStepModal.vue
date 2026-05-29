<script setup lang="ts">
import { computed, watch } from 'vue'
import { X, Save, Sparkles, Scroll, BookmarkCheck } from 'lucide-vue-next'
import { Field, ErrorMessage, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import type { CeremonyTimelineReq, CeremonyTimelineRes } from '@/types/family/ceremony.types'

const props = defineProps<{
    show: boolean
    mode: 'create' | 'update'
    editingStep: CeremonyTimelineRes | null
    isLoading?: boolean
}>()

const emit = defineEmits<{
    close: []
    save: [payload: CeremonyTimelineReq]
}>()

const titleText = computed(() =>
    props.mode === 'update' ? 'Cập nhật bước hướng dẫn' : 'Thêm bước thực hiện mới'
)

const validationSchema = toTypedSchema(
    z.object({
        stepName: z
            .string()
            .trim()
            .min(1, 'Vui lòng nhập tên bước thực hiện')
            .max(255, 'Tên bước không được quá 255 ký tự'),
        stepDescription: z
            .string()
            .trim()
            .min(1, 'Vui lòng nhập mô tả ngắn')
            .max(500, 'Mô tả ngắn không được quá 500 ký tự'),
        stepGuideline: z
            .string()
            .trim()
            .min(1, 'Vui lòng nhập hướng dẫn chi tiết')
            .max(2000, 'Hướng dẫn không được quá 2000 ký tự')
    })
)

const getDefaultValues = (): CeremonyTimelineReq => ({
    stepName: '',
    stepDescription: '',
    stepGuideline: ''
})

const getStepValues = (step: CeremonyTimelineRes | null): CeremonyTimelineReq => {
    if (!step) return getDefaultValues()

    return {
        stepName: step.stepName ?? '',
        stepDescription: step.stepDescription ?? '',
        stepGuideline: step.stepGuideline ?? ''
    }
}

const { handleSubmit, resetForm, meta } = useForm({
    initialValues: getDefaultValues(),
    validationSchema
})

watch(
    () => [props.show, props.mode, props.editingStep],
    () => {
        if (!props.show) return

        resetForm({
            values: getStepValues(props.editingStep)
        })
    },
    { immediate: true }
)

const onSubmit = handleSubmit(values => {
    emit('save', values)
})

const handleClose = () => {
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
                <div class="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30 animate-in fade-in zoom-in duration-200">
                    
                    <!-- Subtle Ornaments -->
                    <div class="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(180,83,9,0.03),transparent)] pointer-events-none"></div>
                    <div class="absolute top-6 left-6 text-amber-900/[0.03] pointer-events-none">
                        <Scroll :size="80" />
                    </div>

                    <!-- Header Section -->
                    <div class="relative px-6 pt-8 pb-4 text-center">
                        <div class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Tiến trình nghi lễ</span>
                        </div>
                        <h2 class="text-xl font-black text-slate-900 tracking-tight">
                            {{ titleText }}
                        </h2>
                        <p class="mt-1 text-xs text-slate-500 font-medium max-w-[280px] mx-auto leading-relaxed">
                            Mô tả chi tiết từng bước để con cháu thực hiện đúng lễ nghi.
                        </p>

                        <button @click="handleClose" 
                            class="absolute top-5 right-5 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="18" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <form class="relative px-6 pb-8" @submit.prevent="onSubmit">
                        
                        <div class="space-y-4">
                            <!-- Tên bước thực hiện -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    <BookmarkCheck :size="14" class="text-amber-600/70" />
                                    Tên bước thực hiện <span class="text-red-400">*</span>
                                </label>
                                <Field name="stepName" type="text" placeholder="Ví dụ: Lễ dâng hương..."
                                    validate-on-blur
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                <ErrorMessage name="stepName" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                            </div>

                            <!-- Mô tả ngắn -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    Mô tả ngắn <span class="text-red-400">*</span>
                                </label>
                                <Field name="stepDescription" type="text" placeholder="Tóm tắt ý nghĩa bước này"
                                    validate-on-blur
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                <ErrorMessage name="stepDescription" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                            </div>

                            <!-- Hướng dẫn chi tiết -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    Hướng dẫn chi tiết <span class="text-red-400">*</span>
                                </label>
                                <Field as="textarea" name="stepGuideline" rows="5"
                                    placeholder="Nhập chi tiết các bước cần làm, lời khấn hoặc lưu ý..." validate-on-blur
                                    class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all leading-relaxed shadow-sm" />
                                <ErrorMessage name="stepGuideline" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="mt-8 flex items-center justify-center gap-3">
                            <button type="button"
                                class="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
                                @click="handleClose">
                                Quay lại
                            </button>

                            <button type="submit" :disabled="isLoading || !meta.valid"
                                class="flex-[1.5] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-40">
                                <Save :size="14" />
                                <span>{{ isLoading ? 'Đang lưu...' : 'Lưu bước này' }}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.rounded-\[2rem\]::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    width: 30px;
    height: 30px;
    border-top: 2px solid rgba(217, 119, 6, 0.08);
    border-left: 2px solid rgba(217, 119, 6, 0.08);
    border-radius: 10px 0 0 0;
    pointer-events: none;
}
</style>
