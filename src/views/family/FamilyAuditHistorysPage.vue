<script setup lang="ts">
import { useAuditLogsByFamilyQuery } from "@/hooks/queries/family/audit_log/useAuditLog";
import { useFamilyStore } from "@/store/family/useFamilyStore";
import type { AuditLogRes } from "@/types/family/audit-log.types";
import { formatDateTime } from "@/utils/format-date"
import { computed, watch } from "vue"
import { usePagination } from "@/composables/common/usePagination";
import AppPagination from "@/components/forms/common/AppPagination.vue";

const familyStore = useFamilyStore();
const familyId = computed(() => familyStore.currentFamilyId);

type AuditDataMap = Record<string, any> | null

const {
    pagination,
    currentPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    setTotalPages
} = usePagination(10, 0);

const queryParams = computed(() => ({
    page: pagination.page,
    size: pagination.size,
    sort: "createdAt,desc"
}))

const { data: auditLogData, isFetching } = useAuditLogsByFamilyQuery(familyId, queryParams);

const auditItems = computed<AuditLogRes[]>(() => auditLogData.value?.data?.items ?? [])
const totalElements = computed(() => auditLogData.value?.data?.totalElements ?? 0)

watch(
    () => auditLogData.value?.data?.totalPages,
    (total) => setTotalPages(total || 0),
    { immediate: true }
)

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

</script>

<template>
    <div class="min-h-screen bg-[#fbfaf5]">
        <div class="mx-auto w-full max-w-[1600px] px-3 py-6 sm:px-5 lg:px-8 xl:px-10">
            <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div class="min-w-0">
                    <h1 class="text-2xl font-bold text-slate-800">Lịch sử hoạt động</h1>
                    <p class="mt-1 text-sm text-slate-500">
                        Theo dõi dữ liệu cũ và dữ liệu mới của từng thao tác.
                    </p>
                </div>

                <div class="shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm">
                    <span class="text-slate-500">Tổng số bản ghi:</span>
                    <span class="ml-2 font-semibold text-slate-800">{{ totalElements }}</span>
                </div>
            </div>

            <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full min-w-[1180px] table-fixed text-left">
                        <colgroup>
                            <col class="w-[170px]" />
                            <col class="w-[220px]" />
                            <col class="w-[160px]" />
                            <col class="w-[315px]" />
                            <col class="w-[315px]" />
                        </colgroup>
                        <thead class="bg-slate-50 text-sm text-slate-600">
                            <tr>
                                <th class="px-5 py-4 font-semibold">Thời gian</th>
                                <th class="px-5 py-4 font-semibold">Người thực hiện</th>
                                <th class="px-5 py-4 font-semibold">Hành động</th>
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
                                    <div class="truncate text-xs font-medium text-slate-600" :title="item.actorEmail">
                                        {{ item.actorEmail }}
                                    </div>
                                </td>

                                <td class="px-5 py-4">
                                    <span class="inline-flex rounded-full border px-3 py-1 text-xs font-semibold"
                                        :class="getActionClass(item.action)">
                                        {{ getActionLabel(item.action) }}
                                    </span>
                                </td>

                                <!-- oldData -->
                                <td class="px-5 py-4">
                                    <div v-if="getEntries(item.oldData).length"
                                        class="max-h-40 space-y-2 overflow-auto rounded-2xl bg-rose-50 p-3">
                                        <div v-for="[key, value] in getEntries(item.oldData)" :key="key"
                                            class="grid grid-cols-[minmax(72px,96px)_minmax(0,1fr)] gap-2 text-xs">
                                            <span class="min-w-0 truncate font-semibold text-rose-700" :title="key">{{ key }}</span>
                                            <span class="min-w-0 break-words text-slate-700">{{ formatValue(value) }}</span>
                                        </div>
                                    </div>
                                    <span v-else class="text-slate-400">-</span>
                                </td>

                                <!-- newData -->
                                <td class="px-5 py-4">
                                    <div v-if="getEntries(item.newData).length"
                                        class="max-h-40 space-y-2 overflow-auto rounded-2xl bg-emerald-50 p-3">
                                        <div v-for="[key, value] in getEntries(item.newData)" :key="key"
                                            class="grid grid-cols-[minmax(72px,96px)_minmax(0,1fr)] gap-2 text-xs">
                                            <span class="min-w-0 truncate font-semibold text-emerald-700" :title="key">{{ key }}</span>
                                            <span class="min-w-0 break-words text-slate-700">{{ formatValue(value) }}</span>
                                        </div>
                                    </div>
                                    <span v-else class="text-slate-400">-</span>
                                </td>
                            </tr>

                            <tr v-if="auditItems.length === 0">
                                <td colspan="5" class="px-5 py-10 text-center text-sm text-slate-500">
                                    {{ isFetching ? 'Đang tải lịch sử hoạt động...' : 'Chưa có lịch sử hoạt động nào.' }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div class="text-sm text-slate-500">
                        Hiển thị từ {{ totalElements === 0 ? 0 : pagination.page * pagination.size + 1 }} đến
                        {{ Math.min((pagination.page + 1) * pagination.size, totalElements) }}
                        trong tổng số {{ totalElements }} bản ghi
                    </div>

                    <AppPagination :page="currentPage" :total-pages="pagination.totalPages" :has-next="hasNextPage"
                        :has-prev="hasPrevPage" @next="nextPage" @prev="prevPage" class="!mt-0" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.overflow-auto::-webkit-scrollbar,
.overflow-x-auto::-webkit-scrollbar {
    height: 8px;
    width: 8px;
}

.overflow-auto::-webkit-scrollbar-track,
.overflow-x-auto::-webkit-scrollbar-track {
    background: transparent;
}

.overflow-auto::-webkit-scrollbar-thumb,
.overflow-x-auto::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 999px;
}
</style>
