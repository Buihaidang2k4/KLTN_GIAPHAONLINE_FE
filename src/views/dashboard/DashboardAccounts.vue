<script setup>
import { ref } from 'vue'
import {
    Users,
    UserPlus,
    ShieldCheck,
    Edit3,
    Trash2,
    UserCheck,
    UserX,
    Search
} from 'lucide-vue-next'

const rolesList = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'USER']

const users = ref([
    {
        "accountId": 21,
        "email": "admin@gmail.com",
        "fullName": "ADMIN",
        "avatarPath": null,
        "avatarUrl": null,
        "accountStatus": "ACTIVE",
        "lockReason": null,
        "lockedAt": null,
        "createdAt": "2026-03-24T22:44:52.081714",
        "updatedAt": null,
        "roles": [{ "name": "ROLE_ADMIN", "scopeType": null, "description": null, "permissions": null }]
    },
    {
        "accountId": 22,
        "email": "user@gmail.com",
        "fullName": "USER",
        "avatarPath": null,
        "avatarUrl": null,
        "accountStatus": "ACTIVE",
        "lockReason": null,
        "lockedAt": null,
        "createdAt": "2026-03-25T00:08:50.979312",
        "updatedAt": null,
        "roles": [{ "name": "ROLE_USER", "scopeType": null, "description": null, "permissions": null }]
    },
    {
        "accountId": 26,
        "email": "dangbui651@gmail.com",
        "fullName": "anhdz",
        "avatarPath": null,
        "avatarUrl": null,
        "accountStatus": "ACTIVE",
        "lockReason": null,
        "lockedAt": null,
        "createdAt": "2026-03-25T22:26:17.253307",
        "updatedAt": "2026-03-25T22:28:00.690294",
        "roles": [{ "name": null, "scopeType": null, "description": null, "permissions": null }]
    }
])

// Hàm định dạng ngày tháng từ chuỗi ISO (2026-03-25T22:26:17...)
const formatDate = (isoString) => {
    if (!isoString) return 'N/A'
    const date = new Date(isoString)
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date)
}

// Hàm lấy tên Vai trò an toàn (tránh trường hợp mảng rỗng hoặc role name = null)
const getRoleName = (rolesArray) => {
    if (!rolesArray || rolesArray.length === 0) return 'Chưa phân quyền'
    const firstRole = rolesArray[0]
    if (!firstRole.name) return 'Chưa phân quyền'

    // Format lại tên role (Bỏ chữ ROLE_ nếu có cho đẹp)
    return firstRole.name.replace('ROLE_', '')
}
</script>

<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-amber-900 flex items-center gap-2">
                    <Users class="w-8 h-8" />
                    Quản lý Tài khoản & Phân quyền
                </h1>
                <p class="text-gray-500 mt-1">Quản lý nhân sự và quyền truy cập hệ thống</p>
            </div>

            <button
                class="mt-4 md:mt-0 flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-all shadow-md active:scale-95">
                <UserPlus class="w-5 h-5" />
                Thêm tài khoản mới
            </button>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
                <div class="text-amber-500 font-semibold mb-2 uppercase text-xs tracking-wider">Tổng thành viên</div>
                <div class="text-3xl font-bold text-gray-800">3</div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
                <div class="text-blue-500 font-semibold mb-2 uppercase text-xs tracking-wider">Tài khoản Admin</div>
                <div class="text-3xl font-bold text-gray-800">1</div>
            </div>
            <div class="bg-white p-6 rounded-xl shadow-sm border border-amber-100">
                <div class="text-green-500 font-semibold mb-2 uppercase text-xs tracking-wider">Đang hoạt động</div>
                <div class="text-3xl font-bold text-gray-800">100%</div>
            </div>
        </div>

        <!-- Main Table Container -->
        <div class="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden">
            <div
                class="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
                <div class="relative w-full md:w-96">
                    <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Tìm kiếm theo tên hoặc email..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" />
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-sm text-gray-500">Lọc theo vai trò:</span>
                    <select class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                        <option>Tất cả</option>
                        <option v-for="role in rolesList" :key="role" :value="role">{{ role }}</option>
                    </select>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="w-full text-left">
                    <thead>
                        <tr class="bg-amber-50/50 text-amber-900 text-sm font-semibold uppercase tracking-wider">
                            <th class="px-6 py-4">Thành viên</th>
                            <th class="px-6 py-4">Vai trò</th>
                            <th class="px-6 py-4">Trạng thái</th>
                            <th class="px-6 py-4">Ngày tạo</th>
                            <th class="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="user in users" :key="user.accountId" class="hover:bg-gray-50 transition-colors">
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <!-- Avatar Xử lý fallback nếu null -->
                                    <div v-if="user.avatarUrl"
                                        class="w-10 h-10 rounded-full overflow-hidden border border-amber-200">
                                        <img :src="user.avatarUrl" :alt="user.fullName"
                                            class="w-full h-full object-cover" />
                                    </div>
                                    <div v-else
                                        class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold uppercase">
                                        {{ user.fullName ? user.fullName.charAt(0) : '?' }}
                                    </div>
                                    <div>
                                        <div class="font-semibold text-gray-800">
                                            {{ user.fullName || 'Người dùng ẩn danh' }}
                                        </div>
                                        <div class="text-xs text-gray-500">{{ user.email }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <!-- Xử lý hiển thị Role từ mảng roles -->
                                <span :class="[
                                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border',
                                    getRoleName(user.roles) === 'Chưa phân quyền'
                                        ? 'bg-gray-50 text-gray-600 border-gray-200'
                                        : 'bg-blue-50 text-blue-700 border-blue-100'
                                ]">
                                    <ShieldCheck v-if="getRoleName(user.roles) !== 'Chưa phân quyền'" class="w-3 h-3" />
                                    {{ getRoleName(user.roles) }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <!-- Xử lý Trạng thái dựa trên accountStatus -->
                                <span :class="[
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                                    user.accountStatus === 'ACTIVE'
                                        ? 'bg-green-50 text-green-700 border-green-100'
                                        : 'bg-red-50 text-red-700 border-red-100'
                                ]">
                                    {{ user.accountStatus === 'ACTIVE' ? 'Hoạt động' : 'Đã khóa' }}
                                </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500">
                                <!-- Xử lý định dạng ngày tháng ISO -->
                                {{ formatDate(user.createdAt) }}
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center justify-center gap-2">
                                    <button
                                        class="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                        title="Phân quyền & Chỉnh sửa">
                                        <Edit3 class="w-5 h-5" />
                                    </button>
                                    <button :class="[
                                        'p-2 rounded-lg transition-all',
                                        user.accountStatus === 'ACTIVE'
                                            ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                                    ]" :title="user.accountStatus === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa'">
                                        <UserX v-if="user.accountStatus === 'ACTIVE'" class="w-5 h-5" />
                                        <UserCheck v-else class="w-5 h-5" />
                                    </button>
                                    <button
                                        class="p-2 text-gray-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                        title="Xóa vĩnh viễn">
                                        <Trash2 class="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div
                class="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-sm text-gray-500">
                <div>Hiển thị trang 1 trong tổng số 1 trang (3 tài khoản)</div>
                <div class="flex gap-2">
                    <button class="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50"
                        disabled>Trước</button>
                    <button
                        class="px-3 py-1 border border-gray-200 rounded hover:bg-white bg-white font-bold text-amber-700">1</button>
                    <button class="px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50"
                        disabled>Sau</button>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped></style>