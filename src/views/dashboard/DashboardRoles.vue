<script setup>
import { ref, computed } from 'vue'
import {
    ShieldCheck,
    Search,
    PlusCircle,
    Key,
    Edit3,
    Trash2,
    Eye,
    Filter,
    UserSquare,
    Download
} from 'lucide-vue-next'

const searchQuery = ref('')
const filterScope = ref('ALL')

const roles = ref([
    {
        "name": "SYSTEM_ADMIN",
        "scopeType": "SYSTEM",
        "description": "Quản trị viên hệ thống - Toàn quyền điều hành",
        "permissions": Array(5).fill({})
    },
    {
        "name": "SYSTEM_CONTENT_MANAGER",
        "scopeType": "SYSTEM",
        "description": "Quản lý nội dung hệ thống",
        "permissions": Array(1).fill({})
    },
    {
        "name": "FAMILY_ADMIN",
        "scopeType": "SYSTEM",
        "description": "Quản trị viên dòng họ - Có quyền xóa gia phả và quản lý thành viên",
        "permissions": Array(12).fill({})
    },
    {
        "name": "FAMILY_EDITOR",
        "scopeType": "SYSTEM",
        "description": "Biên tập viên dòng họ - Thêm sửa thông tin cây và bài viết",
        "permissions": Array(6).fill({})
    },
    {
        "name": "FAMILY_VIEWER",
        "scopeType": "SYSTEM",
        "description": "Người xem - Chỉ có quyền xem thông tin công khai",
        "permissions": Array(2).fill({})
    },
    {
        "name": "FAMILY_USERS",
        "scopeType": "FAMILY",
        "description": "Tài khoản user mặc định mới tạo",
        "permissions": []
    }
])

const filteredRoles = computed(() => {
    return roles.value.filter(r => {
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            r.description.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesScope = filterScope.value === 'ALL' || r.scopeType === filterScope.value
        return matchesSearch && matchesScope
    })
})

const countScope = (type) => {
    return roles.value.filter(r => r.scopeType === type).length
}
</script>


<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-amber-900 flex items-center gap-2">
                    <ShieldCheck class="w-8 h-8" />
                    Quản lý Vai trò & Quyền hạn
                </h1>
                <p class="text-gray-500 mt-1 text-sm">Thiết lập các nhóm quyền cho hệ thống và dòng họ</p>
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
                    Tạo vai trò mới
                </button>
            </div>
        </div>

        <!-- Stats Cards (Đồng bộ kích thước 4 cột) -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-amber-500 font-semibold mb-1 uppercase text-[10px] tracking-wider text-xs">Tổng số Vai
                    trò</div>
                <div class="text-2xl font-bold text-gray-800">{{ roles.length }}</div>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-blue-500 font-semibold mb-1 uppercase text-[10px] tracking-wider text-xs">Hệ thống
                    (SYSTEM)</div>
                <div class="text-2xl font-bold text-gray-800">{{ countScope('SYSTEM') }}</div>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-orange-500 font-semibold mb-1 uppercase text-[10px] tracking-wider text-xs">Dòng họ
                    (FAMILY)</div>
                <div class="text-2xl font-bold text-gray-800">{{ countScope('FAMILY') }}</div>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-green-500 font-semibold mb-1 uppercase text-[10px] tracking-wider text-xs">Phạm vi hoạt
                    động</div>
                <div class="text-2xl font-bold text-gray-800">Toàn quốc</div>
            </div>
        </div>

        <!-- Main Table Container -->
        <div class="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
            <!-- Toolbar (Đồng bộ với Permissions) -->
            <div
                class="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
                <div class="relative w-full md:w-96">
                    <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="searchQuery" type="text" placeholder="Tìm tên vai trò hoặc mô tả..."
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

            <!-- Table (Đồng bộ cấu trúc cột) -->
            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="bg-amber-50/50 text-amber-900 text-xs font-bold uppercase tracking-widest">
                            <th class="px-6 py-4 w-1/4">Tên vai trò (Key)</th>
                            <th class="px-6 py-4 w-1/3">Mô tả chi tiết</th>
                            <th class="px-6 py-4 w-1/6 text-center">Phạm vi</th>
                            <th class="px-6 py-4 w-1/6 text-center">Quyền hạn</th>
                            <th class="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="role in filteredRoles" :key="role.name"
                            class="hover:bg-amber-50/30 transition-colors group">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shadow-sm border border-amber-200">
                                        <UserSquare class="w-5 h-5" />
                                    </div>
                                    <code
                                        class="px-2 py-1 bg-gray-100 text-amber-800 rounded text-xs font-mono font-bold border border-gray-200">
                                    {{ role.name }}
                                    </code>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <span
                                    class="text-sm text-gray-700 leading-relaxed">{{ role.description || 'Chưa có mô tả' }}</span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span :class="[
                                    'px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest border inline-block',
                                    role.scopeType === 'SYSTEM'
                                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                                        : 'bg-orange-50 text-orange-600 border-orange-100'
                                ]">
                                    {{ role.scopeType }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <div
                                    class="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-full py-1 px-3 w-fit mx-auto border border-gray-200">
                                    <Key class="w-3 h-3 text-amber-500" />
                                    {{ role.permissions ? role.permissions.length : 0 }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div
                                    class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        class="p-2 text-gray-400 hover:text-amber-600 hover:bg-white rounded-md border border-transparent hover:border-amber-100 transition-all shadow-sm"
                                        title="Sửa vai trò">
                                        <Edit3 class="w-4 h-4" />
                                    </button>
                                    <button
                                        class="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-md border border-transparent hover:border-blue-100 transition-all shadow-sm"
                                        title="Xem chi tiết">
                                        <Eye class="w-4 h-4" />
                                    </button>
                                    <button v-if="role.name !== 'SYSTEM_ADMIN'"
                                        class="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-md border border-transparent hover:border-red-100 transition-all shadow-sm"
                                        title="Xóa vai trò">
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Footer (Đồng bộ với Permissions) -->
            <div
                class="p-4 border-t border-gray-100 bg-gray-50/30 flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-400 uppercase tracking-widest font-medium">
                <div class="flex items-center gap-4">
                    <span>Tổng: {{ roles.length }} vai trò</span>
                    <span class="text-gray-300">|</span>
                    <span>Dữ liệu: Hệ thống quản trị nội bộ</span>
                </div>
                <div class="mt-2 md:mt-0 italic">
                    Cập nhật: {{ new Date().toLocaleDateString('vi-VN') }}
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
/* Đồng bộ font code và focus giống Permission page */
code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

input:focus {
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.05);
}

.group:hover .opacity-0 {
    opacity: 1;
}
</style>