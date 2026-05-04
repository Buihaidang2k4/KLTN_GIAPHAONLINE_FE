<script setup lang="ts">
import type { CeremonyReq, CeremonyRes, CeremonyUpdateReq } from '@/types/family/ceremony.types'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { z } from 'zod'
import { formatDate } from '@/utils/format-date'

const props = defineProps<{
    show: boolean
    mode: 'create' | 'update'
    ceremony?: CeremonyRes | null
    familyId?: number | null
    isLoading?: boolean
}>()

const emit = defineEmits<{
    create: [data: CeremonyReq]
    update: [data: CeremonyUpdateReq]
    close: []
}>()

const ceremonyTypes = [
    { value: 'Hỷ sự', label: 'Hỷ sự' },
    { value: 'Tang lễ', label: 'Tang lễ' },
    { value: 'Lễ Tết', label: 'Lễ Tết' },
    { value: 'Cúng giỗ', label: 'Cúng giỗ' },
    { value: 'Sinh nhật', label: 'Sinh nhật' },
    { value: 'Mừng thọ', label: 'Mừng thọ' },
    { value: 'Khánh thành', label: 'Khánh thành' },
    { value: 'Tân gia', label: 'Tân gia' },
    { value: 'Tâm linh', label: 'Nghi lễ tâm linh' },
    { value: 'Gia đình', label: 'Sự kiện gia đình' },
    { value: 'Truyền thống', label: 'Nghi lễ truyền thống' },
    { value: 'Khác', label: 'Khác' }
]

const initialValues = computed(() => ({
    ceremonyType: props.ceremony?.ceremonyType ?? '',
    ceremonyName: props.ceremony?.ceremonyName ?? '',
    description: props.ceremony?.description ?? ''
}))

const validationSchema = toTypedSchema(
    z.object({
        ceremonyType: z
            .string()
            .trim()
            .min(1, 'Vui lòng chọn loại nghi lễ')
            .max(100, 'Loại nghi lễ không được quá 100 ký tự'),
        ceremonyName: z
            .string()
            .trim()
            .min(1, 'Vui lòng nhập tên nghi lễ')
            .max(255, 'Tên nghi lễ không được quá 255 ký tự'),
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
    () => props.ceremony,
    (val) => {
        resetForm({
            values: {
                ceremonyType: val?.ceremonyType ?? '',
                ceremonyName: val?.ceremonyName ?? '',
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
    props.mode === 'create' ? 'Thêm phong tục, nghi lễ' : 'Cập nhật phong tục, nghi lễ'
)

const onSubmit = handleSubmit((values) => {
    if (props.mode === 'create') {
        emit('create', {
            ceremonyType: values.ceremonyType,
            ceremonyName: values.ceremonyName,
            description: values.description
        })
        handleClose()
        return
    }

    emit('update', {
        ceremonyType: values.ceremonyType,
        ceremonyName: values.ceremonyName,
        description: values.description
    })
})
</script>

<template>
    <Teleport to="body">
        <div v-if="show">
            <div class="fixed inset-0 z-40 bg-black/50" @click="handleClose"></div>

            <div class="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div class="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <div class="border-b border-slate-200 px-6 py-5">
                        <div class="flex items-start justify-between gap-4">
                            <div>
                                <h2 class="text-2xl font-bold text-slate-800">
                                    {{ titleText }}
                                </h2>
                                <p class="mt-1 text-sm text-slate-500">
                                    Nhập thông tin cơ bản cho nghi lễ của gia đình.
                                </p>
                            </div>

                            <button type="button"
                                class="rounded-full px-3 py-1.5 text-xl text-slate-500 hover:bg-slate-100"
                                @click="handleClose">
                                x
                            </button>
                        </div>
                    </div>

                    <form :key="mode + (ceremony?.ceremonyId ?? 'new')" class="p-6" @submit.prevent="onSubmit">
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label class="mb-1 block text-sm font-medium text-slate-700">
                                    Loại nghi lễ
                                </label>
                                <Field as="select" name="ceremonyType" validate-on-blur
                                    class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                                    <option value="">Chọn loại nghi lễ</option>
                                    <option v-for="item in ceremonyTypes" :key="item.value" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </Field>
                                <ErrorMessage name="ceremonyType" class="mt-1 block text-sm text-red-500" />
                            </div>

                            <div>
                                <label class="mb-1 block text-sm font-medium text-slate-700">
                                    Tên nghi lễ
                                </label>
                                <Field name="ceremonyName" type="text" placeholder="VD: Lễ cưới truyền thống Việt Nam"
                                    validate-on-blur
                                    class="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                                <ErrorMessage name="ceremonyName" class="mt-1 block text-sm text-red-500" />
                            </div>

                            <div class="sm:col-span-2">
                                <label class="mb-1 block text-sm font-medium text-slate-700">
                                    Mô tả
                                </label>
                                <Field as="textarea" name="description" rows="5" validate-on-blur
                                    placeholder="Nhập mô tả chi tiết về nghi lễ, phong tục, ý nghĩa hoặc cách thực hiện..."
                                    class="w-full resize-none rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
                                <ErrorMessage name="description" class="mt-1 block text-sm text-red-500" />
                            </div>
                        </div>

                        <div v-if="ceremony"
                            class="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                <p>
                                    <span class="font-medium text-slate-700">Ngày tạo:</span>
                                    {{ formatDate(ceremony.createdAt) }}
                                </p>
                                <p>
                                    <span class="font-medium text-slate-700">Cập nhật:</span>
                                    {{ formatDate(ceremony.updatedAt) ?? 'Chưa cập nhật' }}
                                </p>
                            </div>
                        </div>

                        <div class="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-5">
                            <button type="button"
                                class="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                @click="handleClose">
                                Hủy
                            </button>

                            <button type="submit" :disabled="isLoading || !meta.valid"
                                class="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60">
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
