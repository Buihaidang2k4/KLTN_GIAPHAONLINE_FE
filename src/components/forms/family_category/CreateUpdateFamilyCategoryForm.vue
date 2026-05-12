<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { X, Save, Sparkles, FolderTree, Scroll, FolderHeart, MapPin, Eye } from 'lucide-vue-next'
import type { FamilyCategoryReq, FamilyCategoryRes } from '@/types/family/family-category.types'

interface Props {
    isOpen: boolean
    mode: 'add' | 'edit'
    data?: FamilyCategoryRes | null
    isLoading?: boolean
}

interface Emits {
    (e: 'close'): void
    (e: 'submit', payload: FamilyCategoryReq): void
}

const props = withDefaults(defineProps<Props>(), {
    data: null,
    isLoading: false
})

const emit = defineEmits<Emits>()

const form = ref<FamilyCategoryReq>({
    familyName: '',
    origin: '',
    description: '',
    isPublic: true
})

const errors = ref<Partial<Record<keyof FamilyCategoryReq, string>>>({})

const titleText = computed(() => (props.mode === 'add' ? 'Thêm danh mục gia phả' : 'Cập nhật danh mục gia phả'))

const resetForm = () => {
    form.value = {
        familyName: '',
        origin: '',
        description: '',
        isPublic: true
    }
    errors.value = {}
}

watch(
    () => props.data,
    (newData) => {
        if (newData && props.mode === 'edit') {
            form.value = {
                familyName: newData.familyName,
                origin: newData.origin,
                description: newData.description,
                isPublic: newData.isPublic
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

const validateForm = (): boolean => {
    errors.value = {}

    if (!form.value.familyName?.trim()) {
        errors.value.familyName = 'Tên danh mục không được để trống'
    }

    if (!form.value.origin?.trim()) {
        errors.value.origin = 'Nguồn gốc không được để trống'
    }

    if (!form.value.description?.trim()) {
        errors.value.description = 'Mô tả không được để trống'
    }

    return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
    if (!validateForm()) return

    emit('submit', {
        familyName: form.value.familyName.trim(),
        origin: form.value.origin.trim(),
        description: form.value.description.trim(),
        isPublic: form.value.isPublic
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
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <div
                    class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[2.5rem] border border-amber-200/30 bg-[#fefaf6] shadow-2xl animate-in fade-in zoom-in duration-300">
                    <div class="pointer-events-none absolute -right-12 -top-12 text-amber-900/[0.03]">
                        <FolderHeart :size="200" />
                    </div>

                    <div class="relative shrink-0 px-8 pb-4 pt-8 text-center md:text-left">
                        <div
                            class="mb-2 inline-flex items-center gap-1.5 rounded-full border border-amber-100/50 bg-amber-50 px-2.5 py-0.5">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold uppercase tracking-widest text-amber-700">Thư viện gia phả</span>
                        </div>
                        <h2 class="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-900">
                            {{ titleText }}
                        </h2>
                        <p class="mt-1 max-w-sm text-xs font-medium leading-relaxed text-slate-500">
                            Quản lý các danh mục gia phả để phân loại nguồn gốc, nhánh họ và trạng thái hiển thị.
                        </p>

                        <button @click="handleClose"
                            class="absolute right-8 top-8 rounded-full p-1.5 text-slate-400  cursor-pointer transition-all hover:bg-amber-50 hover:text-amber-600 active:scale-90">
                            <X :size="20" />
                        </button>
                    </div>

                    <div class="custom-scrollbar flex-1 overflow-y-auto px-8 pb-4">
                        <form id="familyCategoryForm" class="space-y-6 pt-2" @submit.prevent="handleSubmit">
                            <div class="space-y-1.5">
                                <label class="ml-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    <FolderTree :size="14" class="text-amber-600/70" />
                                    Tên danh mục <span class="text-red-400">*</span>
                                </label>
                                <input v-model="form.familyName" type="text" placeholder="VD: Nguyễn Tộc"
                                    :disabled="isLoading"
                                    class="w-full rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm outline-none transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5"
                                    :class="errors.familyName ? 'border-red-400 bg-red-50/10' : 'border-slate-200 bg-white'" />
                                <p v-if="errors.familyName" class="mt-1 ml-1 text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">
                                    {{ errors.familyName }}
                                </p>
                            </div>

                            <div class="space-y-1.5">
                                <label class="ml-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    <MapPin :size="14" class="text-amber-600/70" />
                                    Nguồn gốc <span class="text-red-400">*</span>
                                </label>
                                <input v-model="form.origin" type="text" placeholder="VD: Nam Định"
                                    :disabled="isLoading"
                                    class="w-full rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm outline-none transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5"
                                    :class="errors.origin ? 'border-red-400 bg-red-50/10' : 'border-slate-200 bg-white'" />
                                <p v-if="errors.origin" class="mt-1 ml-1 text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">
                                    {{ errors.origin }}
                                </p>
                            </div>

                            <div class="space-y-1.5">
                                <label class="ml-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    <Scroll :size="14" class="text-amber-600/70" />
                                    Mô tả <span class="text-red-400">*</span>
                                </label>
                                <textarea v-model="form.description" rows="5"
                                    placeholder="Mô tả ngắn gọn về danh mục gia phả này..."
                                    :disabled="isLoading"
                                    class="w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm font-semibold leading-relaxed shadow-sm outline-none transition-all focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5"
                                    :class="errors.description ? 'border-red-400' : 'border-slate-200'" />
                                <p v-if="errors.description" class="mt-1 ml-1 text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">
                                    {{ errors.description }}
                                </p>
                            </div>

                            <label
                                class="flex items-center gap-3 rounded-2xl border border-amber-100/30 bg-amber-50/40 p-4 text-xs font-bold text-slate-700">
                                <Eye :size="16" class="text-amber-600" />
                                <input v-model="form.isPublic" type="checkbox" :disabled="isLoading"
                                    class="h-4 w-4  cursor-pointer accent-amber-600" />
                                Công khai danh mục
                            </label>
                        </form>
                    </div>

                    <div
                        class="flex shrink-0 items-center justify-end gap-3 border-t border-amber-100/30 bg-[#fefaf6]/80 px-8 py-5 backdrop-blur-sm">
                        <button type="button" @click="handleClose" :disabled="isLoading"
                            class="rounded-xl px-8 py-2.5 text-xs font-bold text-slate-500 cursor-pointer transition-all hover:bg-slate-100 hover:text-slate-800">
                            Quay lại
                        </button>

                        <button type="submit" form="familyCategoryForm" :disabled="isLoading"
                            class="flex items-center gap-2 rounded-xl bg-slate-900 px-10 py-2.5 text-xs font-bold cursor-pointer text-white shadow-lg shadow-slate-200 transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-40">
                            <Save :size="14" />
                            <span>{{ isLoading ? 'Đang lưu...' : mode === 'add' ? 'Tạo danh mục' : 'Cập nhật' }}</span>
                        </button>
                    </div>

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
