<script setup lang="ts">
import type { AlbumReq, AlbumRes } from '@/types/family/album.types'
import { formatDate } from '@/utils/format-date'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { z } from 'zod'
import { X, ImagePlus } from 'lucide-vue-next'

const props = defineProps<{
    show: boolean
    mode: 'create' | 'update'
    album?: AlbumRes | null
    familyId?: number | null
    isLoading?: boolean
}>()

const emit = defineEmits<{
    create: [data: AlbumReq]
    update: [data: AlbumReq]
    close: []
}>()

const initialValues = computed(() => ({
    title: props.album?.title ?? '',
    description: props.album?.description ?? ''
}))

const validationSchema = toTypedSchema(
    z.object({
        title: z
            .string()
            .trim()
            .min(1, 'Vui lòng nhập tên album')
            .max(255, 'Tên album không được quá 255 ký tự'),

        description: z
            .string()
            .trim()
            .min(1, 'Vui lòng nhập mô tả')
            .max(2000, 'Mô tả không được quá 2000 ký tự')
    })
)

const { resetForm, handleSubmit, meta } = useForm({
    initialValues: initialValues.value,
    validationSchema
})

watch(
    () => props.album,
    (val) => {
        resetForm({
            values: {
                title: val?.title ?? '',
                description: val?.description ?? ''
            }
        })
    },
    { immediate: true }
)

const titleText = computed(() =>
    props.mode === 'create' ? 'Thêm album mới' : 'Cập nhật album'
)

const subText = computed(() =>
    props.mode === 'create'
        ? 'Tạo album để lưu trữ ảnh, video và tư liệu của gia đình.'
        : 'Chỉnh sửa thông tin album hiện tại.'
)

const handleClose = () => {
    emit('close')
}

const onSubmit = handleSubmit((values) => {
    const payload: AlbumReq = {
        title: values.title.trim(),
        description: values.description.trim()
    }

    if (props.mode === 'create') {
        emit('create', payload)
        return
    }

    emit('update', payload)
})
</script>

<template>
    <Teleport to="body">
        <div v-if="show">
            <div class="fixed inset-0 z-40 bg-slate-950/50" @click="handleClose"></div>

            <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div class="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <!-- Header -->
                    <div class="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                        <div class="flex gap-4">
                            <div
                                class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                                <ImagePlus :size="22" />
                            </div>

                            <div>
                                <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    {{ mode === 'create' ? 'Tạo album' : 'Chỉnh sửa' }}
                                </p>

                                <h2 class="mt-1 text-xl font-bold text-slate-900">
                                    {{ titleText }}
                                </h2>

                                <p class="mt-1 text-sm leading-6 text-slate-500">
                                    {{ subText }}
                                </p>
                            </div>
                        </div>

                        <button type="button"
                            class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            @click="handleClose">
                            <X :size="20" />
                        </button>
                    </div>

                    <!-- Form -->
                    <form :key="mode + (album?.albumId ?? 'new')" class="px-6 py-5" @submit.prevent="onSubmit">
                        <div class="space-y-5">
                            <div>
                                <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Tên album <span class="text-red-500">*</span>
                                </label>

                                <Field name="title" type="text" placeholder="VD: Kỷ niệm đám cưới Hùng và Lan"
                                    validate-on-blur
                                    class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10" />

                                <ErrorMessage name="title" class="mt-1 block text-sm text-red-500" />
                            </div>

                            <div>
                                <label class="mb-1.5 block text-sm font-semibold text-slate-700">
                                    Mô tả <span class="text-red-500">*</span>
                                </label>

                                <Field as="textarea" name="description" rows="5" validate-on-blur
                                    placeholder="Nhập mô tả ngắn cho album, ví dụ nội dung, thời gian hoặc ý nghĩa của bộ sưu tập..."
                                    class="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm leading-6 text-slate-800 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10" />

                                <ErrorMessage name="description" class="mt-1 block text-sm text-red-500" />
                            </div>
                        </div>

                        <!-- Meta info -->
                        <div v-if="album" class="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-500">
                            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <p>
                                    <span class="font-medium text-slate-700">Ngày tạo:</span>
                                    {{ formatDate(album.createdAt) }}
                                </p>

                                <p>
                                    <span class="font-medium text-slate-700">Cập nhật:</span>
                                    {{ formatDate(album.updatedAt) }}
                                </p>
                            </div>
                        </div>

                        <!-- Actions -->
                        <div class="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
                            <button type="button"
                                class="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                @click="handleClose">
                                Hủy
                            </button>

                            <button type="submit" :disabled="isLoading || !meta.valid"
                                class="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                                {{ isLoading ? 'Đang lưu...' : mode === 'create' ? 'Thêm album' : 'Lưu thay đổi' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped></style>