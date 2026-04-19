<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue"
import { AlarmClockCheck, Camera, KeyRound, Mail, Save, Shield, User } from "lucide-vue-next"
import { useChangeAvatarMutation, useChangePasswordMutation, useMyInfoQuery, useUpdateAccountMutation } from "@/hooks/queries/account/useAccount"
import { useAccount } from "@/composables/accounts/useAccount"
import type { UpdateAccountReq } from "@/types/account/account"

type PasswordErrors = {
    oldPassword?: string
    newPassword?: string
    confirmPassword?: string
}

type PasswordForm = {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

const passwordForm = reactive<PasswordForm>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
})

const profileForm = reactive<UpdateAccountReq>({
    fullName: "",
    phoneNumber: "",
})

const changeAvatarMutation = useChangeAvatarMutation()
const changePasswordMutation = useChangePasswordMutation()
const updateAccountMutation = useUpdateAccountMutation();

const myInfo = useMyInfoQuery()

const accountId = computed(() => myInfo?.data?.value?.data?.accountId ?? null)
const { account } = useAccount(accountId)

watch(account, (val) => {
    if (!val) return

    profileForm.fullName = val.fullName ?? ""
    profileForm.phoneNumber = val.phoneNumber ?? ""
}, { immediate: true })

const selectedAvatar = ref<File | null>(null)
const previewAvatar = ref("")

const errors = reactive<PasswordErrors>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
})

const touched = reactive({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
})

function onSelectAvatar(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    selectedAvatar.value = file
    previewAvatar.value = URL.createObjectURL(file)
}

const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/
function handleUpdateProfile() {
    if (profileForm.phoneNumber && !phoneRegex.test(profileForm.phoneNumber)) {
        alert("Số điện thoại không hợp lệ")
        return
    }


    updateAccountMutation.mutate({
        accountId: accountId.value as number,
        data: profileForm
    })
}

function handleChangeAvatar() {
    if (!selectedAvatar.value || !accountId.value) {
        alert("Vui lòng chọn ảnh đại diện")
        return
    }

    changeAvatarMutation.mutate({
        accountId: accountId.value,
        file: selectedAvatar.value
    }, {
        onSuccess: () => {
            selectedAvatar.value = null
            previewAvatar.value = ""
        }
    })
}

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

function validateField(field: keyof PasswordForm) {
    if (field === "oldPassword") {
        if (!passwordForm.oldPassword) {
            errors.oldPassword = "Mật khẩu cũ không được để trống"
        } else {
            errors.oldPassword = ""
        }
    }

    if (field === "newPassword") {
        if (!passwordForm.newPassword) {
            errors.newPassword = "Mật khẩu mới không được để trống"
        } else if (passwordForm.newPassword.length < 8) {
            errors.newPassword = "Mật khẩu phải có ít nhất 8 ký tự"
        } else if (!passwordRegex.test(passwordForm.newPassword)) {
            errors.newPassword = "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
        } else {
            errors.newPassword = ""
        }
    }

    if (field === "confirmPassword") {
        if (!passwordForm.confirmPassword) {
            errors.confirmPassword = "Xác nhận mật khẩu không được để trống"
        } else if (!passwordRegex.test(passwordForm.confirmPassword)) {
            errors.confirmPassword = "Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
        } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            errors.confirmPassword = "Mật khẩu xác nhận không khớp"
        } else {
            errors.confirmPassword = ""
        }
    }
}

function handleInput(field: keyof PasswordForm) {
    if (touched[field]) {
        validateField(field)
    }
}

function handleBlur(field: keyof PasswordForm) {
    touched[field] = true
    validateField(field)
}

function validateAllFields() {
    touched.oldPassword = true
    touched.newPassword = true
    touched.confirmPassword = true

    validateField("oldPassword")
    validateField("newPassword")
    validateField("confirmPassword")
}

watch(() => passwordForm.newPassword, () => {
    if (touched.confirmPassword) {
        validateField("confirmPassword")
    }
})

function handleChangePassword() {
    validateAllFields()

    if (errors.oldPassword || errors.newPassword || errors.confirmPassword) {
        return
    }

    console.log("Đổi mật khẩu", { ...passwordForm })

    changePasswordMutation.mutate({
        accountId: accountId.value as number,
        data: passwordForm
    }, {
        onSuccess: () => {
            passwordForm.confirmPassword = ''
            passwordForm.newPassword = ''
            passwordForm.oldPassword = ''

            touched.confirmPassword = false
            touched.newPassword = false
            touched.oldPassword = false
        }
    })
}
</script>
<template>
    <div class="min-h-screen bg-slate-50">
        <div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-slate-800">Tài khoản</h1>
                <p class="mt-1 text-sm text-slate-500">
                    Quản lý thông tin cá nhân, ảnh đại diện và bảo mật tài khoản.
                </p>
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div class="space-y-6 lg:col-span-1">
                    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 class="text-lg font-semibold text-slate-800">Ảnh đại diện</h2>
                        <p class="mt-1 text-sm text-slate-500">
                            Cập nhật ảnh đại diện của tài khoản.
                        </p>

                        <div class="mt-5 flex flex-col items-center">
                            <div
                                class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-linear-to-r from-orange-400 to-amber-500 text-3xl font-bold text-white">
                                <img v-if="previewAvatar || account?.avatarUrl"
                                    :src="previewAvatar || account?.avatarUrl || undefined" alt="avatar"
                                    class="h-full w-full object-cover" />
                                <span v-else>
                                    {{ account?.fullName?.charAt(0).toUpperCase() ?? 'U' }}
                                </span>
                            </div>

                            <label
                                class="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                <Camera :size="16" />
                                Chọn ảnh mới
                                <input type="file" accept="image/*" class="hidden" @change="onSelectAvatar" />
                            </label>

                            <button type="button"
                                class="mt-3 cursor-pointer inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                                @click="handleChangeAvatar">
                                <Save :size="16" />
                                Lưu avatar
                            </button>
                        </div>
                    </div>

                    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 class="text-lg font-semibold text-slate-800">Tóm tắt tài khoản</h2>

                        <div class="mt-4 space-y-4 text-sm">
                            <div class="flex items-start gap-3">
                                <User :size="18" class="mt-0.5 text-slate-400" />
                                <div>
                                    <p class="text-slate-500">Họ và tên</p>
                                    <p class="font-medium text-slate-800">{{ account?.fullName }}</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3">
                                <Mail :size="18" class="mt-0.5 text-slate-400" />
                                <div>
                                    <p class="text-slate-500">Email</p>
                                    <p class="font-medium text-slate-800">{{ account?.email }}</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3">
                                <Shield :size="18" class="mt-0.5 text-slate-400" />
                                <div>
                                    <p class="text-slate-500">Vai trò</p>
                                    <p class="font-medium text-slate-800">{{ account?.roles[0] }}</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3">
                                <AlarmClockCheck :size="18" class="mt-0.5 text-slate-400" />
                                <div>
                                    <p class="text-slate-500">Trạng thái</p>
                                    <p class="font-medium text-slate-800">{{ account?.accountStatus }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-6 lg:col-span-2">
                    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 class="text-lg font-semibold text-slate-800">Thông tin tài khoản</h2>
                        <p class="mt-1 text-sm text-slate-500">
                            Cập nhật thông tin cơ bản của bạn.
                        </p>

                        <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div class="md:col-span-2">
                                <label class="mb-2 block text-sm font-medium text-slate-700">Họ và tên</label>
                                <input v-model="profileForm.fullName" type="text"
                                    class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                                    placeholder="Nhập họ và tên" />
                            </div>

                            <div class="md:col-span-2">
                                <label class="mb-2 block text-sm font-medium text-slate-700">Số điện thoại</label>
                                <input v-model="profileForm.phoneNumber" type="text"
                                    class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                                    placeholder="Nhập họ và tên" />
                            </div>

                            <div class="md:col-span-2">
                                <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
                                <input v-model="profileForm.email" type="email" disabled
                                    class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none" />
                            </div>
                        </div>

                        <div class="mt-5 flex justify-end">
                            <button type="button"
                                class="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
                                @click="handleUpdateProfile">
                                <Save :size="16" />
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>

                    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 class="text-lg font-semibold text-slate-800">Đổi mật khẩu</h2>
                        <p class="mt-1 text-sm text-slate-500">
                            Để bảo mật tài khoản, hãy sử dụng mật khẩu mạnh và không chia sẻ cho người khác.
                        </p>

                        <div class="mt-5 grid grid-cols-1 gap-4">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-700">Mật khẩu hiện tại</label>
                                <input v-model="passwordForm.oldPassword" type="text"
                                    class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition" :class="touched.oldPassword && errors.oldPassword
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-slate-200 focus:border-slate-400'"
                                    placeholder="Nhập mật khẩu hiện tại" @input="handleInput('oldPassword')"
                                    @blur="handleBlur('oldPassword')" />
                                <p v-if="touched.oldPassword && errors.oldPassword" class="mt-1 text-sm text-red-500">
                                    {{ errors.oldPassword }}
                                </p>
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-700">Mật khẩu mới</label>
                                <input v-model="passwordForm.newPassword" type="text"
                                    class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition" :class="touched.newPassword && errors.newPassword
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-slate-200 focus:border-slate-400'" placeholder="Nhập mật khẩu mới"
                                    @input="handleInput('newPassword')" @blur="handleBlur('newPassword')" />
                                <p v-if="touched.newPassword && errors.newPassword" class="mt-1 text-sm text-red-500">
                                    {{ errors.newPassword }}
                                </p>
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-700">Xác nhận mật khẩu
                                    mới</label>
                                <input v-model="passwordForm.confirmPassword" type="text"
                                    class="w-full rounded-xl border px-4 py-3 text-sm outline-none transition" :class="touched.confirmPassword && errors.confirmPassword
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-slate-200 focus:border-slate-400'"
                                    placeholder="Nhập lại mật khẩu mới" @input="handleInput('confirmPassword')"
                                    @blur="handleBlur('confirmPassword')" />
                                <p v-if="touched.confirmPassword && errors.confirmPassword"
                                    class="mt-1 text-sm text-red-500">
                                    {{ errors.confirmPassword }}
                                </p>
                            </div>
                        </div>

                        <div class="mt-5 flex justify-end">
                            <button type="button"
                                class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-500"
                                @click="handleChangePassword">
                                <KeyRound :size="16" />
                                Đổi mật khẩu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>