<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Image as ImageIcon, Video, FileText, ChevronLeft, Folder,
  Calendar, Layers, Plus, Download, Eye, PlayCircle,
  HardDrive, Search, Trash2, Edit, Link
} from 'lucide-vue-next'
import { refDebounced } from '@vueuse/core'
import { formatByte } from '@/utils/format-byte'
import { formatDate } from '@/utils/format-date'
import { notify } from '@/utils/notify'
import { useFamilyStore } from '@/store/family/useFamilyStore'
import { usePagination } from '@/composables/common/usePagination'
import { useFamilyPermissions } from '@/composables/family/useFamilyPermissions'
import {
  useFamilyAlbumsQuery, useAlbumMediaQuery,
  useCreateAlbumMutation, useUpdateAlbumMutation, useDeleteAlbumMutation,
  useDeleteAlbumMediaMutation, useUploadAlbumLinkMutation
} from '@/hooks/queries/family/album/useAlbum'
import type { AlbumMediaRes, AlbumReq, AlbumRes } from '@/types/family/album.types'
import AppPagination from '@/components/forms/common/AppPagination.vue'
import CreateOrUpdateAlbumForm from '@/components/forms/album/CreateOrUpdateAlbumForm.vue'
import PreviewImageModal from '@/components/forms/album/PreviewImageModal.vue'
import PreviewVideoModal from '@/components/forms/album/PreviewVideoModal.vue'
import PreviewDocsModal from '@/components/forms/album/PreviewDocsModal.vue'
import UploadMediaForm from '@/components/forms/album/UploadMediaForm.vue'
import UploadLinkAlbum from '@/components/forms/album/UploadLinkAlbum.vue'

// ==================== Store & Permission ====================
const familyStore = useFamilyStore()
const familyId = computed(() => familyStore.currentFamilyId)
const { canManageAlbum, withPermission } = useFamilyPermissions(familyId)

// ==================== Pagination & Search ====================
const keyword = ref('')
const debounceKeyword = refDebounced(keyword, 400)
const { pagination, currentPage, hasNextPage, hasPrevPage, nextPage, prevPage, setTotalPages } = usePagination(9, 0)
const params = computed(() => ({ page: pagination.page, size: pagination.size }))

// ==================== Album List ====================
const { data: albumData } = useFamilyAlbumsQuery(familyId, params, debounceKeyword)
const safeAlbums = computed(() => albumData.value?.data?.items || [])
watch(() => albumData.value?.data?.totalPages, (total) => setTotalPages(total || 0), { immediate: true })

const { mutate: createAlbumMutation, isPending: isCreatingAlbum } = useCreateAlbumMutation()
const { mutate: updateAlbumMutation, isPending: isUpdatingAlbum } = useUpdateAlbumMutation()
const { mutate: deleteAlbumMutation } = useDeleteAlbumMutation()

const mode = ref<'create' | 'update'>('create')
const isShowAlbumForm = ref(false)
const edittingAlbum = ref<AlbumRes | null>(null)

const openFormCreateAlbum = withPermission(canManageAlbum, () => {
  mode.value = 'create'
  isShowAlbumForm.value = true
})

const openFormUpdateAlbum = withPermission(canManageAlbum, (album: AlbumRes) => {
  mode.value = 'update'
  edittingAlbum.value = album
  isShowAlbumForm.value = true
})

const closeFormAlbum = () => {
  isShowAlbumForm.value = false
  edittingAlbum.value = null
}

const handleCreateAlbum = (payload: AlbumReq) => {
  if (!familyId.value) return notify.error('Thông báo', 'Không tìm thấy gia phả hiện tại')
  createAlbumMutation(
    { familyId: familyId.value, data: payload },
    {
      onSuccess: () => { notify.success('Thông báo', 'Tạo album thành công'); closeFormAlbum() },
      onError: () => notify.error('Thông báo', 'Tạo album thất bại')
    }
  )
}

const handelUpdateAlbum = (payload: AlbumReq) => {
  updateAlbumMutation(
    { albumId: edittingAlbum.value?.albumId, data: payload },
    {
      onSuccess: () => { notify.success('Thông báo', 'Cập nhật album thành công'); closeFormAlbum() },
      onError: () => notify.error('Thông báo', 'Cập nhật album không thành công')
    }
  )
}

const handleDeleteAlbum = withPermission(canManageAlbum, (id: number) => {
  if (!id || !window.confirm('Bạn có muốn xóa album này không?')) return
  deleteAlbumMutation(id, {
    onSuccess: () => notify.success('Thông báo', 'Xóa album thành công'),
    onError: () => notify.error('Thông báo', 'Xóa album không thành công')
  })
})

// ==================== Album Detail & Media ====================
const selectedAlbum = ref<AlbumRes | null>(null)
const activeTab = ref<'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'LINK'>('IMAGE')
const selectedAlbumId = computed(() => selectedAlbum.value?.albumId)
const mediaType = computed(() => activeTab.value)
const currentAlbumSize = computed(() => formatByte(selectedAlbum.value?.totalSize))

const { data: mediaData } = useAlbumMediaQuery(selectedAlbumId, mediaType, { page: 0, size: 100 })
const safeMedia = computed(() => mediaData.value?.data?.items ?? [])

const { mutate: deleteMediaMutation } = useDeleteAlbumMediaMutation()
const uploadLinkAblumMutation = useUploadAlbumLinkMutation()

const moveOnToDetailMedia = (album: AlbumRes) => {
  selectedAlbum.value = album
  activeTab.value = 'IMAGE'
}

// ==================== Preview ====================
const previewMedia = ref<AlbumMediaRes | null>(null)
const openPreviewImageModal = (media: AlbumMediaRes) => { previewMedia.value = media }
const openPreviewVideoModal = (media: AlbumMediaRes) => { previewMedia.value = media }
const openPreviewDocsModal = (media: AlbumMediaRes) => { previewMedia.value = media }
const closePreviewImageModal = () => { previewMedia.value = null }
const closePreviewVideoModal = () => { previewMedia.value = null }
const closePreviewDocsModal = () => { previewMedia.value = null }

// ==================== Media Actions ====================
const handleDeleteMedia = withPermission(canManageAlbum, (mediaId: number) => {
  if (!mediaId || !window.confirm('Bạn có muốn xóa media này không?')) return
  deleteMediaMutation({ mediaId }, {
    onSuccess: () => notify.success('Thông báo', 'Xóa media thành công'),
    onError: () => notify.error('Thông báo', 'Xóa media không thành công')
  })
})

const handleDownloadMedia = async (media: AlbumMediaRes) => {
  if (!media?.mediaUrl) return notify.error('Thông báo', 'Không tìm thấy tài liệu để tải')
  const blob = await fetch(media.mediaUrl).then(r => r.blob())
  const url = window.URL.createObjectURL(blob)
  const link = Object.assign(document.createElement('a'), { href: url, download: media.title || `media_${media.albumMediaId}` })
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// ==================== Upload ====================
const isShowUploadModal = ref(false)
const isShowUploadLinkModal = ref(false)

const openUploadModal = withPermission(canManageAlbum, () => { isShowUploadModal.value = true })
const closeUploadModal = () => { isShowUploadModal.value = false }
const handleUploadSuccess = () => closeUploadModal()

const openUploadLinkModal = withPermission(canManageAlbum, () => { isShowUploadLinkModal.value = true })

const handleUploadLink = async (formData: any) => {
  if (!selectedAlbumId.value) return
  await uploadLinkAblumMutation.mutateAsync(
    { albumId: formData.albumId, url: formData.url, title: formData.title },
    {
      onSuccess: () => { notify.success('Thông báo', 'Upload link thành công'); isShowUploadLinkModal.value = false },
      onError: () => { notify.error('Thông báo', 'Upload link thất bại'); isShowUploadLinkModal.value = false }
    }
  )
}
</script>

<template>
  <div class="min-h-screen bg-[#fbfaf5] p-4 font-sans text-slate-900 md:p-8">
    <CreateOrUpdateAlbumForm :mode="mode" :album="edittingAlbum" :show="isShowAlbumForm" :family-id="familyId"
      :is-loading="isCreatingAlbum || isUpdatingAlbum" @close="closeFormAlbum" @create="handleCreateAlbum"
      @update="handelUpdateAlbum" />
    <PreviewImageModal :show="!!previewMedia && mediaType === 'IMAGE'" :media="previewMedia"
      @close="closePreviewImageModal" />
    <PreviewVideoModal :show="!!previewMedia && mediaType === 'VIDEO'" :media="previewMedia"
      @close="closePreviewVideoModal" />
    <PreviewDocsModal :show="!!previewMedia && mediaType === 'DOCUMENT'" :media="previewMedia"
      @close="closePreviewDocsModal" />
    <UploadMediaForm :show="isShowUploadModal" :album-id="selectedAlbumId" @close="closeUploadModal"
      @success="handleUploadSuccess" />
    <UploadLinkAlbum :show="isShowUploadLinkModal" :album-id="selectedAlbumId" @close="isShowUploadLinkModal = false"
      @submit="handleUploadLink" />

    <div class="mx-auto max-w-7xl">
      <div v-if="!selectedAlbum" class="animate-in fade-in flex min-h-[calc(100vh-8rem)] flex-col duration-500">
        <header
          class="mb-8 rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.35)] backdrop-blur">
          <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div
                class="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-700">
                <Folder :size="14" /> Album gia đình
              </div>
              <h1 class="mt-4 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">Kho Kỷ Niệm</h1>
              <p class="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                Sắp xếp ảnh, video và tài liệu gia đình theo từng album với bố cục gọn hơn và dễ quét nội dung hơn.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-3 md:min-w-[18rem]">
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Tổng album</p>
                <p class="mt-1 text-2xl font-black text-slate-900">
                  {{ albumData?.data?.totalElements ?? safeAlbums.length }}
                </p>
              </div>
              <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p class="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Đang hiển thị</p>
                <p class="mt-1 text-2xl font-black text-slate-900">{{ safeAlbums.length }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label class="relative w-full sm:max-w-md">
              <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input v-model="keyword" type="text" placeholder="Tìm kiếm album..."
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100" />
            </label>

            <button @click="openFormCreateAlbum"
              class="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 active:scale-95">
              <Plus :size="18" /> Tạo Album Mới
            </button>
          </div>
        </header>

        <div class="grid flex-1 content-start grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <article v-for="album in safeAlbums" :key="album.albumId"
            class="group overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_18px_45px_-38px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_65px_-36px_rgba(15,23,42,0.35)]">
            <div @click="moveOnToDetailMedia(album)" class="relative h-56 cursor-pointer overflow-hidden">
              <img :src="album.coverUrl"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div
                class="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/10 to-transparent opacity-75 transition-opacity group-hover:opacity-90">
              </div>

              <div class="absolute left-4 top-4 flex flex-wrap gap-2">
                <div
                  class="rounded-full border border-black/50 bg-black/60 px-3 py-1.5 text-[10px] font-black text-white backdrop-blur-md">
                  {{ album.mediaCount }} mục
                </div>
                <div
                  class="flex items-center gap-1.5 rounded-full border border-black/50 bg-black/60 px-3 py-1.5 text-[10px] font-black text-white backdrop-blur-md">
                  <HardDrive :size="12" /> {{ formatByte(album.totalSize) }}
                </div>
              </div>

              <div class="absolute bottom-6 left-6 right-6">
                <div
                  class="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
                  <Layers :size="14" /> Bộ sưu tập
                </div>
                <h3 class="line-clamp-2 text-xl font-black leading-tight text-white">{{ album.title }}</h3>
              </div>
            </div>

            <div class="p-5">
              <p class="mb-5 line-clamp-2 min-h-10 text-sm leading-6 text-slate-500">{{ album.description }}</p>

              <div class="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-slate-100 pt-4">
                <span class="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                  <Calendar :size="14" /> {{ formatDate(album.createdAt) }}
                </span>

                <div class="flex items-center gap-2">
                  <button @click.stop="openFormUpdateAlbum(album)"
                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600">
                    <Edit :size="16" />
                  </button>
                  <button @click.stop="moveOnToDetailMedia(album)"
                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                    <Eye :size="16" />
                  </button>
                  <button @click.stop="handleDeleteAlbum(album.albumId)"
                    class="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div class="mt-auto pt-8">
          <AppPagination :page="currentPage" :total-pages="pagination.totalPages" :has-next="hasNextPage"
            :has-prev="hasPrevPage" @next="nextPage" @prev="prevPage" />
        </div>
      </div>

      <div v-else class="animate-in slide-in-from-right-10 space-y-6 duration-500">
        <section
          class="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.35)] backdrop-blur">
          <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div class="flex items-center gap-4">
              <button @click="selectedAlbum = null"
                class="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100">
                <ChevronLeft :size="24" />
              </button>

              <div>
                <div class="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-indigo-500">
                  Album Detail
                </div>
                <h2 class="mt-1 text-3xl font-black text-slate-900">{{ selectedAlbum.title }}</h2>
                <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  {{ selectedAlbum.description }}
                </p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-4">
              <!-- Stats -->
              <div class="flex items-center gap-3">
                <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                  <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Dung lượng</p>
                  <p class="mt-0.5 text-sm font-black text-slate-900">{{ currentAlbumSize }}</p>
                </div>
                <div class="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
                  <p class="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">Ngày tạo</p>
                  <p class="mt-0.5 text-sm font-black text-slate-900">{{ formatDate(selectedAlbum.createdAt) }}</p>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button @click="openUploadModal"
                  class="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700">
                  <Plus :size="14" />
                  Thêm Media
                </button>

                <button @click="openUploadLinkModal"
                  class="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-transparent bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20">
                  <Link :size="14" />
                  Thêm Liên kết
                </button>
              </div>
            </div>
          </div>
        </section>

        <section
          class="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.3)] backdrop-blur">
          <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Phân loại nội dung</p>
              <h3 class="mt-2 text-lg font-black text-slate-900">Hiển thị theo từng loại media</h3>
            </div>

            <div class="grid grid-cols-4 gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 lg:w-[34rem]">
              <button @click="activeTab = 'IMAGE'" :class="[
                'flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all',
                activeTab === 'IMAGE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              ]">
                <ImageIcon :size="18" /> Ảnh
              </button>
              <button @click="activeTab = 'VIDEO'" :class="[
                'flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all',
                activeTab === 'VIDEO' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              ]">
                <Video :size="18" /> Video
              </button>
              <button @click="activeTab = 'DOCUMENT'" :class="[
                'flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all',
                activeTab === 'DOCUMENT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              ]">
                <FileText :size="18" /> Tài liệu
              </button>
              <button @click="activeTab = 'LINK'" :class="[
                'flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all',
                activeTab === 'LINK' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              ]">
                <Link :size="18" /> Liên kết
              </button>
            </div>
          </div>
        </section>

        <section
          class="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.3)] backdrop-blur">
          <div class="mb-5 flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <p class="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">Nội dung hiển thị</p>
              <h3 class="mt-1 text-lg font-black text-slate-900">
                {{ activeTab === 'IMAGE' ? 'Bộ ảnh' : activeTab === 'VIDEO' ? 'Kho video' : activeTab === 'DOCUMENT' ? 'Tài liệu đính kèm' : 'Liên kết ngoài' }}
              </h3>
            </div>
            <div class="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600">
              {{ safeMedia.length }} mục
            </div>
          </div>

          <div v-if="safeMedia.length === 0"
            class="flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 py-20 text-slate-400">
            <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <Layers :size="32" class="opacity-20" />
            </div>
            <p class="font-bold">Chưa có mục nào trong danh mục này</p>
            <button
              class="mt-3 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              Tải lên ngay
            </button>
          </div>

          <div v-else class="animate-in fade-in zoom-in-95 duration-300">
            <template v-if="activeTab === 'IMAGE'">
              <div class="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
                <div v-for="media in safeMedia" :key="media.albumMediaId"
                  class="group overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div class="relative aspect-square cursor-zoom-in overflow-hidden rounded-[1rem] bg-slate-100"
                    @click="openPreviewImageModal(media)">
                    <img :src="media.mediaUrl"
                      class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-slate-950/70 to-transparent p-2">
                      <p class="line-clamp-1 text-xs font-bold text-white">{{ media.title }}</p>
                    </div>
                  </div>
                  <div class="mt-2 flex items-center justify-between gap-2 px-1 pb-1">
                    <p class="line-clamp-1 text-xs font-bold text-slate-700">{{ formatByte(media.fileSizeBytes) }}</p>
                    <div class="flex items-center gap-2">

                      <button @click.stop="handleDownloadMedia(media)"
                        class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                        <Download :size="14" />
                      </button>
                      <button @click.stop="handleDeleteMedia(media.albumMediaId)"
                        class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
                        <Trash2 :size="14" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-if="activeTab === 'VIDEO'">
              <div class="grid gap-4 lg:grid-cols-2">
                <div v-for="media in safeMedia" :key="media.albumMediaId"
                  class="group grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[220px_1fr]">
                  <div class="relative aspect-video cursor-pointer overflow-hidden rounded-[1rem] bg-slate-100"
                    @click="openPreviewVideoModal(media)">
                    <img :src="media.thumbnailUrl || media.mediaUrl" class="h-full w-full object-cover" />
                    <div class="absolute inset-0 flex items-center justify-center bg-slate-950/20">
                      <div
                        class="flex h-12 w-12 items-center justify-center rounded-full border border-white/50 bg-white/25 text-white backdrop-blur transition-transform group-hover:scale-110">
                        <PlayCircle :size="26" />
                      </div>
                    </div>
                  </div>
                  <div class="flex min-w-0 flex-col justify-between">
                    <div>
                      <h4 class="line-clamp-2 text-sm font-black leading-6 text-slate-900">{{ media.title }}</h4>
                      <p class="mt-2 line-clamp-2 text-sm text-slate-500">
                        {{ media.description || 'Video được lưu trong album gia đình.' }}
                      </p>
                    </div>
                    <div class="mt-4 flex items-center justify-between">
                      <div class="flex flex-wrap gap-2">
                        <span
                          class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                          {{ formatByte(media.fileSizeBytes) }}
                        </span>
                        <span
                          class="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-bold text-slate-500">
                          {{ media.mimeType }}
                        </span>
                      </div>
                      <div class="flex items-center gap-2">

                        <button @click.stop="handleDownloadMedia(media)"
                          class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                          <Download :size="16" />
                        </button>
                        <button @click.stop="handleDeleteMedia(media.albumMediaId)"
                          class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
                          <Trash2 :size="16" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-if="activeTab === 'DOCUMENT'">
              <div class="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-3">
                <div class="grid gap-3">
                  <div v-for="media in safeMedia" :key="media.albumMediaId"
                    class="group flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                    <div class="flex min-w-0 items-center gap-4">
                      <div
                        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-100">
                        <FileText :size="22" />
                      </div>
                      <div class="min-w-0">
                        <h4 class="line-clamp-1 font-black text-slate-800">{{ media.title || 'Tài liệu không tên' }}
                        </h4>
                        <p class="mt-1 flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400">
                          <span class="rounded-full bg-slate-100 px-2.5 py-1">{{ media.mimeType }}</span>
                          <span>{{ formatByte(media.fileSizeBytes) }}</span>
                        </p>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <button @click.stop="openPreviewDocsModal(media)"
                        class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-slate-300 hover:bg-white">
                        <Eye :size="16" />
                      </button>
                      <button @click.stop="handleDownloadMedia(media)"
                        class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                        <Download :size="16" />
                      </button>
                      <button @click.stop="handleDeleteMedia(media.albumMediaId)"
                        class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
                        <Trash2 :size="16" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <template v-if="activeTab === 'LINK'">
              <div class="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-3">
                <div class="grid gap-3">
                  <div v-for="media in safeMedia" :key="media.albumMediaId"
                    class="group flex items-center justify-between rounded-[1.25rem] border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                    <div class="flex min-w-0 items-center gap-4">
                      <div
                        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                        <Link :size="22" />
                      </div>
                      <div class="min-w-0">
                        <h4 class="line-clamp-1 font-black text-slate-800">{{ media.title || 'Liên kết không tên' }}
                        </h4>
                        <a :href="media.mediaUrl" target="_blank"
                          class="mt-1 line-clamp-1 text-xs font-bold text-slate-400 hover:text-indigo-500 transition-colors">
                          {{ media.mediaUrl }}
                        </a>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 shrink-0">
                      <a :href="media.mediaUrl" target="_blank"
                        class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600">
                        <Eye :size="16" />
                      </a>
                      <button @click.stop="handleDeleteMedia(media.albumMediaId)"
                        class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600">
                        <Trash2 :size="16" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slide-in-from-right-10 {
  from {
    transform: translateX(2.5rem);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes zoom-in-95 {
  from {
    transform: scale(0.95);
    opacity: 0;
  }

  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-in {
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: both;
}

.fade-in {
  animation-name: fade-in;
}

.slide-in-from-right-10 {
  animation-name: slide-in-from-right-10;
}

.zoom-in-95 {
  animation-name: zoom-in-95;
}
</style>
