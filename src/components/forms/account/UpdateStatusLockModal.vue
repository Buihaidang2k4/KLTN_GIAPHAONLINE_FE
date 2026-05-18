<script setup lang="ts">
import type { AccountRes, ChangeStatusLockReq } from '@/types/account/account.types'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { z } from 'zod'
import { X, Sparkles, Lock, Unlock, ShieldAlert } from 'lucide-vue-next'
import { computed, watch } from 'vue'

const props = defineProps<{
    show: boolean
    account: AccountRes | null
    isLoading?: boolean
}>()

const emit = defineEmits<{
    update: [data: ChangeStatusLockReq]
    close: []
}>()

const statusOptions = [
    { value: 'ACTIVE', label: 'Hoạt động (ACTIVE)' },
    { value: 'LOCKED', label: 'Khóa tài khoản (LOCKED)' },
    // { value: 'PENDING', label: 'Chờ kích hoạt (PENDING)' },
    // { value: 'DELETED', label: 'Đã xóa (DELETED)' }
]

const validationSchema = toTypedSchema(
    z.object({
        accountStatus: z.enum(['ACTIVE', 'LOCKED', 'PENDING', 'DELETED']),
        lockReason: z.string().trim().nullable().optional()
    }).refine((data) => {
        if (data.accountStatus === 'LOCKED') {
            return !!data.lockReason && data.lockReason.trim().length > 0;
        }
        return true;
    }, {
        message: 'Vui lòng nhập lý do khóa tài khoản',
        path: ['lockReason']
    })
)

const { resetForm, handleSubmit, setFieldValue, values } = useForm({
    initialValues: {
        accountStatus: 'ACTIVE',
        lockReason: ''
    },
    validationSchema
})

watch(
    [() => props.account, () => props.show],
    ([acc, show]) => {
        if (show && acc) {
            resetForm({
                values: {
                    accountStatus: acc.accountStatus || 'ACTIVE',
                    lockReason: acc.lockReason || ''
                }
            })
        }
    },
    { immediate: true }
)

const isLockStatus = computed(() => values.accountStatus === 'LOCKED')

// Watch status change to clear lock reason if not LOCKED
watch(
    () => values.accountStatus,
    (status) => {
        if (status !== 'LOCKED') {
            setFieldValue('lockReason', '')
        }
    }
)

const handleClose = () => {
    resetForm()
    emit('close')
}

const onSubmit = handleSubmit((formValues) => {
    emit('update', {
        accountStatus: formValues.accountStatus,
        lockReason: formValues.accountStatus === 'LOCKED' ? formValues.lockReason : null
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
                    
                    <!-- Ornaments -->
                    <div class="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(180,83,9,0.03),transparent)] pointer-events-none"></div>

                    <!-- Header -->
                    <div class="relative px-6 pt-8 pb-4 text-center">
                        <div class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Trạng thái bảo mật</span>
                        </div>
                        <h2 class="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                            <Lock v-if="isLockStatus" class="w-6 h-6 text-red-600" />
                            <Unlock v-else class="w-6 h-6 text-green-600" />
                            Cập nhật trạng thái khóa
                        </h2>
                        <p v-if="account" class="mt-1 text-xs text-slate-500 font-medium max-w-[320px] mx-auto leading-relaxed">
                            Thay đổi trạng thái tài khoản của <span class="font-bold text-amber-800">{{ account.fullName }}</span> ({{ account.email }})
                        </p>

                        <button @click="handleClose" type="button"
                            class="absolute top-5 right-5 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="18" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <form class="relative px-6 pb-8" @submit.prevent="onSubmit">
                        <div class="space-y-4">
                            <!-- Select Trạng thái -->
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Trạng thái tài khoản</label>
                                <Field name="accountStatus" as="select"
                                    class="w-full px-4 py-3 border border-amber-100 rounded-2xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer">
                                    <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                                        {{ opt.label }}
                                    </option>
                                </Field>
                                <ErrorMessage name="accountStatus" class="text-xs text-red-500 font-medium mt-1 block" />
                            </div>

                            <!-- Textarea Lý do khóa (Chỉ hiển thị khi chọn LOCK) -->
                            <Transition name="slide">
                                <div v-if="isLockStatus" class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                                        <ShieldAlert class="w-4 h-4 text-red-500" />
                                        Lý do khóa tài khoản <span class="text-red-500">*</span>
                                    </label>
                                    <Field name="lockReason" as="textarea" rows="3"
                                        placeholder="Nhập lý do khóa tài khoản cụ thể để thông báo tới thành viên..."
                                        class="w-full px-4 py-3 border border-amber-100 rounded-2xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none placeholder-slate-400" />
                                    <ErrorMessage name="lockReason" class="text-xs text-red-500 font-bold mt-1 block" />
                                </div>
                            </Transition>
                        </div>

                        <!-- Footer Actions -->
                        <div class="mt-6 flex gap-3">
                            <button @click="handleClose" type="button"
                                class="flex-1 px-4 py-3 rounded-2xl border border-amber-100 hover:bg-amber-50 text-slate-700 font-bold text-sm transition-all active:scale-95">
                                Hủy bỏ
                            </button>
                            <button :disabled="isLoading" type="submit"
                                :class="[
                                    'flex-1 px-4 py-3 rounded-2xl text-white font-bold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2',
                                    isLockStatus ? 'bg-red-600 hover:bg-red-700 shadow-red-100' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-100'
                                ]">
                                <span v-if="isLoading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span v-else>Cập nhật</span>
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

.slide-enter-active,
.slide-leave-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
