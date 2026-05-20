<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { X, Sparkles, FileText, Tag, Image, AlignLeft } from 'lucide-vue-next'
import WangEditor from '@/components/forms/article/templateEditor.vue'
import { useArticleCategoriesQuery } from '@/hooks/queries/article_category/useArticleCategory'

const props = defineProps<{
    show: boolean
    isLoading?: boolean
}>()

const emit = defineEmits<{
    close: []
    create: [data: ArticleForm]
}>()

interface ArticleForm {
    title: string
    summary: string
    content: string
    categoryId: number | null
    thumbnailUrl: string
    tags: string
    status: 'DRAFT' | 'PUBLISHED'
    isFeatured: boolean
}

const form = reactive<ArticleForm>({
    title: '',
    summary: '',
    content: '<p><br></p>',
    categoryId: null,
    thumbnailUrl: '',
    tags: '',
    status: 'DRAFT',
    isFeatured: false,
})

const errors = reactive({
    title: '',
    content: '',
})

const { data: categoriesData } = useArticleCategoriesQuery({ size: 100 })
const categories = computed(() => categoriesData.value?.data?.items ?? [])

const editorRef = ref()

const validate = () => {
    errors.title = form.title.trim() ? '' : 'Tiêu đề không được để trống'
    const plainText = editorRef.value?.getHtml()?.replace(/<[^>]*>/g, '').trim()
    errors.content = plainText ? '' : 'Nội dung không được để trống'
    return !errors.title && !errors.content
}

const handleSubmit = () => {
    // Lấy HTML từ editor trước khi validate
    form.content = editorRef.value?.getHtml() ?? form.content
    if (!validate()) return
    emit('create', { ...form })
}

const handleClose = () => {
    // Reset form
    form.title = ''
    form.summary = ''
    form.content = '<p><br></p>'
    form.categoryId = null
    form.thumbnailUrl = ''
    form.tags = ''
    form.status = 'DRAFT'
    editorRef.value?.clear()
    errors.title = ''
    errors.content = ''
    emit('close')
}
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" @click="handleClose"></div>

                <div class="relative w-full max-w-4xl rounded-[2rem] bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">

                    <!-- Header -->
                    <div class="flex items-center justify-between px-8 pt-7 pb-5 border-b border-slate-100">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-amber-50 rounded-xl">
                                <FileText class="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                                <div class="flex items-center gap-1.5 mb-0.5">
                                    <Sparkles class="w-3 h-3 text-amber-500" />
                                    <span class="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Tạo mới</span>
                                </div>
                                <h2 class="text-xl font-black text-slate-900">Thêm bài viết mới</h2>
                            </div>
                        </div>
                        <button @click="handleClose" class="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
                            <X :size="20" />
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="px-8 py-6 space-y-5 overflow-y-auto flex-1">

                        <!-- Tiêu đề -->
                        <div class="space-y-1.5">
                            <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <AlignLeft :size="13" class="text-amber-500" /> Tiêu đề <span class="text-red-400">*</span>
                            </label>
                            <input v-model="form.title" type="text" placeholder="Nhập tiêu đề bài viết..."
                                class="w-full rounded-xl border px-4 py-2.5 text-sm font-semibold outline-none transition-all"
                                :class="errors.title ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5'" />
                            <p v-if="errors.title" class="text-[10px] font-bold text-red-500 ml-1">{{ errors.title }}</p>
                        </div>

                        <!-- Tóm tắt -->
                        <div class="space-y-1.5">
                            <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <Tag :size="13" class="text-amber-500" /> Tóm tắt
                            </label>
                            <textarea v-model="form.summary" rows="2" placeholder="Mô tả ngắn về bài viết..."
                                class="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all" />
                        </div>

                        <!-- Danh mục -->
                        <div class="space-y-1.5">
                            <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <Tag :size="13" class="text-amber-500" /> Danh mục bài viết
                            </label>
                            <select v-model="form.categoryId"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all bg-white">
                                <option :value="null">Chọn danh mục...</option>
                                <option v-for="cat in categories" :key="cat.articleCategoryId" :value="cat.articleCategoryId">
                                    {{ cat.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Thumbnail -->
                        <div class="space-y-1.5">
                            <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <Image :size="13" class="text-amber-500" /> Ảnh thumbnail (URL)
                            </label>
                            <input v-model="form.thumbnailUrl" type="text" placeholder="https://..."
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all" />
                        </div>

                        <!-- Trạng thái & Nổi bật -->
                        <div class="flex flex-col sm:flex-row gap-6">
                            <!-- Trạng thái -->
                            <div class="flex items-center gap-4 flex-1">
                                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trạng thái</label>
                                <div class="flex gap-3">
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" v-model="form.status" value="DRAFT" class="accent-amber-500" />
                                        <span class="text-sm font-semibold text-slate-600">Nháp</span>
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" v-model="form.status" value="PUBLISHED" class="accent-amber-500" />
                                        <span class="text-sm font-semibold text-slate-600">Xuất bản</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Nổi bật -->
                            <div class="flex items-center gap-4 flex-1">
                                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nổi bật</label>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="form.isFeatured" class="sr-only peer" />
                                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                                    <span class="ml-3 text-sm font-semibold text-slate-600">
                                        {{ form.isFeatured ? 'Có' : 'Không' }}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <!-- Nội dung (WangEditor) -->
                        <div class="space-y-1.5">
                            <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <FileText :size="13" class="text-amber-500" /> Nội dung <span class="text-red-400">*</span>
                            </label>
                            <WangEditor
                                ref="editorRef"
                                v-model="form.content"
                                upload-image-url="/api/v1/articles/upload-image"
                            />
                            <p v-if="errors.content" class="text-[10px] font-bold text-red-500 ml-1">{{ errors.content }}</p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex items-center justify-end gap-3 px-8 py-5 border-t border-slate-100 bg-slate-50/50">
                        <button type="button" @click="handleClose"
                            class="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all">
                            Hủy bỏ
                        </button>
                        <button type="button" @click="handleSubmit" :disabled="isLoading"
                            class="px-8 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-40">
                            {{ isLoading ? 'Đang tạo...' : 'Tạo bài viết' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
