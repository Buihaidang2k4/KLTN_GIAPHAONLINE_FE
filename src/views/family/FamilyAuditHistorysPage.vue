<script setup lang="ts">
import { formatDateTime } from "@/utils/format-date"
import { computed, ref } from "vue"

type AuditDataMap = Record<string, any> | null

type AuditItem = {
    auditId: number
    actorAccountId: number
    actorName: string
    actorEmail: string
    familyId: number
    action: string
    entityType: string
    entityId: string
    oldData: AuditDataMap
    newData: AuditDataMap
    createdAt: string
}

type AuditResponse = {
    code: number
    message: string
    data: {
        page: number
        size: number
        totalElements: number
        totalPages: number
        first: boolean
        last: boolean
        hasNext: boolean
        hasPrevious: boolean
        sortBy: string
        sortDirection: string
        items: AuditItem[]
    }
    timestamp: string
}

const auditResponse = ref<AuditResponse>({
    code: 200,
    message: "GET_LOG_BY_FAMILY_SUCCESS",
    data: {
        page: 0,
        size: 10,
        totalElements: 36,
        totalPages: 4,
        first: true,
        last: false,
        hasNext: true,
        hasPrevious: false,
        sortBy: "createdAt",
        sortDirection: "DESC",
        items: [
            {
                auditId: 44,
                actorAccountId: 24,
                actorName: "Minh Hùng",
                actorEmail: "nobac20390@sixoplus.com",
                familyId: 5,
                action: "ACCEPT_INVITATION",
                entityType: "FamilyInvitation",
                entityId: "24",
                oldData: {
                    role: "FAMILY_VIEWER",
                    status: "PENDING",
                    message: "ehehehhehe",
                    familyId: 5,
                    invitationId: 24,
                    invitedEmail: "nobac20390@sixoplus.com"
                },
                newData: {
                    role: "FAMILY_VIEWER",
                    status: "ACCEPTED",
                    message: "ehehehhehe",
                    familyId: 5,
                    invitationId: 24,
                    invitedEmail: "nobac20390@sixoplus.com"
                },
                createdAt: "2026-04-19T08:48:36.370293Z"
            },
            {
                auditId: 43,
                actorAccountId: 7,
                actorName: "Anh dep trai",
                actorEmail: "dangbui623@gmail.com",
                familyId: 5,
                action: "INVITE_MEMBER",
                entityType: "FamilyInvitation",
                entityId: "24",
                oldData: null,
                newData: {
                    role: "FAMILY_VIEWER",
                    status: "PENDING",
                    message: "ehehehhehe",
                    familyId: 5,
                    invitationId: 24,
                    invitedEmail: "nobac20390@sixoplus.com"
                },
                createdAt: "2026-04-19T08:48:10.793542Z"
            }
        ]
    },
    timestamp: "2026-04-20T21:22:15.0604729"
})

const auditItems = computed(() => auditResponse.value.data.items)
const page = computed(() => auditResponse.value.data.page)
const totalPages = computed(() => auditResponse.value.data.totalPages)
const totalElements = computed(() => auditResponse.value.data.totalElements)
const hasNext = computed(() => auditResponse.value.data.hasNext)
const hasPrevious = computed(() => auditResponse.value.data.hasPrevious)

function getActionLabel(action: string) {
    switch (action) {
        case "INVITE_MEMBER":
            return "Mời thành viên"
        case "ACCEPT_INVITATION":
            return "Chấp nhận"
        case "CANCEL_INVITATION":
            return "Hủy lời mời"
        case "REJECT_INVITATION":
            return "Từ chối"
        default:
            return action
    }
}

function getActionClass(action: string) {
    switch (action) {
        case "INVITE_MEMBER":
            return "bg-blue-50 text-blue-700 border-blue-200"
        case "ACCEPT_INVITATION":
            return "bg-emerald-50 text-emerald-700 border-emerald-200"
        case "CANCEL_INVITATION":
            return "bg-amber-50 text-amber-700 border-amber-200"
        case "REJECT_INVITATION":
            return "bg-red-50 text-red-700 border-red-200"
        default:
            return "bg-slate-50 text-slate-700 border-slate-200"
    }
}

function formatValue(value: any) {
    if (value === null || value === undefined || value === "") return "-"
    if (typeof value === "boolean") return value ? "true" : "false"
    if (typeof value === "object") return JSON.stringify(value)
    return String(value)
}

function getEntries(data: AuditDataMap) {
    if (!data) return []
    return Object.entries(data)
}

function nextPage() {
    if (!hasNext.value) return
    console.log("Trang sau")
}

function prevPage() {
    if (!hasPrevious.value) return
    console.log("Trang trước")
}
</script>

<template>
    <div class="min-h-screen bg-[#fbfaf5]">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 class="text-2xl font-bold text-slate-800">Lịch sử hoạt động</h1>
                    <p class="mt-1 text-sm text-slate-500">
                        Theo dõi dữ liệu cũ và dữ liệu mới của từng thao tác.
                    </p>
                </div>

                <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
                    <span class="text-slate-500">Tổng số bản ghi:</span>
                    <span class="ml-2 font-semibold text-slate-800">{{ totalElements }}</span>
                </div>
            </div>

            <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div class="overflow-x-auto">
                    <table class="min-w-full text-left">
                        <thead class="bg-slate-50 text-sm text-slate-600">
                            <tr>
                                <th class="px-5 py-4 font-semibold">Thời gian</th>
                                <th class="px-5 py-4 font-semibold">Người thực hiện</th>
                                <th class="px-5 py-4 font-semibold">Hành động</th>
                                <th class="px-5 py-4 font-semibold">Đối tượng</th>
                                <th class="px-5 py-4 font-semibold">Dữ liệu cũ</th>
                                <th class="px-5 py-4 font-semibold">Dữ liệu mới</th>
                            </tr>
                        </thead>

                        <tbody class="divide-y divide-slate-100 text-sm">
                            <tr v-for="item in auditItems" :key="item.auditId"
                                class="align-top transition hover:bg-slate-50/70">
                                <td class="whitespace-nowrap px-5 py-4 text-slate-600">
                                    {{ formatDateTime(item.createdAt) }}
                                </td>

                                <td class="px-5 py-4">
                                    <div class="font-medium text-slate-800">{{ item.actorName }}</div>
                                    <div class="text-xs text-slate-500">{{ item.actorEmail }}</div>
                                </td>

                                <td class="px-5 py-4">
                                    <span class="inline-flex rounded-full border px-3 py-1 text-xs font-semibold"
                                        :class="getActionClass(item.action)">
                                        {{ getActionLabel(item.action) }}
                                    </span>
                                </td>

                                <td class="px-5 py-4 text-slate-700">
                                    <div class="font-medium">{{ item.entityType }}</div>
                                    <div class="text-xs text-slate-500">ID: {{ item.entityId }}</div>
                                </td>

                                <!-- oldData -->
                                <td class="px-5 py-4">
                                    <div v-if="getEntries(item.oldData).length"
                                        class="space-y-2 rounded-2xl bg-rose-50 p-3">
                                        <div v-for="[key, value] in getEntries(item.oldData)" :key="key"
                                            class="grid grid-cols-[100px_1fr] gap-2 text-xs">
                                            <span class="font-semibold text-rose-700">{{ key }}</span>
                                            <span class="break-all text-slate-700">{{ formatValue(value) }}</span>
                                        </div>
                                    </div>
                                    <span v-else class="text-slate-400">-</span>
                                </td>

                                <!-- newData -->
                                <td class="px-5 py-4">
                                    <div v-if="getEntries(item.newData).length"
                                        class="space-y-2 rounded-2xl bg-emerald-50 p-3">
                                        <div v-for="[key, value] in getEntries(item.newData)" :key="key"
                                            class="grid grid-cols-[100px_1fr] gap-2 text-xs">
                                            <span class="font-semibold text-emerald-700">{{ key }}</span>
                                            <span class="break-all text-slate-700">{{ formatValue(value) }}</span>
                                        </div>
                                    </div>
                                    <span v-else class="text-slate-400">-</span>
                                </td>
                            </tr>

                            <tr v-if="auditItems.length === 0">
                                <td colspan="6" class="px-5 py-10 text-center text-sm text-slate-500">
                                    Chưa có lịch sử hoạt động nào.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="flex items-center justify-between border-t border-slate-200 px-5 py-4">
                    <div class="text-sm text-slate-500">
                        Trang <span class="font-semibold text-slate-800">{{ page + 1 }}</span>
                        /
                        <span class="font-semibold text-slate-800">{{ totalPages }}</span>
                    </div>

                    <div class="inline-flex items-center gap-2">
                        <button type="button" @click="prevPage" :disabled="!hasPrevious"
                            class="rounded-xl px-4 py-2 text-sm font-medium transition" :class="!hasPrevious
                                ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                                : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'">
                            ← Trước
                        </button>

                        <button type="button" @click="nextPage" :disabled="!hasNext"
                            class="rounded-xl px-4 py-2 text-sm font-medium transition" :class="!hasNext
                                ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                                : 'bg-indigo-600 text-white hover:bg-indigo-500'">
                            Sau →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>