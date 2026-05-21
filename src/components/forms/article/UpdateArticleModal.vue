<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { X, Sparkles, FileText, Tag, Image, AlignLeft, Upload, Trash2 } from 'lucide-vue-next'
import WangEditor from '@/components/forms/article/templateEditor.vue'
import { useArticleCategoriesQuery } from '@/hooks/queries/article_category/useArticleCategory'

interface ArticleRes {
    articleId: number
    title: string
    summary?: string
    content: string
    categoryId?: number | null
    thumbnailUrl?: string
    tags?: string
    status: 'DRAFT' | 'PUBLISHED'
    isFeatured: boolean
}

interface ArticleForm {
    title: string
    summary: string
    content: string
    categoryId: number | null
    tags: string
    status: 'DRAFT' | 'PUBLISHED'
    isFeatured: boolean
}

const props = defineProps<{
    show: boolean
    article: ArticleRes | null
    isLoading?: boolean
}>()

const emit = defineEmits<{
    close: []
    update: [data: ArticleForm & { thumbnailFile?: File | null }]
}>()

const form = reactive<ArticleForm>({
    title: '',
    summary: '',
    content: '<p><br></p>',
    categoryId: null,
    tags: '',
    status: 'DRAFT',
    isFeatured: false,
})

const thumbnailFile = ref<File | null>(null)
const thumbnailPreview = ref<string | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return
    thumbnailFile.value = file
    thumbnailPreview.value = URL.createObjectURL(file)
}

const removeThumbnail = () => {
    thumbnailFile.value = null
    thumbnailPreview.value = null
    if (fileInputRef.value) fileInputRef.value.value = ''
}

const { data: categoriesData } = useArticleCategoriesQuery({ size: 100 })
const categories = computed(() => categoriesData.value?.data?.items ?? [])

const errors = reactive({ title: '', content: '' })
const editorRef = ref()

// Load dữ liệu article vào form + editor khi mở modal
watch(() => props.article, (val) => {
    if (!val) return
    form.title = val.title ?? ''
    form.summary = val.summary ?? ''
    form.content = val.content ?? '<p><br></p>'
    form.categoryId = val.categoryId ?? null
    form.tags = val.tags ?? ''
    form.status = val.status ?? 'DRAFT'
    form.isFeatured = val.isFeatured ?? false
    // Reset file, hiển ảnh cũ nếu có
    thumbnailFile.value = null
    thumbnailPreview.value = val.thumbnailUrl || null
    if (fileInputRef.value) fileInputRef.value.value = ''
    // Đồng bộ vào editor sau khi DOM render
    setTimeout(() => editorRef.value?.setHtml(form.content), 50)
}, { immediate: true })

const validate = () => {
    errors.title = form.title.trim() ? '' : 'Tiêu đề không được để trống'
    const plainText = editorRef.value?.getHtml()?.replace(/<[^>]*>/g, '').trim()
    errors.content = plainText ? '' : 'Nội dung không được để trống'
    return !errors.title && !errors.content
}

const handleSubmit = () => {
    form.content = editorRef.value?.getHtml() ?? form.content
    if (!validate()) return
    emit('update', { ...form, thumbnailFile: thumbnailFile.value })
}

const handleClose = () => {
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

                <div
                    class="relative w-full max-w-4xl rounded-[2rem] bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">

                    <!-- Header -->
                    <div class="flex items-center justify-between px-8 pt-7 pb-5 border-b border-slate-100">
                        <div class="flex items-center gap-3">
                            <div class="p-2 bg-blue-50 rounded-xl">
                                <FileText class="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <div class="flex items-center gap-1.5 mb-0.5">
                                    <Sparkles class="w-3 h-3 text-blue-500" />
                                    <span class="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Cập
                                        nhật</span>
                                </div>
                                <h2 class="text-xl font-black text-slate-900">Chỉnh sửa bài viết</h2>
                            </div>
                        </div>
                        <button @click="handleClose"
                            class="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
                            <X :size="20" />
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="px-8 py-6 space-y-5 overflow-y-auto flex-1">

                        <!-- Tiêu đề -->
                        <div class="space-y-1.5">
                            <label
                                class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <AlignLeft :size="13" class="text-blue-500" /> Tiêu đề <span
                                    class="text-red-400">*</span>
                            </label>
                            <input v-model="form.title" type="text" placeholder="Nhập tiêu đề bài viết..."
                                class="w-full rounded-xl border px-4 py-2.5 text-sm font-semibold outline-none transition-all"
                                :class="errors.title ? 'border-red-400 bg-red-50/20' : 'border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5'" />
                            <p v-if="errors.title" class="text-[10px] font-bold text-red-500 ml-1">{{ errors.title }}
                            </p>
                        </div>

                        <!-- Tóm tắt -->
                        <div class="space-y-1.5">
                            <label
                                class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <Tag :size="13" class="text-blue-500" /> Tóm tắt
                            </label>
                            <textarea v-model="form.summary" rows="2" placeholder="Mô tả ngắn về bài viết..."
                                class="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all" />
                        </div>

                        <!-- Danh mục -->
                        <div class="space-y-1.5">
                            <label
                                class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <Tag :size="13" class="text-blue-500" /> Danh mục bài viết
                            </label>
                            <select v-model="form.categoryId"
                                class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition-all bg-white">
                                <option :value="null">Chọn danh mục...</option>
                                <option v-for="cat in categories" :key="cat.articleCategoryId" :value="cat.articleCategoryId">
                                    {{ cat.name }}
                                </option>
                            </select>
                        </div>

                        <!-- Thumbnail -->
                        <div class="space-y-1.5">
                            <label
                                class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <Image :size="13" class="text-blue-500" /> Ảnh thumbnail
                            </label>
                            <div v-if="thumbnailPreview" class="relative w-fit">
                                <img :src="thumbnailPreview" alt="Preview" class="h-32 w-auto rounded-xl border border-slate-200 object-cover" />
                                <button type="button" @click="removeThumbnail"
                                    class="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white shadow hover:bg-red-600 transition-colors">
                                    <Trash2 :size="12" />
                                </button>
                            </div>
                            <div v-else @click="fileInputRef?.click()"
                                class="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 px-4 py-6 text-sm text-slate-400 transition-all hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30">
                                <Upload :size="18" />
                                <span class="font-semibold">Nhấn để chọn ảnh thumbnail</span>
                            </div>
                            <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleFileChange" />
                        </div>

                        <!-- Trạng thái & Nổi bật -->
                        <div class="flex flex-col sm:flex-row gap-6">
                            <!-- Trạng thái -->
                            <div class="flex items-center gap-4 flex-1">
                                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Trạng thái</label>
                                <div class="flex gap-3">
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" v-model="form.status" value="DRAFT" class="accent-blue-500" />
                                        <span class="text-sm font-semibold text-slate-600">Nháp</span>
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" v-model="form.status" value="PUBLISHED" class="accent-blue-500" />
                                        <span class="text-sm font-semibold text-slate-600">Xuất bản</span>
                                    </label>
                                </div>
                            </div>

                            <!-- Nổi bật -->
                            <div class="flex items-center gap-4 flex-1">
                                <label class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nổi bật</label>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" v-model="form.isFeatured" class="sr-only peer" />
                                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    <span class="ml-3 text-sm font-semibold text-slate-600">
                                        {{ form.isFeatured ? 'Có' : 'Không' }}
                                    </span>
                                </label>
                            </div>
                        </div>

                        <!-- Nội dung (WangEditor) -->
                        <div class="space-y-1.5">
                            <label
                                class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <FileText :size="13" class="text-blue-500" /> Nội dung <span
                                    class="text-red-400">*</span>
                            </label>
                            <WangEditor ref="editorRef" v-model="form.content"
                                upload-image-url="/api/v1/articles/upload-image" />
                            <p v-if="errors.content" class="text-[10px] font-bold text-red-500 ml-1">
                                {{ errors.content }}</p>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div class="flex items-center justify-end gap-3 px-8 py-5 border-t border-slate-100 bg-slate-50/50">
                        <button type="button" @click="handleClose"
                            class="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-all">
                            Hủy bỏ
                        </button>
                        <button type="button" @click="handleSubmit" :disabled="isLoading"
                            class="px-8 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-lg hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-40">
                            {{ isLoading ? 'Đang lưu...' : 'Lưu thay đổi' }}
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
