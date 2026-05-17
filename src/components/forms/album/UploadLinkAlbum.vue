<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { watch } from 'vue'
import { z } from 'zod'
import { X, Save, Sparkles, Link, Type } from 'lucide-vue-next'

const props = defineProps<{
    show: boolean
    albumId: number
    isLoading?: boolean
}>()

const emit = defineEmits<{
    close: []
    submit: [data: { albumId: number, url: string; title?: string }]
}>()

const validationSchema = toTypedSchema(
    z.object({
        url: z
            .string()
            .trim()
            .min(1, 'Vui lòng nhập đường dẫn')
            .url('Đường dẫn không hợp lệ, vui lòng nhập đầy đủ (VD: https://youtube.com/...)'),
        title: z
            .string()
            .trim()
            .max(255, 'Tiêu đề không được quá 255 ký tự')
            .optional()
            .nullable()
    })
)

const { resetForm, handleSubmit, meta } = useForm({
    initialValues: {
        url: '',
        title: ''
    },
    validationSchema
})

watch(
    () => props.show,
    (val) => {
        if (val) {
            resetForm({
                values: {
                    url: '',
                    title: ''
                }
            })
        }
    }
)

const handleClose = () => {
    emit('close')
}

const onSubmit = handleSubmit((values) => {
    emit('submit', {
        albumId: props.albumId,
        url: values.url.trim(),
        title: values.title?.trim() || undefined
    })
})
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <!-- Modal Container -->
                <div
                    class="relative w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden rounded-[2.5rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30 animate-in fade-in zoom-in duration-300">

                    <!-- Header -->
                    <div class="relative shrink-0 px-8 pt-8 pb-4 text-center md:text-left">
                        <div
                            class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Liên kết
                                mới</span>
                        </div>
                        <h2 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            Thêm liên kết media
                        </h2>
                        <p class="mt-1 text-xs text-slate-500 font-medium leading-relaxed max-w-sm">
                            Thêm video YouTube, Google Drive hoặc các liên kết lưu trữ khác vào tập kỷ niệm.
                        </p>

                        <button @click="handleClose"
                            class="absolute top-8 right-8 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="20" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <div class="custom-scrollbar flex-1 overflow-y-auto px-8 pb-4">
                        <form id="linkForm" @submit.prevent="onSubmit" class="space-y-6 pt-2">

                            <!-- Đường dẫn (URL) -->
                            <div class="space-y-1.5">
                                <label
                                    class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    <Link :size="14" class="text-amber-600/70" />
                                    Đường dẫn (URL) <span class="text-red-400">*</span>
                                </label>
                                <Field name="url" type="url" placeholder="VD: https://youtube.com/watch?v=..."
                                    validate-on-blur
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                <ErrorMessage name="url" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                            </div>

                            <!-- Tiêu đề (Optional) -->
                            <div class="space-y-1.5">
                                <label
                                    class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    <Type :size="14" class="text-amber-600/70" />
                                    Tiêu đề (Tùy chọn)
                                </label>
                                <Field name="title" type="text" placeholder="VD: Video lễ kỷ niệm 2024" validate-on-blur
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                <ErrorMessage name="title" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                            </div>
                        </form>
                    </div>

                    <!-- Fixed Footer Actions -->
                    <div
                        class="shrink-0 flex items-center justify-end gap-3 px-8 py-5 border-t border-amber-100/30 bg-[#fefaf6]/80 backdrop-blur-sm">
                        <button type="button" @click="handleClose" :disabled="isLoading"
                            class="px-8 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all disabled:opacity-50">
                            Hủy bỏ
                        </button>

                        <button type="submit" form="linkForm" :disabled="isLoading || !meta.valid"
                            class="flex items-center gap-2 px-10 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-40">
                            <Save :size="14" />
                            <span>{{ isLoading ? 'Đang thêm...' : 'Thêm liên kết' }}</span>
                        </button>
                    </div>

                    <!-- Decorative footer line -->
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