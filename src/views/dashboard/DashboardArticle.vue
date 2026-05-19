<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { refDebounced } from '@vueuse/core'
import {
  BadgeCheck,
  CalendarDays,
  FileText,
  Filter,
  ImageOff,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2
} from 'lucide-vue-next'
import { useArticlesQuery } from '@/hooks/queries/article/useArticles'
import { usePagination } from '@/composables/common/usePagination'
import AppPagination from '@/components/forms/common/AppPagination.vue'
import type { ArticleRes, ArticleStatus } from '@/types/article/article.types'

const keyword = ref('')
const debouncedKeyword = refDebounced(keyword, 500)
const status = ref<ArticleStatus | ''>('')
const categoryId = ref<number | null>(null)

const {
  pagination,
  currentPage,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
  setTotalPages
} = usePagination(10, 0)

const queryParams = computed(() => ({
  keyword: debouncedKeyword.value.trim(),
  status: status.value || null,
  categoryId: categoryId.value,
  page: pagination.page,
  size: pagination.size,
  sort: 'createdAt,desc'
}))

const { data: articlesData, isFetching } = useArticlesQuery(queryParams)

const articles = computed<ArticleRes[]>(() => articlesData.value?.data?.items ?? [])
const totalElements = computed(() => articlesData.value?.data?.totalElements ?? 0)

watch(
  () => articlesData.value?.data?.totalPages,
  (total) => setTotalPages(total || 0),
  { immediate: true }
)

watch([debouncedKeyword, status, categoryId], () => {
  pagination.page = 0
})

const formatDate = (date?: string | null) => {
  if (!date) return 'Chưa có'
  return new Date(date).toLocaleDateString('vi-VN')
}

const getStatusLabel = (value: ArticleStatus) => {
  const labels: Record<string, string> = {
    DRAFT: 'Bản nháp',
    PUBLISHED: 'Đã xuất bản',
    ARCHIVED: 'Lưu trữ'
  }

  return labels[value] ?? value
}

const getStatusClass = (value: ArticleStatus) => {
  const classes: Record<string, string> = {
    DRAFT: 'bg-slate-100 text-slate-600 border-slate-200',
    PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    ARCHIVED: 'bg-amber-50 text-amber-700 border-amber-100'
  }

  return classes[value] ?? 'bg-slate-100 text-slate-600 border-slate-200'
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="flex items-center gap-2 text-2xl font-bold">
          <FileText class="h-8 w-8 text-amber-600" />
          Quản lý Bài viết
        </h1>
        <p class="mt-1 text-sm text-slate-500">Theo dõi, lọc và quản lý danh sách bài viết hệ thống</p>
      </div>

      <button
        type="button"
        class="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 font-bold text-white shadow-md shadow-amber-100 transition-all hover:bg-amber-700"
      >
        <Plus class="h-5 w-5" />
        Thêm bài viết
      </button>
    </div>

    <div class="mb-6 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
      <div class="relative w-full flex-1">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          v-model="keyword"
          type="text"
          placeholder="Tìm kiếm tiêu đề, slug hoặc nội dung..."
          class="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      <div class="flex w-full items-center gap-2 md:w-auto">
        <select
          v-model="status"
          class="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500 md:flex-none"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="DRAFT">Bản nháp</option>
          <option value="PUBLISHED">Đã xuất bản</option>
          <option value="ARCHIVED">Lưu trữ</option>
        </select>
        <button class="rounded-lg bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200">
          <Filter class="h-5 w-5" />
        </button>
      </div>
    </div>

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-400">
              <th class="w-16 px-6 py-4 text-center">ID</th>
              <th class="px-6 py-4">Bài viết</th>
              <th class="px-6 py-4">Danh mục</th>
              <th class="px-6 py-4">Trạng thái</th>
              <th class="px-6 py-4 text-center">Nổi bật</th>
              <th class="px-6 py-4">Ngày tạo</th>
              <th class="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="article in articles" :key="article.articleId" class="group transition-colors hover:bg-slate-50/50">
              <td class="px-6 py-4 text-center">
                <span class="font-mono text-xs font-bold text-slate-400">#{{ article.articleId }}</span>
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                    <img
                      v-if="article.thumbnailUrl"
                      :src="article.thumbnailUrl"
                      :alt="article.title"
                      class="h-full w-full object-cover"
                    />
                    <ImageOff v-else class="h-5 w-5 text-slate-400" />
                  </div>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-bold text-slate-800">{{ article.title }}</p>
                    <p class="mt-1 truncate text-xs text-slate-400">{{ article.slug }}</p>
                    <p v-if="article.summary" class="mt-1 line-clamp-1 text-xs text-slate-500">
                      {{ article.summary }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="px-6 py-4">
                <span class="rounded border border-blue-100 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                  {{ article.articleCategoryName || article.articleCategoryId || 'Chưa phân loại' }}
                </span>
              </td>

              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold"
                  :class="getStatusClass(article.status)"
                >
                  <BadgeCheck class="h-3.5 w-3.5" />
                  {{ getStatusLabel(article.status) }}
                </span>
              </td>

              <td class="px-6 py-4 text-center">
                <Star
                  class="mx-auto h-4 w-4"
                  :class="article.isFeatured ? 'fill-amber-400 text-amber-500' : 'text-slate-300'"
                />
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CalendarDays class="h-4 w-4 text-slate-400" />
                  {{ formatDate(article.createdAt) }}
                </div>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    class="rounded-lg p-2 text-slate-400 transition-all hover:bg-amber-50 hover:text-amber-600"
                    title="Chỉnh sửa"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    class="rounded-lg p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                    title="Xóa"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!articles.length">
              <td colspan="7" class="px-6 py-10 text-center text-sm font-medium text-slate-400">
                {{ isFetching ? 'Đang tải bài viết...' : 'Chưa có bài viết' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row">
        <p class="text-xs font-medium italic text-slate-500">
          Hiển thị từ {{ totalElements === 0 ? 0 : pagination.page * pagination.size + 1 }} đến
          {{ Math.min((pagination.page + 1) * pagination.size, totalElements) }} trong tổng số
          {{ totalElements }} bài viết
        </p>

        <AppPagination
          :page="currentPage"
          :total-pages="pagination.totalPages"
          :has-next="hasNextPage"
          :has-prev="hasPrevPage"
          class="!mt-0"
          @next="nextPage"
          @prev="prevPage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}
</style>
