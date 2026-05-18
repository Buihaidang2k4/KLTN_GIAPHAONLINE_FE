<script setup lang="ts">
import type { RoleRes, UpdateRoleReq } from '@/types/auth/role.types'
import { toTypedSchema } from '@vee-validate/zod'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { watch, ref, computed } from 'vue'
import { z } from 'zod'
import { X, Sparkles, ShieldCheck, Search, Check } from 'lucide-vue-next'
import { usePermissionsQuery } from '@/hooks/queries/permission/usePermissions'

const props = defineProps<{
    show: boolean
    role: RoleRes | null
    isLoading?: boolean
}>()

const emit = defineEmits<{
    update: [data: UpdateRoleReq]
    close: []
}>()

console.log(props.role?.scopeType);
// Search permissions query
const permSearch = ref('')

// Load all permissions to select from
const scopeType = computed(() => {
    return props.role?.scopeType
})
const { data: allPermsData, isLoading: isPermsLoading } = usePermissionsQuery(scopeType);

// Safely extract flat array of permissions from backend
const allPermissions = computed(() => {
    const d = allPermsData.value?.data
    return Array.isArray(d) ? d : []
})


// Filter permissions based on user search input
const filteredPermissionsList = computed(() => {
    if (!permSearch.value) return allPermissions.value
    const search = permSearch.value.toLowerCase()
    return allPermissions.value.filter(p =>
        p.name.toLowerCase().includes(search) ||
        (p.description && p.description.toLowerCase().includes(search))
    )
})

const validationSchema = toTypedSchema(
    z.object({
        description: z
            .string()
            .trim()
            .max(255, 'Mô tả không được quá 255 ký tự'),
        permissions: z
            .array(z.string())
            .default([])
    })
)

const { resetForm, handleSubmit, meta, values, setFieldValue } = useForm({
    initialValues: {
        description: '',
        permissions: [] as string[]
    },
    validationSchema
})

watch(
    () => [props.role, allPermsData.value] as const,
    ([val]) => {
        if (val && !isPermsLoading.value) {
            resetForm({
                values: {
                    description: val.description ?? '',
                    permissions: val.permissions ? val.permissions.map(p => p.name) : []
                }
            })
        }
    },
    { immediate: true, deep: true }
)

const handleClose = () => {
    emit('close')
}

const togglePermission = (permName: string) => {
    const current = [...values.permissions]
    const idx = current.indexOf(permName)
    if (idx > -1) {
        current.splice(idx, 1)
    } else {
        current.push(permName)
    }
    setFieldValue('permissions', current)
}

const onSubmit = handleSubmit((formValues) => {
    emit('update', {
        description: formValues.description,
        permissions: formValues.permissions
    })
})
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <!-- Modal Container -->
                <div
                    class="relative w-full max-w-xl overflow-hidden rounded-[2rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">

                    <!-- Subtle Ornaments -->
                    <div
                        class="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_top_right,rgba(180,83,9,0.03),transparent)] pointer-events-none">
                    </div>

                    <!-- Header Section -->
                    <div class="relative px-6 pt-8 pb-4 text-center border-b border-amber-100/40 flex-shrink-0">
                        <div
                            class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Quyền & Vai
                                trò</span>
                        </div>
                        <h2
                            class="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-2">
                            <ShieldCheck class="w-6 h-6 text-amber-600" />
                            Cập nhật vai trò & Quyền
                        </h2>
                        <p class="mt-1 text-xs text-slate-500 font-medium max-w-[320px] mx-auto leading-relaxed">
                            Điều chỉnh mô tả và phân chia các quyền hạn trực thuộc vai trò: <br />
                            <span class="font-mono font-bold text-amber-700 text-sm">{{ role?.name }}</span>
                        </p>

                        <button @click="handleClose" type="button"
                            class="absolute top-5 right-5 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="18" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <form class="relative flex flex-col flex-1 overflow-hidden" @submit.prevent="onSubmit">
                        <div class="p-6 overflow-y-auto space-y-5 flex-1 max-h-[50vh]">
                            <!-- Mô tả chi tiết -->
                            <div class="space-y-1.5">
                                <label
                                    class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    Mô tả chi tiết <span class="text-red-400">*</span>
                                </label>
                                <Field as="textarea" name="description" rows="2" validate-on-blur
                                    placeholder="Ghi chú rõ ràng vai trò này dùng để làm gì..."
                                    class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all leading-relaxed shadow-sm" />
                                <ErrorMessage name="description"
                                    class="mt-1 ml-1 block text-[10px] font-bold text-red-500" />
                            </div>

                            <!-- Phân quyền (Permissions Selector) -->
                            <div class="space-y-2">
                                <div class="flex items-center justify-between ml-1">
                                    <label
                                        class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        Phân chia Quyền hạn ({{ values.permissions?.length ?? 0 }})
                                    </label>
                                    <span v-if="isPermsLoading"
                                        class="text-[10px] font-medium text-amber-600 flex items-center gap-1">
                                        <span
                                            class="w-2 h-2 border border-amber-600 border-t-transparent rounded-full animate-spin"></span>
                                        Đang tải...
                                    </span>
                                </div>

                                <!-- Permission Filter Search Box -->
                                <div class="relative w-full">
                                    <Search class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input v-model="permSearch" type="text" placeholder="Tìm nhanh quyền hạn..."
                                        class="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-400 transition-all text-xs font-semibold" />
                                </div>

                                <!-- Custom List of Checkbox Items -->
                                <div
                                    class="border border-slate-100 rounded-2xl bg-slate-50/50 p-2 overflow-y-auto max-h-[220px] divide-y divide-slate-100 shadow-inner">
                                    <div v-for="perm in filteredPermissionsList" :key="perm.name"
                                        @click="togglePermission(perm.name)"
                                        class="flex items-start gap-3 p-2.5 rounded-lg hover:bg-amber-50/40 cursor-pointer transition-colors group">

                                        <!-- Custom Checkbox -->
                                        <div :class="[
                                            'w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-all mt-0.5',
                                            values.permissions?.includes(perm.name)
                                                ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                                                : 'border-slate-300 bg-white group-hover:border-amber-400'
                                        ]">
                                            <Check v-if="values.permissions?.includes(perm.name)" :size="10"
                                                stroke-width="4" />
                                        </div>

                                        <!-- Text Details -->
                                        <div class="space-y-0.5 min-w-0">
                                            <div class="flex items-center gap-1.5">
                                                <span
                                                    class="font-mono text-xs font-bold text-slate-800 break-all">{{ perm.name }}</span>
                                                <span :class="[
                                                    'px-1.5 py-0.2 rounded text-[7px] font-black uppercase tracking-wider border',
                                                    perm.scopeType === 'SYSTEM'
                                                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                        : 'bg-orange-50 text-orange-600 border-orange-100'
                                                ]">
                                                    {{ perm.scopeType }}
                                                </span>
                                            </div>
                                            <p class="text-[10px] text-slate-400 font-medium leading-relaxed truncate">
                                                {{ perm.description || 'Không có mô tả chi tiết' }}
                                            </p>
                                        </div>
                                    </div>
                                    <div v-if="filteredPermissionsList.length === 0"
                                        class="py-8 text-center text-xs font-semibold text-slate-400">
                                        Không tìm thấy quyền nào phù hợp
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div
                            class="p-6 bg-slate-50 border-t border-amber-100/40 flex items-center justify-center gap-3 flex-shrink-0">
                            <button type="button"
                                class="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
                                @click="handleClose">
                                Quay lại
                            </button>

                            <button type="submit" :disabled="isLoading || !meta.valid"
                                class="flex-[1.5] py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-40">
                                {{ isLoading ? 'Đang cập nhật...' : 'Cập nhật' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
