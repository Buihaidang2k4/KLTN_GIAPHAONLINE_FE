<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
    Users,
    UserPlus,
    ShieldCheck,
    Edit3,
    Trash2,
    UserCheck,
    UserX,
    Search,
    Phone,
    ShieldAlert,
    Clock,
    Lock
} from 'lucide-vue-next'
import { useAccountsQuery, useChangeStatusLockMutation, useSoftDeleteAccountMutation } from '@/hooks/queries/account/useAccount'
import UpdateStatusLockModal from '@/components/forms/account/UpdateStatusLockModal.vue'
import UpdateAccountModal from '@/components/forms/account/UpdateAccountModal.vue'
import CreateAccountModal from '@/components/forms/account/CreateAccountModal.vue'
import { notify } from '@/utils/notify'
import { usePagination } from '@/composables/common/usePagination'
import AppPagination from '@/components/forms/common/AppPagination.vue'
import type { AccountRes } from '@/types/account/account.types'

const searchQuery = ref('')
const filterStatus = ref('ALL') // ACTIVE, LOCKED, or ALL
const sort = ref('createdAt,desc')

const {
    pagination,
    currentPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    setTotalPages
} = usePagination(10, 0)

const params = computed(() => ({
    page: pagination.page,
    size: pagination.size,
    sort: sort.value
}))

// Fetch Paged Accounts from Backend
const { data: accountsData, isLoading: isFetching } = useAccountsQuery(searchQuery, filterStatus, params)


const accountsList = computed(() => accountsData.value?.data?.items ?? [])
const totalElements = computed(() => accountsData.value?.data?.totalElements ?? 0)

watch(
    () => accountsData.value?.data?.totalPages,
    (total) => setTotalPages(total || 0),
    { immediate: true }
)

// Reset page when searching or changing filter status
watch([searchQuery, filterStatus], () => {
    pagination.page = 0
})

// Fetch All Accounts for accurate global stats
const { data: allAccountsData } = useAccountsQuery('', 'ALL', computed(() => ({ page: 0, size: 1000, sort: 'createdAt,desc' })))
const allAccounts = computed(() => allAccountsData.value?.data?.items ?? [])
const globalTotal = computed(() => allAccounts.value.length)
const activeCount = computed(() => allAccounts.value.filter(a => a.accountStatus === 'ACTIVE').length)
const lockedCount = computed(() => allAccounts.value.filter(a => a.accountStatus === 'LOCKED').length)
const pendingCount = computed(() => allAccounts.value.filter(a => a.accountStatus === 'PENDING').length)
const deletedCount = computed(() => allAccounts.value.filter(a => a.accountStatus === 'DELETED').length)

// Format ISO date string nicely
const formatDate = (isoString: string) => {
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

const getRoleBadgeClass = (roleName: string) => {
    if (roleName === 'SYSTEM_ADMIN') return 'bg-blue-50 text-blue-700 border-blue-100'
    if (roleName === 'FAMILY_ADMIN') return 'bg-amber-50 text-amber-700 border-amber-100'
    return 'bg-gray-50 text-gray-600 border-gray-200'
}

const getAccountScope = (roles: any[]) => {
    if (!roles || roles.length === 0) return 'UNKNOWN'
    const hasSystem = roles.some(r => r.scopeType === 'SYSTEM')
    if (hasSystem) return 'SYSTEM'
    const hasFamily = roles.some(r => r.scopeType === 'FAMILY')
    if (hasFamily) return 'FAMILY'
    return 'UNKNOWN'
}

const isStatusModalOpen = ref(false)
const selectedAccount = ref<AccountRes | null>(null)

const changeStatusMutation = useChangeStatusLockMutation()

const openStatusModal = (account: AccountRes) => {
    selectedAccount.value = account
    isStatusModalOpen.value = true
}

const handleUpdateStatus = (data: { accountStatus: any; lockReason: string | null }) => {
    if (!selectedAccount.value) return
    changeStatusMutation.mutate({
        accountId: selectedAccount.value.accountId,
        data: {
            accountStatus: data.accountStatus,
            lockReason: data.lockReason
        }
    }, {
        onSuccess: () => {
            isStatusModalOpen.value = false
            notify.success("Thông báo", "Cập nhật trạng thái tài khoản thành công")
        },
        onError: () => {
            notify.error("Thông báo", "Cập nhật trạng thái tài khoản thất bại!")
        }
    })
}

const softDeleteMutation = useSoftDeleteAccountMutation()

const handleDeleteAccount = (account: AccountRes) => {
    if (confirm(`Bạn có chắc chắn muốn xóa tài khoản "${account.fullName || account.email}" không?`)) {
        softDeleteMutation.mutate(account.accountId, {
            onSuccess: () => {
                notify.success("Thông báo", "Xóa tài khoản thành công")
            },
            onError: () => {
                notify.error("Thông báo", "Xóa tài khoản thất bại!")
            }
        })
    }
}
const isEditModalOpen = ref(false)
const editingAccount = ref<AccountRes | null>(null)

const openEditModal = (account: AccountRes) => {
    editingAccount.value = account
    isEditModalOpen.value = true
}

const handleEditSuccess = () => {
    isEditModalOpen.value = false
    editingAccount.value = null
}

const isCreateModalOpen = ref(false)

const openCreateModal = () => {
    isCreateModalOpen.value = true
}

const handleCreateSuccess = () => {
    isCreateModalOpen.value = false
}
</script>

<template>
    <div class="min-h-screen bg-gray-50 p-6">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-amber-900 flex items-center gap-2">
                    <Users class="w-8 h-8 text-amber-600" />
                    Quản lý Tài khoản & Phân quyền
                </h1>
                <p class="text-gray-500 mt-1 text-sm">Quản lý toàn bộ nhân sự và phân quyền truy cập hệ thống gia phả
                </p>
            </div>

            <button @click="openCreateModal"
                class="mt-4 md:mt-0 flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-all shadow-md active:scale-95">
                <UserPlus class="w-5 h-5" />
                Thêm tài khoản mới
            </button>
        </div>

        <!-- Stats Cards -->
        <div class="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-amber-500 font-semibold mb-2 uppercase text-[10px] tracking-wider">Tổng tài khoản</div>
                <div class="text-2xl font-bold text-gray-800">
                    <span v-if="isFetching"
                        class="inline-block w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                    <span v-else>{{ globalTotal }}</span>
                </div>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-green-500 font-semibold mb-2 uppercase text-[10px] tracking-wider">Đang hoạt động</div>
                <div class="text-2xl font-bold text-gray-800">
                    <span v-if="isFetching"
                        class="inline-block w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></span>
                    <span v-else>{{ activeCount }}</span>
                </div>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-red-500 font-semibold mb-2 uppercase text-[10px] tracking-wider">Đang khóa</div>
                <div class="text-2xl font-bold text-gray-800">
                    <span v-if="isFetching"
                        class="inline-block w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
                    <span v-else>{{ lockedCount }}</span>
                </div>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-blue-500 font-semibold mb-2 uppercase text-[10px] tracking-wider">Chờ kích hoạt</div>
                <div class="text-2xl font-bold text-gray-800">
                    <span v-if="isFetching"
                        class="inline-block w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                    <span v-else>{{ pendingCount }}</span>
                </div>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-gray-500 font-semibold mb-2 uppercase text-[10px] tracking-wider">Đã xóa</div>
                <div class="text-2xl font-bold text-gray-800">
                    <span v-if="isFetching"
                        class="inline-block w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                    <span v-else>{{ deletedCount }}</span>
                </div>
            </div>
        </div>

        <!-- Main Table Container -->
        <div class="overflow-hidden rounded-xl border border-amber-100 bg-white shadow-sm">
            <div
                class="flex flex-col gap-4 border-b border-gray-100 bg-white p-4 md:flex-row md:items-center md:justify-between">
                <div class="relative w-full md:w-80 lg:w-96">
                    <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input v-model="searchQuery" type="text" placeholder="Tìm kiếm theo tên hoặc email..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm" />
                </div>
                <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                    <span class="text-sm text-gray-500">Lọc theo trạng thái:</span>
                    <select v-model="filterStatus"
                        class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
                        <option value="ALL">Tất cả</option>
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="LOCKED">Đã khóa</option>
                        <option value="PENDING">Chờ kích hoạt</option>
                        <option value="DELETED">Đã xóa</option>
                    </select>
                </div>
            </div>

            <div class="overflow-x-auto scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-gray-100">
                <table class="min-w-275 w-full text-left">
                    <thead>
                        <tr class="bg-amber-50/50 text-amber-900 text-xs font-bold uppercase tracking-widest">
                            <th class="px-6 py-4 text-center w-12">ID</th>
                            <th class="px-6 py-4">Thành viên</th>
                            <th class="px-6 py-4">Số điện thoại</th>
                            <th class="px-6 py-4">Vai trò</th>
                            <th class="px-6 py-4 text-center">Phạm vi (Scope)</th>
                            <th class="px-6 py-4">Trạng thái</th>
                            <th class="px-6 py-4">Ngày tạo</th>
                            <th class="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        <tr v-for="user in accountsList" :key="user.accountId"
                            class="hover:bg-amber-50/30 transition-colors group">
                            <td class="px-6 py-4 text-center font-mono font-bold text-gray-400 text-xs">
                                #{{ user.accountId }}
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <!-- Avatar fallback if null -->
                                    <div v-if="user.avatarUrl"
                                        class="w-10 h-10 rounded-full overflow-hidden border border-amber-200 shadow-sm shrink-0">
                                        <img :src="user.avatarUrl" :alt="user.fullName"
                                            class="w-full h-full object-cover" />
                                    </div>
                                    <div v-else
                                        class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold uppercase shadow-sm border border-amber-200 shrink-0 text-sm">
                                        {{ user.fullName ? user.fullName.charAt(0) : '?' }}
                                    </div>
                                    <div class="min-w-0">
                                        <div class="font-bold text-gray-800 truncate text-sm">
                                            {{ user.fullName || 'Người dùng ẩn danh' }}
                                        </div>
                                        <div class="text-xs text-gray-400 truncate">{{ user.email }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div v-if="user.phoneNumber"
                                    class="flex items-center gap-1.5 text-xs text-gray-600 font-semibold font-mono">
                                    <Phone class="w-3.5 h-3.5 text-gray-400" />
                                    {{ user.phoneNumber }}
                                </div>
                                <span v-else class="text-xs text-gray-400 font-medium">___</span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-wrap gap-1">
                                    <span v-for="role in user.roles" :key="role.name" :class="[
                                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider',
                                        getRoleBadgeClass(role.name)
                                    ]">
                                        <ShieldCheck class="w-3 h-3 text-amber-600" />
                                        {{ role.name ? role.name.replace('ROLE_', '') : 'Chưa phân vai trò' }}
                                    </span>
                                    <span v-if="!user.roles || user.roles.length === 0"
                                        class="text-xs text-gray-400 font-medium">
                                        Chưa phân vai trò
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-4 text-center">
                                <span :class="[
                                    'inline-flex items-center px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border',
                                    getAccountScope(user.roles) === 'SYSTEM'
                                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                                        : getAccountScope(user.roles) === 'FAMILY'
                                            ? 'bg-orange-50 text-orange-600 border-orange-100'
                                            : 'bg-gray-50 text-gray-500 border-gray-200'
                                ]">
                                    {{ getAccountScope(user.roles) }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex flex-col gap-0.5">
                                    <span :class="[
                                        'inline-flex items-center px-2.5 py-0.5 whitespace-nowrap rounded-full text-[10px] font-black border uppercase tracking-widest w-fit',
                                        user.accountStatus === 'ACTIVE'
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : user.accountStatus === 'LOCKED'
                                                ? 'bg-red-50 text-red-700 border-red-100'
                                                : user.accountStatus === 'PENDING'
                                                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                    : 'bg-rose-50 text-rose-700 border-rose-100'
                                    ]">
                                        {{
                                            user.accountStatus === 'ACTIVE' ? 'Hoạt động' :
                                                user.accountStatus === 'LOCKED' ? 'Đã khóa' :
                                                    user.accountStatus === 'PENDING' ? 'Chờ kích hoạt' : 'Đã xóa'
                                        }}
                                    </span>
                                    <span v-if="user.accountStatus === 'LOCKED' && user.lockReason"
                                        class="text-[9px] text-red-500 italic max-w-37.5 truncate flex items-center gap-1 font-semibold"
                                        :title="user.lockReason">
                                        <Lock class="w-2.5 h-2.5" />
                                        Lý do: {{ user.lockReason }}
                                    </span>
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                                    <Clock class="w-3.5 h-3.5 text-gray-400" />
                                    {{ formatDate(user.createdAt) }}
                                </div>
                            </td>
                            <td class="px-6 py-4">
                                <div v-if="user.accountStatus !== 'DELETED'"
                                    class="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button @click="openEditModal(user)"
                                        class="p-2 text-gray-400 hover:text-amber-600 hover:bg-white rounded-md border border-transparent hover:border-amber-100 transition-all shadow-sm"
                                        title="Phân quyền & Chỉnh sửa">
                                        <Edit3 class="w-4 h-4" />
                                    </button>
                                    <button @click="openStatusModal(user)" :class="[
                                        'p-2 rounded-md border border-transparent transition-all shadow-sm',
                                        user.accountStatus === 'ACTIVE'
                                            ? 'text-gray-400 hover:text-red-600 hover:bg-white hover:border-red-100'
                                            : 'text-gray-400 hover:text-green-600 hover:bg-white hover:border-green-100'
                                    ]" :title="user.accountStatus === 'ACTIVE' ? 'Khóa tài khoản' : 'Mở khóa'">
                                        <UserX v-if="user.accountStatus === 'ACTIVE'" class="w-4 h-4" />
                                        <UserCheck v-else class="w-4 h-4" />
                                    </button>
                                    <button @click="handleDeleteAccount(user)"
                                        class="p-2 text-gray-400 hover:text-red-700 hover:bg-white rounded-md border border-transparent hover:border-red-100 transition-all shadow-sm"
                                        title="Xóa tạm thời">
                                        <Trash2 class="w-4 h-4" />
                                    </button>
                                </div>
                                <span v-else
                                    class="text-xs text-rose-500 font-bold italic flex items-center justify-center gap-1">
                                    Vô hiệu hóa
                                </span>
                            </td>
                        </tr>
                        <tr v-if="accountsList.length === 0">
                            <td colspan="8" class="px-6 py-20 text-center text-gray-400">
                                <div class="flex flex-col items-center gap-2">
                                    <ShieldAlert class="w-12 h-12 text-gray-200" />
                                    <p class="font-semibold text-sm">Không tìm thấy tài khoản nào phù hợp</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination Footer -->
            <div
                class="flex flex-col items-center justify-between gap-4 border-t border-gray-100 bg-gray-50 p-4 sm:flex-row">
                <p class="text-xs font-medium text-gray-500 italic">
                    Hiển thị từ {{ totalElements === 0 ? 0 : pagination.page * pagination.size + 1 }} đến
                    {{ Math.min((pagination.page + 1) * pagination.size, totalElements) }} trong tổng số
                    {{ totalElements }} tài khoản
                </p>
                <AppPagination :page="currentPage" :total-pages="pagination.totalPages" :has-next="hasNextPage"
                    :has-prev="hasPrevPage" @next="nextPage" @prev="prevPage" class="mt-0!" />
            </div>
        </div>

        <!-- Modals -->
        <UpdateStatusLockModal :show="isStatusModalOpen" :account="selectedAccount"
            :is-loading="changeStatusMutation.isPending.value" @update="handleUpdateStatus"
            @close="isStatusModalOpen = false" />

        <UpdateAccountModal :show="isEditModalOpen" :account="editingAccount" @success="handleEditSuccess"
            @close="isEditModalOpen = false" />

        <CreateAccountModal :show="isCreateModalOpen" @success="handleCreateSuccess"
            @close="isCreateModalOpen = false" />
    </div>
</template>

<style scoped>
input:focus {
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.05);
}

.group:hover .opacity-0 {
    opacity: 1;
}
</style>