<script setup lang="ts">
import { ref } from 'vue'
import { Clock, ListOrdered, MoreHorizontal } from 'lucide-vue-next'
import type { CeremonyRes } from '@/types/family/ceremony.types'

const props = defineProps<{
    ceremony: CeremonyRes
}>()

const emit = defineEmits<{
    select: [id: number]
    listener: [id: number]
    delete: [id: number]
}>()

const isMenuOpen = ref(false)

const actions = [
    { key: 'UPDATE', label: 'Chỉnh sửa' },
    { key: 'DETAIL', label: 'Chi tiết' },
    { key: 'DELETE', label: 'Xóa' }
] as const

type ActionKey = typeof actions[number]['key']

const typeClassMap: Record<string, string> = {
    'Hỷ sự': 'border-rose-200 bg-rose-50 text-rose-700',
    'Tang lễ': 'border-slate-200 bg-slate-50 text-slate-600',
    'Lễ Tết': 'border-amber-200 bg-amber-50 text-amber-700',
    'Cúng giỗ': 'border-purple-200 bg-purple-50 text-purple-700',
    'Sinh nhật': 'border-pink-200 bg-pink-50 text-pink-700',
    'Mừng thọ': 'border-orange-200 bg-orange-50 text-orange-700',
    'Khánh thành': 'border-emerald-200 bg-emerald-50 text-emerald-700',
    'Tân gia': 'border-blue-200 bg-blue-50 text-blue-700',
    'Tâm linh': 'border-violet-200 bg-violet-50 text-violet-700',
    'Gia đình': 'border-teal-200 bg-teal-50 text-teal-700',
    'Truyền thống': 'border-yellow-200 bg-yellow-50 text-yellow-700',
    'Khác': 'border-slate-200 bg-slate-50 text-slate-600'
}

const getTypeClass = (type: string) => {
    return typeClassMap[type] ?? typeClassMap['Khác']
}

const handleAction = (action: ActionKey) => {
    isMenuOpen.value = false

    if (action === 'DETAIL') {
        emit('select', props.ceremony.ceremonyId)
        return
    }

    if (action === 'UPDATE') {
        emit('listener', props.ceremony.ceremonyId)
        return
    }

    if (window.confirm('Bạn có chắc muốn xóa nghi lễ này không?')) {
        emit('delete', props.ceremony.ceremonyId)
    }
}
</script>

<template>
    <article
        class="relative flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
        <!-- Top -->
        <div class="mb-4 flex items-start justify-between gap-3">
            <span class="inline-flex max-w-full items-center rounded-md border px-2.5 py-1 text-xs font-semibold"
                :class="getTypeClass(ceremony.ceremonyType)">
                {{ ceremony.ceremonyType }}
            </span>

            <Clock class="mt-1 h-4 w-4 shrink-0 text-slate-400" />
        </div>

        <!-- Main -->
        <button type="button" class="text-left" @click="emit('select', ceremony.ceremonyId)">
            <h3 class="line-clamp-2 text-lg font-bold leading-6 text-slate-900 transition hover:text-slate-700">
                {{ ceremony.ceremonyName }}
            </h3>

            <p class="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                {{ ceremony.description }}
            </p>
        </button>

        <!-- Footer -->
        <div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
            <div class="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                <ListOrdered class="h-4 w-4" />
                {{ ceremony.timelines?.length ?? 0 }} giai đoạn
            </div>

            <div class="relative">
                <button type="button"
                    class="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    title="Tác vụ" @click.stop="isMenuOpen = !isMenuOpen">
                    <MoreHorizontal class="h-4 w-4" />
                </button>

                <div v-if="isMenuOpen"
                    class="absolute right-0 top-10 z-20 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                    <button v-for="action in actions" :key="action.key" type="button"
                        class="block w-full px-4 py-2 text-left text-sm transition" :class="action.key === 'DELETE'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-slate-700 hover:bg-slate-50'" @click.stop="handleAction(action.key)">
                        {{ action.label }}
                    </button>
                </div>
            </div>
        </div>
    </article>
</template>