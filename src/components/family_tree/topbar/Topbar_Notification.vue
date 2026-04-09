<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import {
    Bell,
    Check,
    Trash2,
    Clock,
    MailOpen,
    Mail
} from 'lucide-vue-next'

const isOpen = ref(false)
const notifications = ref([])
const dropdownRef = ref(null)

const mockNotifications = [
    {
        notificationId: 1,
        title: 'Lời mời gia phả',
        message: 'Nguyễn Văn A đã mời bạn tham gia dòng họ Nguyễn Tộc.',
        isRead: false,
        createdAt: '2024-03-20T10:30:00Z',
        type: 'INVITATION'
    },
    {
        notificationId: 2,
        title: 'Cập nhật vai trò',
        message: 'Bạn đã được nâng lên làm Quản trị viên chi nhánh.',
        isRead: true,
        createdAt: '2024-03-19T15:45:00Z',
        type: 'SYSTEM'
    },
    {
        notificationId: 3,
        title: 'Thành viên mới',
        message: 'Lê Thị B vừa tham gia vào cây gia phả của bạn.',
        isRead: false,
        createdAt: '2024-03-20T08:00:00Z',
        type: 'MEMBER'
    }
]

const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
})

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const markAsRead = (id) => {
    const index = notifications.value.findIndex(n => n.notificationId === id)
    if (index !== -1) {
        notifications.value[index].isRead = true
    }
}

const markAllAsRead = () => {
    notifications.value.forEach(n => {
        n.isRead = true
    })
}

const deleteNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.notificationId !== id)
}

const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const handleClickOutside = (event) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false
    }
}

onMounted(() => {
    notifications.value = [...mockNotifications]
    document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
    <div class="relative" ref="dropdownRef">
        <button @click="toggleDropdown" :class="[
            'p-2.5 rounded-xl transition-all relative',
            isOpen
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
        ]">
            <Bell :size="20" />
            <span v-if="unreadCount > 0"
                class="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

        <transition enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="isOpen"
                class="absolute right-0 top-full mt-3 w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-[70] origin-top-right">
                <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 class="font-bold text-slate-800 text-lg">Thông báo</h3>
                    <button v-if="unreadCount > 0" @click="markAllAsRead"
                        class="text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
                        <Check :size="14" />
                        Đọc tất cả
                    </button>
                </div>

                <div class="max-h-[400px] overflow-y-auto custom-scrollbar">
                    <template v-if="notifications.length > 0">
                        <div v-for="n in notifications" :key="n.notificationId" :class="[
                            'p-4 border-b border-slate-50 flex gap-4 transition-colors hover:bg-slate-50 group relative',
                            !n.isRead ? 'bg-indigo-50/30' : ''
                        ]">
                            <div :class="[
                                'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                                !n.isRead ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'
                            ]">
                                <Mail v-if="n.type === 'INVITATION'" :size="18" />
                                <Bell v-else :size="18" />
                            </div>

                            <div class="flex-1">
                                <div class="flex justify-between items-start mb-1 gap-3">
                                    <span
                                        :class="['text-sm font-bold', !n.isRead ? 'text-slate-900' : 'text-slate-600']">
                                        {{ n.title }}
                                    </span>
                                    <span class="text-[11px] text-slate-400 flex items-center gap-1 whitespace-nowrap">
                                        <Clock :size="12" />
                                        {{ formatTime(n.createdAt) }}
                                    </span>
                                </div>

                                <p
                                    :class="['text-xs leading-relaxed mb-2', !n.isRead ? 'text-slate-700' : 'text-slate-500']">
                                    {{ n.message }}
                                </p>

                                <div class="flex gap-3">
                                    <button v-if="!n.isRead" @click="markAsRead(n.notificationId)"
                                        class="text-[11px] font-semibold text-indigo-600 hover:underline">
                                        Đánh dấu đã đọc
                                    </button>

                                    <button @click="deleteNotification(n.notificationId)"
                                        class="text-[11px] font-semibold text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                        <Trash2 :size="12" />
                                        Xóa
                                    </button>
                                </div>
                            </div>

                            <div v-if="!n.isRead" class="absolute right-4 bottom-4 w-2 h-2 bg-indigo-600 rounded-full">
                            </div>
                        </div>
                    </template>

                    <div v-else class="p-12 text-center text-slate-400">
                        <div class="mb-3 flex justify-center text-slate-200">
                            <MailOpen :size="48" />
                        </div>
                        <p class="text-sm">Không có thông báo nào</p>
                    </div>
                </div>

                <div class="p-3 text-center border-t border-slate-100">
                    <button class="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                        Xem tất cả thông báo
                    </button>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}
</style>