<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Plus, Search, Edit2, Trash2,
  Filter
} from 'lucide-vue-next'
import {
  useSubscriptionPlansQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  useToggleActiveSubscriptionPlanMutation
} from "@/hooks/queries/subscription_plan/useSubscriptionPlan"
import { usePagination } from '@/composables/common/usePagination'
import AppPagination from '@/components/forms/common/AppPagination.vue'
import CreateSubscriptionPlanModal from '@/components/forms/subscription_plan/CreateSubscriptionPlanModal.vue'
import UpdateSubscriptionPlanModal from '@/components/forms/subscription_plan/UpdateSubscriptionPlanModal.vue'
import type { SubscriptionPlanReq, SubscriptionPlanRes } from '@/types/family/subscription.types'
import { formatMoney } from '@/utils/format-money'
import { formatDate } from '@/utils/format-date'
import { notify } from '@/utils/notify'

// Search and Filter States
const keyword = ref('')
const isActive = ref<boolean | undefined>(undefined)

// usePagination
const {
  pagination,
  currentPage,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
  setTotalPages
} = usePagination(10, 0)

const queryParams = computed(() => ({
  keyword: keyword.value,
  isActive: isActive.value,
  page: pagination.page,
  size: pagination.size,
  sort: 'createdAt,desc'
}))

// Fetch Data
const { data: plansData, isLoading } = useSubscriptionPlansQuery(queryParams);
console.log(plansData.value);

const plans = computed<SubscriptionPlanRes[]>(() => plansData.value?.data?.items || [])
const totalElements = computed(() => plansData.value?.data?.totalElements || 0)

watch(
  () => plansData.value?.data?.totalPages,
  (total) => setTotalPages(total || 0),
  { immediate: true }
)

// Reset page when search or filters change
watch([keyword, isActive], () => {
  pagination.page = 0
})

// UI States for Modals
const isCreateModalOpen = ref(false)
const isUpdateModalOpen = ref(false)
const selectedPlan = ref<SubscriptionPlanRes | null>(null)

// Mutations
const createMutation = useCreateSubscriptionPlanMutation()
const updateMutation = useUpdateSubscriptionPlanMutation()
const deleteMutation = useDeleteSubscriptionPlanMutation()
const toggleActiveMutation = useToggleActiveSubscriptionPlanMutation()

const handleEdit = (plan: SubscriptionPlanRes) => {
  selectedPlan.value = plan
  isUpdateModalOpen.value = true
}

const handleCreateNew = () => {
  isCreateModalOpen.value = true
}

const handleCreatePlan = async (data: SubscriptionPlanReq) => {
  try {
    await createMutation.mutateAsync(data,
      {
        onSuccess: () => notify.success('Thông báo', 'Thêm gói thành công'),
        onError: (error) => notify.error('Thông báo', 'Mã gói đã tồn tại!')
      }
    )

    isCreateModalOpen.value = false
  } catch (error) {
    console.error('Lỗi khi tạo gói:', error)
  }
}

const handleUpdatePlan = async ({ planId, data }: { planId: number; data: SubscriptionPlanReq }) => {
  try {
    await updateMutation.mutateAsync({ planId, data },
      {
        onSuccess: () => notify.success('Thông báo', 'Cập nhật gói thành công'),
        onError: (error) => notify.error('Thông báo', error.message)
      })
    isUpdateModalOpen.value = false
    selectedPlan.value = null
  } catch (error) {
    console.error('Lỗi khi cập nhật gói:', error)
  }
}

const toggleStatus = async (plan: SubscriptionPlanRes) => {
  try {
    await toggleActiveMutation.mutateAsync(plan.subscriptionPlanId, {
      onSuccess: () => notify.success('Thông báo', 'Đổi trạng thái gói thành công'),
      onError: (error) => notify.error('Thông báo', error.message || 'Lỗi khi đổi trạng thái')
    })
  } catch (error) {
    console.error('Lỗi khi đổi trạng thái gói:', error)
  }
}

const handleDelete = async (plan: SubscriptionPlanRes) => {
  if (confirm(`Bạn có chắc chắn muốn xóa gói "${plan.namePlan}" không?`)) {
    try {
      await deleteMutation.mutateAsync(plan.subscriptionPlanId, {
        onSuccess: () => notify.success('Thông báo', 'Xóa gói thành công'),
        onError: (error) => notify.error('Thông báo', error.message || 'Gói này đã được sử dụng không thể xóa')
      })
    } catch (error) {
      console.error('Lỗi khi xóa gói:', error)
    }
  }
}

const toggleFilterActive = () => {
  if (isActive.value === undefined) {
    isActive.value = true
  } else if (isActive.value === true) {
    isActive.value = false
  } else {
    isActive.value = undefined
  }
}

</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] p-6 font-sans">
    <div class="max-w-[1400px] mx-auto">

      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <nav class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            <span>Hệ thống</span>
            <span>/</span>
            <span class="text-indigo-600">Cấu hình thanh toán</span>
          </nav>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Danh sách Gói Dịch Vụ</h1>
          <p class="text-slate-500 mt-1">Quản lý, thiết lập giá và phân quyền tính năng cho người dùng.</p>
        </div>

        <div class="flex items-center gap-3">
          <button @click="handleCreateNew"
            class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 active:scale-95">
            <Plus :size="18" /> Tạo gói mới
          </button>
        </div>
      </div>

      <!-- Controls Row -->
      <div
        class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="relative w-full md:w-96">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
          <input v-model="keyword" @input="currentPage = 0" type="text" placeholder="Tìm kiếm theo tên hoặc mã gói..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm font-medium" />
        </div>

        <div class="flex items-center gap-2 w-full md:w-auto">
          <button @click="toggleFilterActive"
            class="flex-1 md:flex-none px-4 py-2.5 border rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
            :class="isActive === undefined ? 'border-slate-200 text-slate-600 hover:bg-slate-50' : 'border-indigo-600 bg-indigo-50 text-indigo-600'">
            <Filter :size="16" /> Lọc: {{ isActive === undefined ? 'Tất cả' : (isActive ? 'Đang chạy' : 'Tạm dừng') }}
          </button>
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50/50 border-b border-slate-200">
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Mã Gói</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Tên Gói & Mô tả
                </th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Giá Niêm Yết</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Chu Kỳ</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Giới
                  Hạn Module</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Ngày Tạo</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-right">Thao tác
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-if="isLoading">
                <td colspan="8" class="px-6 py-10 text-center text-slate-400">
                  <div class="flex items-center justify-center gap-2">
                    <div class="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin">
                    </div>
                    Đang tải dữ liệu...
                  </div>
                </td>
              </tr>
              <tr v-else-if="plans.length === 0">
                <td colspan="8" class="px-6 py-10 text-center text-slate-400">
                  Không tìm thấy gói dịch vụ nào.
                </td>
              </tr>
              <tr v-else v-for="plan in plans" :key="plan.subscriptionPlanId"
                class="hover:bg-slate-50/80 transition-colors group">
                <td class="px-6 py-4">
                  <span
                    class="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{{ plan.code }}</span>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <p class="font-bold text-slate-800">{{ plan.namePlan }}</p>
                    <p class="text-xs text-slate-400 truncate max-w-xs">{{ plan.description || 'Không có mô tả' }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 font-black text-slate-700">
                  {{ formatMoney(plan.price, 'VND') }}
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">
                    {{ plan.durationMonth }} tháng
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-xs text-slate-600 space-y-0.5 text-center">
                    <div>Thành viên: <span class="font-bold text-slate-800">{{ plan.maxPerson }}</span></div>
                    <div>Dung lượng: <span class="font-bold text-slate-800">{{ plan.maxStorageMb }}MB</span></div>
                    <div>Admin tối đa: <span class="font-bold text-slate-800">{{ plan.maxAdmin }}</span></div>
                  </div>
                </td>
                <td class="px-6 py-4 text-xs font-bold text-slate-600">
                  {{ formatDate(plan.createdAt) }}
                </td>
                <td class="px-6 py-4">
                  <button @click="toggleStatus(plan)" class="flex items-center gap-2 focus:outline-none">
                    <div class="w-10 h-5 rounded-full relative transition-colors duration-200"
                      :class="plan.isActive ? 'bg-green-500' : 'bg-slate-200'">
                      <div class="absolute w-4 h-4 bg-white rounded-full top-0.5 transition-transform duration-200"
                        :class="plan.isActive ? 'translate-x-5.5' : 'translate-x-0.5'"></div>
                    </div>
                    <span class="text-[10px] font-black uppercase tracking-tighter"
                      :class="plan.isActive ? 'text-green-600' : 'text-slate-400'">
                      {{ plan.isActive ? 'Đang chạy' : 'Tạm dừng' }}
                    </span>
                  </button>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="handleEdit(plan)"
                      class="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-all"
                      title="Chỉnh sửa">
                      <Edit2 :size="18" />
                    </button>
                    <button @click="handleDelete(plan)"
                      class="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                      title="Xóa">
                      <Trash2 :size="18" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="px-6 py-4 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between">
          <p class="text-xs font-bold text-slate-400">
            Hiển thị từ {{ totalElements === 0 ? 0 : pagination.page * pagination.size + 1 }} đến
            {{ Math.min((pagination.page + 1) * pagination.size, totalElements) }} trong tổng số
            {{ totalElements }} gói
          </p>
          <AppPagination :page="currentPage" :total-pages="pagination.totalPages" :has-next="hasNextPage"
            :has-prev="hasPrevPage" @next="nextPage" @prev="prevPage" class="!mt-0" />
        </div>
      </div>

      <!-- Modals -->
      <CreateSubscriptionPlanModal :show="isCreateModalOpen" :is-loading="createMutation.isPending.value"
        @create="handleCreatePlan" @close="isCreateModalOpen = false" />

      <UpdateSubscriptionPlanModal :show="isUpdateModalOpen" :plan="selectedPlan"
        :is-loading="updateMutation.isPending.value" @update="handleUpdatePlan" @close="isUpdateModalOpen = false" />

    </div>
  </div>
</template>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
}

/* Chrome-like minimalist scrollbar */
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}

select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25em;
}
</style>