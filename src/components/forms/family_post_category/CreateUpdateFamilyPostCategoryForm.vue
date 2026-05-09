<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, Save, Sparkles, FolderTree, Scroll, FolderHeart } from 'lucide-vue-next'
import type { PostCategoryReq, FamilyPostCategoryRes } from '@/types/family/post_category.types'

interface Props {
    isOpen: boolean
    mode: 'create' | 'update'
    data?: FamilyPostCategoryRes | null
    isLoading?: boolean
}

interface Emits {
    (e: 'close'): void
    (e: 'submit', payload: PostCategoryReq): void
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
})

const emit = defineEmits<Emits>()

const form = ref<PostCategoryReq>({
    name: '',
    description: '',
})

const errors = ref<Partial<Record<keyof PostCategoryReq, string>>>({})

const titleText = computed(() => (props.mode === 'create' ? 'Thêm chuyên mục' : 'Cập nhật chuyên mục'))

// Watchers
watch(
    () => props.data,
    (newData) => {
        if (newData && props.mode === 'update') {
            form.value = {
                name: newData.name,
                description: newData.description,
            }
        }
    },
    { deep: true }
)

watch(
    () => props.isOpen,
    (isOpen) => {
        if (!isOpen) {
            resetForm()
        }
    }
)

const resetForm = () => {
    form.value = {
        name: '',
        description: '',
    }
    errors.value = {}
}

const validateForm = (): boolean => {
    errors.value = {}

    if (!form.value.name?.trim()) {
        errors.value.name = 'Tên danh mục không được để trống'
    }

    if (!form.value.description?.trim()) {
        errors.value.description = 'Mô tả không được để trống'
    }

    return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
    if (!validateForm()) return

    emit('submit', {
        name: form.value.name.trim(),
        description: form.value.description.trim(),
    })
}

const handleClose = () => {
    emit('close')
}
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <!-- Modal Container -->
                <div class="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-[2.5rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30 animate-in fade-in zoom-in duration-300">
                    
                    <!-- Subtle Decoration -->
                    <div class="absolute -top-12 -right-12 text-amber-900/[0.03] pointer-events-none">
                        <FolderHeart :size="200" />
                    </div>

                    <!-- Header -->
                    <div class="relative shrink-0 px-8 pt-8 pb-4 text-center md:text-left">
                        <div class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Cây phả hệ nội dung</span>
                        </div>
                        <h2 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            {{ titleText }}
                        </h2>
                        <p class="mt-1 text-xs text-slate-500 font-medium leading-relaxed max-w-sm">
                            Phân loại các bài viết, tư liệu và tin tức gia đình vào các danh mục chủ đề rõ ràng.
                        </p>

                        <button @click="handleClose" 
                            class="absolute top-8 right-8 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="20" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <div class="custom-scrollbar flex-1 overflow-y-auto px-8 pb-4">
                        <form id="categoryForm" @submit.prevent="handleSubmit" class="space-y-6 pt-2">
                            
                            <!-- Tên danh mục -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    <FolderTree :size="14" class="text-amber-600/70" />
                                    Tên chuyên mục <span class="text-red-400">*</span>
                                </label>
                                <input v-model="form.name" type="text" placeholder="VD: Tin tức nội tộc"
                                    :disabled="isLoading"
                                    class="w-full rounded-xl border px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                                    :class="errors.name ? 'border-red-400 bg-red-50/10' : 'border-slate-200 bg-white'" />
                                <p v-if="errors.name" class="mt-1 ml-1 block text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">
                                    {{ errors.name }}
                                </p>
                            </div>

                            <!-- Mô tả -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    <Scroll :size="14" class="text-amber-600/70" />
                                    Mô tả chuyên mục <span class="text-red-400">*</span>
                                </label>
                                <textarea v-model="form.description" rows="5"
                                    placeholder="Mô tả ngắn gọn về loại nội dung sẽ được đăng trong chuyên mục này..."
                                    :disabled="isLoading"
                                    class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all leading-relaxed shadow-sm"
                                    :class="errors.description ? 'border-red-400' : 'border-slate-200'" />
                                <p v-if="errors.description" class="mt-1 ml-1 block text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">
                                    {{ errors.description }}
                                </p>
                            </div>

                            <!-- Info Note -->
                            <div class="mt-6 p-4 bg-amber-50/40 rounded-2xl border border-amber-100/30 flex items-start gap-3">
                                <Scroll :size="16" class="text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mẹo nhỏ</p>
                                    <p class="text-[11px] font-bold text-slate-700 leading-relaxed">
                                        Hãy đặt tên danh mục ngắn gọn và súc tích để con cháu dễ dàng tìm kiếm thông tin.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>

                    <!-- Fixed Footer Actions -->
                    <div class="shrink-0 flex items-center justify-end gap-3 px-8 py-5 border-t border-amber-100/30 bg-[#fefaf6]/80 backdrop-blur-sm">
                        <button type="button" @click="handleClose" :disabled="isLoading"
                            class="px-8 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all">
                            Quay lại
                        </button>

                        <button type="submit" form="categoryForm" :disabled="isLoading"
                            class="flex items-center gap-2 px-10 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-40">
                            <Save :size="14" />
                            <span>{{ isLoading ? 'Đang lưu...' : mode === 'create' ? 'Tạo danh mục' : 'Cập nhật' }}</span>
                        </button>
                    </div>
                    
                    <!-- Decorative footer line -->
                    <div class="h-1.5 w-full bg-[linear-gradient(90deg,transparent_0%,#d97706_50%,transparent_100%)] opacity-10"></div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3a3a2815;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #3a3a2830;
}

.rounded-\[2\.5rem\]::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    width: 40px;
    height: 40px;
    border-top: 2px solid rgba(217, 119, 6, 0.08);
    border-left: 2px solid rgba(217, 119, 6, 0.08);
    border-radius: 12px 0 0 0;
    pointer-events: none;
}
</style>
