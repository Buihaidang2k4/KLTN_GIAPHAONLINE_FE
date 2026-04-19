<script setup lang="ts">
import { computed, ref } from "vue"
import {
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Ban,
    Mail,
} from "lucide-vue-next"
import type {
    FamilyInvitationStatus,
    InviteInvitationMemberRes,
} from "@/types/family/family-invitation"

const props = defineProps<{
    title: string
    description?: string
    items: InviteInvitationMemberRes[]
    mode: "received" | "sent"
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: "accept", token: string): void
    (e: "reject", token: string): void
    (e: "cancel", invitaionId: number): void
}>()

const currentFilter = ref<FamilyInvitationStatus | "ALL">("ALL")
const keyword = ref("")

const filterOptions = [
    { label: "Tất cả", value: "ALL" },
    { label: "Đang chờ", value: "PENDING" },
    { label: "Đã chấp nhận", value: "ACCEPTED" },
    { label: "Đã từ chối", value: "DECLINED" },
    { label: "Hết hạn", value: "EXPIRED" },
    { label: "Đã hủy lời mời", value: "CANCELED" },
]

const filteredItems = computed(() => {
    let result = props.items ?? []

    if (currentFilter.value !== "ALL") {
        result = result.filter(
            (item) => item.invitationStatus === currentFilter.value
        )
    }

    const q = keyword.value.trim().toLowerCase()
    if (q) {
        result = result.filter(
            (item) =>
                item.familyName?.toLowerCase().includes(q) ||
                item.invitedEmail?.toLowerCase().includes(q)
        )
    }

    return result
})

const getStatusConfig = (status: FamilyInvitationStatus) => {
    switch (status) {
        case "PENDING":
            return {
                label: "Đang chờ",
                class: "bg-amber-50 text-amber-700 border-amber-200",
                icon: Clock,
            }
        case "ACCEPTED":
            return {
                label: "Đã chấp nhận",
                class: "bg-emerald-50 text-emerald-700 border-emerald-200",
                icon: CheckCircle,
            }
        case "DECLINED":
            return {
                label: "Đã từ chối",
                class: "bg-rose-50 text-rose-700 border-rose-200",
                icon: XCircle,
            }
        case "EXPIRED":
            return {
                label: "Hết hạn",
                class: "bg-slate-100 text-slate-600 border-slate-200",
                icon: AlertCircle,
            }
        case "CANCELED":
            return {
                label: "Đã hủy",
                class: "bg-red-50 text-red-700 border-red-200",
                icon: Ban,
            }
        default:
            return {
                label: status,
                class: "bg-slate-50 text-slate-600 border-slate-200",
                icon: Clock,
            }
    }
}

const canAcceptOrDecline = (status: FamilyInvitationStatus) => status === "PENDING"
const canCancel = (status: FamilyInvitationStatus) => status === "PENDING"

</script>

<template>
    <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div class="p-5 border-b border-slate-100 space-y-4">
            <div>
                <h3 class="text-lg font-bold text-slate-800">{{ title }}</h3>
                <p class="text-sm text-slate-500">{{ description }}</p>
            </div>

            <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <input v-model="keyword" type="text" placeholder="Tìm theo email hoặc tên gia đình..."
                    class="w-full lg:max-w-sm rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400" />

                <div class="flex flex-wrap gap-2">
                    <button v-for="option in filterOptions" :key="option.value"
                        @click="currentFilter = option.value as any"
                        class="px-3 py-1.5 text-xs font-medium rounded-md transition-all" :class="currentFilter === option.value
                            ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                            ">
                        {{ option.label }}
                    </button>
                </div>
            </div>
        </div>

        <div v-if="loading" class="p-10 text-center text-sm text-slate-500">
            Đang tải dữ liệu...
        </div>

        <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-slate-50 border-b border-slate-100">
                        <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Email
                        </th>
                        <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap ">Gia đình
                        </th>
                        <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Trạng
                            thái</th>
                        <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Mã mời
                        </th>
                        <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Lời mời
                        </th>
                        <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Ngày tạo
                        </th>
                        <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Hết hạn
                        </th>
                        <th
                            class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase whitespace-nowrap text-right">
                            Hành động</th>
                    </tr>
                </thead>

                <tbody class="divide-y divide-slate-100">
                    <tr v-for="invite in filteredItems" :key="invite.familyInvitationId"
                        class="hover:bg-slate-50 transition-colors">
                        <td class="px-5 py-4">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Mail :size="14" />
                                </div>
                                <span class="text-sm font-medium text-slate-700">
                                    {{ invite.invitedEmail }}
                                </span>
                            </div>
                        </td>

                        <td class="px-5 py-4 text-sm text-slate-600">
                            {{ invite.familyName }}
                        </td>

                        <td class="px-5 py-4">
                            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                                :class="getStatusConfig(invite.invitationStatus).class">
                                <component :is="getStatusConfig(invite.invitationStatus).icon" :size="12" />
                                {{ getStatusConfig(invite.invitationStatus).label }}
                            </div>
                        </td>

                        <td class="px-5 py-4 text-sm text-slate-500">
                            {{ invite.inviteToken }}
                        </td>

                        <td class="px-5 py-4 text-sm text-slate-500">
                            {{ invite.message }}
                        </td>




                        <td class="px-5 py-4 text-sm text-slate-500">
                            {{ invite.createdAt }}
                        </td>

                        <td class="px-5 py-4 text-sm text-slate-500">
                            {{ invite.expiredAt }}
                        </td>

                        <td class="px-5 py-4 text-right">
                            <div class="flex items-center justify-end gap-2">
                                <template v-if="mode === 'received' && canAcceptOrDecline(invite.invitationStatus)">
                                    <button
                                        class="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 cursor-pointer"
                                        @click="emit('accept', invite.inviteToken)">
                                        Chấp nhận
                                    </button>
                                    <button
                                        class="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium hover:bg-rose-100 cursor-pointer"
                                        @click="emit('reject', invite.inviteToken)">
                                        Từ chối
                                    </button>
                                </template>

                                <template v-else-if="mode === 'sent' && canCancel(invite.invitationStatus)">
                                    <button
                                        class="px-3 py-1.5 rounded-lg bg-red-100 text-red-700 text-xs font-medium hover:bg-red-100 cursor-pointer"
                                        @click="emit('cancel', invite.familyInvitationId)">
                                        Hủy lời mời
                                    </button>
                                </template>

                                <span v-else class="text-xs text-slate-400">--</span>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="filteredItems.length === 0">
                        <td colspan="8" class="px-5 py-12 text-center text-sm text-slate-500">
                            Không có lời mời nào phù hợp.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>