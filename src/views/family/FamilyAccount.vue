<script setup lang="ts">
import { reactive, ref } from "vue"
import { Camera, KeyRound, Mail, Save, Shield, User } from "lucide-vue-next"

type AccountInfo = {
    fullName: string
    email: string
    role: string
    avatarUrl: string
}

const account = reactive<AccountInfo>({
    fullName: "Bùi Hải Đăng",
    email: "dangbui623@gmail.com",
    role: "FAMILY_ADMIN",
    avatarUrl: "",
})

const passwordForm = reactive({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
})

const selectedAvatar = ref<File | null>(null)
const previewAvatar = ref("")

function onSelectAvatar(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    selectedAvatar.value = file
    previewAvatar.value = URL.createObjectURL(file)
}

function handleUpdateProfile() {
    console.log("Cập nhật thông tin tài khoản", {
        fullName: account.fullName,
    })
}

function handleChangeAvatar() {
    if (!selectedAvatar.value) {
        alert("Vui lòng chọn ảnh đại diện")
        return
    }

    console.log("Upload avatar", selectedAvatar.value)
}

function handleChangePassword() {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
        alert("Vui lòng nhập đầy đủ thông tin mật khẩu")
        return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        alert("Mật khẩu xác nhận không khớp")
        return
    }

    console.log("Đổi mật khẩu", passwordForm)
}
</script>

<template>
    <div class="min-h-screen bg-slate-50">
        <div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
            <!-- Header -->
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-slate-800">Tài khoản</h1>
                <p class="mt-1 text-sm text-slate-500">
                    Quản lý thông tin cá nhân, ảnh đại diện và bảo mật tài khoản.
                </p>
            </div>

            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <!-- LEFT -->
                <div class="space-y-6 lg:col-span-1">
                    <!-- Avatar card -->
                    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 class="text-lg font-semibold text-slate-800">Ảnh đại diện</h2>
                        <p class="mt-1 text-sm text-slate-500">
                            Cập nhật ảnh đại diện của tài khoản.
                        </p>

                        <div class="mt-5 flex flex-col items-center">
                            <div
                                class="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-orange-400 to-amber-500 text-3xl font-bold text-white">
                                <img v-if="previewAvatar || account.avatarUrl" :src="previewAvatar || account.avatarUrl"
                                    alt="avatar" class="h-full w-full object-cover" />
                                <span v-else>
                                    {{ account.fullName?.charAt(0).toUpperCase() }}
                                </span>
                            </div>

                            <label
                                class="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                <Camera :size="16" />
                                Chọn ảnh
                                <input type="file" accept="image/*" class="hidden" @change="onSelectAvatar" />
                            </label>

                            <button type="button"
                                class="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                                @click="handleChangeAvatar">
                                <Save :size="16" />
                                Lưu avatar
                            </button>
                        </div>
                    </div>

                    <!-- Account summary -->
                    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 class="text-lg font-semibold text-slate-800">Tóm tắt tài khoản</h2>

                        <div class="mt-4 space-y-4 text-sm">
                            <div class="flex items-start gap-3">
                                <User :size="18" class="mt-0.5 text-slate-400" />
                                <div>
                                    <p class="text-slate-500">Họ và tên</p>
                                    <p class="font-medium text-slate-800">{{ account.fullName }}</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3">
                                <Mail :size="18" class="mt-0.5 text-slate-400" />
                                <div>
                                    <p class="text-slate-500">Email</p>
                                    <p class="font-medium text-slate-800">{{ account.email }}</p>
                                </div>
                            </div>

                            <div class="flex items-start gap-3">
                                <Shield :size="18" class="mt-0.5 text-slate-400" />
                                <div>
                                    <p class="text-slate-500">Vai trò</p>
                                    <p class="font-medium text-slate-800">{{ account.role }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- RIGHT -->
                <div class="space-y-6 lg:col-span-2">
                    <!-- Profile info -->
                    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 class="text-lg font-semibold text-slate-800">Thông tin tài khoản</h2>
                        <p class="mt-1 text-sm text-slate-500">
                            Cập nhật thông tin cơ bản của bạn.
                        </p>

                        <div class="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div class="md:col-span-2">
                                <label class="mb-2 block text-sm font-medium text-slate-700">Họ và tên</label>
                                <input v-model="account.fullName" type="text"
                                    class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                                    placeholder="Nhập họ và tên" />
                            </div>

                            <div class="md:col-span-2">
                                <label class="mb-2 block text-sm font-medium text-slate-700">Email</label>
                                <input v-model="account.email" type="email" disabled
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

                    <!-- Change password -->
                    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 class="text-lg font-semibold text-slate-800">Đổi mật khẩu</h2>
                        <p class="mt-1 text-sm text-slate-500">
                            Để bảo mật tài khoản, hãy sử dụng mật khẩu mạnh và không chia sẻ cho người khác.
                        </p>

                        <div class="mt-5 grid grid-cols-1 gap-4">
                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-700">Mật khẩu hiện tại</label>
                                <input v-model="passwordForm.currentPassword" type="password"
                                    class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                                    placeholder="Nhập mật khẩu hiện tại" />
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-700">Mật khẩu mới</label>
                                <input v-model="passwordForm.newPassword" type="password"
                                    class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                                    placeholder="Nhập mật khẩu mới" />
                            </div>

                            <div>
                                <label class="mb-2 block text-sm font-medium text-slate-700">Xác nhận mật khẩu
                                    mới</label>
                                <input v-model="passwordForm.confirmPassword" type="password"
                                    class="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                                    placeholder="Nhập lại mật khẩu mới" />
                            </div>
                        </div>

                        <div class="mt-5 flex justify-end">
                            <button type="button"
                                class="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-amber-500"
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

<style scoped></style>