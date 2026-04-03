<script setup>
import { ref, shallowRef, onBeforeUnmount, watch } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'
import { 
    Bell, Sun, Moon, User, LogOut, Settings, 
    ChevronDown, ShieldCheck, Globe, Image as ImageIcon, 
    Share2, Lock, Save, RotateCcw, Info, Mail, Palette, 
    BarChart3, MapPin, Trash2, Plus
} from 'lucide-vue-next'

// Chuyển ngôn ngữ
i18nChangeLanguage('en')

const props = defineProps({
    modelValue: { type: String, default: '<p><br></p>' },
    readOnly: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Bắt đầu viết...' },
})

const emit = defineEmits(['update:modelValue', 'change'])

// Editor State
const editorRef = shallowRef()
const valueHtml = ref(props.modelValue)

// UI State
const isDark = ref(false)
const notificationCount = ref(3)
const isProfileOpen = ref(false)
const activeTab = ref('general')

const user = ref({
    name: 'Admin',
    role: 'Quản trị viên',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
})

// Mock Data cho cấu hình mở rộng
const settings = ref({
    siteName: 'Gia phả Đại Việt Online',
    slogan: 'Kết nối cội nguồn, gìn giữ gia phong',
    email: 'contact@giaphadaiviet.vn',
    phone: '0987.654.321',
    address: 'Số 123, Đường Láng, Đống Đa, Hà Nội',
    facebook: 'https://facebook.com/giaphadaiviet',
    zalo: '0987.654.321',
    maintenanceMode: false,
    seoTitle: 'Hệ thống quản lý gia phả trực tuyến số 1 Việt Nam',
    seoDesc: 'Nền tảng hiện đại giúp lưu trữ, xây dựng phả đồ và kết nối dòng tộc một cách dễ dàng.',
    primaryColor: '#d97706', // amber-600
    smtpHost: 'smtp.gmail.com',
    smtpUser: 'noreply@giaphadaiviet.vn',
    googleAnalytics: 'UA-12345678-1',
    googleMapsEmbed: '<iframe src="..."></iframe>',
    faviconUrl: '',
    logoUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=GP&backgroundColor=d97706'
})

const tabs = [
    { id: 'general', name: 'Thông tin chung', icon: Globe },
    { id: 'visual', name: 'Giao diện & Logo', icon: Palette },
    { id: 'contact', name: 'Liên hệ & MXH', icon: Share2 },
    { id: 'smtp', name: 'Cấu hình Email', icon: Mail },
    { id: 'seo', name: 'Cấu hình SEO', icon: Info },
    { id: 'advanced', name: 'Nâng cao', icon: BarChart3 },
    { id: 'security', name: 'Hệ thống', icon: Lock },
]

const handleSave = () => {
    console.log('Lưu toàn bộ cấu hình:', settings.value)
    // Giả lập thông báo
}
</script>

<template>
    <div class="h-screen bg-slate-50 flex flex-col overflow-hidden">
        <!-- TOPBAR -->
        <header class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 py-2 shrink-0 z-50">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Settings class="text-white" :size="18" />
                    </div>
                    <h2 class="text-sm font-bold text-gray-800">Cấu hình hệ thống</h2>
                </div>

                <div class="flex items-center gap-1.5">
                    <button @click="isDark = !isDark" class="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                        <Sun v-if="!isDark" :size="18" />
                        <Moon v-else :size="18" />
                    </button>

                    <button class="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                        <Bell :size="18" />
                        <span v-if="notificationCount > 0" class="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-white">
                            {{ notificationCount }}
                        </span>
                    </button>

                    <div class="w-[1px] h-4 bg-gray-200 mx-1"></div>

                    <div class="relative ml-1">
                        <button @click="isProfileOpen = !isProfileOpen" class="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-all group">
                            <img :src="user.avatar" class="w-8 h-8 rounded-lg object-cover border border-gray-200" alt="Avatar" />
                            <div class="flex flex-col items-start hidden md:flex leading-tight">
                                <span class="text-xs font-bold text-gray-700">{{ user.name }}</span>
                                <span class="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">{{ user.role }}</span>
                            </div>
                            <ChevronDown :size="14" class="text-gray-400 group-hover:text-gray-600 transition-transform" :class="{ 'rotate-180': isProfileOpen }" />
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <!-- MAIN CONTENT -->
        <main class="flex-1 p-4 md:p-6 overflow-y-auto">
            <div class="max-w-6xl mx-auto space-y-6">
                
                <!-- Tab Navigation (Scrollable) -->
                <div class="flex overflow-x-auto gap-2 p-1 bg-gray-200/50 rounded-xl w-full no-scrollbar">
                    <button 
                        v-for="tab in tabs" 
                        :key="tab.id"
                        @click="activeTab = tab.id"
                        :class="[
                            'flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap shrink-0',
                            activeTab === tab.id ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        ]"
                    >
                        <component :is="tab.icon" :size="14" />
                        {{ tab.name }}
                    </button>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
                    <!-- Left Column: Form Fields (75%) -->
                    <div class="lg:col-span-3 space-y-6">
                        <div class="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-6">
                            
                            <!-- Tab: General Info -->
                            <div v-if="activeTab === 'general'" class="space-y-6 animate-in fade-in duration-300">
                                <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <Globe :size="16" class="text-amber-600" /> Thông tin cơ bản
                                </h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div class="space-y-1.5">
                                        <label class="text-[11px] font-bold text-gray-400 uppercase">Tên website</label>
                                        <input v-model="settings.siteName" type="text" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-amber-500" />
                                    </div>
                                    <div class="space-y-1.5">
                                        <label class="text-[11px] font-bold text-gray-400 uppercase">Khẩu hiệu (Slogan)</label>
                                        <input v-model="settings.slogan" type="text" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-amber-500" />
                                    </div>
                                </div>
                                <div class="space-y-1.5">
                                    <label class="text-[11px] font-bold text-gray-400 uppercase">Giới thiệu ngắn (Footer Text)</label>
                                    <textarea rows="3" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-amber-500"></textarea>
                                </div>
                            </div>

                            <!-- Tab: Visual & Brand -->
                            <div v-if="activeTab === 'visual'" class="space-y-6 animate-in fade-in duration-300">
                                <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <Palette :size="16" class="text-amber-600" /> Nhận diện thương hiệu
                                </h3>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <!-- Logo Upload -->
                                    <div class="space-y-3">
                                        <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Logo Chính (Header)</label>
                                        <div class="relative group h-32 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-slate-50 transition-colors hover:border-amber-300">
                                            <img :src="settings.logoUrl" class="max-h-20 max-w-full grayscale group-hover:grayscale-0 transition-all" alt="Logo preview" />
                                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                                                <button class="bg-white p-2 rounded-full shadow-lg"><Plus :size="16" /></button>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Favicon Upload -->
                                    <div class="space-y-3">
                                        <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Favicon (Tab trình duyệt)</label>
                                        <div class="relative group h-32 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-slate-50 transition-colors hover:border-amber-300">
                                            <div class="w-12 h-12 bg-white rounded-lg border border-gray-100 shadow-sm flex items-center justify-center font-bold text-amber-600">GP</div>
                                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                                                <button class="bg-white p-2 rounded-full shadow-lg"><Plus :size="16" /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- Theme Color -->
                                <div class="p-4 bg-slate-50 border border-gray-100 rounded-xl space-y-3">
                                    <label class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Màu sắc chủ đạo (Brand Color)</label>
                                    <div class="flex items-center gap-4">
                                        <input v-model="settings.primaryColor" type="color" class="w-12 h-12 rounded-lg border-2 border-white shadow-sm cursor-pointer" />
                                        <div class="flex-1">
                                            <p class="text-xs font-bold text-gray-700">{{ settings.primaryColor.toUpperCase() }}</p>
                                            <p class="text-[10px] text-gray-400 italic">Hệ thống sẽ tự động cập nhật màu sắc này cho nút bấm, liên kết và các thẻ trạng thái.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Tab: Email SMTP -->
                            <div v-if="activeTab === 'smtp'" class="space-y-6 animate-in fade-in duration-300">
                                <div class="flex items-center justify-between">
                                    <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        <Mail :size="16" class="text-amber-600" /> Cấu hình gửi Mail thông báo
                                    </h3>
                                    <button class="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold hover:bg-blue-100 transition-colors">Kiểm tra kết nối</button>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="space-y-1.5">
                                        <label class="text-[11px] font-bold text-gray-400 uppercase">SMTP Host</label>
                                        <input v-model="settings.smtpHost" placeholder="smtp.gmail.com" type="text" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-amber-500" />
                                    </div>
                                    <div class="space-y-1.5">
                                        <label class="text-[11px] font-bold text-gray-400 uppercase">SMTP Port</label>
                                        <input placeholder="587" type="text" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-amber-500" />
                                    </div>
                                    <div class="space-y-1.5">
                                        <label class="text-[11px] font-bold text-gray-400 uppercase">Tài khoản Email</label>
                                        <input v-model="settings.smtpUser" type="email" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-amber-500" />
                                    </div>
                                    <div class="space-y-1.5">
                                        <label class="text-[11px] font-bold text-gray-400 uppercase">Mật khẩu ứng dụng</label>
                                        <input type="password" placeholder="••••••••••••••••" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-amber-500" />
                                    </div>
                                </div>
                            </div>

                            <!-- Tab: Advanced (Analytics / Maps) -->
                            <div v-if="activeTab === 'advanced'" class="space-y-6 animate-in fade-in duration-300">
                                <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <BarChart3 :size="16" class="text-amber-600" /> Tích hợp bên thứ ba
                                </h3>
                                <div class="space-y-4">
                                    <div class="space-y-1.5">
                                        <label class="text-[11px] font-bold text-gray-400 uppercase flex items-center gap-2">Google Analytics Tracking ID</label>
                                        <input v-model="settings.googleAnalytics" type="text" placeholder="G-XXXXXXXXXX" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-amber-500" />
                                    </div>
                                    <div class="space-y-1.5">
                                        <label class="text-[11px] font-bold text-gray-400 uppercase flex items-center gap-2">Nhúng Google Maps (Iframe)</label>
                                        <textarea rows="4" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg font-mono outline-none focus:border-amber-500"></textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- Tab: SEO -->
                            <div v-if="activeTab === 'seo'" class="space-y-6 animate-in fade-in duration-300">
                                <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <Info :size="16" class="text-amber-600" /> SEO Mặc định
                                </h3>
                                <div class="space-y-4">
                                    <div class="space-y-1.5">
                                        <label class="text-[11px] font-bold text-gray-400 uppercase">Meta Title trang chủ</label>
                                        <input v-model="settings.seoTitle" type="text" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-amber-500" />
                                    </div>
                                    <div class="space-y-1.5">
                                        <label class="text-[11px] font-bold text-gray-400 uppercase">Meta Description trang chủ</label>
                                        <textarea v-model="settings.seoDesc" rows="4" class="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-amber-500"></textarea>
                                    </div>
                                </div>
                            </div>

                            <!-- Tab: Security & Mode -->
                            <div v-if="activeTab === 'security'" class="space-y-6 animate-in fade-in duration-300">
                                <h3 class="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <Lock :size="16" class="text-amber-600" /> Vận hành hệ thống
                                </h3>
                                <div class="space-y-4">
                                    <!-- Maintenance -->
                                    <div class="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between">
                                        <div class="flex items-start gap-3">
                                            <div class="p-2 bg-white rounded-lg text-amber-600 shadow-sm"><Info :size="16" /></div>
                                            <div>
                                                <p class="text-xs font-bold text-amber-900">Chế độ bảo trì</p>
                                                <p class="text-[10px] text-amber-700">Chỉ Admin mới có thể truy cập trang chủ khi chế độ này bật.</p>
                                            </div>
                                        </div>
                                        <button @click="settings.maintenanceMode = !settings.maintenanceMode" class="w-12 h-6 rounded-full relative transition-colors duration-200" :class="settings.maintenanceMode ? 'bg-amber-600' : 'bg-gray-200'">
                                            <div class="absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform duration-200 shadow-sm" :class="settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'"></div>
                                        </button>
                                    </div>
                                    <!-- Log system -->
                                    <div class="p-4 bg-slate-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                                        <div class="flex items-start gap-3">
                                            <div class="p-2 bg-white rounded-lg text-slate-600 shadow-sm"><Settings :size="16" /></div>
                                            <div>
                                                <p class="text-xs font-bold text-slate-900">Debug Mode (Gỡ lỗi)</p>
                                                <p class="text-[10px] text-slate-500">Hiển thị thông báo lỗi chi tiết trên trình duyệt.</p>
                                            </div>
                                        </div>
                                        <button class="w-12 h-6 rounded-full bg-gray-200 relative">
                                            <div class="absolute w-5 h-5 bg-white rounded-full top-0.5 translate-x-0.5"></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Control Panel (25%) -->
                    <div class="lg:col-span-1 space-y-6">
                        <div class="bg-white rounded-2xl border border-gray-200/60 shadow-sm p-5 space-y-5 sticky top-0">
                            <h3 class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Hành động</h3>
                            
                            <div class="space-y-3">
                                <div class="flex items-center justify-between text-xs">
                                    <span class="text-gray-500">Cập nhật:</span>
                                    <span class="font-bold text-gray-700">Vừa xong</span>
                                </div>
                                <div class="flex items-center justify-between text-xs">
                                    <span class="text-gray-500">Phiên bản:</span>
                                    <span class="font-bold text-amber-600">v2.4.0</span>
                                </div>
                            </div>

                            <div class="pt-4 space-y-2.5">
                                <button @click="handleSave" class="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-100 transition-all active:scale-[0.98]">
                                    <Save :size="16" /> Lưu thay đổi
                                </button>
                                <button class="w-full py-2.5 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all">
                                    <RotateCcw :size="16" /> Hoàn tác
                                </button>
                            </div>

                            <div class="h-[1px] bg-gray-100"></div>

                            <button class="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all">
                                <Trash2 :size="16" /> Xóa Cache Web
                            </button>
                        </div>

                        <!-- Guide Card -->
                        <div class="p-5 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl text-white shadow-lg shadow-amber-200/50">
                            <Info :size="24" class="mb-3 opacity-60" />
                            <p class="text-xs font-bold mb-1">Cần hỗ trợ?</p>
                            <p class="text-[10px] leading-relaxed opacity-90">Hãy liên hệ với đội ngũ kỹ thuật nếu bạn muốn tích hợp thêm cổng thanh toán hoặc hệ thống lưu trữ đám mây.</p>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
.animate-in { animation-duration: 300ms; animation-fill-mode: both; }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
.fade-in { animation-name: fade-in; }

.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

input:focus, textarea:focus {
    box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.1);
    border-color: #d97706;
}
</style>