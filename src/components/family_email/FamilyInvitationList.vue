<script setup lang="ts">
import { ref, computed } from 'vue'
import {
    Clock,
    XCircle,
    CheckCircle,
    Search,
    MoreHorizontal,
    Mail
} from "lucide-vue-next"

// Dữ liệu mẫu mở rộng
const invitations = ref([
    {
        email: "abc@gmail.com",
        status: "PENDING",
        createdAt: "2026-04-18",
        role: "Editor"
    },
    {
        email: "xyz@gmail.com",
        status: "CANCELLED",
        createdAt: "2026-04-17",
        role: "Viewer"
    },
    {
        email: "mno@gmail.com",
        status: "ACCEPTED",
        createdAt: "2026-04-15",
        role: "Admin"
    },
    {
        email: "admin@company.com",
        status: "PENDING",
        createdAt: "2026-04-18",
        role: "Owner"
    }
])

// Trạng thái lọc hiện tại
const currentFilter = ref('ALL')

// Danh sách các trạng thái để lọc
const filterOptions = [
    { label: 'Tất cả', value: 'ALL' },
    { label: 'Đang chờ', value: 'PENDING' },
    { label: 'Đã chấp nhận', value: 'ACCEPTED' },
    { label: 'Đã hủy', value: 'CANCELLED' }
]

// Logic lọc dữ liệu
const filteredInvitations = computed(() => {
    if (currentFilter.value === 'ALL') return invitations.value
    return invitations.value.filter(invite => invite.status === currentFilter.value)
})

// Định dạng Style cho Badge trạng thái
const getStatusConfig = (status: string) => {
    switch (status) {
        case "PENDING":
            return {
                label: "Đang chờ",
                class: "bg-amber-50 text-amber-700 border-amber-100",
                icon: Clock
            }
        case "CANCELLED":
            return {
                label: "Đã hủy",
                class: "bg-red-50 text-red-700 border-red-100",
                icon: XCircle
            }
        case "ACCEPTED":
            return {
                label: "Đã nhận",
                class: "bg-emerald-50 text-emerald-700 border-emerald-100",
                icon: CheckCircle
            }
        default:
            return { label: status, class: "bg-slate-50", icon: Clock }
    }
}
</script>

<template>
    <div class="w-full max-w mx-auto">
        <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

            <!-- Header & Filter Section -->
            <div class="p-5 border-b border-slate-100">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 class="text-lg font-bold text-slate-800">
                            Quản lý lời mời
                        </h3>
                        <p class="text-sm text-slate-500">
                            Theo dõi và quản lý các lời mời cộng tác đã gửi.
                        </p>
                    </div>

                    <!-- Tabs Filter -->
                    <div class="flex p-1 bg-slate-100 rounded-lg">
                        <button v-for="option in filterOptions" :key="option.value"
                            @click="currentFilter = option.value"
                            class="px-3 py-1.5 text-xs font-medium rounded-md transition-all" :class="currentFilter === option.value
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'">
                            {{ option.label }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Table Section -->
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-slate-50/50 border-b border-slate-100">
                            <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Người
                                nhận</th>
                            <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vai trò
                            </th>
                            <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Trạng
                                thái</th>
                            <th class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày gửi
                            </th>
                            <th
                                class="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                                Thao tác</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <tr v-for="invite in filteredInvitations" :key="invite.email"
                            class="hover:bg-slate-50/80 transition-colors group">

                            <td class="px-5 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Mail :size="14" />
                                    </div>
                                    <span class="text-sm font-medium text-slate-700">{{ invite.email }}</span>
                                </div>
                            </td>

                            <td class="px-5 py-4">
                                <span class="text-sm text-slate-600">{{ invite.role }}</span>
                            </td>

                            <td class="px-5 py-4">
                                <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border"
                                    :class="getStatusConfig(invite.status).class">
                                    <component :is="getStatusConfig(invite.status).icon" :size="12" />
                                    {{ getStatusConfig(invite.status).label }}
                                </div>
                            </td>

                            <td class="px-5 py-4">
                                <span class="text-sm text-slate-500">{{ invite.createdAt }}</span>
                            </td>

                            <td class="px-5 py-4 text-right">
                                <button
                                    class="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-all">
                                    <MoreHorizontal :size="16" />
                                </button>
                            </td>
                        </tr>

                        <!-- Empty State -->
                        <tr v-if="filteredInvitations.length === 0">
                            <td colspan="5" class="px-5 py-12 text-center">
                                <div class="flex flex-col items-center gap-2">
                                    <Search class="text-slate-300" :size="32" />
                                    <p class="text-slate-500 text-sm font-medium">Không tìm thấy lời mời nào phù hợp.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Footer Section -->
            <div class="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                <span class="text-xs text-slate-500">
                    Hiển thị {{ filteredInvitations.length }} kết quả
                </span>
                <button class="text-xs font-semibold text-blue-600 hover:underline">
                    Gửi lời mời mới
                </button>
            </div>

        </div>
    </div>
</template>

<style scoped></style>