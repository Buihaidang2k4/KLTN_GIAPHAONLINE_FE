<script setup>
import { ref, computed } from 'vue'
import { 
  Plus, Search, Edit2, Trash2, Settings, 
  MoreHorizontal, CheckCircle2, AlertCircle, 
  ArrowUpDown, Filter, Download, Copy,
  Check, X, Save
} from 'lucide-vue-next'

// Mock Data
const plans = ref([
  {
    id: 'PLN-001',
    name: 'Gói Cơ Bản',
    price: 0,
    billing: 'Vĩnh viễn',
    status: 'active',
    users: 850,
    updatedAt: '2023-10-15',
    features: ['50 thành viên', '1 Phả đồ cơ bản', 'Lưu trữ 500MB']
  },
  {
    id: 'PLN-002',
    name: 'Gói Chuyên Nghiệp',
    price: 199000,
    billing: 'Tháng',
    status: 'active',
    users: 420,
    updatedAt: '2023-11-02',
    features: ['Không giới hạn thành viên', 'Phả đồ 3D', 'Lưu trữ 10GB', 'Xuất file PDF']
  },
  {
    id: 'PLN-003',
    name: 'Gói Đại Gia Tộc',
    price: 499000,
    billing: 'Tháng',
    status: 'inactive',
    users: 15,
    updatedAt: '2023-11-20',
    features: ['Tất cả tính năng Pro', 'Subdomain riêng', 'Lưu trữ không giới hạn']
  }
])

const searchQuery = ref('')
const filteredPlans = computed(() => {
  return plans.value.filter(p => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

// UI States
const isModalOpen = ref(false)
const editingPlan = ref(null)

const handleEdit = (plan) => {
  editingPlan.value = JSON.parse(JSON.stringify(plan))
  isModalOpen.value = true
}

const toggleStatus = (plan) => {
  plan.status = plan.status === 'active' ? 'inactive' : 'active'
}

const formatCurrency = (val) => {
  if (val === 0) return 'Miễn phí'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val)
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
          <button class="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <Download :size="16" /> Xuất báo cáo
          </button>
          <button @click="isModalOpen = true; editingPlan = null" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 active:scale-95">
            <Plus :size="18" /> Tạo gói mới
          </button>
        </div>
      </div>

      <!-- Controls Row -->
      <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="relative w-full md:w-96">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Tìm kiếm theo tên gói..." 
            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm font-medium"
          />
        </div>
        
        <div class="flex items-center gap-2 w-full md:w-auto">
          <button class="flex-1 md:flex-none px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
            <Filter :size="16" /> Lọc
          </button>
          <button class="flex-1 md:flex-none px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
            <ArrowUpDown :size="16" /> Sắp xếp
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
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Tên Gói & Mô tả</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Giá Niêm Yết</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Chu Kỳ</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center">Người dùng</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Trạng thái</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="plan in filteredPlans" :key="plan.id" class="hover:bg-slate-50/80 transition-colors group">
                <td class="px-6 py-4">
                  <span class="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{{ plan.id }}</span>
                </td>
                <td class="px-6 py-4">
                  <div>
                    <p class="font-bold text-slate-800">{{ plan.name }}</p>
                    <p class="text-xs text-slate-400 truncate max-w-xs">{{ plan.features.join(', ') }}</p>
                  </div>
                </td>
                <td class="px-6 py-4 font-black text-slate-700">
                  {{ formatCurrency(plan.price) }}
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-lg">{{ plan.billing }}</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="text-sm font-bold text-slate-600">{{ plan.users.toLocaleString() }}</span>
                </td>
                <td class="px-6 py-4">
                  <button @click="toggleStatus(plan)" class="flex items-center gap-2 focus:outline-none">
                    <div 
                      class="w-10 h-5 rounded-full relative transition-colors duration-200" 
                      :class="plan.status === 'active' ? 'bg-green-500' : 'bg-slate-200'"
                    >
                      <div class="absolute w-4 h-4 bg-white rounded-full top-0.5 transition-transform duration-200" :class="plan.status === 'active' ? 'translate-x-5.5' : 'translate-x-0.5'"></div>
                    </div>
                    <span class="text-[10px] font-black uppercase tracking-tighter" :class="plan.status === 'active' ? 'text-green-600' : 'text-slate-400'">
                      {{ plan.status === 'active' ? 'Đang chạy' : 'Tạm dừng' }}
                    </span>
                  </button>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button @click="handleEdit(plan)" class="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-all" title="Chỉnh sửa">
                      <Edit2 :size="18" />
                    </button>
                    <button class="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all" title="Sao chép">
                      <Copy :size="18" />
                    </button>
                    <button class="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-all" title="Xóa">
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
          <p class="text-xs font-bold text-slate-400">Hiển thị {{ filteredPlans.length }} trên tổng số {{ plans.length }} gói</p>
          <div class="flex items-center gap-2">
            <button class="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-400 cursor-not-allowed">Trước</button>
            <button class="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-indigo-600 shadow-sm">1</button>
            <button class="px-3 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-white transition-all">Sau</button>
          </div>
        </div>
      </div>

      <!-- Detail/Edit Side Drawer (Simulated as Modal) -->
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex justify-end">
        <div @click="isModalOpen = false" class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
        <div class="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-slide-in">
          
          <!-- Drawer Header -->
          <div class="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 class="text-xl font-black text-slate-900">{{ editingPlan ? 'Cấu hình: ' + editingPlan.name : 'Thiết lập gói mới' }}</h2>
              <p class="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Cấu hình tham số hệ thống</p>
            </div>
            <button @click="isModalOpen = false" class="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <X :size="24" />
            </button>
          </div>

          <!-- Drawer Body -->
          <div class="flex-1 overflow-y-auto p-6 space-y-8">
            <!-- Basic Info Section -->
            <section class="space-y-4">
              <h3 class="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Settings :size="14" /> Thông tin cơ bản
              </h3>
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2 space-y-1.5">
                  <label class="text-xs font-bold text-slate-600">Tên gói dịch vụ</label>
                  <input type="text" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-medium" placeholder="Nhập tên gói..." />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-slate-600">Giá niêm yết (VNĐ)</label>
                  <input type="number" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold" />
                </div>
                <div class="space-y-1.5">
                  <label class="text-xs font-bold text-slate-600">Chu kỳ thanh toán</label>
                  <select class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all font-bold appearance-none">
                    <option>Tháng</option>
                    <option>Năm</option>
                    <option>Vĩnh viễn</option>
                  </select>
                </div>
              </div>
            </section>

            <!-- Feature Configuration Section -->
            <section class="space-y-4">
              <div class="flex items-center justify-between">
                <h3 class="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2">
                  <CheckCircle2 :size="14" /> Cấu hình quyền lợi
                </h3>
                <button class="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-colors">+ THÊM DÒNG</button>
              </div>
              
              <div class="space-y-3">
                <div v-for="i in 3" :key="i" class="flex gap-2 group">
                  <div class="flex-1 relative">
                    <input type="text" placeholder="Ví dụ: Tối đa 100 thành viên" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 text-sm font-medium" />
                  </div>
                  <button class="p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </div>
            </section>

            <!-- Advanced Modules Toggle -->
            <section class="space-y-4 pt-4 border-t border-slate-100">
               <h3 class="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <AlertCircle :size="14" /> Module nâng cao
              </h3>
              <div class="grid grid-cols-1 gap-3">
                <div v-for="mod in ['Xuất PDF/Excel', 'Quản lý quỹ', 'Số hóa tài liệu', 'Subdomain riêng']" :key="mod" class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span class="text-sm font-bold text-slate-700">{{ mod }}</span>
                  <button class="w-10 h-5 bg-slate-200 rounded-full relative transition-colors">
                    <div class="absolute w-4 h-4 bg-white rounded-full top-0.5 left-0.5"></div>
                  </button>
                </div>
              </div>
            </section>
          </div>

          <!-- Drawer Footer -->
          <div class="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
            <button @click="isModalOpen = false" class="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all">
              Đóng
            </button>
            <button class="flex-2 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 px-10">
              <Save :size="18" /> Lưu thay đổi
            </button>
          </div>
        </div>
      </div>

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