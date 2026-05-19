<script setup lang="ts">
import { useCreateArticleCategoryMutation } from '@/hooks/queries/article_category/useArticleCategory'
import { notify } from '@/utils/notify'
import { toTypedSchema } from '@vee-validate/zod'
import { FolderTree, Hash, Sparkles, X } from 'lucide-vue-next'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { watch } from 'vue'
import { z } from 'zod'

const props = defineProps<{
    show: boolean
    defaultDisplayOrder?: number
}>()

const emit = defineEmits<{
    close: []
    success: []
}>()

const validationSchema = toTypedSchema(
    z.object({
        name: z.string().trim()
            .min(1, 'Tên danh mục không được để trống')
            .min(2, 'Tên danh mục phải từ 2 đến 100 ký tự')
            .max(100, 'Tên danh mục phải từ 2 đến 100 ký tự'),
        description: z.string().trim().optional(),
        displayOrder: z.coerce.number()
            .min(0, 'Thứ tự hiển thị không được là số âm')
    })
)

const { resetForm, handleSubmit } = useForm({
    initialValues: {
        name: '',
        description: '',
        displayOrder: props.defaultDisplayOrder ?? 0
    },
    validationSchema
})

const createMutation = useCreateArticleCategoryMutation()
const isCreating = createMutation.isPending

watch(
    () => props.show,
    (show) => {
        if (!show) return

        resetForm({
            values: {
                name: '',
                description: '',
                displayOrder: props.defaultDisplayOrder ?? 0
            }
        })
    }
)

const handleClose = () => {
    resetForm()
    emit('close')
}

const onSubmit = handleSubmit(async (values) => {
    try {
        await createMutation.mutateAsync({
            name: values.name,
            description: values.description || null,
            displayOrder: Number(values.displayOrder)
        })

        notify.success('Tạo danh mục bài viết thành công', 'Thành công')
        emit('success')
        handleClose()
    } catch (err: any) {
        notify.error(err.response?.data?.message || 'Có lỗi xảy ra khi tạo danh mục', 'Thất bại')
    }
})
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <div
                    class="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30">
                    <div class="relative px-6 pt-8 pb-4 text-center">
                        <div
                            class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Danh mục mới</span>
                        </div>
                        <h2 class="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                            <FolderTree class="w-6 h-6 text-amber-600" />
                            Thêm danh mục bài viết
                        </h2>

                        <button @click="handleClose" type="button"
                            class="absolute top-5 right-5 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all">
                            <X :size="18" />
                        </button>
                    </div>

                    <form class="relative px-6 pb-8" @submit.prevent="onSubmit">
                        <div class="space-y-4">
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Tên danh mục <span class="text-red-500">*</span>
                                </label>
                                <Field name="name" type="text" placeholder="VD: Hướng dẫn sử dụng"
                                    class="w-full px-4 py-3 border border-amber-100 rounded-2xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                                <ErrorMessage name="name" class="text-xs text-red-500 font-semibold mt-1 block" />
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Mô tả</label>
                                <Field as="textarea" name="description" rows="3" placeholder="Nhập mô tả ngắn..."
                                    class="w-full px-4 py-3 border border-amber-100 rounded-2xl bg-white text-slate-800 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                            </div>

                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Thứ tự hiển thị <span class="text-red-500">*</span>
                                </label>
                                <div class="relative">
                                    <Hash class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <Field name="displayOrder" type="number" min="0"
                                        class="w-full pl-10 pr-4 py-3 border border-amber-100 rounded-2xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
                                </div>
                                <ErrorMessage name="displayOrder" class="text-xs text-red-500 font-semibold mt-1 block" />
                            </div>
                        </div>

                        <div class="mt-6 flex gap-3">
                            <button @click="handleClose" type="button"
                                class="flex-1 px-4 py-3 rounded-2xl border border-amber-100 hover:bg-amber-50 text-slate-700 font-bold text-sm">
                                Hủy bỏ
                            </button>
                            <button :disabled="isCreating" type="submit"
                                class="flex-1 px-4 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-bold text-sm">
                                {{ isCreating ? 'Đang tạo...' : 'Tạo danh mục' }}
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
</style>
