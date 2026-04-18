


<script setup lang="ts">
import { ref } from 'vue'
import {
    Mail,
    Bell,
    ShieldCheck,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Plus,
    Trash2,
    Lock
} from 'lucide-vue-next'

const primaryEmail = ref('haidang.bui@example.com')
const secondaryEmail = ref('dangbui.personal@gmail.com')

const notifications = ref([
    { id: 'security', label: 'Cảnh báo bảo mật', description: 'Nhận thông báo khi có đăng nhập lạ hoặc đổi mật khẩu.', enabled: true },
    { id: 'updates', label: 'Cập nhật hệ thống', description: 'Thông tin về các tính năng mới và bảo trì định kỳ.', enabled: true },
    { id: 'billing', label: 'Hóa đơn & Thanh toán', description: 'Gửi biên lai và nhắc nhở gia hạn dịch vụ.', enabled: false },
    { id: 'marketing', label: 'Tin tức & Khuyến mãi', description: 'Các ưu đãi đặc biệt dành riêng cho thành viên gia đình.', enabled: false }
])

const toggleNotification = (index: number) => {
    notifications.value[index].enabled = !notifications.value[index].enabled
}
</script>

<template>
    <div class="max-w-4xl mx-auto space-y-8 p-4 md:p-0">
        <!-- Header -->
        <div class="border-b border-slate-100 pb-6">
            <h1 class="text-2xl font-bold text-slate-800">Cấu hình Email</h1>
            <p class="text-slate-500 text-sm mt-1">Quản lý địa chỉ liên lạc và cách thức chúng tôi gửi thông báo cho
                bạn.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Left: Navigation/Info -->
            <div class="md:col-span-1 space-y-4">
                <nav class="space-y-1">
                    <a href="#"
                        class="flex items-center gap-3 px-4 py-2.5 bg-slate-100 text-[#d4a373] font-semibold rounded-lg">
                        <Mail :size="18" />
                        <span>Địa chỉ Email</span>
                    </a>
                    <a href="#"
                        class="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <Bell :size="18" />
                        <span>Thông báo</span>
                    </a>
                    <a href="#"
                        class="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <Lock :size="18" />
                        <span>Bảo mật</span>
                    </a>
                </nav>

                <div class="bg-[#d4a373]/5 p-4 rounded-xl border border-[#d4a373]/10">
                    <div class="flex items-start gap-3">
                        <ShieldCheck class="text-[#d4a373] shrink-0" :size="20" />
                        <div>
                            <h4 class="text-xs font-bold text-[#d4a373] uppercase tracking-wider">Mẹo bảo mật</h4>
                            <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                                Sử dụng email cá nhân duy nhất để nhận các cảnh báo bảo mật quan trọng nhất.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Right: Content -->
            <div class="md:col-span-2 space-y-8">

                <!-- Email Addresses Section -->
                <section class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="font-semibold text-slate-800">Danh sách Email</h3>
                        <button class="text-sm text-[#d4a373] font-medium flex items-center gap-1 hover:underline">
                            <Plus :size="16" /> Thêm mới
                        </button>
                    </div>

                    <div class="space-y-3">
                        <!-- Primary Email -->
                        <div
                            class="group p-4 bg-white border border-slate-200 rounded-xl hover:border-[#d4a373] transition-all shadow-sm">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                        <CheckCircle2 :size="20" />
                                    </div>
                                    <div>
                                        <div class="flex items-center gap-2">
                                            <span class="font-medium text-slate-800">{{ primaryEmail }}</span>
                                            <span
                                                class="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold uppercase">Chính</span>
                                        </div>
                                        <p class="text-xs text-slate-500">Đã xác minh vào 12/10/2023</p>
                                    </div>
                                </div>
                                <button class="p-2 text-slate-300 hover:text-slate-600">
                                    <ExternalLink :size="16" />
                                </button>
                            </div>
                        </div>

                        <!-- Secondary Email -->
                        <div
                            class="group p-4 bg-white border border-slate-200 rounded-xl hover:border-[#d4a373] transition-all shadow-sm">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                                        <Mail :size="20" />
                                    </div>
                                    <div>
                                        <div class="flex items-center gap-2">
                                            <span class="font-medium text-slate-800">{{ secondaryEmail }}</span>
                                        </div>
                                        <p class="text-xs text-slate-500">Dùng để khôi phục tài khoản</p>
                                    </div>
                                </div>
                                <div class="flex gap-1">
                                    <button class="p-2 text-slate-300 hover:text-red-500 transition-colors">
                                        <Trash2 :size="16" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Preferences Section -->
                <section class="space-y-4">
                    <h3 class="font-semibold text-slate-800">Cài đặt thông báo</h3>
                    <div
                        class="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 shadow-sm overflow-hidden">
                        <div v-for="(item, index) in notifications" :key="item.id"
                            class="p-4 flex items-center justify-between">
                            <div class="pr-8">
                                <p class="text-sm font-medium text-slate-800">{{ item.label }}</p>
                                <p class="text-xs text-slate-500 mt-0.5">{{ item.description }}</p>
                            </div>
                            <button @click="toggleNotification(index)" :class="[
                                'w-11 h-6 rounded-full transition-all relative shrink-0',
                                item.enabled ? 'bg-[#d4a373]' : 'bg-slate-200'
                            ]">
                                <div :class="[
                                    'absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm',
                                    item.enabled ? 'right-1' : 'left-1'
                                ]"></div>
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Warning Alert -->
                <div class="flex gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <AlertCircle class="text-amber-600 shrink-0" :size="20" />
                    <p class="text-xs text-amber-800 leading-relaxed">
                        <strong>Lưu ý:</strong> Việc thay đổi email chính sẽ yêu cầu bạn xác minh lại thông qua mã gửi
                        tới hòm thư mới trước khi có hiệu lực hoàn toàn.
                    </p>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
/* Đồng bộ font và spacing */
h1,
h3 {
    letter-spacing: -0.01em;
}
</style>