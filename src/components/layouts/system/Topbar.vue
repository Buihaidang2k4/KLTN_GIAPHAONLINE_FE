<script setup>
import { ref, shallowRef, onBeforeUnmount, watch } from 'vue'
import '@wangeditor/editor/dist/css/style.css'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { i18nChangeLanguage } from '@wangeditor/editor'
import {
    Bell, Sun, Moon, User, LogOut, Settings,
    ChevronDown, ShieldCheck, Mail
} from 'lucide-vue-next'

// Chuyển ngôn ngữ
i18nChangeLanguage('en')

const props = defineProps({
    modelValue: { type: String, default: '<p><br></p>' },
    readOnly: { type: Boolean, default: false },
    placeholder: { type: String, default: 'Bắt đầu viết...' },
    uploadImageUrl: { type: String, default: '/api/upload-image' },
    uploadVideoUrl: { type: String, default: '/api/upload-video' },
    uploadHeaders: { type: Object, default: () => ({}) },
    uploadMeta: { type: Object, default: () => ({}) },
})

const emit = defineEmits(['update:modelValue', 'change'])

// Editor State
const editorRef = shallowRef()
const valueHtml = ref(props.modelValue)

// UI State (Topbar)
const isDark = ref(false)
const notificationCount = ref(3)
const isProfileOpen = ref(false)

const user = ref({
    name: 'Admin',
    role: 'Quản trị viên',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
})

watch(() => props.modelValue, (val) => {
    if (val !== valueHtml.value) valueHtml.value = val || '<p><br></p>'
})

const toolbarConfig = { excludeKeys: [] }
const editorConfig = {
    placeholder: props.placeholder,
    MENU_CONF: {
        uploadImage: { server: props.uploadImageUrl, headers: props.uploadHeaders, meta: props.uploadMeta },
        uploadVideo: { server: props.uploadVideoUrl, headers: props.uploadHeaders, meta: props.uploadMeta }
    }
}

const handleCreated = (editor) => { editorRef.value = editor }
const handleChange = (editor) => {
    const html = editor.getHtml()
    valueHtml.value = html
    emit('update:modelValue', html)
}

onBeforeUnmount(() => {
    if (editorRef.value) editorRef.value.destroy()
})

defineExpose({
    getHtml: () => valueHtml.value,
    getText: () => editorRef.value?.getText() || '',
    setHtml: (html) => { if (editorRef.value) editorRef.value.setHtml(html) }
})
</script>

<template>
    <div class="h-screen bg-slate-50 flex flex-col overflow-hidden">
        <!-- TOPBAR THU GỌN -->
        <header class="bg-white/80 backdrop-blur-md border-b border-gray-200/60 px-6 py-2 shrink-0 z-50">
            <div class="flex items-center justify-between">
                <!-- Page info -->
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shadow-sm">
                        <ShieldCheck class="text-white" :size="18" />
                    </div>
                    <h2 class="text-sm font-bold text-gray-800">Quản trị hệ thống</h2>
                </div>

                <!-- Right actions -->
                <div class="flex items-center gap-1.5">
                    <!-- Theme toggle -->
                    <button @click="isDark = !isDark"
                        class="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                        <Sun v-if="!isDark" :size="18" />
                        <Moon v-else :size="18" />
                    </button>

                    <!-- Notifications -->
                    <button
                        class="relative w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
                        <Bell :size="18" />
                        <span v-if="notificationCount > 0"
                            class="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white ring-2 ring-white">
                            {{ notificationCount }}
                        </span>
                    </button>

                    <div class="w-[1px] h-4 bg-gray-200 mx-1"></div>

                    <!-- Profile -->
                    <div class="relative ml-1">
                        <button @click="isProfileOpen = !isProfileOpen"
                            class="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-all group">
                            <img :src="user.avatar" class="w-8 h-8 rounded-lg object-cover border border-gray-200"
                                alt="Avatar" />
                            <div class="flex flex-col items-start hidden md:flex leading-tight">
                                <span class="text-xs font-bold text-gray-700">{{ user.name }}</span>
                                <span
                                    class="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">{{ user.role }}</span>
                            </div>
                            <ChevronDown :size="14" class="text-gray-400 group-hover:text-gray-600 transition-transform"
                                :class="{ 'rotate-180': isProfileOpen }" />
                        </button>

                        <!-- Menu Profile -->
                        <div v-if="isProfileOpen"
                            class="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-[100] animate-in fade-in zoom-in slide-in-from-top-1 duration-150">
                            <div class="px-3 py-2 border-b border-gray-50 mb-1">
                                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tài khoản</p>
                            </div>
                            <button
                                class="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-600 hover:bg-slate-50 transition-colors">
                                <User :size="14" /> Hồ sơ cá nhân
                            </button>
                            <button
                                class="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-gray-600 hover:bg-slate-50 transition-colors">
                                <Settings :size="14" /> Cài đặt
                            </button>
                            <div class="h-[1px] bg-gray-100 my-1 mx-3"></div>
                            <button
                                class="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-500 hover:bg-red-50 font-medium transition-colors">
                                <LogOut :size="14" /> Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Editor Content Area - Tối ưu chiều cao -->
        <main class="flex-1 p-4 overflow-hidden">
            <div
                class="h-full max-w-5xl mx-auto border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col">
                <Toolbar class="border-b border-slate-100 bg-white shrink-0" :editor="editorRef"
                    :defaultConfig="toolbarConfig" mode="default" />
                <!-- Sử dụng flex-1 để Editor tự lấp đầy khoảng trống còn lại mà không gây tràn trang -->
                <Editor class="flex-1 overflow-y-hidden" v-model="valueHtml" :defaultConfig="editorConfig"
                    mode="default" @onCreated="handleCreated" @onChange="handleChange" />
                <!-- Footer Info -->
                <div
                    class="px-4 py-2 bg-slate-50 border-t border-slate-100 shrink-0 flex justify-between items-center text-[10px] text-slate-400 font-medium">
                    <span>Trạng thái: Sẵn sàng</span>
                    <span v-if="editorRef">Số ký tự: {{ editorRef.getText().length }}</span>
                </div>
            </div>
        </main>
    </div>
</template>

<style scoped>
.animate-in {
    animation-duration: 150ms;
    animation-fill-mode: both;
}

@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes zoom-in {
    from {
        transform: scale(0.95);
    }

    to {
        transform: scale(1);
    }
}

@keyframes slide-in-from-top-1 {
    from {
        transform: translateY(-0.25rem);
    }

    to {
        transform: translateY(0);
    }
}

.fade-in {
    animation-name: fade-in;
}

.zoom-in {
    animation-name: zoom-in;
}

.slide-in-from-top-1 {
    animation-name: slide-in-from-top-1;
}

:deep(.w-e-toolbar) {
    padding: 2px !important;
}

:deep(.w-e-text-container) {
    background-color: #fff !important;
    /* Loại bỏ border nội bộ để dùng border của container ngoài */
    border: none !important;
}

:deep(.w-e-scroll) {
    padding: 10px 20px !important;
}
</style>