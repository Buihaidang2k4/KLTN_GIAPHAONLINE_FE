<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
import {
    usePermissionsQuery,
    usePermissionsPagedQuery,
    useCreatePermissionMutation,
    useUpdatePermissionMutation,
    useDeletePermissionMutation
} from '@/hooks/queries/permission/usePermissions'
import type { PermissionRes, CreatePermissionReq, UpdatePermissionReq } from '@/types/auth/permission.types'
import { notify } from '@/utils/notify'
import CreatePermissionModal from '@/components/forms/permission/CreatePermissionModal.vue'
import UpdatePermissionModal from '@/components/forms/permission/UpdatePermissionModal.vue'
import { usePagination } from '@/composables/common/usePagination'
import AppPagination from '@/components/forms/common/AppPagination.vue'

// Modal State
const isCreateModalOpen = ref(false)
const isUpdateModalOpen = ref(false)
const selectedPermission = ref<PermissionRes | null>(null)

// Pagination & Filtering State
const searchQuery = ref('')
const filterScope = ref('ALL')
const sort = ref('name,asc')

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

// Fetch Paged Permissions from Backend
const { data: permissionsData, isLoading: isFetching } = usePermissionsPagedQuery(searchQuery, filterScope, params)

// Fetch All Permissions for accurate global statistics
const { data: allPermissionsData } = usePermissionsQuery()
const allPermissions = computed(() => {
    const d = allPermissionsData.value?.data as any
    if (Array.isArray(d)) return d
    if (d && typeof d === 'object' && 'items' in d && Array.isArray(d.items)) return d.items
    return []
})

const permissionsList = computed(() => permissionsData.value?.data?.items ?? [])
const totalElements = computed(() => permissionsData.value?.data?.totalElements ?? 0)

watch(
    () => permissionsData.value?.data?.totalPages,
    (total) => setTotalPages(total || 0),
    { immediate: true }
)

// Reset page when searching or changing filter scope
watch([searchQuery, filterScope], () => {
    pagination.page = 0
})

const filteredPermissions = computed(() => permissionsList.value)

const countScope = (type: string) => {
    return allPermissions.value.filter(p => p.scopeType === type).length
}

// Mutations
const createPermissionMutation = useCreatePermissionMutation()
const updatePermissionMutation = useUpdatePermissionMutation()
const deletePermissionMutation = useDeletePermissionMutation()

const handleCreate = async (data: CreatePermissionReq) => {
    createPermissionMutation.mutate(data, {
        onSuccess: () => {
            notify.success('Đã thêm quyền mới thành công', 'Thành công')
            isCreateModalOpen.value = false
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || 'Có lỗi xảy ra khi thêm mới'
            notify.error(msg, 'Lỗi')
        }
    })
}

const handleUpdate = async (data: UpdatePermissionReq) => {
    if (!selectedPermission.value) return
    updatePermissionMutation.mutate({
        permissionName: selectedPermission.value.name,
        data
    }, {
        onSuccess: () => {
            notify.success('Cập nhật quyền thành công', 'Thành công')
            isUpdateModalOpen.value = false
            selectedPermission.value = null
        },
        onError: (err: any) => {
            const msg = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật'
            notify.error(msg, 'Lỗi')
        }
    })
}

const handleDelete = async (perm: PermissionRes) => {
    if (confirm(`Bạn có chắc chắn muốn xóa quyền "${perm.name}" không? Hành động này không thể hoàn tác!`)) {
        deletePermissionMutation.mutate(perm.name, {
            onSuccess: () => {
                notify.success('Xóa quyền thành công', 'Thành công')
            },
            onError: () => {
                notify.error("Thông báo", 'Quyền này đang được sử dụng, không thể xóa')
            }
        })
    }
}

const openEditModal = (perm: PermissionRes) => {
    selectedPermission.value = perm
    isUpdateModalOpen.value = true
}
</script>

<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
                <h1 class="text-2xl font-bold text-amber-900 flex items-center gap-2">
                    <KeyRound class="w-8 h-8 text-amber-600" />
                    Danh mục Quyền hạn
                </h1>
                <p class="text-gray-500 mt-1">Danh sách các hành động thô được định nghĩa trong hệ thống</p>
            </div>

            <div class="flex gap-3 mt-4 md:mt-0">
                <button @click="isCreateModalOpen = true"
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
                <div class="text-2xl font-bold text-gray-800">
                    <span v-if="isFetching"
                        class="inline-block w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                    <span v-else>{{ totalElements }}</span>
                </div>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-blue-500 font-semibold mb-1 uppercase text-[10px] tracking-wider">Quyền Hệ thống</div>
                <div class="text-2xl font-bold text-gray-800">
                    <span v-if="isFetching"
                        class="inline-block w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
                    <span v-else>{{ countScope('SYSTEM') }}</span>
                </div>
            </div>
            <div class="bg-white p-5 rounded-xl shadow-sm border border-amber-100">
                <div class="text-orange-500 font-semibold mb-1 uppercase text-[10px] tracking-wider">Quyền Dòng họ</div>
                <div class="text-2xl font-bold text-gray-800">
                    <span v-if="isFetching"
                        class="inline-block w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></span>
                    <span v-else>{{ countScope('FAMILY') }}</span>
                </div>
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
                                <span
                                    class="text-sm text-gray-700 leading-relaxed">{{ perm.description || 'Không có mô tả' }}</span>
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
                                    <button @click="openEditModal(perm)"
                                        class="p-2 text-gray-400 hover:text-amber-600 hover:bg-white rounded-md border border-transparent hover:border-amber-100 transition-all shadow-sm">
                                        <Edit3 class="w-4 h-4" />
                                    </button>
                                    <button @click="handleDelete(perm)"
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

            <!-- Pagination Footer -->
            <div
                class="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p class="text-xs font-medium text-gray-500 italic">
                    Hiển thị từ {{ totalElements === 0 ? 0 : pagination.page * pagination.size + 1 }} đến
                    {{ Math.min((pagination.page + 1) * pagination.size, totalElements) }} trong tổng số
                    {{ totalElements }} bản ghi
                </p>
                <AppPagination :page="currentPage" :total-pages="pagination.totalPages" :has-next="hasNextPage"
                    :has-prev="hasPrevPage" @next="nextPage" @prev="prevPage" class="!mt-0" />
            </div>
        </div>
    </div>

    <!-- Modals -->
    <CreatePermissionModal :show="isCreateModalOpen" :is-loading="createPermissionMutation.isPending.value"
        @create="handleCreate" @close="isCreateModalOpen = false" />

    <UpdatePermissionModal :show="isUpdateModalOpen" :permission="selectedPermission"
        :is-loading="updatePermissionMutation.isPending.value" @update="handleUpdate"
        @close="isUpdateModalOpen = false" />
</template>

<style scoped>
/* Hiệu ứng focus nhẹ cho input */
input:focus {
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.05);
}
</style>