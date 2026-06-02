<script setup lang="ts">
import type { FeedbackReq, FeedbackType } from '@/types/feedback/feedback.types'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { MessageSquare, Send, X } from 'lucide-vue-next'
import { watch } from 'vue'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const props = defineProps<{
    show: boolean
    isLoading?: boolean
}>()

const emit = defineEmits<{
    submit: [payload: FeedbackReq]
    close: []
}>()

const feedbackTypes: { value: FeedbackType; label: string }[] = [
    { value: 'BUG_REPORT', label: 'Báo lỗi' },
    { value: 'FEATURE_REQUEST', label: 'Đề xuất tính năng' },
    { value: 'UI_FEEDBACK', label: 'Góp ý giao diện' },
    { value: 'OTHER', label: 'Khác' }
]

const validationSchema = toTypedSchema(
    z.object({
        type: z
            .string()
            .min(1, 'Vui lòng chọn loại phản hồi'),
        subject: z
            .string()
            .trim()
            .min(1, 'Vui lòng nhập tiêu đề')
            .max(255, 'Tiêu đề không được vượt quá 255 ký tự'),
        content: z
            .string()
            .trim()
            .min(1, 'Vui lòng nhập nội dung')
            .max(1000, 'Nội dung không được vượt quá 1000 ký tự')
    })
)

const { handleSubmit, resetForm, meta } = useForm<FeedbackReq>({
    initialValues: {
        type: 'OTHER',
        subject: '',
        content: ''
    },
    validationSchema
})

watch(
    () => props.show,
    (show) => {
        if (show) {
            resetForm({
                values: {
                    type: 'OTHER',
                    subject: '',
                    content: ''
                }
            })
        }
    }
)

const onSubmit = handleSubmit((values) => {
    emit('submit', {
        type: values.type,
        subject: values.subject.trim(),
        content: values.content.trim()
    })
})

const handleClose = () => {
    if (props.isLoading) return
    emit('close')
}
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <div class="relative w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-200">
                    <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                        <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                <MessageSquare :size="20" />
                            </div>
                            <div>
                                <h2 class="text-lg font-bold text-slate-900">Gửi phản hồi</h2>
                                <p class="mt-0.5 text-sm text-slate-500">Nhập nội dung góp ý hoặc vấn đề bạn gặp phải.</p>
                            </div>
                        </div>

                        <button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            @click="handleClose">
                            <X :size="18" />
                        </button>
                    </div>

                    <form id="createFeedbackForm" class="space-y-5 px-6 py-5" @submit.prevent="onSubmit">
                        <div class="space-y-1.5">
                            <label class="block text-xs font-bold uppercase tracking-wide text-slate-500">
                                Loại phản hồi <span class="text-red-500">*</span>
                            </label>
                            <Field as="select" name="type" validate-on-blur
                                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10">
                                <option v-for="item in feedbackTypes" :key="item.value" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </Field>
                            <ErrorMessage name="type" class="block text-xs font-semibold text-red-500" />
                        </div>

                        <div class="space-y-1.5">
                            <label class="block text-xs font-bold uppercase tracking-wide text-slate-500">
                                Tiêu đề <span class="text-red-500">*</span>
                            </label>
                            <Field name="subject" type="text" validate-on-blur placeholder="Ví dụ: Không tải được ảnh gia phả"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10" />
                            <ErrorMessage name="subject" class="block text-xs font-semibold text-red-500" />
                        </div>

                        <div class="space-y-1.5">
                            <label class="block text-xs font-bold uppercase tracking-wide text-slate-500">
                                Nội dung <span class="text-red-500">*</span>
                            </label>
                            <Field as="textarea" name="content" rows="6" validate-on-blur
                                placeholder="Mô tả ngắn gọn phản hồi của bạn..."
                                class="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium leading-relaxed outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10" />
                            <ErrorMessage name="content" class="block text-xs font-semibold text-red-500" />
                        </div>
                    </form>

                    <div class="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                        <button type="button" class="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-white"
                            :disabled="isLoading" @click="handleClose">
                            Hủy
                        </button>
                        <button type="submit" form="createFeedbackForm" :disabled="isLoading || !meta.valid"
                            class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
                            <Send :size="16" />
                            <span>{{ isLoading ? 'Đang gửi...' : 'Gửi phản hồi' }}</span>
                        </button>
                    </div>
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
</style>
