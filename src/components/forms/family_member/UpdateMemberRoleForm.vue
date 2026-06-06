<script setup lang="ts">
import { ref } from "vue"
import type { FamilyMemberRes, FamilyMemberRoleType } from "@/types/family/family-member.types"
import { X } from "lucide-vue-next"

const props = defineProps<{
    member: FamilyMemberRes
}>()

const emit = defineEmits<{
    close: []
    submit: [newRole: FamilyMemberRoleType]
}>()

const selectedRole = ref<FamilyMemberRoleType>(props.member.roleName as FamilyMemberRoleType)

const rolesList = [
    { value: "FAMILY_ADMIN", label: "Quản trị viên", desc: "Có tất cả quyền" },
    { value: "FAMILY_EDITOR", label: "Biên tập viên", desc: "Có quyền thêm, sửa thông tin cây gia phả." },
    { value: "FAMILY_VIEWER", label: "Người xem", desc: "Chỉ có quyền xem thông tin cây gia phả, không được chỉnh sửa." }
]

function handleSubmit() {
    emit("submit", selectedRole.value)
}
</script>

<template>
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <div
            class="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
            <div class="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                    <h3 class="text-base font-semibold text-slate-900">Thay đổi vai trò</h3>
                    <p class="text-xs text-slate-500 mt-0.5">Thay đổi quyền hạn cho: {{ member.fullName }}</p>
                </div>
                <button type="button" @click="emit('close')"
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                    <X :size="18" />
                </button>
            </div>

            <form @submit.prevent="handleSubmit" class="p-5 space-y-4">
                <div class="space-y-3">
                    <label v-for="role in rolesList" :key="role.value"
                        class="flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-all"
                        :class="selectedRole === role.value ? 'border-slate-800 bg-slate-50/50' : 'border-slate-200 hover:bg-slate-50/30'">
                        <input type="radio" v-model="selectedRole" :value="role.value" name="member-role"
                            class="mt-1 h-4 w-4 accent-slate-800 cursor-pointer" />
                        <div class="select-none">
                            <span class="block text-sm font-medium text-slate-800">{{ role.label }}</span>
                            <span class="block text-xs text-slate-500 mt-0.5 leading-relaxed">{{ role.desc }}</span>
                        </div>
                    </label>
                </div>

                <div class="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button type="button" @click="emit('close')"
                        class="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
                        Hủy bỏ
                    </button>
                    <button type="submit"
                        class="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 shadow-xs transition">
                        Xác nhận lưu
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>