<template>
  <div class="p-6 bg-slate-50 min-h-screen font-sans">
    <!-- Header Section -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <LayoutDashboard class="w-8 h-8 text-amber-600" />
          Bảng điều khiển Hệ thống
        </h1>
        <p class="text-slate-500 mt-1">Tổng quan hoạt động, giao dịch và biến động người dùng</p>
      </div>
      <div class="flex gap-3 mt-4 md:mt-0">
        <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 text-sm shadow-sm">
          <Calendar class="w-4 h-4 text-slate-400" />
          <span>01/03/2024 - 31/03/2024</span>
        </div>
        <button class="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition-all shadow-md flex items-center gap-2">
          <RefreshCcw class="w-4 h-4" />
          Làm mới
        </button>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in quickStats" :key="stat.label" class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
        <div :class="['absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10', stat.colorClass]"></div>
        <div class="flex items-start justify-between relative z-10">
          <div>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{{ stat.label }}</p>
            <h3 class="text-2xl font-black text-slate-800">{{ stat.value }}</h3>
            <div :class="['flex items-center gap-1 text-xs mt-2 font-bold', stat.trendUp ? 'text-emerald-600' : 'text-rose-600']">
              <component :is="stat.trendUp ? TrendingUp : TrendingDown" class="w-3 h-3" />
              {{ stat.trendValue }}% so với tháng trước
            </div>
          </div>
          <div :class="['p-3 rounded-xl', stat.bgClass]">
            <component :is="stat.icon" class="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Biểu đồ biến động -->
      <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-bold text-slate-800 flex items-center gap-2">
            <LineChart class="w-5 h-5 text-blue-500" />
            Biến động Giao dịch & Người dùng
          </h3>
          <div class="flex gap-2">
            <button class="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-full font-bold">Ngày</button>
            <button class="px-3 py-1 text-xs bg-amber-600 text-white rounded-full font-bold shadow-sm">Tuần</button>
          </div>
        </div>
        <div class="h-64 w-full bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
          <svg viewBox="0 0 800 200" class="absolute inset-0 w-full h-full p-4">
            <path d="M0,150 Q100,50 200,120 T400,80 T600,140 T800,20" fill="none" stroke="#d97706" stroke-width="3" stroke-linecap="round" />
            <path d="M0,180 Q100,100 200,150 T400,120 T600,160 T800,80" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="5,5" />
          </svg>
          <div class="z-10 text-slate-400 text-sm font-medium">Dữ liệu thời gian thực được biểu diễn trực quan</div>
        </div>
        <div class="flex justify-center gap-6 mt-6">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-amber-600"></div>
            <span class="text-xs text-slate-600 font-bold uppercase">Doanh thu</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-blue-600"></div>
            <span class="text-xs text-slate-600 font-bold uppercase">User mới</span>
          </div>
        </div>
      </div>

      <!-- Sơ đồ luồng hoạt động -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 class="font-bold text-slate-800 flex items-center gap-2 mb-6">
          <GitFork class="w-5 h-5 text-emerald-500" />
          Sơ đồ Luồng hoạt động
        </h3>
        <div class="space-y-4">
          <div v-for="(step, index) in systemFlow" :key="index" class="relative">
            <div v-if="index !== systemFlow.length - 1" class="absolute left-6 top-10 w-0.5 h-8 bg-slate-100"></div>
            <div class="flex items-start gap-4">
              <div :class="['w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2', step.active ? 'bg-white border-amber-500' : 'bg-slate-50 border-slate-100']">
                <component :is="step.icon" :class="['w-6 h-6', step.active ? 'text-amber-600' : 'text-slate-400']" />
              </div>
              <div class="pt-1">
                <h4 class="text-sm font-bold text-slate-800">{{ step.title }}</h4>
                <p class="text-xs text-slate-500 mt-0.5">{{ step.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hoạt động & Giao dịch -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-5 border-b border-slate-50 flex items-center justify-between">
          <h3 class="font-bold text-slate-800">Hoạt động Tài khoản</h3>
          <button class="text-amber-600 text-xs font-bold hover:underline">Xem tất cả</button>
        </div>
        <div class="divide-y divide-slate-50">
          <div v-for="log in activityLogs" :key="log.id" class="p-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
            <div class="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-slate-100">
              <img :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${log.user}`" alt="Avatar">
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between">
                <p class="text-sm font-bold text-slate-800">{{ log.user }}</p>
                <span class="text-[10px] text-slate-400 uppercase font-bold">{{ log.time }}</span>
              </div>
              <p class="text-xs text-slate-600 mt-0.5">
                <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold mr-1">{{ log.action }}</span>
                {{ log.target }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-5 border-b border-slate-50 flex items-center justify-between">
          <h3 class="font-bold text-slate-800">Giao dịch Tài chính</h3>
          <span class="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-black uppercase">Thành công</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="bg-slate-50/50 text-[10px] text-slate-400 font-black uppercase tracking-widest border-b border-slate-100">
                <th class="px-6 py-4">Mã GD</th>
                <th class="px-6 py-4">Nội dung</th>
                <th class="px-6 py-4 text-right">Số tiền</th>
                <th class="px-6 py-4 text-center">Loại</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-slate-50/50">
                <td class="px-6 py-4"><span class="text-xs font-mono text-amber-700">#{{ tx.id }}</span></td>
                <td class="px-6 py-4">
                  <div class="text-xs font-bold text-slate-700">{{ tx.plan }}</div>
                  <div class="text-[10px] text-slate-400">{{ tx.date }}</div>
                </td>
                <td class="px-6 py-4 text-right"><span class="text-sm font-black text-slate-800">{{ tx.amount.toLocaleString() }}đ</span></td>
                <td class="px-6 py-4 text-center">
                  <div :class="['w-8 h-8 rounded flex items-center justify-center mx-auto', tx.type === 'plus' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600']">
                    <component :is="tx.type === 'plus' ? ArrowUpRight : ArrowDownLeft" class="w-4 h-4" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  LayoutDashboard, Users, TrendingUp, TrendingDown, RefreshCcw, Calendar,
  CreditCard, UserCheck, ShieldAlert, LineChart, GitFork,
  ArrowUpRight, ArrowDownLeft, HeartHandshake, Package
} from 'lucide-vue-next'

const quickStats = [
  { label: 'Doanh thu tháng', value: '45.200.000đ', icon: CreditCard, trendValue: 12.5, trendUp: true, colorClass: 'bg-amber-600', bgClass: 'bg-amber-500' },
  { label: 'Người dùng mới', value: '1.284', icon: Users, trendValue: 8.2, trendUp: true, colorClass: 'bg-blue-600', bgClass: 'bg-blue-500' },
  { label: 'Gia phả khởi tạo', value: '342', icon: GitFork, trendValue: 4.1, trendUp: false, colorClass: 'bg-emerald-600', bgClass: 'bg-emerald-500' },
  { label: 'Hỗ trợ xử lý', value: '15/18', icon: HeartHandshake, trendValue: 98, trendUp: true, colorClass: 'bg-rose-600', bgClass: 'bg-rose-500' },
]

const systemFlow = [
  { title: 'Tiếp nhận yêu cầu', desc: 'Hệ thống ghi nhận lượt truy cập và đăng ký mới.', icon: UserCheck, active: true },
  { title: 'Xác thực & Phân quyền', desc: 'Kiểm tra Token và gán vai trò (Roles) tương ứng.', icon: ShieldAlert, active: true },
  { title: 'Xử lý dữ liệu', desc: 'Lưu trữ thông tin gia phả, thành viên vào Database.', icon: Package, active: false },
  { title: 'Hoàn tất giao dịch', desc: 'Kích hoạt gói cước và gửi thông báo xác nhận.', icon: CreditCard, active: false },
]

const activityLogs = [
  { id: 1, user: 'Nguyễn Văn An', action: 'CREATE_NODE', target: 'Thành viên mới: Nguyễn Văn Bình', time: '5 phút trước' },
  { id: 2, user: 'Trần Thị Mai', action: 'UPDATE_ROLE', target: 'Nâng cấp lên FAMILY_ADMIN', time: '12 phút trước' },
  { id: 3, user: 'Admin_Hệ_Thống', action: 'SYS_PLAN_EDIT', target: 'Thay đổi giá gói Premium', time: '45 phút trước' },
  { id: 4, user: 'Lê Văn Tám', action: 'DELETE_POST', target: 'Xóa bài viết "Lễ hội làng 2024"', time: '1 giờ trước' },
  { id: 5, user: 'Phạm Minh', action: 'LOGIN', target: 'Đăng nhập từ IP: 192.168.1.1', time: '2 giờ trước' },
]

const transactions = [
  { id: 'GD8829', plan: 'Gói Vĩnh Cửu (Gia phả lớn)', date: '24/03/2024 14:20', amount: 2500000, type: 'plus' },
  { id: 'GD8825', plan: 'Gói Tiêu chuẩn (1 năm)', date: '24/03/2024 09:15', amount: 500000, type: 'plus' },
  { id: 'GD8812', plan: 'Hoàn tiền Gói Cơ bản', date: '23/03/2024 16:30', amount: 200000, type: 'minus' },
  { id: 'GD8809', plan: 'Gói Premium (Dòng họ lớn)', date: '23/03/2024 10:00', amount: 1500000, type: 'plus' },
  { id: 'GD8790', plan: 'Gói Tiêu chuẩn (1 năm)', date: '22/03/2024 18:45', amount: 500000, type: 'plus' },
]
</script>
