<script setup lang="ts">
import type { AlbumReq, AlbumRes } from '@/types/family/album.types'
import { formatDate } from '@/utils/format-date'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { z } from 'zod'

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

const handleClose = () => {
    emit('close')
}

const titleText = computed(() =>
    props.mode === 'create' ? 'Thêm album mới' : 'Cập nhật album'
)

const onSubmit = handleSubmit((values) => {
    const payload: AlbumReq = {
        title: values.title,
        description: values.description
    }

    if (props.mode === 'create') {
        emit('create', payload)
        handleClose()
        return
    }

    emit('update', payload)
})
</script>

<template>
    <Teleport to="body">
        <div v-if="show">
            <div class="fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-sm" @click="handleClose"></div>

            <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div class="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_35px_90px_-40px_rgba(15,23,42,0.45)]">
                    <div class="border-b border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-6 py-5">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <div class="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-700">
                                    {{ mode === 'create' ? 'Tạo album' : 'Chỉnh sửa album' }}
                                </div>
                                <h2 class="mt-3 text-2xl font-bold text-slate-800">
                                    {{ titleText }}
                                </h2>
                                <p class="mt-1 text-sm leading-6 text-slate-500">
                                    Nhập thông tin cơ bản cho album ảnh hoặc tư liệu của gia đình.
                                </p>
                            </div>

                            <button
                                type="button"
                                class="rounded-full px-3 py-1.5 text-xl text-slate-500 transition hover:bg-slate-100"
                                @click="handleClose"
                            >
                                x
                            </button>
                        </div>
                    </div>

                    <form :key="mode + (album?.albumId ?? 'new')" class="p-6" @submit.prevent="onSubmit">
                        <div class="grid grid-cols-1 gap-4">
                            <div class="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4">
                                <label class="mb-2 block text-sm font-medium text-slate-700">
                                    Tên album
                                </label>
                                <Field
                                    name="title"
                                    type="text"
                                    placeholder="VD: Kỷ niệm đám cưới Hùng và Lan"
                                    validate-on-blur
                                    class="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                                <ErrorMessage name="title" class="mt-1 block text-sm text-red-500" />
                            </div>

                            <div class="rounded-[1.5rem] border border-slate-200 bg-slate-50/70 p-4">
                                <label class="mb-2 block text-sm font-medium text-slate-700">
                                    Mô tả
                                </label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    rows="5"
                                    validate-on-blur
                                    placeholder="Nhập mô tả ngắn cho album, ví dụ nội dung, thời gian hoặc ý nghĩa của bộ sưu tập..."
                                    class="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                                <ErrorMessage name="description" class="mt-1 block text-sm text-red-500" />
                            </div>
                        </div>

                        <div
                            v-if="album"
                            class="mt-5 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600"
                        >
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

                        <div class="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
                            <button
                                type="button"
                                class="rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                                @click="handleClose"
                            >
                                Hủy
                            </button>

                            <button
                                type="submit"
                                :disabled="isLoading || !meta.valid"
                                class="rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {{ isLoading ? 'Đang lưu...' : mode === 'create' ? 'Thêm' : 'Cập nhật' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped></style>
