<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { refDebounced } from '@vueuse/core'
import { Search, Calendar, ChevronLeft, ChevronRight, BookOpen, Clock, Tag, ImageOff } from 'lucide-vue-next'
import { useArticlesQuery } from '@/hooks/queries/article/useArticles'
import { useArticleCategoriesQuery } from '@/hooks/queries/article_category/useArticleCategory'
import { usePagination } from '@/composables/common/usePagination'
import AppPagination from '@/components/forms/common/AppPagination.vue'
import type { ArticleRes, ArticleStatus } from '@/types/article/article.types'

const router = useRouter()
const keyword = ref('')
const debouncedKeyword = refDebounced(keyword, 500)
const selectedCategoryId = ref<number | null>(null)

const {
    pagination,
    currentPage,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    setTotalPages
} = usePagination(9, 0)

const queryParams = computed(() => ({
    keyword: debouncedKeyword.value.trim(),
    status: 'PUBLISHED' as ArticleStatus,
    categoryId: selectedCategoryId.value,
    page: pagination.page,
    size: pagination.size,
    sort: 'createdAt,desc'
}))

const { data: articlesData, isFetching } = useArticlesQuery(queryParams)
const { data: categoriesData } = useArticleCategoriesQuery({ size: 100 })

const articles = computed<ArticleRes[]>(() => articlesData.value?.data?.items ?? [])
const categories = computed(() => categoriesData.value?.data?.items ?? [])

watch(
    () => articlesData.value?.data?.totalPages,
    (total) => setTotalPages(total || 0),
    { immediate: true }
)

watch([debouncedKeyword, selectedCategoryId], () => {
    pagination.page = 0
})

const selectCategory = (id: number | null) => {
    selectedCategoryId.value = id
}

const navigateToDetail = (slug: string) => {
    router.push({ name: 'HomePostDetails', params: { slug } })
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
    <div class="min-h-screen bg-gradient-to-b from-amber-50/40 via-white to-slate-50/50 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <!-- Header / Banner -->
            <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <span
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
                    📰 Góc Chia Sẻ
                </span>
                <h1 class="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    Tin Tức & Hướng Dẫn Gia Phả
                </h1>
                <p class="text-lg text-slate-600">
                    Khám phá những câu chuyện dòng họ, hướng dẫn lập gia phả chuyên nghiệp và các giá trị văn hóa gia
                    đình truyền thống.
                </p>

                <!-- Search Bar -->
                <div class="relative max-w-xl mx-auto mt-8 group">
                    <Search
                        class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-600 transition-colors" />
                    <input v-model="keyword" type="text" placeholder="Tìm kiếm bài viết, tin tức..."
                        class="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold shadow-sm outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all" />
                </div>
            </div>

            <!-- Main Layout Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

                <!-- Sidebar: Danh mục -->
                <div class="space-y-6">
                    <div class="bg-white rounded-3xl border border-slate-200/60 p-6 shadow-sm sticky top-24">
                        <h2 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Tag class="w-5 h-5 text-amber-600" />
                            Danh mục bài viết
                        </h2>

                        <div class="flex flex-col gap-1">
                            <button @click="selectCategory(null)"
                                class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex justify-between items-center"
                                :class="selectedCategoryId === null
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'">
                                <span>Tất cả bài viết</span>
                            </button>

                            <button v-for="cat in categories" :key="cat.articleCategoryId"
                                @click="selectCategory(cat.articleCategoryId)"
                                class="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex justify-between items-center"
                                :class="selectedCategoryId === cat.articleCategoryId
                                    ? 'bg-amber-100 text-amber-900'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'">
                                <span>{{ cat.name }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Grid bài viết -->
                <div class="lg:col-span-3 space-y-12">

                    <!-- Loading state -->
                    <div v-if="isFetching && !articles.length"
                        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="i in 6" :key="i"
                            class="bg-white rounded-3xl border border-slate-100 p-4 space-y-4 animate-pulse">
                            <div class="w-full aspect-[16/10] bg-slate-100 rounded-2xl"></div>
                            <div class="h-4 bg-slate-100 rounded-full w-2/3"></div>
                            <div class="h-6 bg-slate-100 rounded-full w-full"></div>
                            <div class="h-4 bg-slate-100 rounded-full w-1/2"></div>
                        </div>
                    </div>

                    <!-- Empty state -->
                    <div v-else-if="!articles.length"
                        class="text-center py-20 bg-white rounded-3xl border border-slate-200/60 shadow-sm space-y-4">
                        <div
                            class="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                            <BookOpen class="w-8 h-8" />
                        </div>
                        <h3 class="text-lg font-bold text-slate-800">Không tìm thấy bài viết</h3>
                        <p class="text-sm text-slate-500 max-w-sm mx-auto">
                            Vui lòng thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục bài viết khác.
                        </p>
                    </div>

                    <!-- Articles list -->
                    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <article v-for="article in articles" :key="article.articleId"
                            @click="navigateToDetail(article.slug)"
                            class="group cursor-pointer bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-300/60 transition-all duration-300 flex flex-col h-full">
                            <!-- Thumbnail -->
                            <div class="aspect-[16/10] bg-slate-100 overflow-hidden relative">
                                <img v-if="article.thumbnailUrl" :src="article.thumbnailUrl" :alt="article.title"
                                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div v-else class="w-full h-full flex items-center justify-center bg-amber-50/50">
                                    <ImageOff class="w-8 h-8 text-amber-800/40" />
                                </div>
                            </div>

                            <!-- Content Area -->
                            <div class="p-6 flex-1 flex flex-col justify-between">
                                <div class="space-y-3">
                                    <!-- Category tag -->
                                    <div class="flex items-center gap-2">
                                        <span
                                            class="inline-flex px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 text-[10px] font-bold uppercase tracking-wider">
                                            {{ article.articleCategoryName || 'Tin tức' }}
                                        </span>
                                    </div>

                                    <!-- Title -->
                                    <h3
                                        class="text-base font-bold text-slate-900 group-hover:text-amber-800 line-clamp-2 transition-colors duration-200">
                                        {{ article.title }}
                                    </h3>

                                    <!-- Summary -->
                                    <p class="text-xs text-slate-500 line-clamp-3">
                                        {{ article.summary || 'Không có tóm tắt cho bài viết này.' }}
                                    </p>
                                </div>

                                <!-- Footer info -->
                                <div
                                    class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                                    <span class="flex items-center gap-1">
                                        <Calendar class="w-3.5 h-3.5" />
                                        {{ formatDate(article.createdAt) }}
                                    </span>
                                    <span class="flex items-center gap-1 text-amber-700">
                                        Chi tiết &rarr;
                                    </span>
                                </div>
                            </div>
                        </article>
                    </div>

                    <!-- Pagination controls -->
                    <div v-if="articles.length" class="flex justify-center pt-6">
                        <AppPagination :page="currentPage" :total-pages="pagination.totalPages" :has-next="hasNextPage"
                            :has-prev="hasPrevPage" class="!justify-center !mt-0" @next="nextPage" @prev="prevPage" />
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
/* Thêm một số hiệu ứng mượt mà */
article {
    will-change: transform, box-shadow;
}
</style>