<script setup lang="ts">
import AppPagination from '@/components/forms/common/AppPagination.vue'
import HandleFeedbackModel from '@/components/forms/feedback/HandleFeedbackModel.vue'
import ViewFeedbackModel from '@/components/forms/feedback/ViewFeedbackModel.vue'
import { usePagination } from '@/composables/common/usePagination'
import {
  useFeedbackQuery,
  useFeedbacksQuery,
  useHandleFeedbackMutation
} from '@/hooks/queries/feedback/useFeedbacks'
import type { FeedbackHandleReq, FeedbackStatus, FeedbackType } from '@/types/feedback/feedback.types'
import { useDebounce } from '@vueuse/core'
import { CheckCircle2, Eye, MessageSquare, Search, Wrench } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

const keyword = ref('')
const debouncedKeyword = useDebounce(keyword, 500)
const selectedFeedbackId = ref<number | null>(null)
const isOpenViewModel = ref(false)
const isOpenHandleModel = ref(false)

const {
  pagination,
  currentPage,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
  setTotalPages
} = usePagination(10, 0)

const normalizedParams = computed(() => ({
  keyword: debouncedKeyword.value,
  page: pagination.page,
  size: pagination.size
}))

const feedbackQuery = useFeedbacksQuery(normalizedParams)
const { data: feedbackData, isLoading } = feedbackQuery
const { data: feedbackById, isLoading: isLoadingFeedbackDetail } = useFeedbackQuery(selectedFeedbackId)
const { mutate: handleFeedback, isPending: isHandlingFeedback } = useHandleFeedbackMutation()

const feedbacks = computed(() => feedbackData.value?.data?.items ?? [])
const totalElements = computed(() => feedbackData.value?.data?.totalElements ?? 0)
const selectedFeedback = computed(() => feedbackById.value?.data ?? null)

watch(
  () => feedbackData.value?.data?.totalPages,
  (total) => {
    setTotalPages(total || 0)
  },
  { immediate: true }
)

const openViewModel = (feedbackId: number) => {
  selectedFeedbackId.value = feedbackId
  isOpenViewModel.value = true
}

const closeViewModel = () => {
  isOpenViewModel.value = false
  selectedFeedbackId.value = null
}

const openHandleModel = (feedbackId: number) => {
  selectedFeedbackId.value = feedbackId
  isOpenHandleModel.value = true
}

const closeHandleModel = () => {
  isOpenHandleModel.value = false
  selectedFeedbackId.value = null
}

const submitHandleFeedback = (payload: FeedbackHandleReq) => {
  if (!selectedFeedbackId.value) return

  handleFeedback(
    {
      feedbackId: selectedFeedbackId.value,
      data: payload
    },
    {
      onSuccess: () => {
        isOpenHandleModel.value = false
        feedbackQuery.refetch()
      }
    }
  )
}

const getTypeLabel = (type: FeedbackType) => {
  const map: Record<string, string> = {
    BUG_REPORT: 'Báo lỗi',
    FEATURE_REQUEST: 'Đề xuất tính năng',
    UI_FEEDBACK: 'Góp ý giao diện',
    OTHER: 'Khác'
  }

  return map[type] ?? type
}

const getTypeClass = (type: FeedbackType) => {
  const map: Record<string, string> = {
    BUG_REPORT: 'bg-red-50 text-red-700 ring-red-200',
    FEATURE_REQUEST: 'bg-blue-50 text-blue-700 ring-blue-200',
    UI_FEEDBACK: 'bg-violet-50 text-violet-700 ring-violet-200',
    OTHER: 'bg-slate-50 text-slate-700 ring-slate-200'
  }

  return map[type] ?? 'bg-slate-50 text-slate-700 ring-slate-200'
}

const getStatusLabel = (status: FeedbackStatus) => {
  const map: Record<string, string> = {
    PENDING: 'Chờ xử lý',
    PROCESSING: 'Đang xử lý',
    RESOLVED: 'Đã xử lý',
    REJECTED: 'Từ chối'
  }

  return map[status] ?? status
}

const getStatusClass = (status: FeedbackStatus) => {
  const map: Record<string, string> = {
    PENDING: 'bg-slate-50 text-slate-600 ring-slate-200',
    PROCESSING: 'bg-amber-50 text-amber-700 ring-amber-200',
    RESOLVED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    REJECTED: 'bg-red-50 text-red-700 ring-red-200'
  }

  return map[status] ?? 'bg-slate-50 text-slate-700 ring-slate-200'
}
</script>

<template>
  <div class="bg-slate-50/70">
    <div class="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <div
        class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        <div class="flex items-center gap-4">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <MessageSquare :size="24" />
          </div>
          <div>
            <h1 class="text-2xl font-black tracking-tight text-slate-900">Quản lý phản hồi</h1>
            <p class="mt-1 text-sm font-medium text-slate-500">
              Xem, theo dõi và xử lý phản hồi người dùng gửi về hệ thống.
            </p>
          </div>
        </div>

        <div
          class="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-black text-emerald-700 ring-1 ring-emerald-100">
          <CheckCircle2 :size="18" />
          Tổng: {{ totalElements }} phản hồi
        </div>
      </div>

      <div class="relative">
        <Search :size="18" class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input v-model="keyword" type="text" placeholder="Tìm kiếm theo tiêu đề..."
          class="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-700 outline-none shadow-sm transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10" />
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div v-if="isLoading" class="flex min-h-72 items-center justify-center">
          <div class="text-center">
            <div class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-emerald-500">
            </div>
            <p class="mt-4 text-sm font-semibold text-slate-500">Đang tải danh sách phản hồi...</p>
          </div>
        </div>

        <div v-else-if="feedbacks.length === 0"
          class="flex min-h-72 flex-col items-center justify-center px-6 text-center">
          <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
            <MessageSquare :size="26" />
          </div>
          <h2 class="mt-4 text-lg font-black text-slate-900">Không có phản hồi</h2>
          <p class="mt-1 max-w-md text-sm font-medium text-slate-500">
            Danh sách phản hồi sẽ hiển thị khi người dùng gửi góp ý cho hệ thống.
          </p>
        </div>

        <div v-else class="overflow-x-auto rounded-2xl">
          <table class="w-full text-left text-sm">
            <thead class="sticky top-0 bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
              <tr>
                <th class="whitespace-nowrap px-4 py-4 sm:px-5">STT</th>
                <th class="whitespace-nowrap px-4 py-4 sm:px-5">Người gửi</th>
                <th class="hidden px-4 py-4 sm:px-5 lg:table-cell">Tiêu đề</th>
                <th class="hidden px-4 py-4 sm:px-5 xl:table-cell">Loại</th>
                <th class="hidden px-4 py-4 sm:px-5 xl:table-cell">Nội dung</th>
                <th class="hidden px-4 py-4 sm:px-5 md:table-cell">Ngày gửi</th>
                <th class="whitespace-nowrap px-4 py-4 sm:px-5">Trạng thái</th>
                <th class="hidden px-4 py-4 sm:px-5 lg:table-cell">Phản hồi</th>
                <th class="whitespace-nowrap px-4 py-4 text-right sm:px-5">Thao tác</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="(feedback, index) in feedbacks" :key="feedback.feedbackId"
                class="transition hover:bg-emerald-50/30">
                <td class="whitespace-nowrap px-4 py-4 text-xs font-bold text-slate-500 sm:px-5 sm:text-sm">
                  {{ index + 1 + currentPage * pagination.size }}
                </td>
                <td class="truncate px-4 py-4 text-xs font-semibold text-slate-600 sm:px-5 sm:text-sm">
                  {{ feedback.email || 'Không có' }}
                </td>
                <td
                  class="hidden truncate px-4 py-4 text-xs font-black text-slate-900 sm:px-5 lg:table-cell lg:text-sm">
                  {{ feedback.subject }}
                </td>
                <td class="hidden whitespace-nowrap px-4 py-4 sm:px-5 xl:table-cell">
                  <span class="inline-flex rounded-full px-2 py-1 text-xs font-black ring-1"
                    :class="getTypeClass(feedback.type)">
                    {{ getTypeLabel(feedback.type) }}
                  </span>
                </td>
                <td class="hidden px-4 py-4 sm:px-5 xl:table-cell">
                  <p class="line-clamp-1 text-xs font-medium text-slate-600 lg:line-clamp-2">
                    {{ feedback.content }}
                  </p>
                </td>
                <td
                  class="hidden whitespace-nowrap px-4 py-4 text-xs font-semibold text-slate-600 sm:px-5 md:table-cell">
                  {{ new Date(feedback.createdAt).toLocaleDateString('vi-VN') }}
                </td>
                <td class="whitespace-nowrap px-4 py-4 sm:px-5">
                  <span class="inline-flex rounded-full px-2 py-1 text-xs font-black ring-1"
                    :class="getStatusClass(feedback.status)">
                    {{ getStatusLabel(feedback.status) }}
                  </span>
                </td>
                <td class="hidden px-4 py-4 sm:px-5 lg:table-cell">
                  <p class="line-clamp-1 text-xs font-medium text-slate-600 lg:line-clamp-2">
                    {{ feedback.adminResponse || 'Chưa có' }}
                  </p>
                </td>
                <td class="px-4 py-4 sm:px-5">
                  <div class="flex flex-col justify-end gap-1.5 sm:flex-row sm:gap-2">
                    <button type="button"
                      class="inline-flex items-center justify-center gap-1 truncate rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs font-black text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 sm:px-3"
                      @click="openViewModel(feedback.feedbackId)">
                      <Eye :size="15" />
                      <span class="hidden sm:inline">Xem</span>
                    </button>
                    <button type="button"
                      class="inline-flex items-center justify-center gap-1 truncate rounded-xl bg-slate-900 px-2 py-2 text-xs font-black text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3"
                      :disabled="isHandlingFeedback" @click="openHandleModel(feedback.feedbackId)">
                      <Wrench :size="15" />
                      <span class="hidden sm:inline">Xử lý</span>
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

    <ViewFeedbackModel :show="isOpenViewModel" :feedback="selectedFeedback" :is-loading="isLoadingFeedbackDetail"
      @close="closeViewModel" />

    <HandleFeedbackModel :show="isOpenHandleModel" :feedback="selectedFeedback"
      :is-loading="isLoadingFeedbackDetail || isHandlingFeedback" @close="closeHandleModel"
      @submit="submitHandleFeedback" />
  </div>
</template>
