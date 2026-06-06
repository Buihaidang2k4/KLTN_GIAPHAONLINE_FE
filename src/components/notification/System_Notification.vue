<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Bell, CheckCheck, Trash2, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-vue-next'
import { useWebSocket } from '@/composables/websocket/useWebSocket'

// WebSocket
const { notifications, connect } = useWebSocket()

// Dropdown State
const isOpen = ref(false)
const notificationRef = ref<HTMLElement | null>(null)

// Connect on mount
onMounted(() => {
    connect()
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: MouseEvent) => {
    if (notificationRef.value && !notificationRef.value.contains(event.target as Node)) {
        isOpen.value = false
    }
}

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

// Unread count (assume notification has 'read' property, default to false if not present)
const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.read).length
})

// Mark all as read
const markAllAsRead = () => {
    notifications.value.forEach(n => {
        n.read = true
    })
}

// Clear all notifications
const clearAll = () => {
    notifications.value = []
}

// Format Time
const formatTime = (timeStr?: string) => {
    if (!timeStr) return 'Vừa xong'
    try {
        const date = new Date(timeStr)
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    } catch {
        return timeStr
    }
}

// Icon helper based on type
const getIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
        case 'success': return CheckCircle
        case 'warning': return AlertTriangle
        case 'error': return XCircle
        default: return Info
    }
}

// Color helper based on type
const getIconColor = (type?: string) => {
    switch (type?.toLowerCase()) {
        case 'success': return 'text-emerald-500 bg-emerald-50'
        case 'warning': return 'text-amber-500 bg-amber-50'
        case 'error': return 'text-rose-500 bg-rose-50'
        default: return 'text-blue-500 bg-blue-50'
    }
}
</script>

<template>
    <div class="relative" ref="notificationRef">
        <!-- Notification Button -->
        <button
            @click="toggleDropdown"
            class="relative w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition focus:outline-none"
        >
            <Bell :size="17" />
            <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse"
            >
                {{ unreadCount }}
            </span>
        </button>

        <!-- Dropdown Panel -->
        <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
        >
            <div
                v-if="isOpen"
                class="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden"
            >
                <!-- Header -->
                <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span class="text-sm font-semibold text-slate-800">Thông báo</span>
                    <div class="flex gap-2">
                        <button
                            v-if="unreadCount > 0"
                            @click="markAllAsRead"
                            class="text-[11px] text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium transition"
                            title="Đánh dấu tất cả đã đọc"
                        >
                            <CheckCheck :size="13" />
                            Đã đọc hết
                        </button>
                        <button
                            v-if="notifications.length > 0"
                            @click="clearAll"
                            class="text-[11px] text-slate-400 hover:text-rose-500 flex items-center gap-1 font-medium transition"
                            title="Xóa tất cả"
                        >
                            <Trash2 :size="13" />
                            Xóa hết
                        </button>
                    </div>
                </div>

                <!-- Notification List -->
                <div class="max-h-[350px] overflow-y-auto divide-y divide-slate-100">
                    <template v-if="notifications.length > 0">
                        <div
                            v-for="(item, index) in notifications"
                            :key="index"
                            class="p-4 hover:bg-slate-50/50 transition cursor-pointer flex gap-3"
                            :class="{ 'bg-amber-50/20': !item.read }"
                            @click="item.read = true"
                        >
                            <!-- Icon -->
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="getIconColor(item.type)">
                                    <component :is="getIcon(item.type)" :size="16" />
                                </div>
                            </div>

                            <!-- Content -->
                            <div class="flex-1 min-w-0">
                                <div class="flex items-start justify-between gap-1 mb-1">
                                    <h4 class="text-xs font-semibold text-slate-800 truncate" :class="{ 'font-bold': !item.read }">
                                        {{ item.title || 'Thông báo hệ thống' }}
                                    </h4>
                                    <span class="text-[9px] text-slate-400 whitespace-nowrap">
                                        {{ formatTime(item.createdAt || item.timestamp) }}
                                    </span>
                                </div>
                                <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                    {{ item.message || item.content }}
                                </p>
                            </div>
                        </div>
                    </template>

                    <!-- Empty State -->
                    <div v-else class="py-12 flex flex-col items-center justify-center text-center">
                        <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mb-3">
                            <Bell :size="20" />
                        </div>
                        <span class="text-xs text-slate-400">Không có thông báo nào</span>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style scoped>
/* Custom scrollbar for dropdown */
.max-h-\[350px\]::-webkit-scrollbar {
    width: 4px;
}
.max-h-\[350px\]::-webkit-scrollbar-track {
    background: transparent;
}
.max-h-\[350px\]::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 2px;
}
.max-h-\[350px\]::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>
