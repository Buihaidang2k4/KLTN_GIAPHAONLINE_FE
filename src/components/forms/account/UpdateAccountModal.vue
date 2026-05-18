<script setup lang="ts">
import type { AccountRes } from '@/types/account/account.types'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { z } from 'zod'
import { X, Sparkles, User, Phone, Shield } from 'lucide-vue-next'
import { computed, watch, ref } from 'vue'
import { useRolesQuery } from '@/hooks/queries/auth/useRoles'
import {
    useUpdateAccountMutation,
    useAddRoleMutation,
    useRemoveRoleMutation
} from '@/hooks/queries/account/useAccount'
import { notify } from '@/utils/notify'

const props = defineProps<{
    show: boolean
    account: AccountRes | null
}>()

const emit = defineEmits<{
    close: []
    success: []
}>()

// Fetch all available roles in the system
const roleScope = computed(() => props.account?.roles[0].scopeType)

const { data: rolesData, isLoading: isLoadingRoles } = useRolesQuery('', roleScope, { page: 0, size: 100 })
const allRoles = computed(() => rolesData.value?.data?.items ?? [])

const validationSchema = toTypedSchema(
    z.object({
        fullName: z.string().trim().min(1, 'Vui lòng nhập họ và tên'),
        phoneNumber: z.string().trim().regex(/^[0-9+]{9,11}$/, 'Số điện thoại không hợp lệ (9-11 số)')
    })
)

const { resetForm, handleSubmit } = useForm({
    initialValues: {
        fullName: '',
        phoneNumber: ''
    },
    validationSchema
})

// Keep track of selected roles reactive state
const selectedRoleNames = ref<string[]>([])
const isSaving = ref(false)

watch(
    [() => props.account, () => props.show],
    ([acc, show]) => {
        if (show && acc) {
            resetForm({
                values: {
                    fullName: acc.fullName || '',
                    phoneNumber: acc.phoneNumber || ''
                }
            })
            // Map role names from original user
            selectedRoleNames.value = acc.roles ? acc.roles.map(r => r.name) : []
        }
    },
    { immediate: true }
)

const handleClose = () => {
    resetForm()
    emit('close')
}

// Mutations
const updateAccountMutation = useUpdateAccountMutation()
const addRoleMutation = useAddRoleMutation()
const removeRoleMutation = useRemoveRoleMutation()

const onSubmit = handleSubmit(async (formValues) => {
    if (!props.account) return

    isSaving.value = true
    const accountId = props.account.accountId

    try {
        // 1. Update Profile (Name & Phone)
        await updateAccountMutation.mutateAsync({
            accountId,
            data: {
                fullName: formValues.fullName,
                phoneNumber: formValues.phoneNumber
            }
        })

        // 2. Diff and update Roles
        const originalRoles = props.account.roles ? props.account.roles.map(r => r.name) : []
        const addedRoles = selectedRoleNames.value.filter(r => !originalRoles.includes(r))
        const removedRoles = originalRoles.filter(r => !selectedRoleNames.value.includes(r))

        // Execute role modifications concurrently
        const rolePromises = [
            ...addedRoles.map(roleName => addRoleMutation.mutateAsync({ accountId, roleName })),
            ...removedRoles.map(roleName => removeRoleMutation.mutateAsync({ accountId, roleName }))
        ]

        if (rolePromises.length > 0) {
            await Promise.all(rolePromises)
        }

        notify.success('Cập nhật tài khoản & Phân vai trò thành công', 'Thành công')
        emit('success')
        handleClose()
    } catch (err: any) {
        const errorMsg = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tài khoản'
        notify.error(errorMsg, 'Thất bại')
    } finally {
        isSaving.value = false
    }
})

// Toggle role selection
const toggleRole = (roleName: string) => {
    const idx = selectedRoleNames.value.indexOf(roleName)
    if (idx > -1) {
        selectedRoleNames.value.splice(idx, 1)
    } else {
        selectedRoleNames.value.push(roleName)
    }
}
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

                    <!-- Ornaments -->
                    <div
                        class="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(180,83,9,0.03),transparent)] pointer-events-none">
                    </div>

                    <!-- Header -->
                    <div class="relative px-6 pt-8 pb-4 text-center">
                        <div
                            class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Thông tin tài
                                khoản</span>
                        </div>
                        <h2
                            class="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                            <User class="w-6 h-6 text-amber-600" />
                            Cập nhật tài khoản & Vai trò
                        </h2>
                        <p v-if="account" class="mt-1 text-xs text-slate-500 font-medium leading-relaxed">
                            Chỉnh sửa thông tin cơ bản và phân quyền vai trò cho <span
                                class="font-bold text-amber-800">{{ account.email }}</span>
                        </p>

                        <button @click="handleClose" type="button"
                            class="absolute top-5 right-5 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="18" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <form class="relative px-6 pb-8" @submit.prevent="onSubmit">
                        <div class="space-y-4 max-h-[50vh] overflow-y-auto px-1">
                            <!-- Họ và tên (fullName) -->
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Họ và tên
                                    <span class="text-red-500">*</span></label>
                                <div class="relative">
                                    <User class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <Field name="fullName" type="text" placeholder="Nhập họ và tên..."
                                        class="w-full pl-10 pr-4 py-3 border border-amber-100 rounded-2xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-slate-400" />
                                </div>
                                <ErrorMessage name="fullName" class="text-xs text-red-500 font-semibold mt-1 block" />
                            </div>

                            <!-- Số điện thoại (phoneNumber) -->
                            <div class="space-y-1.5">
                                <label class="text-xs font-bold text-slate-700 uppercase tracking-wider block">Số điện
                                    thoại <span class="text-red-500">*</span></label>
                                <div class="relative">
                                    <Phone class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <Field name="phoneNumber" type="text" placeholder="Nhập số điện thoại..."
                                        class="w-full pl-10 pr-4 py-3 border border-amber-100 rounded-2xl bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder-slate-400" />
                                </div>
                                <ErrorMessage name="phoneNumber"
                                    class="text-xs text-red-500 font-semibold mt-1 block" />
                            </div>

                            <!-- Vai trò & Quyền hạn (Roles selection) -->
                            <div class="space-y-2 pt-2 border-t border-amber-100/50">
                                <label
                                    class="text-xs font-bold text-slate-700 uppercase tracking-wider block flex items-center gap-1.5">
                                    <Shield class="w-4 h-4 text-amber-600" />
                                    Phân vai trò tài khoản
                                </label>

                                <div v-if="isLoadingRoles" class="py-4 text-center">
                                    <span
                                        class="inline-block w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                                </div>
                                <div v-else class="grid grid-cols-1 gap-2">
                                    <div v-for="role in allRoles" :key="role.name" @click="toggleRole(role.name)"
                                        :class="[
                                            'p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-start justify-between gap-3 group/item',
                                            selectedRoleNames.includes(role.name)
                                                ? 'bg-amber-50/50 border-amber-500/50 ring-1 ring-amber-500/10'
                                                : 'bg-white border-amber-100 hover:border-amber-300 hover:bg-amber-50/10'
                                        ]">
                                        <div class="min-w-0">
                                            <div class="flex items-center gap-2">
                                                <span
                                                    class="font-bold text-slate-800 text-xs group-hover/item:text-amber-800 transition-colors uppercase">
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
                                            <p class="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-normal">
                                                {{ role.description || 'Không có mô tả chi tiết cho vai trò này.' }}
                                            </p>
                                        </div>

                                        <!-- Custom Checkbox -->
                                        <div :class="[
                                            'w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-200 mt-0.5',
                                            selectedRoleNames.includes(role.name)
                                                ? 'bg-amber-600 border-amber-600 text-white'
                                                : 'border-slate-300 bg-white'
                                        ]">
                                            <svg v-if="selectedRoleNames.includes(role.name)"
                                                class="w-3.5 h-3.5 stroke-[3]" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M5 13l4 4L19 7" />
                                            </svg>
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
                                <span v-if="isSaving"
                                    class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                <span v-else>Lưu thay đổi</span>
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
