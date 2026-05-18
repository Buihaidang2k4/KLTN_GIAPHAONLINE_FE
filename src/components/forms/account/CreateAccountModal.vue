<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { z } from 'zod'
import { X, Sparkles, User, Phone, Shield, Mail, Lock, Home } from 'lucide-vue-next'
import { computed, watch, ref } from 'vue'
import { useRolesQuery } from '@/hooks/queries/auth/useRoles'
import { useCreateAccountMutation } from '@/hooks/queries/account/useAccount'
import { notify } from '@/utils/notify'

const props = defineProps<{
    show: boolean
}>()

const emit = defineEmits<{
    close: []
    success: []
}>()

const accountScopeType = ref<'SYSTEM' | 'FAMILY'>('SYSTEM')

// Fetch roles dynamically filtered by active scope type
const { data: rolesData, isLoading: isLoadingRoles } = useRolesQuery('', accountScopeType, { page: 0, size: 100 })
const allRoles = computed(() => rolesData.value?.data?.items ?? [])

const selectedRoleName = ref<string>('')
const isSaving = ref(false)

const validationSchema = toTypedSchema(
    z.object({
        fullName: z.string().trim()
            .min(1, 'Họ tên không được để trống')
            .min(2, 'Họ tên phải từ 2 đến 100 ký tự')
            .max(100, 'Họ tên phải từ 2 đến 100 ký tự'),
        email: z.string().trim()
            .min(1, 'Email không được để trống')
            .email('Email không đúng định dạng'),
        phoneNumber: z.string().trim()
            .min(1, 'Số điện thoại không được để trống')
            .regex(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ'),
        familyName: z.string().trim().optional(),
        password: z.string()
            .min(1, 'Mật khẩu không được để trống')
            .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'),
        rePassword: z.string()
            .min(1, 'Vui lòng nhập lại mật khẩu')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 'Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt')
    }).refine((data) => data.password === data.rePassword, {
        message: 'Mật khẩu xác nhận không khớp',
        path: ['rePassword']
    }).refine((data) => {
        // Require familyName only if Family scope is selected
        if (accountScopeType.value === 'FAMILY') {
            return !!data.familyName && data.familyName.trim().length > 0
        }
        return true;
    }, {
        message: 'FamilyName không được để trống',
        path: ['familyName']
    })
)

const { resetForm, handleSubmit } = useForm({
    initialValues: {
        fullName: '',
        email: '',
        phoneNumber: '',
        familyName: '',
        password: '',
        rePassword: ''
    },
    validationSchema
})

// Auto-select first role in the active scope list when it changes
watch(
    () => allRoles.value,
    (roles) => {
        if (roles.length > 0) {
            const exists = roles.some(r => r.name === selectedRoleName.value)
            if (!exists) {
                selectedRoleName.value = roles[0].name
            }
        } else {
            selectedRoleName.value = ''
        }
    },
    { immediate: true }
)

watch(
    () => props.show,
    (show) => {
        if (show) {
            resetForm()
            accountScopeType.value = 'SYSTEM'
            selectedRoleName.value = ''
        }
    }
)

const handleClose = () => {
    resetForm()
    emit('close')
}

const createAccountMutation = useCreateAccountMutation()

const onSubmit = handleSubmit(async (formValues) => {
    if (!selectedRoleName.value) {
        notify.error('Vui lòng chọn 1 vai trò cho tài khoản mới', 'Lỗi')
        return
    }

    isSaving.value = true
    try {
        await createAccountMutation.mutateAsync({
            fullName: formValues.fullName,
            email: formValues.email,
            phoneNumber: formValues.phoneNumber,
            familyName: accountScopeType.value === 'FAMILY' ? (formValues.familyName || '') : '',
            roleEnums: selectedRoleName.value,
            password: formValues.password,
            rePassword: formValues.rePassword
        })

        notify.success('Tạo tài khoản mới thành công', 'Thành công')
        emit('success')
        handleClose()
    } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi tạo tài khoản'
        notify.error(errorMsg, 'Thất bại')
    } finally {
        isSaving.value = false
    }
})

const selectRole = (roleName: string) => {
    selectedRoleName.value = roleName
}
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <!-- Modal Container -->
                <div class="relative w-full max-w-lg overflow-hidden rounded-[2rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30 animate-in fade-in zoom-in duration-200">
                    
                    <!-- Ornaments -->
                    <div class="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(180,83,9,0.03),transparent)] pointer-events-none"></div>

                    <!-- Header -->
                    <div class="relative px-6 pt-8 pb-4 text-center">
                        <div class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Tài khoản mới</span>
                        </div>
                        <h2 class="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                            <User class="w-6 h-6 text-amber-600" />
                            Tạo Tài khoản mới
                        </h2>
                        <p class="mt-1 text-xs text-slate-500 font-medium leading-relaxed">
                            Chọn loại tài khoản, nhập thông tin đăng nhập và chọn 1 vai trò cho thành viên mới
                        </p>

                        <button @click="handleClose" type="button"
                            class="absolute top-5 right-5 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="18" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <form class="relative px-6 pb-8" @submit.prevent="onSubmit">
                        <div class="space-y-4 max-h-[50vh] overflow-y-auto px-1 pb-2">
                            
                            <!-- 1. Loại tài khoản (Account Scope) & Dòng họ -->
                            <div class="p-4 bg-amber-50/40 border border-amber-100 rounded-3xl space-y-3">
                                <div>
                                    <label class="text-[10px] font-black text-amber-800 uppercase tracking-widest block mb-2">Loại tài khoản <span class="text-red-500">*</span></label>
                                    <div class="grid grid-cols-2 gap-2">
                                        <button type="button" @click="accountScopeType = 'SYSTEM'"
                                            :class="[
                                                'py-2.5 rounded-2xl border font-bold text-xs transition-all text-center',
                                                accountScopeType === 'SYSTEM'
                                                    ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                                                    : 'bg-white border-amber-100/70 text-slate-600 hover:bg-white/80'
                                            ]">
                                            Hệ thống (SYSTEM)
                                        </button>
                                        <button type="button" @click="accountScopeType = 'FAMILY'"
                                            :class="[
                                                'py-2.5 rounded-2xl border font-bold text-xs transition-all text-center',
                                                accountScopeType === 'FAMILY'
                                                    ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                                                    : 'bg-white border-amber-100/70 text-slate-600 hover:bg-white/80'
                                            ]">
                                            Dòng họ (FAMILY)
                                        </button>
                                    </div>
                                </div>

                                <!-- Tên dòng họ (familyName) - Chỉ hiển thị khi chọn loại Family -->
                                <Transition name="slide-down">
                                    <div v-if="accountScopeType === 'FAMILY'" class="space-y-1.5">
                                        <label class="text-[10px] font-black text-amber-800 uppercase tracking-widest block">Tên dòng họ quản lý <span class="text-red-500">*</span></label>
                                        <div class="relative">
                                            <Home class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <Field name="familyName" type="text" placeholder="Nhập tên dòng họ..."
                                                class="w-full pl-10 pr-4 py-2.5 border border-amber-100 rounded-2xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-slate-400" />
                                        </div>
                                        <ErrorMessage name="familyName" class="text-xs text-red-500 font-semibold mt-1 block" />
                                    </div>
                                </Transition>
                            </div>

                            <!-- 2. Thông tin cá nhân -->
                            <div class="space-y-3">
                                <!-- Họ và tên (fullName) -->
                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Họ và tên <span class="text-red-500">*</span></label>
                                    <div class="relative">
                                        <User class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <Field name="fullName" type="text" placeholder="Nhập họ và tên..."
                                            class="w-full pl-10 pr-4 py-3 border border-amber-100 rounded-2xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-slate-400" />
                                    </div>
                                    <ErrorMessage name="fullName" class="text-xs text-red-500 font-semibold mt-1 block" />
                                </div>

                                <!-- Email -->
                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Địa chỉ Email <span class="text-red-500">*</span></label>
                                    <div class="relative">
                                        <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <Field name="email" type="email" placeholder="email@vi-du.com..."
                                            class="w-full pl-10 pr-4 py-3 border border-amber-100 rounded-2xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-slate-400" />
                                    </div>
                                    <ErrorMessage name="email" class="text-xs text-red-500 font-semibold mt-1 block" />
                                </div>

                                <!-- Số điện thoại (phoneNumber) -->
                                <div class="space-y-1.5">
                                    <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Số điện thoại <span class="text-red-500">*</span></label>
                                    <div class="relative">
                                        <Phone class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <Field name="phoneNumber" type="text" placeholder="Nhập số điện thoại..."
                                            class="w-full pl-10 pr-4 py-3 border border-amber-100 rounded-2xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-slate-400" />
                                    </div>
                                    <ErrorMessage name="phoneNumber" class="text-xs text-red-500 font-semibold mt-1 block" />
                                </div>

                                <!-- Mật khẩu -->
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-1.5">
                                        <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Mật khẩu <span class="text-red-500">*</span></label>
                                        <div class="relative">
                                            <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <Field name="password" type="password" placeholder="••••••••"
                                                class="w-full pl-10 pr-4 py-3 border border-amber-100 rounded-2xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-slate-400" />
                                        </div>
                                        <ErrorMessage name="password" class="text-xs text-red-500 font-semibold mt-1 block" />
                                    </div>

                                    <div class="space-y-1.5">
                                        <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Xác nhận mật khẩu <span class="text-red-500">*</span></label>
                                        <div class="relative">
                                            <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                            <Field name="rePassword" type="password" placeholder="••••••••"
                                                class="w-full pl-10 pr-4 py-3 border border-amber-100 rounded-2xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-slate-400" />
                                        </div>
                                        <ErrorMessage name="rePassword" class="text-xs text-red-500 font-semibold mt-1 block" />
                                    </div>
                                </div>
                            </div>

                            <!-- 3. Chọn 1 vai trò (Single Role selection) - Được lọc động theo Scope đã chọn -->
                            <div class="space-y-2 pt-2 border-t border-amber-100/50">
                                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                                    <Shield class="w-4 h-4 text-amber-600" />
                                    Chọn duy nhất 1 vai trò <span class="text-red-500">*</span>
                                </label>
                                
                                <div v-if="isLoadingRoles" class="py-4 text-center">
                                    <span class="inline-block w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                                </div>
                                <div v-else-if="allRoles.length === 0" class="py-4 text-center text-xs text-slate-400 italic">
                                    Không tìm thấy vai trò phù hợp với phạm vi này.
                                </div>
                                <div v-else class="grid grid-cols-1 gap-2">
                                    <div v-for="role in allRoles" :key="role.name"
                                        @click="selectRole(role.name)"
                                        :class="[
                                            'p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start justify-between gap-3 group/item',
                                            selectedRoleName === role.name
                                                ? 'bg-amber-50/50 border-amber-500/50 ring-1 ring-amber-500/10'
                                                : 'bg-white border-amber-100 hover:border-amber-300 hover:bg-amber-50/10'
                                        ]">
                                        <div class="min-w-0">
                                            <div class="flex items-center gap-2">
                                                <span class="font-bold text-slate-800 text-xs group-hover/item:text-amber-800 transition-colors uppercase">
                                                    {{ role.name.replace('ROLE_', '') }}
                                                </span>
                                                <span :class="[
                                                    'text-[8px] px-1.5 py-0.5 rounded font-black tracking-widest uppercase border',
                                                    role.scopeType === 'SYSTEM'
                                                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                        : 'bg-orange-50 text-orange-600 border-orange-100'
                                                ]">
                                                    {{ role.scopeType }}
                                                </span>
                                            </div>
                                            <p class="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-normal">{{ role.description || 'Không có mô tả chi tiết cho vai trò này.' }}</p>
                                        </div>

                                        <!-- Radio Circle Indicator -->
                                        <div :class="[
                                            'w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-200 mt-0.5',
                                            selectedRoleName === role.name
                                                ? 'border-amber-600 bg-white'
                                                : 'border-slate-300 bg-white'
                                        ]">
                                            <div v-if="selectedRoleName === role.name" class="w-2.5 h-2.5 rounded-full bg-amber-600"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Footer Actions -->
                        <div class="mt-6 flex gap-3">
                            <button @click="handleClose" type="button"
                                class="flex-1 px-4 py-3 rounded-2xl border border-amber-100 hover:bg-amber-50 text-slate-700 font-bold text-sm transition-all active:scale-95">
                                Hủy bỏ
                            </button>
                            <button :disabled="isSaving" type="submit"
                                class="flex-1 px-4 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm transition-all shadow-md shadow-amber-100 active:scale-95 flex items-center justify-center gap-2">
                                <span v-if="isSaving" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span v-else>Tạo tài khoản</span>
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

.slide-down-enter-active,
.slide-down-leave-active {
    transition: all 0.25s ease-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>
