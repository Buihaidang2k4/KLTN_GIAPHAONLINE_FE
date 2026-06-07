<script setup lang="ts">
import AppPagination from '@/components/forms/common/AppPagination.vue';
import CreateFeedbackModel from '@/components/forms/feedback/CreateFeedbackModel.vue';
import ViewFeedbackModel from '@/components/forms/feedback/ViewFeedbackModel.vue';
import { usePagination } from '@/composables/common/usePagination';
import { useCreateFeedbackMutation, useDeleteFeedbackMutation, useFeedbackQuery, useFeedbacksByAccountQuery } from '@/hooks/queries/feedback/useFeedbacks';
import type { FeedbackReq, FeedbackType } from '@/types/feedback/feedback.types';
import { useDebounce } from '@vueuse/core';
import { Eye, MessageSquare, Plus, Search, Trash2 } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';

const keyword = ref('');
const useDebounceKeyword = useDebounce(keyword, 500);
const isOpenModel = ref(false);
const isOpenViewModel = ref(false);
const selectedFeedbackId = ref<number | null>(null);

const {
    pagination,
    currentPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    setTotalPages
} = usePagination(6, 0);


const normalizedParams = computed(() => ({
    subject: useDebounceKeyword.value,
    page: pagination.page,
    size: pagination.size
}));

const feedbackQuery = useFeedbacksByAccountQuery(normalizedParams);
const { data: feedbackData, isLoading } = feedbackQuery;
const { mutate: createFeedback, isPending: isCreatingFeedback } = useCreateFeedbackMutation();
const { mutate: deleteFeedback, isPending: isDeletingFeedback } = useDeleteFeedbackMutation();
const { data: feedbackById, isLoading: isLoadingFeedbackDetail } = useFeedbackQuery(selectedFeedbackId);
const feedbacks = computed(() => feedbackData.value?.data?.items ?? []);
const totalElements = computed(() => feedbackData.value?.data?.totalElements ?? 0);
const selectedFeedback = computed(() => feedbackById.value?.data ?? null);

watch(
    () => feedbackData.value?.data?.totalPages,
    (total) => {
        setTotalPages(total || 0);
    },
    { immediate: true }
);


const openModel = () => {
    isOpenModel.value = true;
};

const closeModel = () => {
    isOpenModel.value = false;
};

const openViewModel = (feedbackId: number) => {
    selectedFeedbackId.value = feedbackId;
    isOpenViewModel.value = true;
};

const closeViewModel = () => {
    isOpenViewModel.value = false;
    selectedFeedbackId.value = null;
};

const submitFeedback = (payload: FeedbackReq) => {
    createFeedback(payload, {
        onSuccess: () => {
            isOpenModel.value = false;
            feedbackQuery.refetch();
        }
    });
};

const handleDeleteFeedback = (feedbackId: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa phản hồi này không?')) return;

    deleteFeedback(feedbackId, {
        onSuccess: () => {
            feedbackQuery.refetch();
        }
    });
};

const getTypeLabel = (type: FeedbackType) => {
    const map: Record<string, string> = {
        BUG_REPORT: 'Báo lỗi',
        FEATURE_REQUEST: 'Đề xuất tính năng',
        UI_FEEDBACK: 'Góp ý giao diện',
        OTHER: 'Khác'
    };

    return map[type] ?? type;
};

const getTypeClass = (type: FeedbackType) => {
    const map: Record<string, string> = {
        BUG_REPORT: 'bg-red-50 text-red-700 ring-red-200',
        FEATURE_REQUEST: 'bg-blue-50 text-blue-700 ring-blue-200',
        UI_FEEDBACK: 'bg-violet-50 text-violet-700 ring-violet-200',
        OTHER: 'bg-slate-50 text-slate-700 ring-slate-200'
    };

    return map[type] ?? 'bg-slate-50 text-slate-700 ring-slate-200';
};

const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
        PENDING: 'Chờ xử lý',
        HANDLED: 'Đã xử lý',
        REJECTED: 'Từ chối'
    };

    return map[status] ?? status;
};

const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
        PENDING: 'bg-amber-50 text-amber-700 ring-amber-200',
        HANDLED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        REJECTED: 'bg-red-50 text-red-700 ring-red-200'
    };

    return map[status] ?? 'bg-slate-50 text-slate-700 ring-slate-200';
};
</script>

<template>
    <div class="min-h-screen bg-slate-50/70 p-4 md:p-8">
        <div class="mx-auto max-w-7xl space-y-6">
            <div
                class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div class="flex items-center gap-4">
                    <div
                        class="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                        <MessageSquare :size="24" />
                    </div>
                    <div>
                        <h1 class="text-2xl font-black tracking-tight text-slate-900">Phản hồi của tôi</h1>
                        <p class="mt-1 text-sm font-medium text-slate-500">
                            Theo dõi các góp ý đã gửi và phản hồi từ hệ thống.
                        </p>
                    </div>
                </div>

                <button
                    class="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"
                    @click="openModel">
                    <Plus :size="18" />
                    Tạo phản hồi cho hệ thống
                </button>
            </div>

            <div class="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                <div class="relative">
                    <Search :size="18"
                        class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input v-model="keyword" type="text" placeholder="Tìm kiếm theo tiêu đề..."
                        class="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none shadow-sm transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10" />
                </div>

                <div
                    class="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 shadow-sm">
                    Tổng: <span class="text-slate-950">{{ totalElements }}</span> phản hồi
                </div>
            </div>

            <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div v-if="isLoading" class="flex min-h-72 items-center justify-center">
                    <div class="text-center">
                        <div
                            class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500">
                        </div>
                        <p class="mt-4 text-sm font-semibold text-slate-500">Đang tải danh sách phản hồi...</p>
                    </div>
                </div>

                <div v-else-if="feedbacks.length === 0"
                    class="flex min-h-72 flex-col items-center justify-center px-6 text-center">
                    <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                        <MessageSquare :size="26" />
                    </div>
                    <h2 class="mt-4 text-lg font-black text-slate-900">Chưa có phản hồi</h2>
                    <p class="mt-1 max-w-md text-sm font-medium text-slate-500">
                        Khi bạn gửi phản hồi, danh sách và trạng thái xử lý sẽ hiển thị tại đây.
                    </p>
                    <button
                        class="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
                        @click="openModel">
                        <Plus :size="16" />
                        Gửi phản hồi
                    </button>
                </div>

                <div v-else class="overflow-x-auto max-w-full">
                    <table class="w-full min-w-230 text-left">
                        <thead class="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
                            <tr>
                                <th class="w-20 px-5 py-4">STT</th>
                                <th class="px-5 py-4">Tiêu đề</th>
                                <th class="px-5 py-4">Loại</th>
                                <th class="px-5 py-4">Nội dung</th>
                                <th class="px-5 py-4">Ngày gửi</th>
                                <th class="px-5 py-4">Trạng thái</th>
                                <th class="px-5 py-4">Phản hồi hệ thống</th>
                                <th class="px-5 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr v-for="(feedback, index) in feedbacks" :key="feedback.feedbackId"
                                class="transition hover:bg-amber-50/30">
                                <td class="px-5 py-4 text-sm font-bold text-slate-500">
                                    {{ index + 1 + currentPage * pagination.size }}
                                </td>
                                <td class="max-w-55 px-5 py-4">
                                    <p class="truncate text-sm font-black text-slate-900">{{ feedback.subject }}</p>
                                </td>
                                <td class="px-5 py-4">
                                    <span
                                        class="inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 whitespace-nowrap"
                                        :class="getTypeClass(feedback.type)">
                                        {{ getTypeLabel(feedback.type) }}
                                    </span>
                                </td>
                                <td class="max-w-70 px-5 py-4">
                                    <p class="line-clamp-2 text-sm font-medium leading-6 text-slate-600">
                                        {{ feedback.content }}
                                    </p>
                                </td>
                                <td class="px-5 py-4 text-sm font-semibold text-slate-600">
                                    {{ new Date(feedback.createdAt).toLocaleDateString('vi-VN') }}
                                </td>
                                <td class="px-5 py-4">
                                    <span
                                        class="inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 whitespace-nowrap"
                                        :class="getStatusClass(feedback.status)">
                                        {{ getStatusLabel(feedback.status) }}
                                    </span>
                                </td>
                                <td class="max-w-65 px-5 py-4">
                                    <p class="line-clamp-2 text-sm font-medium leading-6 text-slate-600">
                                        {{ feedback.adminResponse || 'Chưa có phản hồi' }}
                                    </p>
                                </td>
                                <td class="px-5 py-4 text-right">
                                    <div class="flex flex-wrap items-center justify-end gap-2">
                                        <button type="button"
                                            class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                                            @click="openViewModel(feedback.feedbackId)">
                                            <Eye :size="15" />
                                            Xem
                                        </button>
                                        <button type="button"
                                            class="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-black text-red-600 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                            :disabled="isDeletingFeedback"
                                            @click="handleDeleteFeedback(feedback.feedbackId)">
                                            <Trash2 :size="15" />
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="feedbacks.length > 0" class="flex justify-end">
                <AppPagination :page="pagination.page" :total-pages="pagination.totalPages" :has-next="hasNextPage"
                    :has-prev="hasPrevPage" @next="nextPage" @prev="prevPage" />
            </div>
        </div>

        <CreateFeedbackModel :show="isOpenModel" :is-loading="isCreatingFeedback" @close="closeModel"
            @submit="submitFeedback" />

        <ViewFeedbackModel :show="isOpenViewModel" :feedback="selectedFeedback" :is-loading="isLoadingFeedbackDetail"
            @close="closeViewModel" />
    </div>

</template>


<style scoped></style>
