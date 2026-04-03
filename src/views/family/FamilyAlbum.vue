<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Image as ImageIcon, 
  Video, 
  FileText, 
  ChevronLeft, 
  Folder, 
  Calendar,
  Layers,
  ArrowRight,
  Plus,
  Search,
  Download,
  Eye,
  PlayCircle,
  HardDrive,
  MoreVertical
} from 'lucide-vue-next'

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU THEO SCHEMA ---
interface Album {
  album_id: number;
  family_id: number;
  created_by_account_id: number;
  title: string;
  slug: string;
  description: string;
  cover_url: string;
  total_size: number; // bytes
  media_count: number;
  created_at: string;
  updated_at: string;
}

interface AlbumMedia {
  album_media_id: number;
  album_id: number;
  title: string;
  description: string;
  media_url: string;
  thumbnail_url: string;
  mime_type: string;
  file_size_bytes: number;
  media_type: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  created_at: string;
}

// --- DỮ LIỆU MẪU (Mô phỏng dữ liệu từ API) ---
const albums = ref<Album[]>([
  { 
    album_id: 1, 
    family_id: 101, 
    created_by_account_id: 1, 
    title: 'Kỷ niệm Đám cưới Hùng & Lan', 
    slug: 'ky-niem-dam-cuoi',
    description: 'Bộ sưu tập hình ảnh và video từ ngày trọng đại 20/12/2023',
    cover_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800',
    total_size: 157286400, // 150MB
    media_count: 45,
    created_at: '2023-12-20T08:00:00Z',
    updated_at: '2024-01-05T10:00:00Z'
  },
  { 
    album_id: 2, 
    family_id: 101, 
    created_by_account_id: 1, 
    title: 'Du xuân Giáp Thìn 2024', 
    slug: 'du-xuan-2024',
    description: 'Chuyến đi lễ chùa và du xuân của đại gia đình tại miền Bắc',
    cover_url: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800',
    total_size: 524288000, // 500MB
    media_count: 128,
    created_at: '2024-02-12T09:00:00Z',
    updated_at: '2024-02-15T15:00:00Z'
  }
])

const allMedia = ref<AlbumMedia[]>([
  { album_media_id: 1, album_id: 1, title: 'Ảnh cổng', description: '', media_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=500', thumbnail_url: '', mime_type: 'image/jpeg', file_size_bytes: 2048000, media_type: 'IMAGE', created_at: '2023-12-20' },
  { album_media_id: 2, album_id: 1, title: 'Lễ rước dâu', description: '', media_url: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=500', thumbnail_url: '', mime_type: 'image/jpeg', file_size_bytes: 3500000, media_type: 'IMAGE', created_at: '2023-12-20' },
  { album_media_id: 3, album_id: 1, title: 'Highlight Đám Cưới', description: '', media_url: '#', thumbnail_url: 'https://images.unsplash.com/photo-1492691523567-6170c817538a?q=80&w=500', mime_type: 'video/mp4', file_size_bytes: 50000000, media_type: 'VIDEO', created_at: '2023-12-21' },
  { album_media_id: 4, album_id: 1, title: 'Danh sách khách mời', description: '', media_url: '#', thumbnail_url: '', mime_type: 'application/pdf', file_size_bytes: 1200000, media_type: 'DOCUMENT', created_at: '2023-12-15' },
])

// --- TRẠNG THÁI GIAO DIỆN ---
const selectedAlbum = ref<Album | null>(null)
const activeTab = ref<'IMAGE' | 'VIDEO' | 'DOCUMENT'>('IMAGE')

// --- LOGIC PHÂN LOẠI MEDIA TRONG ALBUM ĐANG CHỌN ---
const filteredMedia = computed(() => {
  if (!selectedAlbum.value) return []
  return allMedia.value.filter(m => m.album_id === selectedAlbum.value?.album_id && m.media_type === activeTab.value)
})

// --- HELPER FUNCTIONS ---
const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

const openAlbum = (album: Album) => {
  selectedAlbum.value = album
  activeTab.value = 'IMAGE'
}
</script>

<template>
  <div class="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900">
    <div class="max-w-7xl mx-auto">
      
      <!-- [MÀN HÌNH NGOÀI]: DANH SÁCH ALBUMS -->
      <div v-if="!selectedAlbum" class="animate-in fade-in duration-500">
        <header class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 class="text-4xl font-black tracking-tight text-slate-900">Kho Kỷ Niệm</h1>
            <p class="text-slate-500 mt-2 font-medium flex items-center gap-2">
              <Folder :size="18" class="text-indigo-500" /> Quản lý các album gia đình tập trung
            </p>
          </div>
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 transition-all active:scale-95 group">
            <Plus :size="22" /> Tạo Album Mới
          </button>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div 
            v-for="album in albums" 
            :key="album.album_id"
            @click="openAlbum(album)"
            class="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-white"
          >
            <!-- Cover Image -->
            <div class="relative h-64 overflow-hidden">
              <img :src="album.cover_url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              
              <!-- Stats Overlay -->
              <div class="absolute top-4 right-4 flex flex-col gap-2">
                <div class="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 self-end">
                   <HardDrive :size="12" /> {{ formatSize(album.total_size) }}
                </div>
              </div>

              <div class="absolute bottom-6 left-6 right-6">
                 <div class="flex items-center gap-2 text-white/80 text-xs font-bold mb-1">
                   <Layers :size="14" /> {{ album.media_count }} tài liệu
                 </div>
                 <h3 class="text-white text-xl font-black leading-tight line-clamp-1">{{ album.title }}</h3>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <p class="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-6 h-10">{{ album.description }}</p>
              <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span class="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <Calendar :size="14" /> {{ formatDate(album.created_at) }}
                </span>
                <div class="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                  <ArrowRight :size="18" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- [MÀN HÌNH TRONG]: CHI TIẾT ALBUM & PHÂN LOẠI MEDIA -->
      <div v-else class="animate-in slide-in-from-right-10 duration-500">
        <!-- Header điều hướng -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div class="flex items-center gap-5">
            <button @click="selectedAlbum = null" class="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors border border-slate-200 text-slate-600">
              <ChevronLeft :size="28" />
            </button>
            <div>
              <div class="flex items-center gap-2 text-indigo-500 text-xs font-black uppercase tracking-[0.2em]">
                Album Detail
              </div>
              <h2 class="text-3xl font-black text-slate-900 mt-0.5">{{ selectedAlbum.title }}</h2>
            </div>
          </div>
          <div class="flex items-center gap-3">
             <div class="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
               <span class="text-[10px] font-bold text-slate-400 uppercase">Dung lượng</span>
               <span class="text-sm font-black text-slate-800">{{ formatSize(selectedAlbum.total_size) }}</span>
             </div>
             <button class="bg-slate-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg">
                <Plus :size="24" />
             </button>
          </div>
        </div>

        <!-- Thanh phân loại Tab (Media Type) -->
        <div class="grid grid-cols-3 gap-2 bg-slate-200/50 p-1.5 rounded-3xl mb-8 max-w-2xl mx-auto md:mx-0">
          <button 
            @click="activeTab = 'IMAGE'"
            :class="[
              'flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all',
              activeTab === 'IMAGE' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            ]"
          >
            <ImageIcon :size="20" /> Ảnh
          </button>
          <button 
            @click="activeTab = 'VIDEO'"
            :class="[
              'flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all',
              activeTab === 'VIDEO' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            ]"
          >
            <Video :size="20" /> Video
          </button>
          <button 
            @click="activeTab = 'DOCUMENT'"
            :class="[
              'flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold transition-all',
              activeTab === 'DOCUMENT' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            ]"
          >
            <FileText :size="20" /> Tài liệu
          </button>
        </div>

        <!-- Khu vực hiển thị nội dung Media -->
        <div class="min-h-[500px]">
          <!-- EMPTY STATE -->
          <div v-if="filteredMedia.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 text-slate-400">
             <div class="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                <Layers :size="32" class="opacity-20" />
             </div>
             <p class="font-bold">Chưa có mục nào trong danh mục này</p>
             <button class="text-indigo-600 text-sm font-black mt-2 underline">Tải lên ngay</button>
          </div>

          <!-- GRID HIỂN THỊ -->
          <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in zoom-in-95 duration-300">
            
            <!-- HIỂN THỊ ẢNH -->
            <template v-if="activeTab === 'IMAGE'">
              <div v-for="m in filteredMedia" :key="m.album_media_id" class="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all border border-slate-100">
                <img :src="m.media_url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                   <p class="text-white text-sm font-bold mb-3">{{ m.title }}</p>
                   <div class="flex gap-2">
                     <button class="flex-1 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white text-xs font-bold hover:bg-white/40 transition-colors">Xem</button>
                     <button class="w-10 h-10 bg-white rounded-xl text-slate-900 flex items-center justify-center"><Download :size="16" /></button>
                   </div>
                </div>
              </div>
            </template>

            <!-- HIỂN THỊ VIDEO -->
            <template v-if="activeTab === 'VIDEO'">
              <div v-for="m in filteredMedia" :key="m.album_media_id" class="group bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all">
                <div class="relative aspect-video">
                   <img :src="m.thumbnail_url" class="w-full h-full object-cover" />
                   <div class="absolute inset-0 flex items-center justify-center">
                      <div class="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white border border-white/50 group-hover:scale-110 transition-transform cursor-pointer">
                         <PlayCircle :size="32" />
                      </div>
                   </div>
                </div>
                <div class="p-5 flex items-center justify-between">
                   <div>
                     <h4 class="text-sm font-black text-slate-800 line-clamp-1">{{ m.title }}</h4>
                     <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{{ formatSize(m.file_size_bytes) }}</span>
                   </div>
                   <button class="text-slate-400 hover:text-indigo-600"><Download :size="18" /></button>
                </div>
              </div>
            </template>

            <!-- HIỂN THỊ TÀI LIỆU -->
            <template v-if="activeTab === 'DOCUMENT'">
              <div v-for="m in filteredMedia" :key="m.album_media_id" class="col-span-full md:col-span-2 lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between hover:shadow-lg transition-all group">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FileText :size="24" />
                  </div>
                  <div>
                    <h4 class="font-black text-slate-800">{{ m.title || 'Tài liệu không tên' }}</h4>
                    <p class="text-xs font-bold text-slate-400 flex items-center gap-2">
                       <span class="px-2 py-0.5 bg-slate-100 rounded text-[9px]">{{ m.mime_type }}</span>
                       {{ formatSize(m.file_size_bytes) }}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                   <button class="p-3 text-slate-400 hover:bg-slate-50 rounded-xl"><Eye :size="20" /></button>
                   <button class="p-3 text-slate-400 hover:bg-slate-50 rounded-xl"><Download :size="20" /></button>
                </div>
              </div>
            </template>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes slide-in-from-right-10 { from { transform: translateX(2.5rem); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes zoom-in-95 { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

.animate-in {
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  animation-fill-mode: both;
}

.fade-in { animation-name: fade-in; }
.slide-in-from-right-10 { animation-name: slide-in-from-right-10; }
.zoom-in-95 { animation-name: zoom-in-95; }
</style>