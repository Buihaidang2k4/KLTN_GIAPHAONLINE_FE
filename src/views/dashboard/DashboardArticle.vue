<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { refDebounced } from '@vueuse/core'
import {
  BadgeCheck, CalendarDays, FileText, Filter,
  ImageOff, Pencil, Plus, Search, Star, Trash2
} from 'lucide-vue-next'
import {
  useArticlesQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  usePublishArticleMutation,
  useUnpublishArticleMutation,
  useToggleFeaturedArticleMutation
} from '@/hooks/queries/article/useArticles'
import { usePagination } from '@/composables/common/usePagination'
import AppPagination from '@/components/forms/common/AppPagination.vue'
import CreateArticleModal from '@/components/forms/article/CreateArticleModal.vue'
import UpdateArticleModal from '@/components/forms/article/UpdateArticleModal.vue'
import type { ArticleRes, ArticleReq, ArticleStatus } from '@/types/article/article.types'
import { notify } from '@/utils/notify'

const keyword = ref('')
const debouncedKeyword = refDebounced(keyword, 500)
const status = ref<ArticleStatus | ''>('')
const categoryId = ref<number | null>(null)

const {
  pagination, currentPage, hasNextPage, hasPrevPage,
  nextPage, prevPage, setTotalPages
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

watch(() => articlesData.value?.data?.totalPages, (total) => setTotalPages(total || 0), { immediate: true })
watch([debouncedKeyword, status, categoryId], () => { pagination.page = 0 })

// ==================== Mutations ====================
const createMutation = useCreateArticleMutation()
const updateMutation = useUpdateArticleMutation()
const deleteMutation = useDeleteArticleMutation()
const publishMutation = usePublishArticleMutation()
const unpublishMutation = useUnpublishArticleMutation()
const toggleFeaturedMutation = useToggleFeaturedArticleMutation()

// ==================== Modal state ====================
const isCreateOpen = ref(false)
const isUpdateOpen = ref(false)
const selectedArticle = ref<ArticleRes | null>(null)

const openCreate = () => { isCreateOpen.value = true }

const openUpdate = (article: ArticleRes) => {
  selectedArticle.value = article
  isUpdateOpen.value = true
}

const closeCreate = () => { isCreateOpen.value = false }
const closeUpdate = () => { isUpdateOpen.value = false; selectedArticle.value = null }

// ==================== Handlers ====================
const handleCreate = (formData: any) => {
  const payload: ArticleReq = {
    title: formData.title,
    summary: formData.summary || null,
    content: formData.content,
    contentFormat: 'HTML',
    articleCategoryId: formData.categoryId || null,
    isFeatured: formData.isFeatured,
    thumbnail: formData.thumbnailFile || null,
  }
  createMutation.mutate(payload, {
    onSuccess: (res) => {
      const articleId = res.data.articleId
      if (formData.status === 'PUBLISHED') {
        publishMutation.mutate(articleId)
      }
      notify.success('Thông báo', 'Tạo bài viết thành công')
      closeCreate()
    },
    onError: () => notify.error('Thông báo', 'Tạo bài viết thất bại')
  })
}

const handleUpdate = (formData: any) => {
  if (!selectedArticle.value) return
  const articleId = selectedArticle.value.articleId
  const oldArticle = selectedArticle.value

  const payload: ArticleReq = {
    title: formData.title,
    summary: formData.summary || null,
    content: formData.content,
    contentFormat: 'HTML',
    articleCategoryId: formData.articleCategoryId || null,
    isFeatured: formData.isFeatured,
    thumbnail: formData.thumbnailFile || null,
  }

  updateMutation.mutate({ articleId, data: payload }, {
    onSuccess: () => {
      if (formData.isFeatured !== oldArticle.isFeatured) {
        toggleFeaturedMutation.mutate(articleId)
      }
      if (formData.status !== oldArticle.status) {
        if (formData.status === 'PUBLISHED') {
          publishMutation.mutate(articleId)
        } else {
          unpublishMutation.mutate(articleId)
        }
      }
      notify.success('Thông báo', 'Cập nhật bài viết thành công')
      closeUpdate()
    },
    onError: () => notify.error('Thông báo', 'Cập nhật bài viết thất bại')
  })
}

const handleTogglePublish = (article: ArticleRes) => {
  if (article.status === 'PUBLISHED') {
    unpublishMutation.mutate(article.articleId, {
      onSuccess: () => notify.success('Thông báo', 'Đã chuyển thành bản nháp'),
      onError: () => notify.error('Thông báo', 'Chuyển trạng thái thất bại')
    })
  } else {
    publishMutation.mutate(article.articleId, {
      onSuccess: () => notify.success('Thông báo', 'Đã xuất bản bài viết'),
      onError: () => notify.error('Thông báo', 'Chuyển trạng thái thất bại')
    })
  }
}

const handleToggleFeatured = (article: ArticleRes) => {
  toggleFeaturedMutation.mutate(article.articleId, {
    onSuccess: () => notify.success('Thông báo', 'Đã cập nhật trạng thái nổi bật'),
    onError: () => notify.error('Thông báo', 'Cập nhật thất bại')
  })
}

const handleDelete = (article: ArticleRes) => {
  if (!confirm(`Xóa bài viết "${article.title}"?`)) return
  deleteMutation.mutate(article.articleId, {
    onSuccess: () => notify.success('Thông báo', 'Xóa bài viết thành công'),
    onError: () => notify.error('Thông báo', 'Xóa bài viết thất bại')
  })
}

// ==================== Helpers ====================
const formatDate = (date?: string | null) => {
  if (!date) return 'Chưa có'
  return new Date(date).toLocaleDateString('vi-VN')
}

const getStatusLabel = (value: ArticleStatus) => {
  const labels: Record<string, string> = {
    DRAFT: 'Bản nháp', PUBLISHED: 'Đã xuất bản', ARCHIVED: 'Lưu trữ'
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
    <!-- Header & nút thêm mới -->
    <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 class="flex items-center gap-2 text-2xl font-bold">
          <FileText class="h-8 w-8 text-amber-600" />
          Quản lý Bài viết
        </h1>
        <p class="mt-1 text-sm text-slate-500">Theo dõi, lọc và quản lý danh sách bài viết hệ thống</p>
      </div>

      <button type="button" @click="openCreate"
        class="flex items-center gap-2 rounded-xl bg-amber-600 px-5 py-2.5 font-bold text-white shadow-md shadow-amber-100 transition-all hover:bg-amber-700">
        <Plus class="h-5 w-5" />
        Thêm bài viết
      </button>
    </div>

    <!-- Bộ lọc -->
    <div
      class="mb-6 flex flex-col items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
      <div class="relative w-full flex-1">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input v-model="keyword" type="text" placeholder="Tìm kiếm tiêu đề, slug hoặc nội dung..."
          class="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-amber-500" />
      </div>

      <div class="flex w-full items-center gap-2 md:w-auto">
        <select v-model="status"
          class="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500 md:flex-none">
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

    <!-- Bảng dữ liệu -->
    <div class="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <!-- Thanh loading mỏng phía trên khi đang fetch -->
      <div v-if="isFetching"
        class="absolute inset-x-0 top-0 z-10 h-1 animate-pulse bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400">
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr
              class="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-widest text-slate-400">
              <th class="w-16 px-6 py-4 text-center">ID</th>
              <th class="px-6 py-4 max-w-[200px] sm:max-w-[300px] md:max-w-[400px] truncate">Bài viết</th>
              <th class="px-6 py-4">Danh mục</th>
              <th class="px-6 py-4">Trạng thái</th>
              <th class="px-6 py-4 text-center">Nổi bật</th>
              <th class="px-6 py-4">Ngày tạo</th>
              <th class="px-6 py-4 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <!-- Dữ liệu thực tế khi có bài viết -->
            <tr v-for="article in articles" :key="article.articleId"
              class="group transition-colors hover:bg-slate-50/50">
              <td class="px-6 py-4 text-center">
                <span class="font-mono text-xs font-bold text-slate-400">#{{ article.articleId }}</span>
              </td>

              <td class="px-6 py-4 max-w-[200px] sm:max-w-[300px] md:max-w-[400px]">
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                    <img v-if="article.thumbnailUrl" :src="article.thumbnailUrl" :alt="article.title"
                      class="h-full w-full object-cover" />
                    <ImageOff v-else class="h-5 w-5 text-slate-400" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-bold text-slate-800" :title="article.title">{{ article.title }}</p>
                    <p class="mt-1 truncate text-xs text-slate-400" :title="article.slug">{{ article.slug }}</p>
                    <p v-if="article.summary" class="mt-1 line-clamp-1 text-xs text-slate-500" :title="article.summary">
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
                <span @click="handleTogglePublish(article)"
                  class="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity"
                  :class="getStatusClass(article.status)" title="Click để đổi trạng thái">
                  <BadgeCheck class="h-3.5 w-3.5" />
                  {{ getStatusLabel(article.status) }}
                </span>
              </td>

              <td class="px-6 py-4 text-center">
                <Star @click="handleToggleFeatured(article)"
                  class="mx-auto h-4 w-4 cursor-pointer hover:scale-110 transition-transform"
                  :class="article.isFeatured ? 'fill-amber-400 text-amber-500' : 'text-slate-300'"
                  title="Click để bật/tắt nổi bật" />
              </td>

              <td class="px-6 py-4">
                <div class="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <CalendarDays class="h-4 w-4 text-slate-400" />
                  {{ formatDate(article.createdAt) }}
                </div>
              </td>

              <td class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button @click="openUpdate(article)"
                    class="rounded-lg p-2 text-slate-400 transition-all hover:bg-amber-50 hover:text-amber-600"
                    title="Chỉnh sửa">
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button @click="handleDelete(article)"
                    class="rounded-lg p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                    title="Xóa">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Skeleton loading khi đang tải và chưa có dữ liệu -->
            <template v-if="isFetching && !articles.length">
              <tr v-for="i in 5" :key="'skeleton-' + i" class="animate-pulse">
                <td class="px-6 py-4 text-center">
                  <div class="mx-auto h-4 w-8 rounded bg-slate-200"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="h-12 w-16 shrink-0 rounded-lg bg-slate-200"></div>
                    <div class="flex-1 space-y-2">
                      <div class="h-4 w-3/4 rounded bg-slate-200"></div>
                      <div class="h-3 w-1/2 rounded bg-slate-200"></div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-5 w-20 rounded bg-slate-200"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-5 w-24 rounded-full bg-slate-200"></div>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="mx-auto h-4 w-4 rounded bg-slate-200"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 w-24 rounded bg-slate-200"></div>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="ml-auto h-4 w-16 rounded bg-slate-200"></div>
                </td>
              </tr>
            </template>

            <!-- Không có dữ liệu (khi không fetch) -->
            <tr v-if="!isFetching && !articles.length">
              <td colspan="7" class="px-6 py-10 text-center text-sm font-medium text-slate-400">
                Chưa có bài viết
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Phân trang -->
      <div
        class="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 p-4 sm:flex-row">
        <p class="text-xs font-medium italic text-slate-500">
          Hiển thị từ {{ totalElements === 0 ? 0 : pagination.page * pagination.size + 1 }} đến
          {{ Math.min((pagination.page + 1) * pagination.size, totalElements) }} trong tổng số
          {{ totalElements }} bài viết
        </p>

        <AppPagination :page="currentPage" :total-pages="pagination.totalPages" :has-next="hasNextPage"
          :has-prev="hasPrevPage" class="!mt-0" @next="nextPage" @prev="prevPage" />
      </div>
    </div>
  </div>

  <!-- Modal tạo mới -->
  <CreateArticleModal :show="isCreateOpen" :is-loading="createMutation.isPending.value" @close="closeCreate"
    @create="handleCreate" />

  <!-- Modal cập nhật -->
  <UpdateArticleModal :show="isUpdateOpen" :article="selectedArticle" :is-loading="updateMutation.isPending.value"
    @close="closeUpdate" @update="handleUpdate" />
</template>

<style scoped>
table {
  border-collapse: separate;
  border-spacing: 0;
}
</style>