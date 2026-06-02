<script setup lang="ts">
import type { FeedbackRes, FeedbackStatus, FeedbackType } from '@/types/feedback/feedback.types'
import { CalendarClock, CheckCircle2, Clock, Mail, MessageSquare, Tag, X } from 'lucide-vue-next'

defineProps<{
    show: boolean
    feedback?: FeedbackRes | null
    isLoading?: boolean
}>()

const emit = defineEmits<{
    close: []
}>()

const getTypeLabel = (type?: FeedbackType) => {
    const map: Record<string, string> = {
        BUG_REPORT: 'Báo lỗi',
        FEATURE_REQUEST: 'Đề xuất tính năng',
        UI_FEEDBACK: 'Góp ý giao diện',
        OTHER: 'Khác'
    }

    return type ? map[type] ?? type : 'Khác'
}

const getTypeClass = (type?: FeedbackType) => {
    const map: Record<string, string> = {
        BUG_REPORT: 'bg-red-50 text-red-700 ring-red-200',
        FEATURE_REQUEST: 'bg-blue-50 text-blue-700 ring-blue-200',
        UI_FEEDBACK: 'bg-violet-50 text-violet-700 ring-violet-200',
        OTHER: 'bg-slate-50 text-slate-700 ring-slate-200'
    }

    return type ? map[type] ?? map.OTHER : map.OTHER
}

const getStatusLabel = (status?: FeedbackStatus) => {
    const map: Record<string, string> = {
        PENDING: 'Chờ xử lý',
        HANDLED: 'Đã xử lý',
        REJECTED: 'Từ chối'
    }

    return status ? map[status] ?? status : 'Chưa rõ'
}

const getStatusClass = (status?: FeedbackStatus) => {
    const map: Record<string, string> = {
        PENDING: 'bg-amber-50 text-amber-700 ring-amber-200',
        HANDLED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        REJECTED: 'bg-red-50 text-red-700 ring-red-200'
    }

    return status ? map[status] ?? 'bg-slate-50 text-slate-700 ring-slate-200' : 'bg-slate-50 text-slate-700 ring-slate-200'
}

const formatDate = (value?: string | null) => {
    if (!value) return 'Chưa có'
    return new Date(value).toLocaleString('vi-VN')
}
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="emit('close')"></div>

                <div class="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
                    <div class="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                        <div class="flex items-center gap-3">
                            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                                <MessageSquare :size="22" />
                            </div>
                            <div>
                                <h2 class="text-lg font-black text-slate-900">Chi tiết phản hồi</h2>
                                <p class="mt-0.5 text-sm font-medium text-slate-500">Thông tin phản hồi và kết quả xử lý.</p>
                            </div>
                        </div>

                        <button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            @click="emit('close')">
                            <X :size="18" />
                        </button>
                    </div>

                    <div v-if="isLoading" class="flex min-h-80 items-center justify-center">
                        <div class="text-center">
                            <div class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500"></div>
                            <p class="mt-4 text-sm font-semibold text-slate-500">Đang tải chi tiết phản hồi...</p>
                        </div>
                    </div>

                    <div v-else-if="feedback" class="max-h-[75vh] overflow-y-auto px-6 py-5">
                        <div class="flex flex-wrap items-center gap-2">
                            <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ring-1"
                                :class="getTypeClass(feedback.type)">
                                <Tag :size="13" />
                                {{ getTypeLabel(feedback.type) }}
                            </span>
                            <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ring-1"
                                :class="getStatusClass(feedback.status)">
                                <CheckCircle2 :size="13" />
                                {{ getStatusLabel(feedback.status) }}
                            </span>
                        </div>

                        <h3 class="mt-4 text-2xl font-black leading-tight text-slate-950">
                            {{ feedback.subject }}
                        </h3>

                        <div class="mt-4 grid gap-3 md:grid-cols-3">
                            <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                                    <Mail :size="14" />
                                    Email
                                </div>
                                <p class="mt-2 break-all text-sm font-bold text-slate-700">{{ feedback.email || 'Không có' }}</p>
                            </div>
                            <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                                    <CalendarClock :size="14" />
                                    Ngày gửi
                                </div>
                                <p class="mt-2 text-sm font-bold text-slate-700">{{ formatDate(feedback.createdAt) }}</p>
                            </div>
                            <div class="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                <div class="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-400">
                                    <Clock :size="14" />
                                    Ngày xử lý
                                </div>
                                <p class="mt-2 text-sm font-bold text-slate-700">{{ formatDate(feedback.resolvedAt) }}</p>
                            </div>
                        </div>

                        <div class="mt-5 grid gap-5 md:grid-cols-2">
                            <div class="rounded-2xl border border-slate-200 bg-white p-5">
                                <h4 class="text-sm font-black uppercase tracking-wide text-slate-500">Nội dung phản hồi</h4>
                                <p class="mt-3 whitespace-pre-line text-sm font-medium leading-7 text-slate-700">
                                    {{ feedback.content }}
                                </p>
                            </div>

                            <div class="rounded-2xl border border-slate-200 bg-white p-5">
                                <h4 class="text-sm font-black uppercase tracking-wide text-slate-500">Phản hồi từ hệ thống</h4>
                                <p class="mt-3 whitespace-pre-line text-sm font-medium leading-7 text-slate-700">
                                    {{ feedback.adminResponse || 'Chưa có phản hồi từ hệ thống.' }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div v-else class="flex min-h-80 flex-col items-center justify-center px-6 text-center">
                        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                            <MessageSquare :size="26" />
                        </div>
                        <p class="mt-4 text-sm font-bold text-slate-600">Không tìm thấy phản hồi.</p>
                    </div>

                    <div class="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-4">
                        <button type="button" class="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
                            @click="emit('close')">
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
