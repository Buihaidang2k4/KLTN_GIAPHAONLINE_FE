<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Calendar, Tag, Clock, Star, ImageOff } from 'lucide-vue-next'
import { useArticleBySlugQuery, useArticlesQuery } from '@/hooks/queries/article/useArticles'
import type { ArticleStatus } from '@/types/article/article.types'

const route = useRoute()
const router = useRouter()

const slug = computed(() => route.params.slug as string)

// Fetch chi tiết bài viết theo slug
const { data: articleData, isFetching, error } = useArticleBySlugQuery(slug)
const article = computed(() => articleData.value?.data)

// Fetch bài viết liên quan (cùng danh mục)
const categoryId = computed(() => article.value?.articleCategoryId ?? null)
const relatedParams = computed(() => ({
  categoryId: categoryId.value,
  status: 'PUBLISHED' as ArticleStatus,
  size: 5, 
  sort: 'createdAt,desc'
}))
const { data: relatedData } = useArticlesQuery(relatedParams)

const relatedArticles = computed(() => {
  const items = relatedData.value?.data?.items ?? []
  // Loại trừ bài viết đang đọc
  return items.filter(item => item.articleId !== article.value?.articleId).slice(0, 3)
})

const goBack = () => {
  router.push({ name: 'HomePost' })
}

const navigateToDetail = (newSlug: string) => {
  router.push({ name: 'HomePostDetails', params: { slug: newSlug } })
}

const formatDate = (date?: string | null) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-amber-50/20 via-white to-slate-50/30 py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Back button -->
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-amber-50 border border-slate-200/80 rounded-2xl text-xs font-bold text-slate-600 hover:text-amber-900 transition-all shadow-sm mb-8"
      >
        <ArrowLeft class="w-4 h-4" />
        Quay lại danh sách
      </button>

      <!-- Loading State -->
      <div v-if="isFetching" class="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div class="space-y-4">
          <div class="h-4 bg-slate-200 rounded-full w-24"></div>
          <div class="h-10 bg-slate-200 rounded-full w-3/4"></div>
          <div class="h-4 bg-slate-200 rounded-full w-1/3"></div>
        </div>
        <div class="w-full aspect-[21/9] bg-slate-200 rounded-3xl"></div>
        <div class="space-y-4 pt-4">
          <div class="h-4 bg-slate-200 rounded-full w-full"></div>
          <div class="h-4 bg-slate-200 rounded-full w-full"></div>
          <div class="h-4 bg-slate-200 rounded-full w-4/5"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error || !article" class="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
        <div class="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <ImageOff class="w-8 h-8" />
        </div>
        <h3 class="text-lg font-bold text-slate-800">Không thể tìm thấy bài viết</h3>
        <p class="text-sm text-slate-500 max-w-sm mx-auto">
          Đường dẫn không chính xác hoặc bài viết đã bị xóa/ẩn. Vui lòng quay lại danh sách bài viết.
        </p>
        <button @click="goBack" class="px-6 py-2.5 bg-amber-800 text-white rounded-xl text-sm font-bold hover:bg-amber-950 transition-colors">
          Quay lại danh sách
        </button>
      </div>

      <!-- Main Layout Details -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Cột nội dung chính bài viết -->
        <div class="lg:col-span-2 space-y-8 bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-10 shadow-sm">
          
          <!-- Header Meta -->
          <div class="space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                {{ article.articleCategoryName || 'Tin tức' }}
              </span>
              <span v-if="article.isFeatured" class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                <Star class="w-3 h-3 fill-white" /> Nổi bật
              </span>
            </div>

            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
              {{ article.title }}
            </h1>

            <div class="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-semibold pt-2">
              <span class="flex items-center gap-1.5">
                <Calendar class="w-4 h-4 text-slate-400" />
                {{ formatDate(article.createdAt) }}
              </span>
              <span class="flex items-center gap-1.5">
                <Clock class="w-4 h-4 text-slate-400" />
                Bài hướng dẫn
              </span>
            </div>
          </div>

          <!-- Hero Thumbnail -->
          <div v-if="article.thumbnailUrl" class="w-full overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
            <img :src="article.thumbnailUrl" :alt="article.title" class="w-full object-cover max-h-[400px]" />
          </div>

          <!-- Summary callout -->
          <div v-if="article.summary" class="border-l-4 border-amber-500 bg-amber-50/40 p-5 rounded-r-2xl">
            <p class="text-sm font-semibold text-slate-700 italic leading-relaxed">
              &ldquo; {{ article.summary }} &rdquo;
            </p>
          </div>

          <!-- Rich Text Content Render -->
          <div class="article-body text-slate-700 text-base leading-relaxed space-y-6" v-html="article.content"></div>

        </div>

        <!-- Cột Sidebar: Bài viết liên quan -->
        <div class="space-y-6">
          <div class="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm sticky top-24 space-y-6">
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Tag class="w-5 h-5 text-amber-600" />
              Bài viết cùng danh mục
            </h2>

            <div v-if="!relatedArticles.length" class="text-center py-6 text-sm text-slate-400 font-medium">
              Chưa có bài viết liên quan khác
            </div>

            <div v-else class="flex flex-col gap-4">
              <div
                v-for="rel in relatedArticles"
                :key="rel.articleId"
                @click="navigateToDetail(rel.slug)"
                class="group cursor-pointer flex gap-4 items-start hover:bg-slate-50/50 p-2 rounded-xl transition-all"
              >
                <!-- Small thumbnail -->
                <div class="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                  <img v-if="rel.thumbnailUrl" :src="rel.thumbnailUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div v-else class="w-full h-full flex items-center justify-center bg-amber-50/30">
                    <ImageOff class="w-5 h-5 text-amber-800/30" />
                  </div>
                </div>

                <div class="min-w-0 space-y-1">
                  <h4 class="text-xs font-bold text-slate-800 group-hover:text-amber-800 line-clamp-2 leading-snug transition-colors">
                    {{ rel.title }}
                  </h4>
                  <p class="text-[10px] text-slate-400 font-semibold">
                    {{ formatDate(rel.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<style>
/* Style cho phần nội dung Rich Text chèn từ WangEditor */
.article-body p {
  margin-bottom: 1.25rem;
  line-height: 1.8;
  color: #334155; /* slate-700 */
}

.article-body h2 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a; /* slate-900 */
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.4;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 0.5rem;
}

.article-body h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b; /* slate-800 */
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.article-body img {
  border-radius: 1rem;
  margin: 1.5rem auto;
  max-width: 100%;
  height: auto;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  border: 1px solid #f1f5f9;
}

.article-body ul, .article-body ol {
  margin-left: 1.5rem;
  margin-bottom: 1.25rem;
  list-style-position: outside;
}

.article-body ul {
  list-style-type: disc;
}

.article-body ol {
  list-style-type: decimal;
}

.article-body li {
  margin-bottom: 0.5rem;
  line-height: 1.7;
}

.article-body strong {
  font-weight: 700;
  color: #0f172a;
}

.article-body blockquote {
  border-left: 4px solid #f59e0b;
  padding-left: 1rem;
  color: #475569;
  font-style: italic;
  margin: 1.5rem 0;
}

.article-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.article-body th, .article-body td {
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
  text-align: left;
}

.article-body th {
  background-color: #f8fafc;
  font-weight: 700;
}
</style>