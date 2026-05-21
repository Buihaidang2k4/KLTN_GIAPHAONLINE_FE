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

const getTypeConfig = (type: string): { bg: string; text: string; border: string; dot: string } => {
    return typeConfigMap[type] ?? typeConfigMap['Khác']!
}

const handleDelete = () => {
    if (window.confirm('Bạn có chắc muốn xóa nghi lễ này không?')) {
        emit('delete', props.ceremony.ceremonyId)
    }
}
</script>


<template>
    <article
        class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

        <!-- Background decoration -->
        <div
            class="pointer-events-none absolute inset-0 opacity-[0.05] bg-[radial-gradient(circle_at_20%_20%,#000,transparent_60%)]">
        </div>

        <!-- Gradient header -->
        <div class="relative h-14 w-full flex items-center px-5" :class="getTypeConfig(ceremony.ceremonyType).bg">

            <!-- ceremony type -->
            <div class="flex items-center gap-2 text-xs font-semibold tracking-wide"
                :class="getTypeConfig(ceremony.ceremonyType).text">

                <span class="h-2 w-2 rounded-full" :class="getTypeConfig(ceremony.ceremonyType).dot">
                </span>

                {{ ceremony.ceremonyType }}
            </div>

        </div>

        <!-- Body -->
        <div class="relative flex flex-1 flex-col p-6">

            <!-- Title -->
            <button type="button" class="text-left" @click="emit('select', ceremony.ceremonyId)">

                <h3
                    class="text-lg font-bold text-slate-900 leading-7 transition-colors group-hover:text-indigo-600 line-clamp-2">

                    {{ ceremony.ceremonyName }}

                </h3>

            </button>

            <!-- Description -->
            <p class="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-3">
                {{ ceremony.description || 'Chưa có mô tả cho nghi lễ này.' }}
            </p>

            <!-- Timeline section -->
            <div class="mt-5 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">

                <div
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm">

                    <ListOrdered class="h-4 w-4 text-slate-600" />

                </div>

                <div class="flex flex-col leading-tight">

                    <span class="text-sm font-semibold text-slate-700">
                        {{ ceremony.timelines?.length ?? 0 }}
                    </span>

                    <span class="text-[11px] text-slate-400">
                        bước nghi lễ
                    </span>

                </div>

            </div>

            <!-- Divider -->
            <div class="my-4 h-px w-full bg-slate-100"></div>

            <!-- Footer -->
            <div class="flex items-center justify-between">

                <!-- Label -->
                <div class="flex items-center gap-1.5 text-xs text-slate-400">

                    <Clock class="h-3.5 w-3.5" />

                    <span>Nghi lễ truyền thống</span>

                </div>

                <!-- Actions -->
                <div class="flex items-center gap-1">

                    <button type="button" @click="emit('select', ceremony.ceremonyId)"
                        class="flex h-8 w-8 items-center cursor-pointer justify-center rounded-lg text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600">

                        <Eye class="h-4 w-4" />

                    </button>

                    <button type="button" @click="emit('listener', ceremony.ceremonyId)"
                        class="flex h-8 w-8 items-center cursor-pointer justify-center rounded-lg text-slate-400 transition hover:bg-amber-50 hover:text-amber-600">

                        <Pencil class="h-4 w-4" />

                    </button>

                    <button type="button" @click="handleDelete"
                        class="flex h-8 w-8 items-center cursor-pointer justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600">

                        <Trash2 class="h-4 w-4" />

                    </button>

                </div>

            </div>

        </div>

    </article>
</template>