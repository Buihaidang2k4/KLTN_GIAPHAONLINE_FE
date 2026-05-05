<script setup lang="ts">
import { computed, ref } from 'vue'
import {
    Upload,
    X,
    Image as ImageIcon,
    Video,
    FileText,
    Plus
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
        <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm" @click="handleClose"></div>

            <div
                class="relative z-50 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-white shadow-[0_40px_100px_-45px_rgba(0,0,0,0.8)]">
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <h3 class="text-lg font-bold text-slate-900">
                            Tải lên tệp media
                        </h3>
                        <p class="mt-1 text-sm text-slate-500">
                            Ảnh, video, tài liệu và nhiều loại khác
                        </p>
                    </div>

                    <button type="button" @click="handleClose"
                        class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100">
                        <X :size="18" />
                    </button>
                </div>

                <!-- Content -->
                <div class="p-6">
                    <!-- Drag Area -->
                    <div :class="[
                        'relative rounded-[1.5rem] border-2 border-dashed p-8 transition-colors',
                        isDragging
                            ? 'border-indigo-400 bg-indigo-50'
                            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                    ]" @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop">
                        <div class="flex flex-col items-center justify-center text-center">
                            <div :class="[
                                'mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-all',
                                isDragging
                                    ? 'bg-indigo-100 text-indigo-600'
                                    : 'bg-slate-200 text-slate-600'
                            ]">
                                <Upload :size="32" />
                            </div>

                            <h4 class="font-black text-slate-900">
                                Kéo và thả tệp vào đây
                            </h4>

                            <p class="mt-2 text-sm text-slate-600">
                                Hoặc nhấp vào nút bên dưới để chọn tệp
                            </p>

                            <label class="mt-4">
                                <input type="file" multiple :accept="acceptedMimeTypes.join(',')" class="hidden"
                                    @change="handleFileInputChange" />

                                <span
                                    class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-indigo-700 active:scale-95">
                                    <Plus :size="18" />
                                    Chọn tệp
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- Files List -->
                    <div v-if="selectedFiles.length" class="mt-6">
                        <div class="mb-4 flex items-center justify-between border-b border-slate-200 pb-4">
                            <div>
                                <p class="font-bold text-slate-900">
                                    Các tệp đã chọn
                                </p>
                                <p class="mt-1 text-sm text-slate-500">
                                    {{ selectedFiles.length }} tệp • {{ allFilesSize }}
                                </p>
                            </div>

                            <button type="button"
                                class="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                                @click="clearFiles">
                                Xóa tất cả
                            </button>
                        </div>

                        <div class="max-h-64 space-y-2 overflow-y-auto">
                            <div v-for="(file, index) in selectedFiles" :key="file.name + file.size + file.lastModified"
                                class="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <div class="flex min-w-0 items-center gap-3">
                                    <div :class="[
                                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                                        getFileIcon(file.type) === 'image'
                                            ? 'bg-blue-100 text-blue-600'
                                            : getFileIcon(file.type) === 'video'
                                                ? 'bg-purple-100 text-purple-600'
                                                : 'bg-amber-100 text-amber-600'
                                    ]">
                                        <ImageIcon v-if="getFileIcon(file.type) === 'image'" :size="18" />
                                        <Video v-else-if="getFileIcon(file.type) === 'video'" :size="18" />
                                        <FileText v-else :size="18" />
                                    </div>

                                    <div class="min-w-0">
                                        <p class="line-clamp-1 text-sm font-bold text-slate-900">
                                            {{ file.name }}
                                        </p>
                                        <p class="text-xs text-slate-500">
                                            {{ formatByte(file.size) }}
                                        </p>
                                    </div>
                                </div>

                                <button type="button" @click="removeFile(index)"
                                    class="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600">
                                    <X :size="16" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Info -->
                    <div class="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p class="text-xs font-bold uppercase tracking-widest text-slate-500">
                            Các loại tệp được hỗ trợ
                        </p>

                        <p class="mt-2 text-sm text-slate-600">
                            Ảnh: JPG, PNG, GIF, WebP • Video: MP4, MPEG, MOV, WebM •
                            Tài liệu: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
                    <button type="button" @click="handleClose"
                        class="rounded-xl border border-slate-200 bg-slate-50 px-6 py-2.5 font-bold text-slate-700 transition hover:bg-slate-100">
                        Hủy
                    </button>

                    <button type="button" @click="handleUpload" :disabled="!selectedFiles.length || isUploading" :class="[
                        'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 font-bold text-white transition-all',
                        !selectedFiles.length || isUploading
                            ? 'cursor-not-allowed bg-slate-300'
                            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                    ]">
                        <Upload v-if="!isUploading" :size="18" />
                        <div v-else
                            class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>

                        {{ isUploading ? 'Đang tải lên...' : 'Tải lên' }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped></style>