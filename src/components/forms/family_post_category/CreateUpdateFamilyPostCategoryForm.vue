<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { PostCategoryReq, FamilyPostCategoryRes } from '@/types/family/post_category.types'

interface Props {
    isOpen: boolean
    mode: 'create' | 'update'
    data?: FamilyPostCategoryRes | null
    isLoading?: boolean
}

interface Emits {
    (e: 'close'): void
    (e: 'submit', payload: PostCategoryReq): void
}

const props = withDefaults(defineProps<Props>(), {
    isLoading: false,
})

const emit = defineEmits<Emits>()

const form = ref<PostCategoryReq>({
    name: '',
    description: '',
})

const errors = ref<Partial<Record<keyof PostCategoryReq, string>>>({})

const title = computed(() => (props.mode === 'create' ? 'Thêm danh mục' : 'Sửa danh mục'))

// Watchers
watch(
    () => props.data,
    (newData) => {
        if (newData && props.mode === 'update') {
            form.value = {
                name: newData.name,
                description: newData.description,
            }
        }
    },
    { deep: true }
)

watch(
    () => props.isOpen,
    (isOpen) => {
        if (!isOpen) {
            resetForm()
        }
    }
)

const resetForm = () => {
    form.value = {
        name: '',
        description: '',
    }
    errors.value = {}
}

const validateForm = (): boolean => {
    errors.value = {}

    if (!form.value.name?.trim()) {
        errors.value.name = 'Tên danh mục không được để trống'
    }

    if (!form.value.description?.trim()) {
        errors.value.description = 'Mô tả không được để trống'
    }

    return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
    if (!validateForm()) return

    emit('submit', {
        name: form.value.name.trim(),
        description: form.value.description.trim(),
    })
}

const handleClose = () => {
    emit('close')
}
</script>

<template>
    <!-- Modal Backdrop -->
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] transition-opacity duration-200"
        @click="handleClose" />

    <!-- Modal -->
    <div v-if="isOpen" class="fixed inset-0 z-[1001] flex items-center justify-center p-4 transition-all duration-200">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg border border-slate-200" @click.stop>
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 class="text-xl font-bold text-slate-900">{{ title }}</h2>
                <button @click="handleClose" class="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
                    :disabled="isLoading">
                    <X :size="20" />
                </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
                <!-- Name Field -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">
                        Tên danh mục <span class="text-red-500">*</span>
                    </label>
                    <input v-model="form.name" type="text" placeholder="Nhập tên danh mục"
                        class="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                        :class="{ 'border-red-300': errors.name }" :disabled="isLoading" />
                    <p v-if="errors.name" class="text-red-500 text-xs mt-1.5 font-medium">
                        {{ errors.name }}
                    </p>
                </div>

                <!-- Description Field -->
                <div>
                    <label class="block text-sm font-bold text-slate-700 mb-2">
                        Mô tả <span class="text-red-500">*</span>
                    </label>
                    <textarea v-model="form.description" placeholder="Nhập mô tả danh mục" rows="4"
                        class="w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium resize-none"
                        :class="{ 'border-red-300': errors.description }" :disabled="isLoading" />
                    <p v-if="errors.description" class="text-red-500 text-xs mt-1.5 font-medium">
                        {{ errors.description }}
                    </p>
                </div>
            </form>

            <!-- Footer -->
            <div class="flex gap-3 p-6 border-t border-slate-100 bg-slate-50/50">
                <button @click="handleClose"
                    class="flex-1 px-4 py-3 text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold transition-colors"
                    :disabled="isLoading">
                    Hủy
                </button>
                <button @click="handleSubmit"
                    class="flex-1 px-4 py-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="isLoading">
                    {{ isLoading ? 'Đang xử lý...' : mode === 'create' ? 'Thêm mới' : 'Cập nhật' }}
                </button>
            </div>
        </div>
    </div>
</template>
