<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { FamilyEventReq, FamilyEventRes } from '@/types/family/family-event.types'

type CalendarType = 'SOLAR' | 'LUNAR'
type RepeatType = 'NONE' | 'YEARLY'
type ReminderEventType = 'NONE' | 'DAY_1' | 'DAY_3' | 'DAY_7' | 'DAY_15' | 'MONTH_1'
type FamilyEventStatus = 'ACTIVE' | 'INACTIVE'

type FamilyEventPayload = {
    eventName: string
    eventTime: string
    day: number | null
    month: number | null
    year: number | null
    calendarType: CalendarType
    repeatType: RepeatType
    reminderType: ReminderEventType
    status: FamilyEventStatus
    location: string
    locationMapUrl: string
    note: string
}

const props = defineProps<{
    show: boolean
    mode: 'create' | 'update' | 'view'
    event?: FamilyEventRes | null
    isLoading?: boolean
}>()

const emit = defineEmits<{
    close: []
    submit: [payload: FamilyEventReq]
}>()

const form = reactive<FamilyEventPayload>({
    eventName: '',
    eventTime: '08:00:00',
    day: null,
    month: null,
    year: null,
    calendarType: 'SOLAR',
    repeatType: 'NONE',
    reminderType: 'DAY_7',
    status: 'ACTIVE',
    location: '',
    locationMapUrl: '',
    note: ''
})

const errors = reactive({
    eventName: '',
    day: '',
    month: '',
    year: '',
    eventTime: ''
})

const title = computed(() =>
    props.mode === 'create' ? 'Tạo sự kiện mới' : props.mode === 'update' ? 'Cập nhật sự kiện' : 'Xem chi tiết sự kiện'
)

const submitText = computed(() =>
    props.mode === 'create' ? 'Tạo sự kiện' : 'Lưu thay đổi'
)

const resetForm = () => {
    form.eventName = ''
    form.eventTime = '08:00:00'
    form.day = null
    form.month = null
    form.year = null
    form.calendarType = 'SOLAR'
    form.repeatType = 'NONE'
    form.reminderType = 'DAY_7'
    form.status = 'ACTIVE'
    form.location = ''
    form.locationMapUrl = ''
    form.note = ''

    clearErrors()
}

const clearErrors = () => {
    errors.eventName = ''
    errors.day = ''
    errors.month = ''
    errors.year = ''
    errors.eventTime = ''
}

const fillForm = () => {
    if (!props.event) {
        resetForm()
        return
    }

    form.eventName = props.event.eventName || ''
    form.eventTime = props.event.eventTime || '08:00:00'
    form.day = props.event.day ? Number(props.event.day) : null
    form.month = props.event.month ? Number(props.event.month) : null
    form.year = props.event.year ? Number(props.event.year) : null
    form.calendarType = (props.event.calendarType as CalendarType) || 'SOLAR'
    form.repeatType = (props.event.repeatType as RepeatType) || 'NONE'
    form.reminderType = (props.event.reminderType as ReminderEventType) || 'DAY_7'
    form.status = (props.event.status as FamilyEventStatus) || 'ACTIVE'
    form.location = props.event.location || ''
    form.locationMapUrl = props.event.locationMapUrl || ''
    form.note = props.event.note || ''

    clearErrors()
}

watch(
    () => [props.show, props.event, props.mode],
    () => {
        if (props.show) {
            fillForm()
        }
    },
    { immediate: true }
)

watch(
    () => form.repeatType,
    value => {
        if (value === 'YEARLY') {
            form.year = null
        }
    }
)

const validate = () => {
    clearErrors()

    if (!form.eventName.trim()) {
        errors.eventName = 'Tên sự kiện không được để trống.'
    }

    if (!form.eventTime) {
        errors.eventTime = 'Thời gian không được để trống.'
    }

    if (!form.day) {
        errors.day = 'Ngày không được để trống.'
    } else if (form.day < 1 || form.day > 31) {
        errors.day = 'Ngày phải từ 1 đến 31.'
    }

    if (!form.month) {
        errors.month = 'Tháng không được để trống.'
    } else if (form.month < 1 || form.month > 12) {
        errors.month = 'Tháng phải từ 1 đến 12.'
    }

    if (form.repeatType === 'NONE' && !form.year) {
        errors.year = 'Sự kiện không lặp cần nhập năm.'
    }

    if (form.year && (form.year < 1900 || form.year > 3000)) {
        errors.year = 'Năm không hợp lệ.'
    }

    return !errors.eventName && !errors.day && !errors.month && !errors.year && !errors.eventTime
}

const handleSubmit = () => {
    if (!validate()) return

    emit('submit', {
        eventName: form.eventName.trim(),
        eventTime: form.eventTime,
        day: form.day ? String(form.day) : undefined,
        month: form.month ? String(form.month) : undefined,
        year: form.repeatType === 'YEARLY' ? null : (form.year ? String(form.year) : null),
        calendarType: form.calendarType,
        repeatType: form.repeatType,
        reminderType: form.reminderType,
        status: form.status,
        location: form.location.trim(),
        locationMapUrl: form.locationMapUrl.trim(),
        note: form.note.trim(),
    })
}


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

                <form class="max-h-[75vh] overflow-y-auto px-6 py-5" @submit.prevent="handleSubmit">
                    <div class="grid gap-5 md:grid-cols-2">
                        <div class="md:col-span-2">
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Tên sự kiện <span class="text-rose-500">*</span>
                            </label>
                            <input v-model="form.eventName" type="text" placeholder="Ví dụ: Giỗ tổ họ Phan"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                            <p v-if="errors.eventName" class="mt-1 text-xs font-medium text-rose-600">
                                {{ errors.eventName }}
                            </p>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Thời gian
                            </label>
                            <input v-model="form.eventTime" type="time" step="1"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                            <p v-if="errors.eventTime" class="mt-1 text-xs font-medium text-rose-600">
                                {{ errors.eventTime }}
                            </p>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Loại lịch
                            </label>
                            <select v-model="form.calendarType"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
                                <option value="SOLAR">Dương lịch</option>
                                <option value="LUNAR">Âm lịch</option>
                            </select>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Ngày <span class="text-rose-500">*</span>
                            </label>
                            <input v-model.number="form.day" type="number" min="1" max="31" placeholder="24"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                            <p v-if="errors.day" class="mt-1 text-xs font-medium text-rose-600">
                                {{ errors.day }}
                            </p>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Tháng <span class="text-rose-500">*</span>
                            </label>
                            <input v-model.number="form.month" type="number" min="1" max="12" placeholder="4"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                            <p v-if="errors.month" class="mt-1 text-xs font-medium text-rose-600">
                                {{ errors.month }}
                            </p>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Kiểu lặp
                            </label>
                            <select v-model="form.repeatType"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
                                <option value="NONE">Không lặp</option>
                                <option value="YEARLY">Hằng năm</option>
                            </select>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Năm
                            </label>
                            <input v-model.number="form.year" type="number" min="1900" max="3000"
                                :disabled="form.repeatType === 'YEARLY'"
                                :placeholder="form.repeatType === 'YEARLY' ? 'Tự động hằng năm' : '2026'"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400" />
                            <p v-if="errors.year" class="mt-1 text-xs font-medium text-rose-600">
                                {{ errors.year }}
                            </p>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Trạng thái
                            </label>
                            <select v-model="form.status"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
                                <option value="ACTIVE">Hoạt động</option>
                                <option value="INACTIVE">Không hoạt động</option>
                            </select>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Nhắc hẹn
                            </label>
                            <select v-model="form.reminderType"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20">
                                <option value="NONE">Không nhắc</option>
                                <option value="DAY_1">Trước 1 ngày</option>
                                <option value="DAY_3">Trước 3 ngày</option>
                                <option value="DAY_7">Trước 7 ngày</option>
                                <option value="DAY_15">Trước 15 ngày</option>
                                <option value="MONTH_1">Trước 1 tháng</option>
                            </select>
                        </div>

                        <div class="md:col-span-2">
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Địa điểm
                            </label>
                            <input v-model="form.location" type="text" placeholder="Nhà thờ tổ, Hà Nam..."
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                        </div>

                        <div class="md:col-span-2">
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Link bản đồ
                            </label>
                            <input v-model="form.locationMapUrl" type="text" placeholder="https://maps.google.com/..."
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                        </div>

                        <div class="md:col-span-2">
                            <label class="mb-1.5 block text-sm font-bold text-slate-700">
                                Ghi chú
                            </label>
                            <textarea v-model="form.note" rows="4" placeholder="Ghi chú thêm về sự kiện..."
                                class="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
                        </div>
                    </div>

                    <div class="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
                        <button type="button"
                            class="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                            @click="handleClose">
                            Hủy
                        </button>

                        <button type="submit" :disabled="isLoading"
                            class="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">
                            {{ isLoading ? 'Đang xử lý...' : submitText }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </Teleport>
</template>
