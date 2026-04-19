<script setup lang="ts">
import type { FamilyMemberRes } from "@/types/family/family-member"
import { formatDate } from "@/utils/format-date"
import { Mail, Settings, Trash2 } from "lucide-vue-next"

defineProps<{
    member: FamilyMemberRes
    getStatus: (status: FamilyMemberRes["status"]) => string
}>()

const emit = defineEmits<{
    (e: "remove", memberId: number): void
}>()

const isAdmin = (member: FamilyMemberRes) => member.roleName === "FAMILY_ADMIN"

const getRoleLabel = (roleName: string) => {
    switch (roleName) {
        case "FAMILY_ADMIN":
            return "Quản trị viên"
        case "FAMILY_EDITOR":
            return "Biên tập viên"
        case "FAMILY_VIEWER":
            return "Người xem"
        default:
            return roleName
    }
}

const getRoleClass = (roleName: string) => {
    switch (roleName) {
        case "FAMILY_ADMIN":
            return "bg-amber-100 text-amber-700"
        case "FAMILY_EDITOR":
            return "bg-blue-100 text-blue-700"
        case "FAMILY_VIEWER":
            return "bg-slate-100 text-slate-700"
        default:
            return "bg-slate-100 text-slate-700"
    }
}

const getStatusClass = (status: FamilyMemberRes["status"]) => {
    switch (status) {
        case "ACTIVE":
            return "bg-emerald-100 text-emerald-700"
        case "LEFT":
            return "bg-amber-100 text-amber-700"
        case "REMOVED":
            return "bg-slate-100 text-slate-600"
        default:
            return "bg-slate-100 text-slate-600"
    }
}
</script>

<template>
    <div
        class="grid grid-cols-12 items-center gap-3 px-4 py-4 border-b border-slate-200 hover:bg-slate-50 transition-colors">
        <!-- Cột 1: thông tin thành viên -->
        <div class="col-span-12 md:col-span-5 flex items-center gap-3 min-w-0">
            <div class="relative shrink-0">
                <div
                    class="w-11 h-11 rounded-full overflow-hidden bg-linear-to-r from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-semibold">
                    <span>{{ member.email?.charAt(0).toUpperCase() }}</span>
                </div>

                <div v-if="member.status === 'ACTIVE'"
                    class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
            </div>

            <div class="min-w-0">
                <div class="font-medium text-slate-800 truncate">
                    {{ member.fullName }}
                </div>

                <div class="flex items-center gap-1 text-slate-500 text-sm truncate">
                    <Mail :size="14" class="shrink-0" />
                    <span class="truncate">{{ member.email }}</span>
                </div>
            </div>
        </div>

        <!-- Cột 2: vai trò -->
        <div class="col-span-6 md:col-span-2">
            <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                :class="getRoleClass(member.roleName)">
                {{ getRoleLabel(member.roleName) }}
            </span>
        </div>

        <!-- Cột 3: trạng thái -->
        <div class="col-span-6 md:col-span-2">
            <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium"
                :class="getStatusClass(member.status)">
                {{ getStatus(member.status) }}
            </span>
        </div>

        <!-- Cột 4: ngày tham gia -->
        <div class="col-span-8 md:col-span-2 text-sm text-slate-500">
            {{ formatDate(member.joinedAt) }}
        </div>

        <div class="col-span-4 md:col-span-1 flex items-center justify-end gap-1">
            <template v-if="!isAdmin(member)">
                <button type="button"
                    class="p-2 text-slate-400 hover:text-[#d4a373] hover:bg-orange-50 rounded-lg transition-colors">
                    <Settings :size="18" />
                </button>

                <button type="button" @click="emit('remove', member.accountId)"
                    class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 :size="18" />
                </button>
            </template>
        </div>
    </div>
</template>