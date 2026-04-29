<script setup lang="ts">
import { ref, computed, type MaybeRefOrGetter, toValue, reactive, toRef } from 'vue'
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  MapPin,
  Clock,
  MoreVertical,
  Bell,
  CalendarDays,
  Filter,
  Info
} from 'lucide-vue-next'

import type { FamilyEventRes } from '@/types/family/family-event.types'
import { formatDate } from '@/utils/format-date'
import {
  useCreateFamilyEventMutation,
  useDeleteFamilyEventMutation,
  useFamilyEventsByFamilyQuery,
  useUpdateFamilyEventMutation
} from '@/hooks/queries/family/family_event/useFamilyEvent'
import AppPagination from '@/components/forms/common/AppPagination.vue'
import { useFamilyStore } from '@/store/family/useFamilyStore'

const activeTab = ref<'all' | 'recent'>('all')
const familyStore = useFamilyStore();
const familyId = computed(() => familyStore.currentFamilyId);

const { mutate: createEventMutation } = useCreateFamilyEventMutation()
const { mutate: deleteEventMutation } = useDeleteFamilyEventMutation()
const { mutate: updateEventMutation } = useUpdateFamilyEventMutation()


// ui helper
type NullableString = string | null | undefined


const getStatusText = (status: MaybeRefOrGetter<NullableString>) => {
  const value = toValue(status);

  const map: Record<string, string> = {
    ACTIVE: 'Hoạt động',
    INACTIVE: 'Không hoạt động'
  }

  return value ? map[value] || value : toValue(status)
}

const getStatusClass = (status: MaybeRefOrGetter<NullableString>) => {
  const value = toValue(status);

  switch (value) {
    case 'ACTIVE':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    case 'INACTIVE':
      return 'bg-slate-50 text-slate-600 border-slate-100'
    default:
      return 'bg-amber-50 text-amber-600 border-amber-100'
  }
}

const getRepeatType = (type: MaybeRefOrGetter<NullableString>) => {
  const value = toValue(type)

  const map: Record<string, { label: string; class: string }> = {
    NONE: {
      label: 'Không lặp',
      class: 'bg-slate-100 text-slate-600'
    },
    DAILY: {
      label: 'Hằng ngày',
      class: 'bg-green-100 text-green-600'
    },
    WEEKLY: {
      label: 'Hằng tuần',
      class: 'bg-blue-100 text-blue-600'
    },
    MONTHLY: {
      label: 'Hằng tháng',
      class: 'bg-indigo-100 text-indigo-600'
    },
    YEARLY: {
      label: 'Hằng năm',
      class: 'bg-purple-100 text-purple-600'
    }
  }

  return value && map[value]
    ? map[value]
    : {
      label: value || '---',
      class: 'bg-slate-100 text-slate-600'
    }
}

const getCalendarType = (type: MaybeRefOrGetter<NullableString>) => {
  const value = toValue(type);

  const map: Record<string, string> = {
    SOLAR: 'Dương lịch',
    LUNAR: 'Âm lịch'
  }

  return value ? map[value] || value || value : '---'
}

const getReminderEventType = (reminderType: MaybeRefOrGetter<NullableString>) => {
  const value = toValue(reminderType)

  const map: Record<string, { label: string; class: string }> = {
    NONE: {
      label: 'Không nhắc',
      class: 'bg-slate-100 text-slate-600'
    },
    DAY_1: {
      label: 'Trước 1 ngày',
      class: 'bg-green-100 text-green-600'
    },
    DAY_3: {
      label: 'Trước 3 ngày',
      class: 'bg-emerald-100 text-emerald-600'
    },
    DAY_7: {
      label: 'Trước 7 ngày',
      class: 'bg-blue-100 text-blue-600'
    },
    DAY_15: {
      label: 'Trước 15 ngày',
      class: 'bg-indigo-100 text-indigo-600'
    },
    MONTH_1: {
      label: 'Trước 1 tháng',
      class: 'bg-purple-100 text-purple-600'
    }
  }

  return value && map[value]
    ? map[value]
    : {
      label: value || '---',
      class: 'bg-slate-100 text-slate-600'
    }
}
const tableHeaders = [
  '#',
  'Tên sự kiện',
  'Âm lịch',
  'Dương lịch',
  'Loại lịch',
  'Trạng thái',
  'Lặp lại',
  'Nhắc hẹn',
  'Thời gian',
  'Địa điểm',
  'Ghi chú',
  'Hành động'
]

// panagtion
const pagination = reactive({
  page: 0, size: 10, keyword: ''
})

const params = computed(() => ({
  page: pagination.page,
  size: pagination.size,
  keyword: pagination.keyword
}))

const { data: familyEventsData } = useFamilyEventsByFamilyQuery(familyId, params)

const events = computed<FamilyEventRes[]>(() => {
  const data = familyEventsData.value?.data

  if (data?.items) {
    return data.items
  }

  if (Array.isArray(data)) {
    return data
  }

  return []
})

const currentTotalPages = computed(() => {
  return familyEventsData.value?.data?.totalPages ?? 1
})

const currentPage = computed(() => pagination.page)
const hasNextPage = computed(() => currentPage.value + 1 < currentTotalPages.value)
const hasPrevPage = computed(() => currentPage.value > 0)

const nextPage = () => { if (hasNextPage.value) pagination.page++ }
const prevPage = () => { if (hasPrevPage.value) pagination.page-- }

const indexUI = (index: number) => {
  return index + 1 + (currentPage.value) * pagination.size
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

      <button type="button"
        class="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95">
        <Plus :size="18" />
        Tạo sự kiện
      </button>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-4">
      <!-- Tab Navigation -->
      <div class="flex flex-col items-center justify-between gap-4 lg:flex-row">
        <div class="flex w-full rounded-xl bg-slate-100 p-1 lg:w-auto">
          <button type="button" @click="activeTab = 'all'" :class="[
            'flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-bold transition-all lg:w-auto',
            activeTab === 'all'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
          ]">
            <CalendarDays :size="16" />
            Tất cả
          </button>

          <button type="button" @click="activeTab = 'recent'" :class="[
            'flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2 text-sm font-bold transition-all lg:w-auto',
            activeTab === 'recent'
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
            <input v-model="searchKeyword" type="text" placeholder="Tìm kiếm sụ kiện theo tên..."
              class="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>

          <button type="button"
            class="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-500 hover:bg-slate-100">
            <Filter :size="18" />
          </button>
        </div>
      </div>
    </div>

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse text-left">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50/50">
              <th v-for="(header, index) in tableHeaders" :key="index"
                class="whitespace-nowrap px-6 py-4 text-[13px] font-black uppercase tracking-wider text-slate-500">
                {{ header }}
              </th>
            </tr>
          </thead>

          <tbody v-if="events.length > 0" class="divide-y divide-slate-100">
            <tr v-for="(event, index) in events" :key="event.familyEventId ?? index"
              class="group transition-colors hover:bg-indigo-50/30">
              <td class="px-6 py-4 align-top">
                <span class="font-bold text-slate-800 group-hover:text-indigo-600">
                  {{ indexUI(index) }}
                </span>
              </td>

              <td class="px-6 py-4 align-top">
                <div class="flex min-w-64 flex-col">
                  <span class="font-bold text-slate-800 group-hover:text-indigo-600">
                    {{ event.eventName }}
                  </span>
                  <span class="mt-0.5 line-clamp-1 max-w-64 text-xs text-slate-400">
                    {{ event.note || 'Không có ghi chú' }}
                  </span>
                </div>
              </td>

              <td class="px-6 py-4 align-top">
                <span class="whitespace-nowrap text-sm font-semibold text-slate-700">
                  {{ event.lunarDate ? formatDate(event.lunarDate) : '---' }}
                </span>
              </td>

              <td class="px-6 py-4 align-top">
                <span class="whitespace-nowrap text-sm font-semibold text-slate-700">
                  {{ event.solarDate ? formatDate(event.solarDate) : '---' }}
                </span>
              </td>

              <td class="px-6 py-4 align-top">
                <span
                  class="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-black uppercase text-indigo-600 whitespace-nowrap">
                  {{ getCalendarType(event.calendarType) }}
                </span>
              </td>

              <td class="px-6 py-4 align-top">
                <span :class="[
                  'rounded-lg border px-2.5 py-1 text-[11px] font-bold',
                  getStatusClass(event.status)
                ]">
                  {{ getStatusText(event.status) }}
                </span>
              </td>

              <td class="px-6 py-4 align-top">
                <span :class="[
                  'px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap',
                  getRepeatType(event.repeatType).class
                ]">
                  {{ getRepeatType(event.repeatType).label }}
                </span>
              </td>

              <td class="px-6 py-4 align-top">
                <span
                  :class="['whitespace-nowrap text-sm px-2 py-1 rounded-2xl', getReminderEventType(event.reminderType).class]">
                  {{ getReminderEventType(event.reminderType).label }}
                </span>
              </td>

              <td class="px-6 py-4 align-top">
                <div class="flex flex-col">
                  <span class="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                    <Clock :size="14" class="text-slate-400" />
                    {{ event.eventTime }}
                  </span>
                  <span class="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                    <CalendarIcon :size="14" />
                    {{ event.createdAt ? formatDate(event.createdAt) : '---' }}
                  </span>
                </div>
              </td>

              <td class="px-6 py-4 align-top">
                <div class="flex max-w-52 items-center gap-2 text-sm text-slate-600">
                  <MapPin :size="14" class="shrink-0 text-slate-400" />
                  <a v-if="event.locationMapUrl" :href="event.locationMapUrl" target="_blank" rel="noopener noreferrer"
                    class="truncate font-medium text-indigo-600 hover:underline">
                    {{ event.location || 'Xem bản đồ' }}
                  </a>
                  <span v-else class="truncate">
                    {{ event.location || '---' }}
                  </span>
                </div>
              </td>

              <td class="px-6 py-4 align-top">
                <p class="line-clamp-2 max-w-72 text-sm text-slate-500">
                  {{ event.note || '---' }}
                </p>
              </td>

              <td class="px-6 py-4 align-top">
                <div class="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button type="button"
                    class="rounded-lg border border-transparent p-2 text-slate-400 shadow-sm transition-all hover:border-indigo-100 hover:bg-white hover:text-indigo-600"
                    title="Chi tiết">
                    <Info :size="18" />
                  </button>

                  <button type="button"
                    class="rounded-lg border border-transparent p-2 text-slate-400 shadow-sm transition-all hover:border-slate-200 hover:bg-white hover:text-slate-800"
                    title="Thao tác">
                    <MoreVertical :size="18" />
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
    <!-- panagtion -->
    <AppPagination :page="currentPage" :total-pages="currentTotalPages" :has-next="hasNextPage" :has-prev="hasPrevPage"
      @next="nextPage" @prev="prevPage" />
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