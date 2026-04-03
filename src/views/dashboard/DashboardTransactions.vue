<script setup lang="ts">
import { ref } from 'vue'
import { 
  Search, Filter, Download, ExternalLink, 
  CheckCircle2, Clock, ArrowUpRight,
  CreditCard, Calendar, RefreshCcw, Eye
} from 'lucide-vue-next'

interface Transaction {
  id: string;
  txnRef: string;
  amount: number;
  bankCode: string;
  content: string;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  createdAt: string;
  customer: string;
}

const transactions = ref<Transaction[]>([
  {
    id: '1',
    txnRef: 'VNP12345678',
    amount: 199000,
    bankCode: 'NCB',
    content: 'Thanh toan Goi Chuyen Nghiep - User: dung_phan',
    status: 'success',
    createdAt: '2024-03-20 14:30:22',
    customer: 'Phan Văn Dũng'
  },
  {
    id: '2',
    txnRef: 'VNP12345679',
    amount: 499000,
    bankCode: 'VNPAYQR',
    content: 'Nâng cấp tài khoản - User: hoang_nguyen',
    status: 'pending',
    createdAt: '2024-03-20 15:10:05',
    customer: 'Nguyễn Văn Hoàng'
  },
  {
    id: '3',
    txnRef: 'VNP12345680',
    amount: 199000,
    bankCode: 'VISA',
    content: 'Thanh toan Goi Chuyen Nghiep - User: minh_tran',
    status: 'failed',
    createdAt: '2024-03-19 09:20:15',
    customer: 'Trần Bình Minh'
  },
  {
    id: '4',
    txnRef: 'VNP12345681',
    amount: 1500000,
    bankCode: 'MBBANK',
    content: 'Mua Credit hệ thống - User: gia_toc_le',
    status: 'refunded',
    createdAt: '2024-03-18 11:45:30',
    customer: 'Lê Gia Tộc'
  }
])

const searchQuery = ref('')
const selectedStatus = ref('all')

const stats = [
  { label: 'Tổng doanh thu (Tháng)', value: '15,420,000đ', icon: ArrowUpRight, color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Giao dịch thành công', value: '142', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Đang chờ xử lý', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Yêu cầu hoàn tiền', value: '3', icon: RefreshCcw, color: 'text-red-600', bg: 'bg-red-50' },
]

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'success': return 'bg-green-50 text-green-700 border-green-200'
    case 'failed': return 'bg-red-50 text-red-700 border-red-200'
    case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'refunded': return 'bg-slate-50 text-slate-700 border-slate-200'
    default: return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'success': return 'Thành công'
    case 'failed': return 'Thất bại'
    case 'pending': return 'Chờ xử lý'
    case 'refunded': return 'Đã hoàn tiền'
    default: return status
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}
</script>

<template>
  <div class="min-h-screen bg-[#F1F5F9] p-4 md:p-8 font-sans">
    <div class="max-w-7xl mx-auto">
      
      <!-- Header Area -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 class="text-2xl font-black text-slate-900 flex items-center gap-3">
            <div class="p-2 bg-indigo-600 rounded-lg">
              <CreditCard class="text-white" :size="24" />
            </div>
            Lịch sử giao dịch VNPay
          </h1>
          <p class="text-slate-500 text-sm mt-1 font-medium">Theo dõi và đối soát các dòng tiền thanh toán qua cổng VNPay.</p>
        </div>
        
        <div class="flex items-center gap-3">
          <button class="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar :size="18" /> Chọn khoảng ngày
          </button>
          <button class="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Download :size="18" /> Xuất Excel
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="stat in stats" :key="stat.label" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{{ stat.label }}</p>
              <h3 class="text-xl font-black text-slate-800">{{ stat.value }}</h3>
            </div>
            <div :class="['p-2 rounded-xl', stat.bg]">
              <component :is="stat.icon" :class="stat.color" :size="20" />
            </div>
          </div>
        </div>
      </div>

      <!-- Main Table Card -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        <!-- Filter Header -->
        <div class="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-white">
          <div class="relative w-full md:w-96">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Tìm theo mã TxnRef hoặc tên khách hàng..." 
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          
          <div class="flex items-center gap-3 w-full md:w-auto">
            <select v-model="selectedStatus" class="flex-1 md:w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 outline-none">
              <option value="all">Tất cả trạng thái</option>
              <option value="success">Thành công</option>
              <option value="pending">Đang chờ</option>
              <option value="failed">Thất bại</option>
            </select>
            <button class="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400">
              <Filter :size="18" />
            </button>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50/50">
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Thời gian</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Mã TxnRef</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Khách hàng</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Số tiền</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Ngân hàng</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Trạng thái</th>
                <th class="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="txn in transactions" :key="txn.id" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-slate-700">{{ txn.createdAt.split(' ')[0] }}</div>
                  <div class="text-[11px] text-slate-400 font-bold">{{ txn.createdAt.split(' ')[1] }}</div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">{{ txn.txnRef }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-bold text-slate-800">{{ txn.customer }}</div>
                  <div class="text-xs text-slate-400 truncate max-w-45">{{ txn.content }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-black text-slate-800">{{ formatCurrency(txn.amount) }}</div>
                </td>
                <td class="px-6 py-4 text-center">
                  <span class="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-black rounded uppercase border border-slate-200">
                    {{ txn.bankCode }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div :class="['px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1.5', getStatusStyle(txn.status)]">
                    <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                    {{ getStatusLabel(txn.status) }}
                  </div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex items-center justify-end gap-2">
                    <button class="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all" title="Xem chi tiết Log">
                      <Eye :size="18" />
                    </button>
                    <button class="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all" title="Mở cổng VNPay">
                      <ExternalLink :size="18" />
                    </button>
                    <button v-if="txn.status === 'success'" class="p-2 hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-lg transition-all" title="Hoàn tiền">
                      <RefreshCcw :size="18" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer / Pagination -->
        <div class="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-xs font-bold text-slate-400">Hiển thị 1 - 4 trên 142 giao dịch</p>
          <div class="flex items-center gap-1">
            <button class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-400 hover:bg-white disabled:opacity-50">Trước</button>
            <button class="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm">1</button>
            <button class="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">2</button>
            <button class="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">3</button>
            <button class="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-white">Sau</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

.font-sans {
  font-family: 'Inter', sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>