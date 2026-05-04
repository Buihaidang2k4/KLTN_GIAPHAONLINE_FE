<script setup lang="ts">
import { computed, watch } from 'vue'
import { X, Save } from 'lucide-vue-next'
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
    props.mode === 'update' ? 'Sửa bước hướng dẫn' : 'Thêm bước mới'
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
            .max(3000, 'Hướng dẫn không được quá 3000 ký tự')
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
        <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="show"
                class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
                <div
                    class="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                    <div
                        class="flex shrink-0 items-center justify-between border-b border-slate-200 bg-slate-50/50 p-5">
                        <h3 class="text-lg font-bold text-slate-900">
                            {{ titleText }}
                        </h3>

                        <button type="button" @click="handleClose"
                            class="mr-1 rounded-md p-1.5 transition-colors hover:bg-white">
                            <X class="h-4 w-4 text-slate-400" />
                        </button>
                    </div>

                    <form class="flex min-h-0 flex-1 flex-col" @submit.prevent="onSubmit">
                        <div class="custom-scrollbar space-y-6 overflow-y-auto p-6">
                            <div class="grid grid-cols-1 gap-5">
                                <div>
                                    <label
                                        class="mb-2 ml-1 block text-[8px] font-bold uppercase tracking-widest text-slate-700 opacity-60">
                                        Tên bước thực hiện
                                    </label>

                                    <Field name="stepName" type="text" placeholder="Ví dụ: Lễ dâng hương..."
                                        validate-on-blur
                                        class="w-full rounded-lg border border-slate-200 px-4 py-3 font-semibold outline-none transition-all placeholder:font-medium placeholder:text-slate-300 focus:border-slate-700 focus:ring-2 focus:ring-slate-700/20" />

                                    <ErrorMessage name="stepName" class="mt-1 block text-xs font-medium text-red-500" />
                                </div>

                                <div>
                                    <label
                                        class="mb-2 ml-1 block text-[8px] font-bold uppercase tracking-widest text-slate-700 opacity-60">
                                        Mô tả ngắn
                                    </label>

                                    <Field name="stepDescription" type="text" placeholder="Tóm tắt ý nghĩa bước này"
                                        validate-on-blur
                                        class="w-full rounded-lg border border-slate-200 px-4 py-3 font-semibold outline-none transition-all placeholder:font-medium placeholder:text-slate-300 focus:border-slate-700 focus:ring-2 focus:ring-slate-700/20" />

                                    <ErrorMessage name="stepDescription"
                                        class="mt-1 block text-xs font-medium text-red-500" />
                                </div>

                                <div>
                                    <label
                                        class="mb-2 ml-1 block text-[8px] font-bold uppercase tracking-widest text-slate-700 opacity-60">
                                        Hướng dẫn chi tiết
                                    </label>

                                    <Field as="textarea" name="stepGuideline" rows="5"
                                        placeholder="Nhập chi tiết các bước cần làm..." validate-on-blur
                                        class="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 font-medium leading-relaxed text-slate-700 outline-none transition-all focus:border-slate-700 focus:ring-2 focus:ring-slate-700/20" />

                                    <ErrorMessage name="stepGuideline"
                                        class="mt-1 block text-xs font-medium text-red-500" />
                                </div>
                            </div>
                        </div>

                        <div class="flex shrink-0 gap-3 border-t border-slate-200 bg-slate-50 p-5">
                            <button type="button" @click="handleClose"
                                class="flex-1 rounded-lg border border-transparent py-3 text-[8px] font-bold uppercase tracking-widest text-slate-900 transition-all hover:border-slate-200 hover:bg-white">
                                Hủy bỏ
                            </button>

                            <button type="submit" :disabled="isLoading || !meta.valid"
                                class="flex flex-[2] items-center justify-center gap-2 rounded-lg bg-slate-700 py-3 text-[8px] font-bold uppercase tracking-widest text-white shadow-lg shadow-slate-700/20 transition-all hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60">
                                <Save class="h-4 w-4" />
                                {{ isLoading ? 'Đang lưu...' : 'Lưu bước này' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
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
