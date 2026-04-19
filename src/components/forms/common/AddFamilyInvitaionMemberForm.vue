<script setup lang="ts">
import { reactive } from "vue"

type InvitePayload = {
    invitedEmail: string
    roleName: string
    message: string
}

type FormField = keyof InvitePayload

const emit = defineEmits<{
    (e: "close"): void
    (e: "submit", payload: InvitePayload): void
}>()

const form = reactive<InvitePayload>({
    invitedEmail: "",
    roleName: "FAMILY_VIEWER",
    message: ""
})

const errors = reactive<Record<FormField, string>>({
    invitedEmail: "",
    roleName: "",
    message: ""
})

const touched = reactive<Record<FormField, boolean>>({
    invitedEmail: false,
    roleName: false,
    message: false
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validators: Record<FormField, () => boolean> = {
    invitedEmail: () => {
        if (!form.invitedEmail.trim()) {
            errors.invitedEmail = "Email không được để trống"
            return false
        }

        if (!emailRegex.test(form.invitedEmail)) {
            errors.invitedEmail = "Email không hợp lệ"
            return false
        }

        errors.invitedEmail = ""
        return true
    },

    roleName: () => {
        if (!form.roleName.trim()) {
            errors.roleName = "Vai trò không được để trống"
            return false
        }

        errors.roleName = ""
        return true
    },

    message: () => {
        if (form.message.length > 200) {
            errors.message = "Lời nhắn không được vượt quá 200 ký tự"
            return false
        }

        errors.message = ""
        return true
    }
}

function validateField(field: FormField) {
    return validators[field]()
}

function handleBlur(field: FormField) {
    touched[field] = true
    validateField(field)
}

function handleInput(field: FormField) {
    if (!touched[field]) return
    validateField(field)
}

function validateForm() {
    return (Object.keys(form) as FormField[]).every((field) => {
        touched[field] = true
        return validateField(field)
    })
}

function handleSubmit() {
    if (!validateForm()) return
    emit("submit", { ...form })
}

function handleClose() {
    emit("close")
}

</script>

<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black/40">
        <div class="w-105 bg-white p-5 rounded-lg">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-base font-medium">Mời thành viên</h2>
                <button class="text-sm" @click="handleClose">X</button>
            </div>

            <form class="space-y-3" @submit.prevent="handleSubmit">
                <div>
                    <label class="text-sm">Email</label>
                    <input v-model="form.invitedEmail" type="email" placeholder="example@gmail.com"
                        class="w-full border px-2 py-1 text-sm outline-none"
                        :class="touched.invitedEmail && errors.invitedEmail ? 'border-red-400' : 'border-gray-300'"
                        @input="handleInput('invitedEmail')" @blur="handleBlur('invitedEmail')" />
                    <p v-if="touched.invitedEmail && errors.invitedEmail" class="text-sm text-red-500">
                        {{ errors.invitedEmail }}
                    </p>
                </div>

                <div>
                    <label class="text-sm">Vai trò</label>
                    <select v-model="form.roleName" class="w-full border px-2 py-1 text-sm"
                        :class="touched.roleName && errors.roleName ? 'border-red-400' : 'border-gray-300'"
                        @change="handleInput('roleName')" @blur="handleBlur('roleName')">
                        <option value="FAMILY_VIEWER">Viewer</option>
                        <option value="FAMILY_ADMIN">Admin</option>
                        <option value="FAMILY_EDITOR">Editor</option>
                    </select>
                    <p v-if="touched.roleName && errors.roleName" class="text-sm text-red-500">
                        {{ errors.roleName }}
                    </p>
                </div>

                <div>
                    <label class="text-sm">Lời nhắn</label>
                    <textarea v-model="form.message" class="w-full border px-2 py-1 text-sm"
                        :class="touched.message && errors.message ? 'border-red-400' : 'border-gray-300'" rows="3"
                        placeholder="Nhập lời mời..." @input="handleInput('message')" @blur="handleBlur('message')" />
                    <p v-if="touched.message && errors.message" class="text-sm text-red-500">
                        {{ errors.message }}
                    </p>
                </div>

                <div class="flex justify-end gap-2 mt-4">
                    <button type="button" class="border px-3 py-1 text-sm" @click="handleClose">
                        Huỷ
                    </button>

                    <button type="submit" class="border px-3 py-1 text-sm">
                        Gửi
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>