<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    Upload,
    X,
    Image as ImageIcon,
    Video,
    FileText,
    Plus,
    CloudUpload,
    Sparkles,
    Scroll,
    Trash2
} from 'lucide-vue-next'
import { formatByte } from '@/utils/format-byte'
import { useUploadMultipleAlbumMediaMutation } from '@/hooks/queries/family/album/useAlbum'
import { notify } from '@/utils/notify'

const props = defineProps<{
    show: boolean
    albumId: number | null
}>()

const emit = defineEmits<{
    close: []
    success: []
}>()

const isDragging = ref(false)
const selectedFiles = ref<File[]>([])
const isUploading = ref(false)

const { mutate: uploadMediaMutation } = useUploadMultipleAlbumMediaMutation()

const acceptedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/mpeg',
    'video/quicktime',
    'video/webm',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
]

const totalSize = computed(() =>
    selectedFiles.value.reduce((sum, file) => sum + file.size, 0)
)

const allFilesSize = computed(() => formatByte(totalSize.value))

const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'image'
    if (mimeType.startsWith('video/')) return 'video'
    return 'document'
}

const isDuplicateFile = (file: File) => {
    return selectedFiles.value.some(
        item =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified
    )
}

const addFiles = (files: File[]) => {
    const validFiles = files.filter(file => acceptedMimeTypes.includes(file.type))

    if (!validFiles.length) {
        notify.error('Thông báo', 'Tệp không được hỗ trợ')
        return
    }

    const newFiles = validFiles.filter(file => !isDuplicateFile(file))

    if (!newFiles.length) {
        notify.error('Thông báo', 'Các tệp này đã được chọn')
        return
    }

    selectedFiles.value.push(...newFiles)
}

const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
    isDragging.value = true
}

const handleDragLeave = () => {
    isDragging.value = false
}

const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    isDragging.value = false

    const files = Array.from(event.dataTransfer?.files || [])
    addFiles(files)
}

const handleFileInputChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    const files = Array.from(input.files || [])

    addFiles(files)

    input.value = ''
}

const removeFile = (index: number) => {
    selectedFiles.value.splice(index, 1)
}

const clearFiles = () => {
    selectedFiles.value = []
}

const handleClose = () => {
    clearFiles()
    emit('close')
}

const handleUpload = () => {
    if (!props.albumId) {
        notify.error('Thông báo', 'Không tìm thấy album')
        return
    }

    if (!selectedFiles.value.length) {
        notify.error('Thông báo', 'Vui lòng chọn tệp để tải lên')
        return
    }

    isUploading.value = true

    uploadMediaMutation(
        {
            albumId: props.albumId,
            files: selectedFiles.value
        },
        {
            onSuccess: () => {
                notify.success('Thông báo', 'Tải lên tệp thành công')
                clearFiles()
                emit('success')
                emit('close')
            },
            onError: () => {
                notify.error('Thông báo', 'Tải lên tệp thất bại')
            },
            onSettled: () => {
                isUploading.value = false
            }
        }
    )
}
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <!-- Modal Container -->
                <div class="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-[2.5rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30 animate-in fade-in zoom-in duration-300">
                    
                    <!-- Header -->
                    <div class="relative shrink-0 px-8 pt-8 pb-4 text-center md:text-left">
                        <div class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Tải lên kỷ niệm</span>
                        </div>
                        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Thêm nội dung mới</h2>
                        <p class="mt-1 text-xs text-slate-500 font-medium leading-relaxed">
                            Đưa những thước phim, hình ảnh và tài liệu quý giá vào kho lưu trữ của dòng tộc.
                        </p>

                        <button @click="handleClose" 
                            class="absolute top-8 right-8 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="20" />
                        </button>
                    </div>

                    <!-- Scrollable Content -->
                    <div class="custom-scrollbar flex-1 overflow-y-auto px-8 pb-4">
                        <!-- Drag Area -->
                        <div :class="[
                            'relative rounded-[2rem] border-2 border-dashed p-8 transition-all duration-300 group overflow-hidden',
                            isDragging
                                ? 'border-amber-400 bg-amber-50/50 ring-4 ring-amber-500/5'
                                : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/10'
                        ]" @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop">
                            
                            <!-- Ornament -->
                            <div class="absolute -bottom-4 -right-4 text-amber-900/[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                                <CloudUpload :size="120" />
                            </div>

                            <div class="relative flex flex-col items-center text-center">
                                <div :class="[
                                    'mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-all shadow-sm',
                                    isDragging ? 'bg-amber-500 text-white scale-110' : 'bg-amber-50 text-amber-600'
                                ]">
                                    <CloudUpload :size="32" />
                                </div>

                                <h4 class="text-sm font-black text-slate-800 uppercase tracking-widest">Thả tệp vào đây</h4>
                                <p class="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">hoặc nhấp để chọn từ thiết bị</p>

                                <label class="mt-5">
                                    <input type="file" multiple :accept="acceptedMimeTypes.join(',')" class="hidden"
                                        @change="handleFileInputChange" />
                                    <span
                                        class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-slate-800 transition-all active:scale-95">
                                        <Plus :size="16" />
                                        Chọn tệp
                                    </span>
                                </label>
                            </div>
                        </div>

                        <!-- Files List -->
                        <div v-if="selectedFiles.length" class="mt-6 animate-in slide-in-from-bottom-2 duration-300">
                            <div class="mb-3 flex items-center justify-between px-1">
                                <div class="flex items-center gap-2">
                                    <div class="w-1 h-1 rounded-full bg-amber-500"></div>
                                    <p class="text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                                        {{ selectedFiles.length }} tệp đã chọn <span class="text-slate-400 ml-1">({{ allFilesSize }})</span>
                                    </p>
                                </div>
                                <button type="button" @click="clearFiles"
                                    class="flex items-center gap-1.5 text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest transition-colors">
                                    <Trash2 :size="12" />
                                    Xóa hết
                                </button>
                            </div>

                            <div class="space-y-2.5 max-h-56 overflow-y-auto custom-scrollbar pr-1">
                                <div v-for="(file, index) in selectedFiles" :key="file.name + file.size + file.lastModified"
                                    class="flex items-center justify-between rounded-2xl border border-amber-100/50 bg-white p-3 shadow-sm group hover:border-amber-200 transition-all">
                                    <div class="flex min-w-0 items-center gap-3">
                                        <div :class="[
                                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                                            getFileIcon(file.type) === 'image'
                                                ? 'bg-blue-50 text-blue-600'
                                                : getFileIcon(file.type) === 'video'
                                                    ? 'bg-purple-50 text-purple-600'
                                                    : 'bg-amber-50 text-amber-600'
                                        ]">
                                            <ImageIcon v-if="getFileIcon(file.type) === 'image'" :size="18" />
                                            <Video v-else-if="getFileIcon(file.type) === 'video'" :size="18" />
                                            <FileText v-else :size="18" />
                                        </div>

                                        <div class="min-w-0">
                                            <p class="truncate text-xs font-bold text-slate-800">{{ file.name }}</p>
                                            <p class="text-[10px] font-bold text-slate-400 uppercase">{{ formatByte(file.size) }}</p>
                                        </div>
                                    </div>

                                    <button type="button" @click="removeFile(index)"
                                        class="shrink-0 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                                        <X :size="16" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Info Note -->
                        <div class="mt-6 p-4 bg-amber-50/40 rounded-2xl border border-amber-100/30 flex items-start gap-3">
                            <Scroll :size="16" class="text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Định dạng hỗ trợ</p>
                                <p class="text-[11px] font-bold text-slate-700 leading-relaxed">
                                    JPG, PNG, WebP • MP4, MOV, WebM • PDF, DOC, XLS, PPT, TXT
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Fixed Footer Actions -->
                    <div class="shrink-0 flex items-center justify-end gap-3 px-8 py-5 border-t border-amber-100/30 bg-[#fefaf6]/80 backdrop-blur-sm">
                        <button type="button" @click="handleClose"
                            class="px-8 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all">
                            Quay lại
                        </button>

                        <button type="button" @click="handleUpload" :disabled="!selectedFiles.length || isUploading"
                            class="flex items-center gap-2 px-10 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-40">
                            <div v-if="isUploading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            <Upload v-else :size="16" />
                            <span>{{ isUploading ? 'Đang tải...' : 'Bắt đầu tải lên' }}</span>
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