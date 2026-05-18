<script setup lang="ts">
import type { PermissionRes, UpdatePermissionReq } from '@/types/auth/permission.types'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { watch } from 'vue'
import { z } from 'zod'
import { X, Sparkles, ShieldCheck } from 'lucide-vue-next'

const props = defineProps<{
    show: boolean
    permission: PermissionRes | null
    isLoading?: boolean
}>()

const emit = defineEmits<{
    update: [data: UpdatePermissionReq]
    close: []
}>()

const scopeTypes = [
    { value: 'SYSTEM', label: 'Hệ thống (SYSTEM)' },
    { value: 'FAMILY', label: 'Dòng họ (FAMILY)' }
]

const validationSchema = toTypedSchema(
    z.object({
        scopeType: z
            .string()
            .trim()
            .min(1, 'Vui lòng chọn phạm vi hoạt động'),
        description: z
            .string()
            .trim()
            .max(255, 'Mô tả không được quá 255 ký tự')
            .optional()
    })
)

const { resetForm, handleSubmit, meta } = useForm({
    initialValues: {
        scopeType: props.permission?.scopeType ?? 'SYSTEM',
        description: props.permission?.description ?? ''
    },
    validationSchema
})

watch(
    () => props.permission,
    (val) => {
        if (val) {
            resetForm({
                values: {
                    scopeType: val.scopeType,
                    description: val.description ?? ''
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
    emit('update', {
        scopeType: values.scopeType,
        description: values.description || undefined
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
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Quyền hạn hệ thống</span>
                        </div>
                        <h2 class="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                            <ShieldCheck class="w-6 h-6 text-amber-600" />
                            Cập nhật quyền hạn
                        </h2>
                        <p class="mt-1 text-xs text-slate-500 font-medium max-w-[280px] mx-auto leading-relaxed">
                            Cập nhật thông tin cho quyền: <br />
                            <span class="font-mono font-bold text-pink-600 text-sm">{{ permission?.name }}</span>
                        </p>

                        <button @click="handleClose" type="button"
                            class="absolute top-5 right-5 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="18" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <form class="relative px-6 pb-8" @submit.prevent="onSubmit">
                        <div class="space-y-4">
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
                                    placeholder="Ghi chú rõ ràng quyền này dùng để làm gì..."
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

select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2392400e' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E");
    background-position: right 1rem center;
    background-repeat: no-repeat;
    background-size: 0.85rem;
}
</style>