<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
    ChevronLeft, 
    Save, 
    Sparkles, 
    FileText, 
    LayoutGrid, 
    Eye, 
    History,
    CheckCircle2,
    Clock,
    X,
    Image as ImageIcon,
    Settings2,
    Send
} from 'lucide-vue-next'
import Template_wangeditor from '@/components/wangeditor_template/Template_wangeditor.vue'

const router = useRouter()
const route = useRoute()

// State
const isEditMode = ref(false)
const isLoading = ref(false)
const postTitle = ref('')
const postCategory = ref('Lịch sử dòng họ')
const postStatus = ref('published')
const contentHtml = ref('<p><br></p>')

const categories = [
    { id: 1, name: 'Lịch sử dòng họ', icon: History, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 2, name: 'Thông báo', icon: Send, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 3, name: 'Tin tức', icon: ImageIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 4, name: 'Gương sáng', icon: Sparkles, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 5, name: 'Kỷ niệm', icon: ImageIcon, color: 'text-rose-600', bg: 'bg-rose-50' }
]

onMounted(() => {
    const id = route.params.id
    if (id) {
        isEditMode.value = true
        // Fetch post data logic would go here
    }
})

const handleBack = () => {
    router.push({ name: 'FamilyPost' })
}

const handleSave = () => {
    isLoading.value = true
    // Simulate API call
    setTimeout(() => {
        console.log('Saving post:', {
            title: postTitle.value,
            category: postCategory.value,
            status: postStatus.value,
            content: contentHtml.value
        })
        isLoading.value = false
        handleBack()
    }, 1500)
}

</script>

<template>
    <div class="min-h-screen bg-[#f8fafc] font-sans text-slate-900 pb-20">
        
        <!-- TOP STICKY BAR -->
        <div class="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-4">
            <div class="max-w-[1440px] mx-auto flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button @click="handleBack" 
                        class="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-all active:scale-95 group">
                        <ChevronLeft :size="20" class="group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                    <div class="h-8 w-px bg-slate-200 hidden md:block"></div>
                    <div class="hidden sm:block">
                        <h2 class="text-sm font-bold text-slate-900 leading-none">
                            {{ isEditMode ? 'Chỉnh sửa bài viết' : 'Soạn thảo nội dung mới' }}
                        </h2>
                        <p class="text-[11px] text-slate-400 font-medium mt-1 uppercase tracking-tighter">
                            Family Administration System • Content Editor
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <button @click="handleBack"
                        class="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all active:scale-95">
                        Hủy bỏ
                    </button>
                    <button @click="handleSave" :disabled="isLoading || !postTitle"
                        class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none">
                        <Save v-if="!isLoading" :size="18" />
                        <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>{{ isLoading ? 'Đang lưu trữ...' : 'Xuất bản nội dung' }}</span>
                    </button>
                </div>
            </div>
        </div>

        <main class="max-w-[1440px] mx-auto p-6 md:p-8">
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <!-- LEFT CONTENT AREA (75%) -->
                <div class="lg:col-span-8 space-y-6">
                    
                    <!-- Editor Card -->
                    <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-200/60 overflow-hidden flex flex-col">
                        
                        <!-- Title Input Header -->
                        <div class="px-8 py-10 border-b border-slate-50 bg-white">
                            <div class="space-y-4 max-w-3xl">
                                <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                                    <Sparkles :size="12" />
                                    Bắt đầu một câu chuyện
                                </span>
                                <input v-model="postTitle" type="text" 
                                    placeholder="Tiêu đề bài viết ấn tượng..."
                                    class="w-full text-4xl font-black text-slate-900 placeholder:text-slate-200 outline-none border-none p-0 focus:ring-0 leading-tight tracking-tight" />
                                <div class="flex items-center gap-6 text-xs text-slate-400 font-medium">
                                    <div class="flex items-center gap-2">
                                        <div class="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        Tự động lưu sau mỗi 30s
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <History :size="14" />
                                        Cập nhật lần cuối: 2 phút trước
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Editor Wrapper -->
                        <div class="flex-1 min-h-[600px] flex flex-col">
                            <Template_wangeditor v-model="contentHtml" />
                        </div>
                    </div>

                    <!-- Footer Tip -->
                    <div class="flex items-center gap-3 px-6 py-4 bg-slate-100/50 rounded-2xl border border-slate-200/40 text-slate-500 text-xs font-medium italic">
                        <CheckCircle2 :size="16" class="text-emerald-500" />
                        Gợi ý: Bạn có thể kéo thả trực tiếp hình ảnh vào trình soạn thảo để đính kèm minh họa.
                    </div>
                </div>

                <!-- RIGHT SIDEBAR (25%) -->
                <aside class="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
                    
                    <!-- Post Configuration Card -->
                    <div class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-200/60 p-6 space-y-8">
                        
                        <div class="flex items-center justify-between">
                            <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <Settings2 :size="18" class="text-indigo-600" />
                                Cấu hình bài viết
                            </h3>
                        </div>

                        <!-- Category Selection -->
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <label class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    Chuyên mục
                                </label>
                                <span class="text-[10px] font-bold text-indigo-500 cursor-pointer hover:underline">+ Tạo mới</span>
                            </div>
                            <div class="grid grid-cols-1 gap-2.5">
                                <button v-for="cat in categories" :key="cat.id"
                                    @click="postCategory = cat.name"
                                    class="group flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300"
                                    :class="postCategory === cat.name 
                                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100 translate-x-1' 
                                        : 'bg-white border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50'"
                                >
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                                            :class="postCategory === cat.name ? 'bg-white/20' : cat.bg">
                                            <component :is="cat.icon" :size="16" :class="postCategory === cat.name ? 'text-white' : cat.color" />
                                        </div>
                                        <span class="text-xs font-bold">{{ cat.name }}</span>
                                    </div>
                                    <div v-if="postCategory === cat.name" class="w-1.5 h-1.5 bg-white rounded-full"></div>
                                </button>
                            </div>
                        </div>

                        <!-- Visibility / Status -->
                        <div class="space-y-4 pt-4 border-t border-slate-100">
                            <label class="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                Trạng thái hiển thị
                            </label>
                            <div class="flex p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50">
                                <button @click="postStatus = 'draft'"
                                    class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-300"
                                    :class="postStatus === 'draft' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
                                >
                                    <Clock :size="14" />
                                    Bản nháp
                                </button>
                                <button @click="postStatus = 'published'"
                                    class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-300"
                                    :class="postStatus === 'published' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'"
                                >
                                    <CheckCircle2 :size="14" />
                                    Công khai
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Additional Metadata (Optional) -->
                    <div class="bg-indigo-900 rounded-2xl p-6 relative overflow-hidden group shadow-xl shadow-indigo-100">
                        <div class="absolute -right-6 -bottom-6 text-white/5 group-hover:rotate-12 transition-transform duration-700">
                            <Sparkles :size="120" />
                        </div>
                        <div class="relative z-10 space-y-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                    <ImageIcon :size="20" class="text-indigo-200" />
                                </div>
                                <h4 class="text-white font-bold text-sm">Hình ảnh đại diện</h4>
                            </div>
                            <p class="text-indigo-200/60 text-[11px] leading-relaxed">
                                Thêm hình ảnh đại diện để bài viết trở nên sinh động và chuyên nghiệp hơn trên dòng thời gian.
                            </p>
                            <button class="w-full py-2.5 bg-white text-indigo-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-colors">
                                Tải ảnh lên
                            </button>
                        </div>
                    </div>

                    <!-- SEO Tip -->
                    <div class="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                        <CheckCircle2 :size="16" class="text-emerald-500 shrink-0 mt-0.5" />
                        <p class="text-[11px] text-emerald-700 font-medium leading-relaxed">
                            Bài viết của bạn đã tối ưu 85% các tiêu chí tìm kiếm. Hãy thêm mô tả ngắn để đạt 100%.
                        </p>
                    </div>

                </aside>
            </div>
        </main>
    </div>
</template>

<style scoped>
/* Smooth animations */
main {
    animation: fadeInScale 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.98) translateY(10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
}

/* Custom styles for WangEditor integration */
:deep(.w-e-text-container) {
    border: none !important;
    padding: 0 40px 40px 40px !important;
}

:deep(.w-e-toolbar) {
    border: none !important;
    padding: 10px 40px !important;
}

:deep(.w-e-scroll) {
    padding: 0 !important;
}

/* Title focus effect */
input:focus::placeholder {
    opacity: 0.5;
}
</style>
