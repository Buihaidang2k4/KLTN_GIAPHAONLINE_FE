<script setup lang="ts">
import { computed, watch } from 'vue'
import { Field, ErrorMessage, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { X } from 'lucide-vue-next'
import type { FamilyEventReq, FamilyEventRes } from '@/types/family/family-event.types'

type CalendarType = 'SOLAR' | 'LUNAR'
type RepeatType = 'NONE' | 'YEARLY'
type ReminderEventType = 'NONE' | 'DAY_1' | 'DAY_3' | 'DAY_7' | 'DAY_15' | 'MONTH_1'
type FamilyEventStatus = 'ACTIVE' | 'INACTIVE'

const props = defineProps<{
    show: boolean
    mode: 'create' | 'update'
    event?: FamilyEventRes | null
    isLoading?: boolean
}>()

const emit = defineEmits<{
    close: []
    submit: [payload: FamilyEventReq]
}>()

const title = computed(() =>
    props.mode === 'create' ? 'Tạo sự kiện mới' : 'Cập nhật sự kiện'
)

const submitText = computed(() =>
    props.mode === 'create' ? 'Tạo sự kiện' : 'Lưu thay đổi'
)

const validationSchema = toTypedSchema(
    z.object({
        eventName: z
            .string()
            .trim()
            .min(1, 'Tên sự kiện không được để trống')
            .max(255, 'Tên sự kiện không được quá 255 ký tự'),

        eventTime: z
            .string()
            .min(1, 'Thời gian không được để trống'),

        day: z.preprocess(
            value => value === '' || value === null ? undefined : Number(value),
            z
                .number({
                    error: 'Ngày không được để trống'
                })
                .min(1, 'Ngày phải từ 1 đến 31')
                .max(31, 'Ngày phải từ 1 đến 31')
        ),

        month: z.preprocess(
            value => value === '' || value === null ? undefined : Number(value),
            z
                .number({
                    error: 'Tháng không được để trống'
                })
                .min(1, 'Tháng phải từ 1 đến 12')
                .max(12, 'Tháng phải từ 1 đến 12')
        ),

        year: z
            .union([
                z.coerce.number().min(1900, 'Năm không hợp lệ').max(3000, 'Năm không hợp lệ'),
                z.literal(''),
                z.null()
            ])
            .optional(),

        calendarType: z.enum(['SOLAR', 'LUNAR']),
        repeatType: z.enum(['NONE', 'YEARLY']),
        reminderType: z.enum(['NONE', 'DAY_1', 'DAY_3', 'DAY_7', 'DAY_15', 'MONTH_1']),
        status: z.enum(['ACTIVE', 'INACTIVE']),

        location: z
            .string()
            .trim()
            .max(255, 'Địa điểm không được quá 255 ký tự')
            .optional()
            .or(z.literal('')),

        locationMapUrl: z
            .string()
            .trim()
            .max(500, 'Link bản đồ không được quá 500 ký tự')
            .optional()
            .or(z.literal('')),

        note: z
            .string()
            .trim()
            .max(1000, 'Ghi chú không được quá 1000 ký tự')
            .optional()
            .or(z.literal(''))
    })
        .superRefine((data, ctx) => {
            if (data.repeatType === 'NONE' && !data.year) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    path: ['year'],
                    message: 'Sự kiện không lặp cần nhập năm'
                })
            }
        })
)

const getDefaultValues = () => ({
    eventName: '',
    eventTime: '08:00:00',
    day: '',
    month: '',
    year: '',
    calendarType: 'SOLAR' as CalendarType,
    repeatType: 'NONE' as RepeatType,
    reminderType: 'DAY_7' as ReminderEventType,
    status: 'ACTIVE' as FamilyEventStatus,
    location: '',
    locationMapUrl: '',
    note: ''
})

const getEventValues = (event?: FamilyEventRes | null) => {
    if (!event) return getDefaultValues()

    return {
        eventName: event.eventName ?? '',
        eventTime: event.eventTime ?? '08:00:00',
        day: event.day ? Number(event.day) : '',
        month: event.month ? Number(event.month) : '',
        year: event.year ? Number(event.year) : '',
        calendarType: (event.calendarType as CalendarType) ?? 'SOLAR',
        repeatType: (event.repeatType as RepeatType) ?? 'NONE',
        reminderType: (event.reminderType as ReminderEventType) ?? 'DAY_7',
        status: (event.status as FamilyEventStatus) ?? 'ACTIVE',
        location: event.location ?? '',
        locationMapUrl: event.locationMapUrl ?? '',
        note: event.note ?? ''
    }
}

const {
    handleSubmit,
    resetForm,
    setFieldValue,
    values,
    meta
} = useForm({
    initialValues: getDefaultValues(),
    validationSchema
})

watch(
    () => [props.show, props.event, props.mode],
    () => {
        if (!props.show) return

        resetForm({
            values: getEventValues(props.event)
        })
    },
    { immediate: true }
)

watch(
    () => values.repeatType,
    repeatType => {
        if (repeatType === 'YEARLY') {
            setFieldValue('year', '')
        }
    }
)

const onSubmit = handleSubmit(data => {
    emit('submit', {
        eventName: data.eventName.trim(),
        eventTime: data.eventTime,
        day: String(data.day),
        month: String(data.month),
        year: data.repeatType === 'YEARLY' ? null : String(data.year),
        calendarType: data.calendarType,
        repeatType: data.repeatType,
        reminderType: data.reminderType,
        status: data.status,
        location: data.location?.trim() || '',
        locationMapUrl: data.locationMapUrl?.trim() || '',
        note: data.note?.trim() || ''
    })
})

const handleClose = () => {
    emit('close')
}
</script>

<template>
    <Teleport to="body">
        <div v-if="show" class="fixed inset-0 z-999 flex items-center justify-center bg-slate-950/40 px-4">
            <div class="w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <div class="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                    <div>
                        <h2 class="text-xl font-black text-slate-800">
                            {{ title }}
                        </h2>
                        <p class="mt-1 text-sm text-slate-500">
                            Nhập thông tin ngày, tháng, năm và nhắc hẹn cho sự kiện gia đình.
                        </p>
                    </div>

                    <button type="button" class="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        @click="handleClose">
                        <X :size="20" />
                    </button>
                </div>

                <form class="max-h-[75vh] overflow-y-auto px-6 py-5" @submit.prevent="onSubmit">
                    <div class="grid gap-5 md:grid-cols-2">
                        <div class="md:col-span-2">
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Tên sự kiện <span class="text-rose-500">*</span>
                            </label>
                            <Field name="eventName" type="text" placeholder="Ví dụ: Giỗ tổ họ Phan"
                                :validate-on-blur="true" :validate-on-change="true" :validate-on-input="false"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                            <ErrorMessage name="eventName" class="mt-1 block text-xs font-medium text-rose-600" />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Thời gian <span class="text-rose-500">*</span>
                            </label>
                            <Field name="eventTime" type="time" step="1" :validate-on-blur="true"
                                :validate-on-change="true" :validate-on-input="false"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                            <ErrorMessage name="eventTime" class="mt-1 block text-xs font-medium text-rose-600" />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Loại lịch
                            </label>
                            <Field as="select" name="calendarType" :validate-on-blur="true" :validate-on-change="true"
                                :validate-on-input="false"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
                                <option value="SOLAR">Dương lịch</option>
                                <option value="LUNAR">Âm lịch</option>
                            </Field>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Ngày <span class="text-rose-500">*</span>
                            </label>
                            <Field name="day" type="number" min="1" max="31" placeholder="24" :validate-on-blur="true"
                                :validate-on-change="true" :validate-on-input="false"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                            <ErrorMessage name="day" class="mt-1 block text-xs font-medium text-rose-600" />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Tháng <span class="text-rose-500">*</span>
                            </label>
                            <Field name="month" type="number" min="1" max="12" placeholder="4" :validate-on-blur="true"
                                :validate-on-change="true" :validate-on-input="false"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                            <ErrorMessage name="month" class="mt-1 block text-xs font-medium text-rose-600" />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Kiểu lặp
                            </label>
                            <Field as="select" name="repeatType" :validate-on-blur="true" :validate-on-change="true"
                                :validate-on-input="false"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
                                <option value="NONE">Không lặp</option>
                                <option value="YEARLY">Hằng năm</option>
                            </Field>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Năm
                            </label>
                            <Field name="year" type="number" min="1900" max="3000"
                                :disabled="values.repeatType === 'YEARLY'"
                                :placeholder="values.repeatType === 'YEARLY' ? 'Tự động hằng năm' : '2026'"
                                :validate-on-blur="true" :validate-on-change="true" :validate-on-input="false"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400" />
                            <ErrorMessage name="year" class="mt-1 block text-xs font-medium text-rose-600" />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Trạng thái
                            </label>
                            <Field as="select" name="status" :validate-on-blur="true" :validate-on-change="true"
                                :validate-on-input="false"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
                                <option value="ACTIVE">Hoạt động</option>
                                <option value="INACTIVE">Không hoạt động</option>
                            </Field>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Nhắc hẹn
                            </label>
                            <Field as="select" name="reminderType" :validate-on-blur="true" :validate-on-change="true"
                                :validate-on-input="false"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
                                <option value="NONE">Không nhắc</option>
                                <option value="DAY_1">Trước 1 ngày</option>
                                <option value="DAY_3">Trước 3 ngày</option>
                                <option value="DAY_7">Trước 7 ngày</option>
                                <option value="DAY_15">Trước 15 ngày</option>
                                <option value="MONTH_1">Trước 1 tháng</option>
                            </Field>
                        </div>

                        <div class="md:col-span-2">
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Địa điểm
                            </label>
                            <Field name="location" type="text" placeholder="Nhà thờ tổ, Hà Nam..."
                                :validate-on-blur="true" :validate-on-change="true" :validate-on-input="false"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                            <ErrorMessage name="location" class="mt-1 block text-xs font-medium text-rose-600" />
                        </div>

                        <div class="md:col-span-2">
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Link bản đồ
                            </label>
                            <Field name="locationMapUrl" type="text" placeholder="https://maps.google.com/..."
                                :validate-on-blur="true" :validate-on-change="true" :validate-on-input="false"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                            <ErrorMessage name="locationMapUrl" class="mt-1 block text-xs font-medium text-rose-600" />
                        </div>

                        <div class="md:col-span-2">
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Ghi chú
                            </label>
                            <Field as="textarea" name="note" rows="4" placeholder="Ghi chú thêm về sự kiện..."
                                :validate-on-blur="true" :validate-on-change="true" :validate-on-input="false"
                                class="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                            <ErrorMessage name="note" class="mt-1 block text-xs font-medium text-rose-600" />
                        </div>
                    </div>

                    <div class="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                        <button type="button"
                            class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                            @click="handleClose">
                            Hủy
                        </button>

                        <button type="submit" :disabled="isLoading || !meta.valid"
                            class="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">
                            {{ isLoading ? 'Đang xử lý...' : submitText }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Teleport>
</template>