<script setup lang="ts">
import type { FeedbackHandleReq, FeedbackRes, FeedbackStatus } from '@/types/feedback/feedback.types'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { CheckCircle2, Send, X } from 'lucide-vue-next'
import { watch } from 'vue'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

const props = defineProps<{
    show: boolean
    feedback?: FeedbackRes | null
    isLoading?: boolean
}>()

const emit = defineEmits<{
    submit: [payload: FeedbackHandleReq]
    close: []
}>()

const statuses: { value: FeedbackStatus; label: string }[] = [
    { value: 'HANDLED', label: 'Đã xử lý' },
    { value: 'REJECTED', label: 'Từ chối' },
    { value: 'PENDING', label: 'Chờ xử lý' }
]

const validationSchema = toTypedSchema(
    z.object({
        status: z.string().min(1, 'Vui lòng chọn trạng thái'),
        adminResponse: z.string().trim().max(1000, 'Phản hồi không được vượt quá 1000 ký tự').optional().or(z.literal(''))
    })
)

const { handleSubmit, resetForm, meta } = useForm<FeedbackHandleReq>({
    initialValues: {
        status: 'HANDLED',
        adminResponse: ''
    },
    validationSchema
})

watch(
    () => props.feedback,
    (feedback) => {
        resetForm({
            values: {
                status: feedback?.status === 'PENDING' ? 'HANDLED' : feedback?.status ?? 'HANDLED',
                adminResponse: feedback?.adminResponse ?? ''
            }
        })
    },
    { immediate: true }
)

const onSubmit = handleSubmit((values) => {
    emit('submit', {
        status: values.status,
        adminResponse: values.adminResponse?.trim() || null
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

                <div class="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                    <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                        <div class="flex items-center gap-3">
                            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                <CheckCircle2 :size="20" />
                            </div>
                            <div>
                                <h2 class="text-lg font-black text-slate-900">Xử lý phản hồi</h2>
                                <p class="mt-0.5 line-clamp-1 text-sm font-medium text-slate-500">
                                    {{ feedback?.subject || 'Cập nhật trạng thái và phản hồi hệ thống.' }}
                                </p>
                            </div>
                        </div>

                        <button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            @click="handleClose">
                            <X :size="18" />
                        </button>
                    </div>

                    <form id="handleFeedbackForm" class="space-y-5 px-6 py-5" @submit.prevent="onSubmit">
                        <div class="space-y-1.5">
                            <label class="block text-xs font-bold uppercase tracking-wide text-slate-500">
                                Trạng thái <span class="text-red-500">*</span>
                            </label>
                            <Field as="select" name="status" validate-on-blur
                                class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10">
                                <option v-for="item in statuses" :key="item.value" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </Field>
                            <ErrorMessage name="status" class="block text-xs font-semibold text-red-500" />
                        </div>

                        <div class="space-y-1.5">
                            <label class="block text-xs font-bold uppercase tracking-wide text-slate-500">
                                Phản hồi từ hệ thống
                            </label>
                            <Field as="textarea" name="adminResponse" rows="6" validate-on-blur
                                placeholder="Nhập nội dung phản hồi cho người dùng..."
                                class="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium leading-relaxed outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10" />
                            <ErrorMessage name="adminResponse" class="block text-xs font-semibold text-red-500" />
                        </div>
                    </form>

                    <div class="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
                        <button type="button" class="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-white"
                            :disabled="isLoading" @click="handleClose">
                            Hủy
                        </button>
                        <button type="submit" form="handleFeedbackForm" :disabled="isLoading || !meta.valid"
                            class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">
                            <Send :size="16" />
                            <span>{{ isLoading ? 'Đang lưu...' : 'Lưu xử lý' }}</span>
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
