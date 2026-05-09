<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Calendar as CalendarIcon,
  Pencil,
  Trash2,
  Search,
  MapPin,
  Clock,
  Bell,
  CalendarDays,
  Filter,
  Plus,
  RefreshCcw
} from 'lucide-vue-next'
import { refDebounced } from '@vueuse/core'
import type { FamilyEventReq, FamilyEventRes, UpdateFamilyEventReq } from '@/types/family/family-event.types'
import { formatDate } from '@/utils/format-date'
import { useCreateFamilyEventMutation, useDeleteFamilyEventMutation, useFamilyEventsByFamilyQuery, useUpdateFamilyEventMutation } from '@/hooks/queries/family/family_event/useFamilyEvent'
import AppPagination from '@/components/forms/common/AppPagination.vue'
import { useFamilyStore } from '@/store/family/useFamilyStore'
import AddOrUpdateEventForm from '@/components/forms/family_event/AddOrUpdateEventForm.vue'
import { usePagination } from '@/composables/common/usePagination'

const activeTab = ref<'ALL' | 'UPCOMING'>('ALL')
const familyStore = useFamilyStore()
const familyId = computed(() => familyStore.currentFamilyId)

// ===== UI HELPER =====
type NullableString = string | null | undefined

const getStatusText = (status: NullableString) => {
  const map: Record<string, string> = {
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Không hoạt động'
  }
  return status ? map[status] || status : '---'
}

const getStatusClass = (status: NullableString) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    case 'INACTIVE':
      return 'bg-slate-50 text-slate-600 border-slate-100'
    default:
      return 'bg-amber-50 text-amber-600 border-amber-100'
  }
}

const getRepeatType = (type: NullableString) => {
  const map: Record<string, { label: string; class: string }> = {
    NONE: { label: 'Không lặp', class: 'bg-slate-100 text-slate-600' },
    YEARLY: { label: 'Hằng năm', class: 'bg-purple-100 text-purple-600' }
  }
  return type && map[type]
    ? map[type]
    : { label: '---', class: 'bg-slate-100 text-slate-600' }
}

const getReminderEventType = (type: NullableString) => {
  const map: Record<string, { label: string; class: string }> = {
    NONE: { label: 'Không nhắc', class: 'bg-slate-100 text-slate-600' },
    DAY_1: { label: '1 ngày', class: 'bg-green-100 text-green-600' },
    DAY_3: { label: '3 ngày', class: 'bg-emerald-100 text-emerald-600' },
    DAY_7: { label: '7 ngày', class: 'bg-blue-100 text-blue-600' },
    DAY_15: { label: '15 ngày', class: 'bg-indigo-100 text-indigo-600' },
    MONTH_1: { label: '1 tháng', class: 'bg-purple-100 text-purple-600' }
  }
  return type && map[type]
    ? map[type]
    : { label: '---', class: 'bg-slate-100 text-slate-600' }
}

// ===== TABLE HEADER =====
const tableHeaders = [
  '#',
  'Tên sự kiện',
  'Ngày sự kiện',
  'Sắp diễn ra',
  'Trạng thái',
  'Lặp lại',
  'Nhắc hẹn',
  'Thời gian',
  'Địa điểm',
  'Ghi chú',
  'Hành động'
]

// ===== SEARCH + PAGINATION =====
const {
  pagination,
  currentPage,
  hasNextPage,
  hasPrevPage,
  nextPage,
  prevPage,
  setTotalPages
} = usePagination(10, 0)

const keyword = ref('')
const debounceKeyword = refDebounced(keyword, 400)

const option = ref<'ALL' | 'UPCOMING'>('ALL')

const params = computed(() => ({
  page: pagination.page,
  size: pagination.size,
  keyword: debounceKeyword.value,
  option: option.value
}))

const { data: familyEventsData } =
  useFamilyEventsByFamilyQuery(familyId, params)

const events = computed<FamilyEventRes[]>(() => {
  return familyEventsData.value?.data?.items ?? []
})

watch(
  () => familyEventsData.value?.data?.totalPages,
  (total) => setTotalPages(total || 0),
  { immediate: true }
)

const indexUI = (index: number) =>
  index + 1 + pagination.page * pagination.size

watch(activeTab, (v) => {
  option.value = v
  pagination.page = 0
})

watch(debounceKeyword, () => {
  pagination.page = 0
})

// curd
const { mutate: createEventMutation } = useCreateFamilyEventMutation();
const { mutate: updateEventMutation } = useUpdateFamilyEventMutation();
const { mutate: deleteEventMutation } = useDeleteFamilyEventMutation();
const mode = {
  create: 'create',
  update: 'update',
} as const

const currentMode = ref<typeof mode[keyof typeof mode]>(mode.create);
const isShowAddOrUpdateEventForm = ref(false);
const selectedEvent = ref<FamilyEventRes | null>(null)

const closeEventForm = () => {
  isShowAddOrUpdateEventForm.value = false
  selectedEvent.value = null
}

const openCreateForm = () => {
  currentMode.value = mode.create
  selectedEvent.value = null
  isShowAddOrUpdateEventForm.value = true
}

const openUpdateForm = (event: FamilyEventRes) => {
  currentMode.value = mode.update
  selectedEvent.value = event
  isShowAddOrUpdateEventForm.value = true
}


const handleCreateEvent = (payload: FamilyEventReq) => {
  if (!familyId.value) return

  createEventMutation({
    familyId: familyId.value,
    data: payload
  }, {
    onSuccess: () => {
      closeEventForm()
    }
  })
}


const handleUpdateEvent = (payload: UpdateFamilyEventReq) => {
  if (!familyId.value || !selectedEvent.value?.familyEventId) return

  updateEventMutation({
    familyId: familyId.value,
    eventId: selectedEvent.value.familyEventId,
    data: payload
  }, {
    onSuccess: () => {
      closeEventForm()
    }
  })
}


const handleDeleteEvent = (eventId: number) => {
  if (!familyId.value) return

  const confirmed = confirm('Bạn có chắc chắn muốn xóa sự kiện này?')
  if (!confirmed) return

  deleteEventMutation({
    familyId: familyId.value,
    eventId
  })
}

const handleReload = () => {
  keyword.value = ''
}

</script>



<template>
  <div class="min-h-screen bg-slate-50/50 p-8">
    <div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 class="flex items-center gap-2 text-2xl font-black tracking-tight text-slate-800">
          <CalendarIcon class="text-amber-600" :size="28" />
          Quản lý Sự kiện
        </h1>
        <p class="mt-1 text-sm font-medium text-slate-500">
          Danh sách các hoạt động quan trọng của gia đình.
        </p>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-4">
      <!-- Tab Navigation -->
      <div class="flex flex-col items-center justify-between gap-4 lg:flex-row">
        <div class="flex w-full rounded-xl bg-slate-100 p-1 lg:w-auto">
          <button type="button" @click="activeTab = 'ALL'" :class="[
            'flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-bold transition-all lg:w-auto',
            activeTab === 'ALL'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          ]">
            <CalendarDays :size="16" />
            Tất cả
          </button>

          <button type="button" @click="activeTab = 'UPCOMING'" :class="[
            'flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-bold transition-all lg:w-auto',
            activeTab === 'UPCOMING'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          ]">
            <Bell :size="16" />
            Sắp diễn ra
          </button>
        </div>

        <!-- Search and Filter -->
        <div class="flex w-full items-center gap-3 lg:w-auto">
          <div class="relative flex-1 lg:w-72">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
            <input v-model="keyword" type="text" placeholder="Tìm kiếm sụ kiện theo tên..."
              class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>

          <button type="button" @click="handleReload"
            class="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-500 hover:bg-slate-100">
            <RefreshCcw :size="18" />
          </button>

          <button type="button" @click="openCreateForm"
            class="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95">
            <Plus :size="18" />
            Tạo sự kiện
          </button>

        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full border-collapse text-left">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/50">
              <th v-for="(header, index) in tableHeaders" :key="index"
                class="whitespace-nowrap px-5 py-4 text-[13px] font-black uppercase tracking-wider text-slate-500">
                {{ header }}
              </th>
            </tr>
          </thead>

          <tbody v-if="events.length > 0" class="divide-y divide-slate-100">
            <tr v-for="(event, index) in events" :key="event.familyEventId"
              class="group transition-colors hover:bg-indigo-50/30">

              <!-- STT -->
              <td class="px-5 py-4 align-top">
                <span class="text-sm font-bold text-slate-800 group-hover:text-indigo-600">
                  {{ indexUI(index) }}
                </span>
              </td>

              <!-- TÊN -->
              <td class="px-5 py-4 align-top">
                <div class="min-w-48 max-w-64">
                  <p class="font-bold text-slate-800 group-hover:text-indigo-600">
                    {{ event.eventName }}
                  </p>
                  <p class="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-400">
                    {{ event.note || '---' }}
                  </p>
                </div>
              </td>

              <!-- NGÀY SỰ KIỆN -->
              <td class="px-5 py-4 align-top">
                <div class="min-w-28">
                  <div class="flex items-center gap-2">
                    <span class="text-base font-bold text-slate-800">
                      {{ event.day }}/{{ event.month }}
                    </span>

                    <!-- chỉ hiện nếu âm -->
                    <span v-if="event.calendarType === 'LUNAR'"
                      class="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-600">
                      Âm
                    </span>
                  </div>

                  <div class="mt-1 text-xs text-slate-400">
                    {{ event.year || 'Hằng năm' }}
                  </div>
                </div>
              </td>

              <!-- SẮP DIỄN RA -->
              <td class="px-5 py-4 align-top">
                <div class="min-w-28">
                  <span class="rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600">
                    {{ event.nextOccurrenceDate ? formatDate(event.nextOccurrenceDate) : '---' }}
                  </span>
                </div>
              </td>

              <!-- STATUS -->
              <td class="px-5 py-4 align-top">
                <span :class="[
                  'inline-flex whitespace-nowrap rounded-lg border px-2.5 py-1 text-[11px] font-bold',
                  getStatusClass(event.status)
                ]">
                  {{ getStatusText(event.status) }}
                </span>
              </td>

              <!-- REPEAT -->
              <td class="px-5 py-4 align-top">
                <span :class="[
                  'inline-flex whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-bold',
                  getRepeatType(event.repeatType).class
                ]">
                  {{ getRepeatType(event.repeatType).label }}
                </span>
              </td>

              <!-- REMINDER -->
              <td class="px-5 py-4 align-top">
                <span :class="[
                  'inline-flex whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-bold',
                  getReminderEventType(event.reminderType).class
                ]">
                  {{ getReminderEventType(event.reminderType).label }}
                </span>
              </td>

              <!-- TIME -->
              <td class="px-5 py-4 align-top">
                <span class="whitespace-nowrap text-sm font-semibold text-slate-700">
                  {{ event.eventTime || '---' }}
                </span>
              </td>

              <!-- LOCATION -->
              <td class="px-5 py-4 align-top">
                <div class="flex max-w-72 items-start gap-2 text-sm text-slate-600">
                  <MapPin :size="14" class="mt-0.5 shrink-0 text-slate-400" />
                  <a v-if="event.locationMapUrl" :href="event.locationMapUrl" target="_blank"
                    class="line-clamp-2 font-medium text-indigo-600 hover:underline">
                    {{ event.location || 'Xem bản đồ' }}
                  </a>
                  <span v-else class="line-clamp-2">
                    {{ event.location || '---' }}
                  </span>
                </div>
              </td>

              <!-- NOTE -->
              <td class="px-5 py-4 align-top">
                <p class="line-clamp-2 max-w-72 text-sm leading-relaxed text-slate-500">
                  {{ event.note || '---' }}
                </p>
              </td>

              <!-- ACTION -->
              <td class="px-5 py-4 align-top">
                <div class="flex items-center justify-center gap-1">
                  <button type="button" @click="openUpdateForm(event)"
                    class="rounded-lg border border-transparent p-2 text-slate-400 transition-all hover:border-indigo-100 hover:bg-white hover:text-indigo-600">
                    <Pencil :size="16" />
                  </button>
                  <button type="button" @click="handleDeleteEvent(event.familyEventId)"
                    class="rounded-lg border border-transparent p-2 text-slate-400 transition-all hover:border-rose-100 hover:bg-white hover:text-rose-600">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="events.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-300">
          <CalendarIcon :size="32" />
        </div>
        <h3 class="text-lg font-bold text-slate-800">Không có dữ liệu</h3>
        <p class="mt-1 text-sm text-slate-400">
          Không tìm thấy sự kiện nào phù hợp với tìm kiếm của bạn.
        </p>
      </div>

      <div
        class="flex items-center justify-between border-t border-slate-100 bg-slate-50/30 px-6 py-4 text-sm font-medium text-slate-500">
        <span>Hiển thị {{ events.length }} sự kiện</span>

        <div class="flex gap-2">
          <button type="button"
            class="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-white disabled:opacity-50" disabled>
            Trước
          </button>

          <button type="button"
            class="rounded-lg border border-indigo-200 bg-white px-3 py-1.5 font-bold text-indigo-600 shadow-sm">
            1
          </button>

          <button type="button"
            class="rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-white disabled:opacity-50" disabled>
            Sau
          </button>
        </div>
      </div>
    </div>

    <AddOrUpdateEventForm :show="isShowAddOrUpdateEventForm" :mode="currentMode" :event="selectedEvent"
      @close="closeEventForm"
      @submit="currentMode === mode.create ? handleCreateEvent($event) : handleUpdateEvent($event)" />

    <!-- panagtion -->
    <AppPagination :page="currentPage" :total-pages="pagination.totalPages" :has-next="hasNextPage"
      :has-prev="hasPrevPage" @next="nextPage" @prev="prevPage" />
  </div>
</template>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
