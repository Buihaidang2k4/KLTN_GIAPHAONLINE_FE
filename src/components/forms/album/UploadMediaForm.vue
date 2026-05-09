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
            <!-- Overlay -->
            <div class="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm" @click="handleClose"></div>

            <!-- Modal -->
            <div
                class="relative z-50 flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-white/10 bg-white shadow-2xl">
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <div>
                        <h3 class="text-lg font-bold text-slate-900">Tải lên tệp media</h3>
                        <p class="text-sm text-slate-500">Ảnh, video, tài liệu</p>
                    </div>
                    <button type="button" @click="handleClose"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition hover:bg-slate-100">
                        <X :size="18" />
                    </button>
                </div>

                <!-- Content - Scrollable -->
                <div class="flex-1 overflow-y-auto p-5">
                    <!-- Drag Area -->
                    <div :class="[
                        'rounded-xl border-2 border-dashed p-6 transition-colors',
                        isDragging
                            ? 'border-indigo-400 bg-indigo-50'
                            : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                    ]" @dragover="handleDragOver" @dragleave="handleDragLeave" @drop="handleDrop">
                        <div class="flex flex-col items-center text-center">
                            <div :class="[
                                'mb-3 flex h-14 w-14 items-center justify-center rounded-full transition-all',
                                isDragging ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-200 text-slate-600'
                            ]">
                                <Upload :size="28" />
                            </div>

                            <h4 class="font-bold text-slate-900">Kéo và thả tệp vào đây</h4>
                            <p class="mt-1 text-sm text-slate-500">hoặc</p>

                            <label class="mt-3">
                                <input type="file" multiple :accept="acceptedMimeTypes.join(',')" class="hidden"
                                    @change="handleFileInputChange" />
                                <span
                                    class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95">
                                    <Plus :size="16" />
                                    Chọn tệp
                                </span>
                            </label>
                        </div>
                    </div>

                    <!-- Files List -->
                    <div v-if="selectedFiles.length" class="mt-4">
                        <div class="mb-3 flex items-center justify-between">
                            <p class="text-sm font-semibold text-slate-900">
                                {{ selectedFiles.length }} tệp • {{ allFilesSize }}
                            </p>
                            <button type="button" class="text-xs font-semibold text-red-600 hover:text-red-700"
                                @click="clearFiles">
                                Xóa tất cả
                            </button>
                        </div>

                        <div
                            class="max-h-48 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-2">
                            <div v-for="(file, index) in selectedFiles" :key="file.name + file.size + file.lastModified"
                                class="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm">
                                <div class="flex min-w-0 items-center gap-2.5">
                                    <div :class="[
                                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                                        getFileIcon(file.type) === 'image'
                                            ? 'bg-blue-100 text-blue-600'
                                            : getFileIcon(file.type) === 'video'
                                                ? 'bg-purple-100 text-purple-600'
                                                : 'bg-amber-100 text-amber-600'
                                    ]">
                                        <ImageIcon v-if="getFileIcon(file.type) === 'image'" :size="14" />
                                        <Video v-else-if="getFileIcon(file.type) === 'video'" :size="14" />
                                        <FileText v-else :size="14" />
                                    </div>

                                    <div class="min-w-0">
                                        <p class="truncate text-sm font-medium text-slate-900">{{ file.name }}</p>
                                        <p class="text-xs text-slate-500">{{ formatByte(file.size) }}</p>
                                    </div>
                                </div>

                                <button type="button" @click="removeFile(index)"
                                    class="ml-2 shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                                    <X :size="14" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Supported Types -->
                    <div class="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <p class="text-xs font-semibold text-slate-500">Định dạng hỗ trợ:</p>
                        <p class="mt-1 text-xs text-slate-600">
                            Ảnh: JPG, PNG, GIF, WebP • Video: MP4, MOV, WebM • Tài liệu: PDF, DOC, XLS, PPT, TXT
                        </p>
                    </div>
                </div>

                <!-- Footer - Fixed at bottom -->
                <div class="flex items-center justify-end gap-2.5 border-t border-slate-200 px-5 py-3.5">
                    <button type="button" @click="handleClose"
                        class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                        Hủy
                    </button>

                    <button type="button" @click="handleUpload" :disabled="!selectedFiles.length || isUploading" :class="[
                        'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all',
                        !selectedFiles.length || isUploading
                            ? 'cursor-not-allowed bg-slate-300'
                            : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
                    ]">
                        <Upload v-if="!isUploading" :size="16" />
                        <div v-else
                            class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        {{ isUploading ? 'Đang tải...' : 'Tải lên' }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<style scoped></style>