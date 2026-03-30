<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-amber-900 flex items-center gap-2">
                    <KeyRound class="w-8 h-8" />
                    Danh mục Quyền hạn
                </h1>
                <p class="text-gray-500 mt-1">Danh sách các hành động thô được định nghĩa trong hệ thống</p>
            </div>

            <div class="flex gap-3 mt-4 md:mt-0">
                <button
                    class="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-all shadow-sm">
                    <Download class="w-4 h-4" />
                    Xuất dữ liệu
                </button>
                <button
                    class="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-all shadow-md active:scale-95">
                    <PlusCircle class="w-5 h-5" />
                    Thêm quyền mới
                </button>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-amber-500 font-semibold mb-1 uppercase text-[10px] tracking-wider">Tổng số Quyền</div>
                <div class="text-2xl font-bold text-gray-800">{{ permissions.length }}</div>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-blue-500 font-semibold mb-1 uppercase text-[10px] tracking-wider">Quyền Hệ thống</div>
                <div class="text-2xl font-bold text-gray-800">{{ countScope('SYSTEM') }}</div>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-orange-500 font-semibold mb-1 uppercase text-[10px] tracking-wider">Quyền Dòng họ</div>
                <div class="text-2xl font-bold text-gray-800">{{ countScope('FAMILY') }}</div>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-green-500 font-semibold mb-1 uppercase text-[10px] tracking-wider">Mới cập nhật</div>
                <div class="text-2xl font-bold text-gray-800">3</div>
            </div>
        </div>

        <!-- Main Content Container -->
        <div class="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
            <!-- Toolbar -->
            <div
                class="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
                <div class="relative w-full md:w-96">
                    <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="searchQuery" type="text" placeholder="Tìm mã quyền hoặc mô tả..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm" />
                </div>
                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-2 text-sm text-gray-500 border rounded-lg px-3 py-1.5 bg-gray-50">
                        <Filter class="w-4 h-4" />
                        <select v-model="filterScope" class="bg-transparent focus:outline-none cursor-pointer">
                            <option value="ALL">Tất cả phạm vi</option>
                            <option value="SYSTEM">Phạm vi SYSTEM</option>
                            <option value="FAMILY">Phạm vi FAMILY</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="bg-amber-50/50 text-amber-900 text-xs font-bold uppercase tracking-widest">
                            <th class="px-6 py-4">Mã định danh (Key)</th>
                            <th class="px-6 py-4">Mô tả chi tiết</th>
                            <th class="px-6 py-4">Phạm vi (Scope)</th>
                            <th class="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="perm in filteredPermissions" :key="perm.name"
                            class="hover:bg-amber-50/30 transition-colors group">
                            <td class="px-6 py-4">
                                <code
                                    class="px-2 py-1 bg-gray-100 text-pink-600 rounded text-xs font-mono font-bold border border-gray-200">
                                {{ perm.name }}
                                </code>
                            </td>
                            <td class="px-6 py-4">
                                <span class="text-sm text-gray-700 leading-relaxed">{{ perm.description }}</span>
                            </td>
                            <td class="px-6 py-4">
                                <span :class="[
                                    'px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border',
                                    perm.scopeType === 'SYSTEM'
                                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                                        : 'bg-orange-50 text-orange-600 border-orange-100'
                                ]">
                                    {{ perm.scopeType }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div
                                    class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        class="p-2 text-gray-400 hover:text-amber-600 hover:bg-white rounded-md border border-transparent hover:border-amber-100 transition-all shadow-sm">
                                        <Edit3 class="w-4 h-4" />
                                    </button>
                                    <button
                                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-md border border-transparent hover:border-red-100 transition-all shadow-sm">
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr v-if="filteredPermissions.length === 0">
                            <td colspan="4" class="px-6 py-20 text-center text-gray-400">
                                <div class="flex flex-col items-center gap-2">
                                    <ShieldAlert class="w-12 h-12 text-gray-200" />
                                    <p>Không tìm thấy quyền nào phù hợp</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Footer Info -->
            <div
                class="p-4 border-t border-gray-100 bg-gray-50/30 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-400 uppercase tracking-widest font-medium">
                <div class="flex items-center gap-4">
                    <span>Tổng: {{ permissions.length }} bản ghi</span>
                    <span class="text-gray-300">|</span>
                    <span>Hiển thị: {{ filteredPermissions.length }} bản ghi</span>
                </div>
                <div class="mt-2 md:mt-0 italic">
                    Timestamp: {{ timestamp }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
    KeyRound,
    Search,
    PlusCircle,
    Filter,
    Download,
    Edit3,
    Trash2,
    ShieldAlert
} from 'lucide-vue-next'

const timestamp = ref("2026-03-30T22:09:57.2343638")
const searchQuery = ref('')
const filterScope = ref('ALL')

// Dữ liệu từ JSON Permissions bạn cung cấp
const permissions = ref([
    { "name": "SYS_DASHBOARD_VIEW", "scopeType": "SYSTEM", "description": "Xem thống kê hệ thống" },
    { "name": "SYS_PLAN_MANAGE", "scopeType": "SYSTEM", "description": "Quản lý gói cước" },
    { "name": "SYS_PAYMENT_MANAGE", "scopeType": "SYSTEM", "description": "Quản lý thanh toán" },
    { "name": "SYS_ACCOUNT_MANAGE", "scopeType": "SYSTEM", "description": "Quản lý tài khoản người dùng" },
    { "name": "SYS_CONTENT_MANAGE", "scopeType": "SYSTEM", "description": "Quản lý bài viết trang chủ" },
    { "name": "FAM_DELETE", "scopeType": "SYSTEM", "description": "Xóa gia phả" },
    { "name": "FAM_SETTINGS_EDIT", "scopeType": "SYSTEM", "description": "Chỉnh sửa thông tin dòng họ" },
    { "name": "FAM_MEMBER_MANAGE", "scopeType": "SYSTEM", "description": "Quản lý thành viên trong họ" },
    { "name": "FAM_SUBSCRIPTION_MANAGE", "scopeType": "SYSTEM", "description": "Quản lý gói cước dòng họ" },
    { "name": "FAM_EXPORT", "scopeType": "SYSTEM", "description": "Xuất dữ liệu gia phả" },
    { "name": "NODE_WRITE", "scopeType": "SYSTEM", "description": "Thêm/Sửa thành viên cây" },
    { "name": "NODE_DELETE", "scopeType": "SYSTEM", "description": "Xóa thành viên cây" },
    { "name": "RELATIONSHIP_MANAGE", "scopeType": "SYSTEM", "description": "Quản lý quan hệ" },
    { "name": "POST_MANAGE", "scopeType": "SYSTEM", "description": "Quản lý bài đăng dòng họ" },
    { "name": "EVENT_MANAGE", "scopeType": "SYSTEM", "description": "Quản lý sự kiện/ngày giỗ" },
    { "name": "ALBUM_MANAGE", "scopeType": "SYSTEM", "description": "Quản lý album ảnh" },
    { "name": "POST_VIEW_PUBLIC", "scopeType": "SYSTEM", "description": "Xem bài viết công khai" },
    { "name": "FAM_VIEW_PUBLIC", "scopeType": "SYSTEM", "description": "Xem gia phả công khai" },
    { "name": "FAM_SUBSCRIPTION_VIEW", "scopeType": "FAMILY", "description": "Xem thông tin gói cước dòng họ" },
    { "name": "FAM_SUBSCRIPTION_UPGRADE_REQUEST", "scopeType": "FAMILY", "description": "Yêu cầu nâng cấp gói cước" },
    { "name": "FAM_PAYMENT_VIEW", "scopeType": "FAMILY", "description": "Xem lịch sử thanh toán dòng họ" }
])

// Logic tìm kiếm và lọc
const filteredPermissions = computed(() => {
    return permissions.value.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesScope = filterScope.value === 'ALL' || p.scopeType === filterScope.value
        return matchesSearch && matchesScope
    })
})

const countScope = (type) => {
    return permissions.value.filter(p => p.scopeType === type).length
}
</script>

<style scoped>
/* Hiệu ứng focus nhẹ cho input */
input:focus {
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.05);
}
</style>