<script setup lang="ts">
import type { CreateRoleReq } from '@/types/auth/role.types'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { z } from 'zod'
import { X, Sparkles, ShieldPlus } from 'lucide-vue-next'

const props = defineProps<{
    show: boolean
    isLoading?: boolean
}>()

const emit = defineEmits<{
    create: [data: CreateRoleReq]
    close: []
}>()

const scopeTypes = [
    { value: 'SYSTEM', label: 'Hệ thống (SYSTEM)' },
    { value: 'FAMILY', label: 'Dòng họ (FAMILY)' }
]

const validationSchema = toTypedSchema(
    z.object({
        name: z
            .string()
            .trim()
            .min(1, 'Vui lòng nhập tên vai trò')
            .max(50, 'Tên vai trò không được quá 50 ký tự')
            .regex(/^[A-Z0-9_]+$/, 'Tên vai trò chỉ gồm chữ hoa, số và dấu gạch dưới (VD: FAMILY_MOD)'),
        scopeType: z
            .enum(['SYSTEM', 'FAMILY'], { errorMap: () => ({ message: 'Phạm vi không hợp lệ' }) }),
        description: z
            .string()
            .trim()
            .max(255, 'Mô tả không được quá 255 ký tự')
    })
)

const { resetForm, handleSubmit, meta } = useForm({
    initialValues: {
        name: '',
        scopeType: 'SYSTEM',
        description: ''
    },
    validationSchema
})

const handleClose = () => {
    resetForm()
    emit('close')
}

const onSubmit = handleSubmit((values) => {
    emit('create', {
        name: values.name,
        scopeType: values.scopeType,
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
                <div class="relative w-full max-w-md overflow-hidden rounded-[2rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30 animate-in fade-in zoom-in duration-200">
                    
                    <!-- Subtle Ornaments -->
                    <div class="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(180,83,9,0.03),transparent)] pointer-events-none"></div>

                    <!-- Header Section -->
                    <div class="relative px-6 pt-8 pb-4 text-center">
                        <div class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Vai trò hệ thống</span>
                        </div>
                        <h2 class="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                            <ShieldPlus class="w-6 h-6 text-amber-600" />
                            Thêm vai trò mới
                        </h2>
                        <p class="mt-1 text-xs text-slate-500 font-medium max-w-[280px] mx-auto leading-relaxed">
                            Định nghĩa thêm vai trò mới để nhóm các quyền hạn trong hệ thống.
                        </p>

                        <button @click="handleClose" type="button"
                            class="absolute top-5 right-5 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="18" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <form class="relative px-6 pb-8" @submit.prevent="onSubmit">
                        <div class="space-y-4">
                            <!-- Tên vai trò (Name) -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    Tên vai trò (Key) <span class="text-red-400">*</span>
                                </label>
                                <Field name="name" type="text" placeholder="Ví dụ: FAMILY_MODERATOR" validate-on-blur
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm font-mono" />
                                <ErrorMessage name="name" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                            </div>

                            <!-- Phạm vi (Scope Type) -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    Phạm vi (Scope) <span class="text-red-400">*</span>
                                </label>
                                <Field as="select" name="scopeType" validate-on-blur
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all appearance-none cursor-pointer shadow-sm">
                                    <option v-for="item in scopeTypes" :key="item.value" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </Field>
                                <ErrorMessage name="scopeType" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                            </div>

                            <!-- Mô tả chi tiết -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    Mô tả chi tiết
                                </label>
                                <Field as="textarea" name="description" rows="3" validate-on-blur
                                    placeholder="Ghi chú vai trò này chịu trách nhiệm gì..."
                                    class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all leading-relaxed shadow-sm" />
                                <ErrorMessage name="description" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
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
                                {{ isLoading ? 'Đang tạo...' : 'Tạo vai trò mới' }}
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
</style>
