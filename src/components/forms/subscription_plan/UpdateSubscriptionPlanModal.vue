<script setup lang="ts">
import { watch } from 'vue'
import type { SubscriptionPlanReq, SubscriptionPlanRes } from '@/types/family/subscription.types'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { z } from 'zod'
import { X, Settings, Sparkles, Edit2 } from 'lucide-vue-next'

const props = defineProps<{
    show: boolean
    plan: SubscriptionPlanRes | null
    isLoading?: boolean
}>()

const emit = defineEmits<{
    update: [data: { planId: number; data: SubscriptionPlanReq }]
    close: []
}>()

const validationSchema = toTypedSchema(
    z.object({
        namePlan: z.string().trim().min(1, 'Tên gói không được để trống'),
        code: z.string().trim().min(1, 'Mã gói không được để trống').max(50, 'Mã gói không được vượt quá 50 ký tự').regex(/^[A-Z0-9_]+$/, 'Mã gói chỉ gồm chữ hoa, số và dấu gạch dưới (VD: BASIC, PREMIUM)'),
        description: z.string().trim().max(500, 'Mô tả không được vượt quá 500 ký tự').optional().or(z.literal('')),
        price: z.number({ message: 'Giá gói không được để trống' }).min(0, 'Giá gói không được âm'),
        currency: z.string().trim().min(1, 'Đơn vị tiền tệ không được để trống').min(3, 'Currency phải có 3 ký tự, ví dụ VND').max(3, 'Currency phải có 3 ký tự, ví dụ VND'),
        maxPerson: z.number({ message: 'Số thành viên tối đa không được để trống' }).min(1, 'Số thành viên tối đa phải lớn hơn 0'),
        maxAdmin: z.number({ message: 'Số thành viên quản lí tối đa không được để trống' }).min(1, 'Số thành viên quản lí tối đa phải lớn hơn 0'),
        maxStorageMb: z.number({ message: 'Dung lượng tối đa không được để trống' }).min(0, 'Dung lượng không được âm'),
        durationMonth: z.number({ message: 'Thời hạn gói không được để trống' }).min(0, 'Thời hạn không được âm'),
        isActive: z.boolean().optional()
    })
)

const { resetForm, handleSubmit, meta, setFieldValue, values } = useForm({
    initialValues: {
        namePlan: '',
        code: '',
        description: '',
        price: 0,
        currency: 'VND',
        maxPerson: 50,
        maxAdmin: 2,
        maxStorageMb: 500,
        durationMonth: 1,
        isActive: true
    },
    validationSchema
})

// Watch plan prop to update form values reactively
watch(
    () => props.plan,
    (newPlan) => {
        if (newPlan) {
            resetForm({
                values: {
                    namePlan: newPlan.namePlan,
                    code: newPlan.code,
                    description: newPlan.description || '',
                    price: newPlan.price,
                    currency: newPlan.currency || 'VND',
                    maxPerson: newPlan.maxPerson,
                    maxAdmin: newPlan.maxAdmin,
                    maxStorageMb: newPlan.maxStorageMb,
                    durationMonth: newPlan.durationMonth,
                    isActive: newPlan.isActive
                }
            })
        }
    },
    { immediate: true }
)

const handleClose = () => {
    emit('close')
}

const onSubmit = handleSubmit((values) => {
    if (!props.plan) return
    emit('update', {
        planId: props.plan.subscriptionPlanId,
        data: {
            namePlan: values.namePlan,
            code: values.code,
            description: values.description,
            price: values.price,
            currency: values.currency,
            maxPerson: values.maxPerson,
            maxAdmin: values.maxAdmin,
            maxStorageMb: values.maxStorageMb,
            durationMonth: values.durationMonth,
            isActive: values.isActive
        }
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
                <div class="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-[#fefaf6] shadow-2xl border border-indigo-200/30 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                    
                    <!-- Subtle Ornaments -->
                    <div class="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.03),transparent)] pointer-events-none"></div>

                    <!-- Header Section -->
                    <div class="relative px-6 pt-8 pb-4 text-center border-b border-indigo-100/10">
                        <div class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-indigo-50 rounded-full border border-indigo-100/50">
                            <Sparkles :size="12" class="text-indigo-600" />
                            <span class="text-[9px] font-bold text-indigo-700 uppercase tracking-widest">Cấu hình hệ thống</span>
                        </div>
                        <h2 class="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                            <Edit2 class="w-6 h-6 text-indigo-600" />
                            Cập nhật gói dịch vụ
                        </h2>
                        <p class="mt-1 text-xs text-slate-500 font-medium max-w-[320px] mx-auto leading-relaxed">
                            Cập nhật lại giá tiền, giới hạn hoặc trạng thái hoạt động của gói.
                        </p>

                        <button @click="handleClose" type="button"
                            class="absolute top-5 right-5 p-1.5 rounded-full hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-all active:scale-90">
                            <X :size="18" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <form class="relative flex-1 overflow-y-auto px-6 pb-6 pt-4 space-y-4" @submit.prevent="onSubmit">
                        <div class="space-y-4">
                            <!-- Basic Info Section -->
                            <div class="p-4 bg-white/60 rounded-2xl border border-indigo-100/50 space-y-4">
                                <h3 class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                                    <Settings :size="12" /> Thông tin cơ bản
                                </h3>
                                
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="col-span-2 space-y-1.5">
                                        <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Tên gói dịch vụ <span class="text-red-400">*</span>
                                        </label>
                                        <Field name="namePlan" type="text" placeholder="Ví dụ: Gói Cơ Bản" validate-on-blur
                                            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm" />
                                        <ErrorMessage name="namePlan" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                    </div>

                                    <div class="col-span-2 space-y-1.5">
                                        <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Mã gói (Code) <span class="text-red-400">*</span>
                                        </label>
                                        <Field name="code" type="text" placeholder="Ví dụ: BASIC, PREMIUM" validate-on-blur
                                            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm font-mono uppercase" />
                                        <ErrorMessage name="code" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                    </div>

                                    <div class="space-y-1.5">
                                        <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Giá tiền (VNĐ) <span class="text-red-400">*</span>
                                        </label>
                                        <Field name="price" type="number" validate-on-blur
                                            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm" />
                                        <ErrorMessage name="price" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                    </div>

                                    <div class="space-y-1.5">
                                        <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Chu kỳ (Tháng) <span class="text-red-400">*</span>
                                        </label>
                                        <Field name="durationMonth" type="number" validate-on-blur
                                            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm" />
                                        <ErrorMessage name="durationMonth" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                    </div>
                                    
                                    <div class="col-span-2 space-y-1.5">
                                        <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Mô tả chi tiết
                                        </label>
                                        <Field as="textarea" name="description" rows="2" validate-on-blur
                                            placeholder="Nhập mô tả các đặc quyền của gói..."
                                            class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all leading-relaxed shadow-sm" />
                                        <ErrorMessage name="description" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                    </div>
                                </div>
                            </div>

                            <!-- Limits Configuration Section -->
                            <div class="p-4 bg-white/60 rounded-2xl border border-indigo-100/50 space-y-4">
                                <h3 class="text-[10px] font-bold text-indigo-600 uppercase tracking-widest flex items-center gap-1.5">
                                    <Settings :size="12" /> Cấu hình giới hạn
                                </h3>

                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-1.5">
                                        <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Thành viên tối đa <span class="text-red-400">*</span>
                                        </label>
                                        <Field name="maxPerson" type="number" validate-on-blur
                                            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm" />
                                        <ErrorMessage name="maxPerson" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                    </div>

                                    <div class="space-y-1.5">
                                        <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Admin tối đa <span class="text-red-400">*</span>
                                        </label>
                                        <Field name="maxAdmin" type="number" validate-on-blur
                                            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm" />
                                        <ErrorMessage name="maxAdmin" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                    </div>

                                    <div class="col-span-2 space-y-1.5">
                                        <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                            Dung lượng lưu trữ (MB) <span class="text-red-400">*</span>
                                        </label>
                                        <Field name="maxStorageMb" type="number" validate-on-blur
                                            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm" />
                                        <ErrorMessage name="maxStorageMb" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                                    </div>
                                </div>
                            </div>

                            <!-- Active State Switch -->
                            <div class="flex items-center justify-between p-4 bg-white/60 rounded-2xl border border-indigo-100/50">
                                <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Kích hoạt gói dịch vụ</span>
                                <button type="button" @click="setFieldValue('isActive', !values.isActive)" 
                                    class="w-10 h-5 rounded-full relative transition-colors duration-200 focus:outline-none"
                                    :class="values.isActive ? 'bg-green-500' : 'bg-slate-200'">
                                    <div class="absolute w-4 h-4 bg-white rounded-full top-0.5 transition-transform duration-200" 
                                        :class="values.isActive ? 'translate-x-5.5' : 'translate-x-0.5'"></div>
                                </button>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="pt-4 flex items-center justify-center gap-3 bg-[#fefaf6] sticky bottom-0 border-t border-indigo-100/10">
                            <button type="button"
                                class="flex-1 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
                                @click="handleClose">
                                Quay lại
                            </button>

                            <button type="submit" :disabled="isLoading || !meta.valid"
                                class="flex-[1.5] py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2">
                                <span v-if="isLoading" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                {{ isLoading ? 'Đang cập nhật...' : 'Cập nhật' }}
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
