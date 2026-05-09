<script setup lang="ts">
import { Clock, ListOrdered, Pencil, Eye, Trash2 } from 'lucide-vue-next'
import type { CeremonyRes } from '@/types/family/ceremony.types'

const props = defineProps<{
    ceremony: CeremonyRes
}>()

const emit = defineEmits<{
    select: [id: number]
    listener: [id: number]
    delete: [id: number]
}>()

const typeConfigMap: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    'Hỷ sự': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
    'Tang lễ': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-500' },
    'Lễ Tết': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    'Cúng giỗ': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
    'Sinh nhật': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', dot: 'bg-pink-500' },
    'Mừng thọ': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' },
    'Khánh thành': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    'Tân gia': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    'Tâm linh': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', dot: 'bg-violet-500' },
    'Gia đình': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', dot: 'bg-teal-500' },
    'Truyền thống': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', dot: 'bg-yellow-500' },
    'Khác': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-500' }
}

const getTypeConfig = (type: string) => {
    return typeConfigMap[type] ?? typeConfigMap['Khác']
}

const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa nghi lễ này không?')) {
        emit('delete', props.ceremony.ceremonyId)
    }
}
</script>

<template>
    <article
        class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1">

        <!-- Color accent top bar -->
        <div class="h-1.5 w-full" :class="getTypeConfig(ceremony.ceremonyType).dot"></div>

        <!-- Card Body -->
        <div class="flex flex-1 flex-col p-5">
            <!-- Header -->
            <div class="mb-4 flex items-start justify-between gap-3">
                <span class="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold"
                    :class="[
                        getTypeConfig(ceremony.ceremonyType).bg,
                        getTypeConfig(ceremony.ceremonyType).text,
                        getTypeConfig(ceremony.ceremonyType).border
                    ]">
                    <span class="h-1.5 w-1.5 rounded-full" :class="getTypeConfig(ceremony.ceremonyType).dot"></span>
                    {{ ceremony.ceremonyType }}
                </span>

                <div class="flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] text-slate-400">
                    <Clock class="h-3 w-3" />
                    <span>Nghi lễ</span>
                </div>
            </div>

            <!-- Content - Clickable -->
            <button type="button" class="flex-1 text-left" @click="emit('select', ceremony.ceremonyId)">
                <h3
                    class="text-lg font-bold leading-7 text-slate-900 transition-colors group-hover:text-indigo-600 line-clamp-2">
                    {{ ceremony.ceremonyName }}
                </h3>

                <p class="mt-2 text-sm leading-6 text-slate-500 line-clamp-3">
                    {{ ceremony.description || 'Chưa có mô tả cho nghi lễ này.' }}
                </p>
            </button>

            <!-- Footer -->
            <div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <!-- Timeline count -->
                <div class="flex items-center gap-1.5 text-sm text-slate-500">
                    <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                        <ListOrdered class="h-3.5 w-3.5 text-slate-600" />
                    </div>
                    <span class="font-medium">{{ ceremony.timelines?.length ?? 0 }}</span>
                    <span class="text-slate-400">bước</span>
                </div>

                <!-- Action Buttons -->
                <div class="flex items-center gap-1">
                    <!-- Xem chi tiết -->
                    <button type="button" @click="emit('select', ceremony.ceremonyId)"
                        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
                        title="Xem chi tiết">
                        <Eye class="h-4 w-4" />
                    </button>

                    <!-- Chỉnh sửa -->
                    <button type="button" @click="emit('listener', ceremony.ceremonyId)"
                        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-amber-50 hover:text-amber-600"
                        title="Chỉnh sửa">
                        <Pencil class="h-4 w-4" />
                    </button>

                    <!-- Xóa -->
                    <button type="button" @click="handleDelete"
                        class="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        title="Xóa">
                        <Trash2 class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    </article>
</template>