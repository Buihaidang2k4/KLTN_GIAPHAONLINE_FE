<script setup lang="ts">
import type { AlbumMediaRes } from '@/types/family/album.types'
import { formatByte } from '@/utils/format-byte'
import { onBeforeUnmount, onMounted } from 'vue'
import { Download, X } from 'lucide-vue-next'

const props = defineProps<{
  show: boolean
  media: AlbumMediaRes | null
}>()

const emit = defineEmits<{
  close: []
}>()

const handleClose = () => {
  emit('close')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="show && media">
      <div class="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm" @click="handleClose"></div>

      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
        <div class="relative flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-[0_40px_100px_-45px_rgba(0,0,0,0.8)]">
          <div class="flex items-center justify-between border-b border-white/10 px-5 py-4 text-white">
            <div class="min-w-0">
              <h3 class="line-clamp-1 text-lg font-bold">{{ media.title || 'Ảnh xem trước' }}</h3>
              <p class="mt-1 text-xs text-white/60">
                {{ media.mimeType }} • {{ formatByte(media.fileSizeBytes) }}
              </p>
            </div>

            <div class="ml-4 flex items-center gap-2">
              <a
                :href="media.mediaUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <Download :size="18" />
              </a>
              <button
                type="button"
                class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
                @click="handleClose"
              >
                <X :size="18" />
              </button>
            </div>
          </div>

          <div class="flex min-h-0 flex-1 items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_55%)] p-4 md:p-6">
            <img
              :src="media.mediaUrl"
              :alt="media.title"
              class="max-h-[75vh] w-auto max-w-full rounded-[1.5rem] object-contain"
            />
          </div>

          <div v-if="media.description" class="border-t border-white/10 px-5 py-4 text-sm leading-6 text-white/70">
            {{ media.description }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped></style>
