<script setup lang="ts">
import { computed, watch } from 'vue'
import { Field, ErrorMessage, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'
import { X, Save, Sparkles, CalendarDays, Bell, MapPin, Clock, History, Scroll, CalendarCheck } from 'lucide-vue-next'
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
    props.mode === 'create' ? 'Ghi danh sự kiện' : 'Cập nhật sự kiện'
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
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <!-- Modal Container -->
                <div class="relative w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden rounded-[2.5rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30 animate-in fade-in zoom-in duration-300">
                    
                    <!-- Subtle Decoration -->
                    <div class="absolute -top-12 -right-12 text-amber-900/[0.03] pointer-events-none">
                        <CalendarCheck :size="220" />
                    </div>

                    <!-- Header -->
                    <div class="relative shrink-0 px-8 pt-8 pb-4 text-center md:text-left">
                        <div class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Sổ tay sự kiện</span>
                        </div>
                        <h2 class="text-2xl font-black text-slate-900 tracking-tight">
                            {{ title }}
                        </h2>
                        <p class="mt-1 text-xs text-slate-500 font-medium leading-relaxed max-w-md">
                            Ghi chú và nhắc hẹn các ngày kỷ niệm, ngày lễ trọng đại để con cháu luôn nhớ về nguồn cội.
                        </p>

                        <button @click="handleClose" 
                            class="absolute top-8 right-8 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="20" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <div class="custom-scrollbar flex-1 overflow-y-auto px-8 pb-4">
                        <form id="eventForm" :key="mode + (event?.eventId ?? 'new')" @submit.prevent="onSubmit" class="space-y-6 pt-2">
                            
                            <!-- Tên sự kiện -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    <CalendarDays :size="14" class="text-amber-600/70" />
                                    Tên sự kiện <span class="text-red-400">*</span>
                                </label>
                                <Field name="eventName" type="text" placeholder="VD: Ngày giỗ Tổ dòng họ Phan"
                                    validate-on-blur
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                <ErrorMessage name="eventName" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <!-- Thời gian & Loại lịch -->
                                <div class="space-y-1.5">
                                    <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                        <Clock :size="14" class="text-amber-600/70" />
                                        Giờ diễn ra <span class="text-red-400">*</span>
                                    </label>
                                    <Field name="eventTime" type="time" step="1"
                                        validate-on-blur
                                        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                    <ErrorMessage name="eventTime" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                </div>

                                <div class="space-y-1.5">
                                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                        Loại lịch sử dụng
                                    </label>
                                    <Field as="select" name="calendarType"
                                        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm appearance-none cursor-pointer">
                                        <option value="SOLAR">Dương lịch</option>
                                        <option value="LUNAR">Âm lịch</option>
                                    </Field>
                                </div>

                                <!-- Ngày & Tháng -->
                                <div class="space-y-1.5">
                                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                        Ngày diễn ra <span class="text-red-400">*</span>
                                    </label>
                                    <Field name="day" type="number" min="1" max="31" placeholder="Ngày"
                                        validate-on-blur
                                        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                    <ErrorMessage name="day" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                </div>

                                <div class="space-y-1.5">
                                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                        Tháng diễn ra <span class="text-red-400">*</span>
                                    </label>
                                    <Field name="month" type="number" min="1" max="12" placeholder="Tháng"
                                        validate-on-blur
                                        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                    <ErrorMessage name="month" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                </div>

                                <!-- Lặp & Năm -->
                                <div class="space-y-1.5">
                                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                        Chu kỳ lặp lại
                                    </label>
                                    <Field as="select" name="repeatType"
                                        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm appearance-none cursor-pointer">
                                        <option value="NONE">Chỉ diễn ra một lần</option>
                                        <option value="YEARLY">Lặp lại hằng năm</option>
                                    </Field>
                                </div>

                                <div class="space-y-1.5">
                                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                        Năm diễn ra
                                    </label>
                                    <Field name="year" type="number" min="1900" max="3000"
                                        :disabled="values.repeatType === 'YEARLY'"
                                        :placeholder="values.repeatType === 'YEARLY' ? 'Mặc định hằng năm' : '2026'"
                                        validate-on-blur
                                        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-100" />
                                    <ErrorMessage name="year" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                </div>

                                <!-- Nhắc hẹn & Trạng thái -->
                                <div class="space-y-1.5">
                                    <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                        <Bell :size="14" class="text-amber-600/70" />
                                        Thông báo nhắc hẹn
                                    </label>
                                    <Field as="select" name="reminderType"
                                        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm appearance-none cursor-pointer">
                                        <option value="NONE">Không nhắc</option>
                                        <option value="DAY_1">Trước 1 ngày</option>
                                        <option value="DAY_3">Trước 3 ngày</option>
                                        <option value="DAY_7">Trước 7 ngày</option>
                                        <option value="DAY_15">Trước 15 ngày</option>
                                        <option value="MONTH_1">Trước 1 tháng</option>
                                    </Field>
                                </div>

                                <div class="space-y-1.5">
                                    <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                        Trạng thái hiển thị
                                    </label>
                                    <Field as="select" name="status"
                                        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm appearance-none cursor-pointer">
                                        <option value="ACTIVE">Đang hoạt động</option>
                                        <option value="INACTIVE">Tạm ẩn</option>
                                    </Field>
                                </div>
                            </div>

                            <!-- Địa điểm -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    <MapPin :size="14" class="text-amber-600/70" />
                                    Địa điểm tổ chức
                                </label>
                                <Field name="location" type="text" placeholder="VD: Nhà thờ họ Nguyễn, Duy Tiên, Hà Nam"
                                    validate-on-blur
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                <ErrorMessage name="location" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                            </div>

                            <!-- Link bản đồ -->
                            <div class="space-y-1.5">
                                <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    Đường dẫn bản đồ (Google Maps)
                                </label>
                                <Field name="locationMapUrl" type="text" placeholder="https://maps.google.com/..."
                                    validate-on-blur
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                            </div>

                            <!-- Ghi chú -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    <Scroll :size="14" class="text-amber-600/70" />
                                    Ghi chú thêm
                                </label>
                                <Field as="textarea" name="note" rows="3" placeholder="Chi tiết về khâu chuẩn bị hoặc lưu ý đặc biệt cho thành viên..."
                                    validate-on-blur
                                    class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all leading-relaxed shadow-sm" />
                            </div>
                        </form>
                    </div>

                    <!-- Fixed Footer Actions -->
                    <div class="shrink-0 flex items-center justify-end gap-3 px-8 py-5 border-t border-amber-100/30 bg-[#fefaf6]/80 backdrop-blur-sm">
                        <button type="button" @click="handleClose"
                            class="px-8 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all">
                            Quay lại
                        </button>

                        <button type="submit" form="eventForm" :disabled="isLoading || !meta.valid"
                            class="flex items-center gap-2 px-10 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-40">
                            <Save :size="14" />
                            <span>{{ isLoading ? 'Đang lưu...' : mode === 'create' ? 'Ghi danh' : 'Cập nhật' }}</span>
                        </button>
                    </div>
                    
                    <!-- Decorative footer line -->
                    <div class="h-1.5 w-full bg-[linear-gradient(90deg,transparent_0%,#d97706_50%,transparent_100%)] opacity-10"></div>
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

select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2392400e' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E");
    background-position: right 1rem center;
    background-repeat: no-repeat;
    background-size: 0.85rem;
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