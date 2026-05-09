<script setup lang="ts">
import type { AlbumMediaRes } from '@/types/family/album.types'
import { formatByte } from '@/utils/format-byte'
import { onBeforeUnmount, onMounted } from 'vue'
import { Download, X, ImageIcon, Sparkles } from 'lucide-vue-next'

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
    <Transition name="fade">
        <div v-if="show && media" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-slate-900/90 backdrop-blur-md" @click="handleClose"></div>

            <!-- Modal Container -->
            <div class="relative w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden rounded-[2.5rem] bg-slate-900 shadow-[0_40px_100px_-45px_rgba(0,0,0,0.8)] border border-white/5 animate-in fade-in zoom-in duration-300">
                
                <!-- Header -->
                <div class="relative shrink-0 px-8 py-5 flex items-center justify-between border-b border-white/5">
                    <div class="flex items-center gap-4">
                        <div class="p-2.5 bg-white/5 rounded-xl border border-white/10 text-amber-500 shadow-inner">
                            <ImageIcon :size="20" />
                        </div>
                        <div class="min-w-0">
                            <div class="flex items-center gap-2 mb-0.5">
                                <Sparkles :size="10" class="text-amber-500/50" />
                                <span class="text-[9px] font-bold text-amber-500/70 uppercase tracking-widest">Xem ảnh kỷ niệm</span>
                            </div>
                            <h3 class="line-clamp-1 text-lg font-black text-white leading-tight">{{ media.title || 'Khoảnh khắc gia đình' }}</h3>
                            <p class="text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                                {{ media.mimeType.split('/')[1] }} • {{ formatByte(media.fileSizeBytes) }}
                            </p>
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <a
                            :href="media.mediaUrl"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex items-center gap-2 px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-all active:scale-95"
                        >
                            <Download :size="16" />
                            <span class="text-[10px] font-bold uppercase tracking-widest">Tải xuống</span>
                        </a>
                        <button
                            type="button"
                            class="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all active:scale-90"
                            @click="handleClose"
                        >
                            <X :size="20" />
                        </button>
                    </div>
                </div>

                <!-- Media Content -->
                <div class="flex-1 flex items-center justify-center bg-[radial-gradient(circle_at_center,rgba(255,191,36,0.03),transparent_70%)] p-4 md:p-8 overflow-hidden">
                    <div class="relative group h-full w-full flex items-center justify-center">
                        <img
                            :src="media.mediaUrl"
                            :alt="media.title"
                            class="max-h-full w-auto max-w-full rounded-2xl object-contain shadow-2xl transition duration-700 group-hover:scale-[1.01]"
                        />
                    </div>
                </div>

                <!-- Footer Description -->
                <div v-if="media.description" class="shrink-0 px-8 py-5 bg-white/[0.02] border-t border-white/5">
                    <p class="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Ghi chú kỷ niệm</p>
                    <p class="text-sm leading-relaxed text-white/70 font-medium">
                        {{ media.description }}
                    </p>
                </div>
                
                <!-- Decorative footer line -->
                <div class="h-1 w-full bg-[linear-gradient(90deg,transparent_0%,#d97706_50%,transparent_100%)] opacity-20"></div>
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

.rounded-\[2\.5rem\]::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    width: 40px;
    height: 40px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    border-left: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px 0 0 0;
    pointer-events: none;
}
</style>
