<script setup lang="ts">
import type { AlbumReq, AlbumRes } from '@/types/family/album.types'
import { formatDate } from '@/utils/format-date'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { computed, watch } from 'vue'
import { z } from 'zod'
import { X, Save, Sparkles, FolderPlus, History, Scroll, FolderHeart } from 'lucide-vue-next'

const props = defineProps<{
    show: boolean
    mode: 'create' | 'update'
    album?: AlbumRes | null
    familyId?: number | null
    isLoading?: boolean
}>()

const emit = defineEmits<{
    create: [data: AlbumReq]
    update: [data: AlbumReq]
    close: []
}>()

const initialValues = computed(() => ({
    title: props.album?.title ?? '',
    description: props.album?.description ?? ''
}))

const validationSchema = toTypedSchema(
    z.object({
        title: z
            .string()
            .trim()
            .min(1, 'Vui lòng nhập tên album')
            .max(255, 'Tên album không được quá 255 ký tự'),

        description: z
            .string()
            .trim()
            .min(1, 'Vui lòng nhập mô tả')
            .max(2000, 'Mô tả không được quá 2000 ký tự')
    })
)

const { resetForm, handleSubmit, meta } = useForm({
    initialValues: initialValues.value,
    validationSchema
})

watch(
    () => props.album,
    (val) => {
        resetForm({
            values: {
                title: val?.title ?? '',
                description: val?.description ?? ''
            }
        })
    },
    { immediate: true }
)

const titleText = computed(() =>
    props.mode === 'create' ? 'Tạo tập kỷ niệm' : 'Chỉnh sửa tập kỷ niệm'
)

const handleClose = () => {
    emit('close')
}

const onSubmit = handleSubmit((values) => {
    const payload: AlbumReq = {
        title: values.title.trim(),
        description: values.description.trim()
    }

    if (props.mode === 'create') {
        emit('create', payload)
        return
    }

    emit('update', payload)
})
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <!-- Modal Container -->
                <div class="relative w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden rounded-[2.5rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30 animate-in fade-in zoom-in duration-300">
                    
                    <!-- Subtle Decoration -->
                    <div class="absolute -top-12 -right-12 text-amber-900/[0.03] pointer-events-none">
                        <FolderHeart :size="200" />
                    </div>

                    <!-- Header -->
                    <div class="relative shrink-0 px-8 pt-8 pb-4 text-center md:text-left">
                        <div class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Lưu giữ khoảnh khắc</span>
                        </div>
                        <h2 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            {{ titleText }}
                        </h2>
                        <p class="mt-1 text-xs text-slate-500 font-medium leading-relaxed max-w-sm">
                            Tổ chức những hình ảnh, video và tư liệu quý giá của dòng tộc vào từng chủ đề riêng biệt.
                        </p>

                        <button @click="handleClose" 
                            class="absolute top-8 right-8 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="20" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <div class="custom-scrollbar flex-1 overflow-y-auto px-8 pb-4">
                        <form id="albumForm" :key="mode + (album?.albumId ?? 'new')" @submit.prevent="onSubmit" class="space-y-6 pt-2">
                            
                            <!-- Tên Album -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    <FolderPlus :size="14" class="text-amber-600/70" />
                                    Tên tập kỷ niệm <span class="text-red-400">*</span>
                                </label>
                                <Field name="title" type="text" placeholder="VD: Lễ thượng thọ cụ nội 2024"
                                    validate-on-blur
                                    class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm" />
                                <ErrorMessage name="title" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                            </div>

                            <!-- Mô tả -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    <Scroll :size="14" class="text-amber-600/70" />
                                    Ghi chú & Ý nghĩa <span class="text-red-400">*</span>
                                </label>
                                <Field as="textarea" name="description" rows="4" validate-on-blur
                                    placeholder="Chia sẻ về nội dung hoặc ý nghĩa đặc biệt của tập kỷ niệm này..."
                                    class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all leading-relaxed shadow-sm" />
                                <ErrorMessage name="description" class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                            </div>

                            <!-- Audit Info -->
                            <div v-if="album"
                                class="flex items-center justify-between p-4 bg-amber-50/40 rounded-2xl border border-amber-100/30">
                                <div class="flex items-center gap-3">
                                    <div class="p-2 bg-white rounded-xl shadow-sm">
                                        <History :size="16" class="text-amber-600" />
                                    </div>
                                    <div class="flex flex-col">
                                        <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cập nhật lần cuối</span>
                                        <span class="text-[11px] font-bold text-slate-700">{{ formatDate(album.updatedAt) }}</span>
                                    </div>
                                </div>
                                <span class="text-[10px] font-bold text-amber-700/60 uppercase">Đã đồng bộ</span>
                            </div>
                        </form>
                    </div>

                    <!-- Fixed Footer Actions -->
                    <div class="shrink-0 flex items-center justify-end gap-3 px-8 py-5 border-t border-amber-100/30 bg-[#fefaf6]/80 backdrop-blur-sm">
                        <button type="button" @click="handleClose"
                            class="px-8 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all">
                            Quay lại
                        </button>

                        <button type="submit" form="albumForm" :disabled="isLoading || !meta.valid"
                            class="flex items-center gap-2 px-10 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-40">
                            <Save :size="14" />
                            <span>{{ isLoading ? 'Đang lưu...' : mode === 'create' ? 'Tạo ngay' : 'Cập nhật' }}</span>
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