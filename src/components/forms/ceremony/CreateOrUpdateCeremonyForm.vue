<script setup lang="ts">
import type { CeremonyReq, CeremonyRes, CeremonyUpdateReq } from '@/types/family/ceremony.types'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { z } from 'zod'
import { formatDate } from '@/utils/format-date'
import { X, Scroll, Sparkles, History, BookmarkCheck } from 'lucide-vue-next'

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
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <!-- Modal Container -->
                <div
                    class="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30 animate-in fade-in zoom-in duration-200">

                    <!-- Subtle Ornaments -->
                    <div
                        class="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(180,83,9,0.03),transparent)] pointer-events-none">
                    </div>
                    <div class="absolute top-6 left-6 text-amber-900/[0.03] pointer-events-none">
                        <Scroll :size="80" />
                    </div>

                    <!-- Header Section -->
                    <div class="relative px-6 pt-8 pb-4 text-center">
                        <div
                            class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Số hóa truyền
                                thống</span>
                        </div>
                        <h2 class="text-xl font-black text-slate-900 tracking-tight">
                            {{ titleText }}
                        </h2>
                        <p class="mt-1 text-xs text-slate-500 font-medium max-w-[280px] mx-auto leading-relaxed">
                            Điền thông tin để lưu giữ nét đẹp văn hóa cho thế hệ mai sau.
                        </p>

                        <button @click="handleClose"
                            class="absolute top-5 right-5 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="18" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <form :key="mode + (ceremony?.ceremonyId ?? 'new')" class="relative px-6 pb-8"
                        @submit.prevent="onSubmit">

                        <div class="space-y-5">
                            <!-- Vertical Stack for focus -->
                            <div class="space-y-4">
                                <!-- Loại nghi lễ -->
                                <div class="space-y-1.5">
                                    <label
                                        class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                        <BookmarkCheck :size="14" class="text-amber-600/70" />
                                        Loại nghi lễ <span class="text-red-400">*</span>
                                    </label>
                                    <Field as="select" name="ceremonyType" validate-on-blur
                                        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all appearance-none cursor-pointer shadow-sm">
                                        <option value="">Chọn loại nghi lễ</option>
                                        <option v-for="item in ceremonyTypes" :key="item.value" :value="item.value">
                                            {{ item.label }}
                                        </option>
                                    </Field>
                                    <ErrorMessage name="ceremonyType"
                                        class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                </div>

                                <!-- Tên nghi lễ -->
                                <div class="space-y-1.5">
                                    <label
                                        class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                        Tên nghi lễ <span class="text-red-400">*</span>
                                    </label>
                                    <Field name="ceremonyName" type="text" placeholder="Ví dụ: Lễ mừng thọ"
                                        validate-on-blur
                                        class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                    <ErrorMessage name="ceremonyName"
                                        class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                </div>

                                <!-- Mô tả -->
                                <div class="space-y-1.5">
                                    <label
                                        class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                        Mô tả chi tiết <span class="text-red-400">*</span>
                                    </label>
                                    <Field as="textarea" name="description" rows="4" validate-on-blur
                                        placeholder="Ý nghĩa và các bước thực hiện..."
                                        class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all leading-relaxed shadow-sm" />
                                    <ErrorMessage name="description"
                                        class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                </div>
                            </div>

                            <!-- Audit Info -->
                            <div v-if="ceremony"
                                class="flex items-center justify-between p-3 bg-amber-50/40 rounded-xl border border-amber-100/30">
                                <div class="flex items-center gap-2.5">
                                    <div class="p-1.5 bg-white rounded-lg shadow-sm">
                                        <History :size="14" class="text-amber-600" />
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Cập
                                            nhật lúc</span>
                                        <span
                                            class="text-[10px] font-bold text-slate-600">{{ formatDate(ceremony.updatedAt || ceremony.createdAt) }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="mt-8 flex items-center justify-center gap-3">
                            <button type="button"
                                class="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
                                @click="handleClose">
                                Quay lại
                            </button>

                            <button type="submit" :disabled="isLoading || !meta.valid"
                                class="flex-[1.5] py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-40">
                                {{ isLoading ? 'Đang lưu...' : mode === 'create' ? 'Lưu thông tin' : 'Cập nhật' }}
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

select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2392400e' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E");
    background-position: right 1rem center;
    background-repeat: no-repeat;
    background-size: 0.85rem;
}

.rounded-\[2rem\]::before {
    content: '';
    position: absolute;
    top: 15px;
    left: 15px;
    width: 30px;
    height: 30px;
    border-top: 2px solid rgba(217, 119, 6, 0.08);
    border-left: 2px solid rgba(217, 119, 6, 0.08);
    border-radius: 10px 0 0 0;
    pointer-events: none;
}
</style>
