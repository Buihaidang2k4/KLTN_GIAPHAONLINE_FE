<script setup lang="ts">
import type { FamilyMemberRes } from '@/types/family/family-member'
import { formatDate } from '@/utils/format-date'
import { Mail, Settings, Trash2 } from 'lucide-vue-next'

defineProps<{
    member: FamilyMemberRes
    getStatus: (status: FamilyMemberRes['status']) => string
}>()

const emit = defineEmits<{
    (e: 'remove', memberId: number): void
}>()

const isAdmin = (member: FamilyMemberRes) => member.roleName === "FAMILY_ADMIN"
</script>

<template>
    <div class="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">

        <div class="flex items-center gap-4">

            <div class="relative">

                <div
                    class="w-10 h-10 rounded-full overflow-hidden bg-linear-to-r from-orange-400 to-amber-500 flex items-center justify-center text-white text-sm font-semibold">
                    <span>
                        {{ member.fullName?.charAt(0).toUpperCase() }}
                    </span>

                </div>

                <div v-if="member.status === 'ACTIVE'"
                    class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />

            </div>

            <!-- Member info -->
            <div>

                <div class="flex items-center gap-2">

                    <span class="font-medium text-slate-800">
                        {{ getStatus(member.status) }}
                    </span>

                    <span v-if="member.status === 'LEFT'"
                        class="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold uppercase tracking-wider">
                        Đã rời nhóm
                    </span>

                </div>

                <div class="flex items-center gap-1 text-slate-500 text-xs">
                    <Mail :size="12" />
                    {{ member.email }}
                </div>

            </div>

            <!-- Role + joined -->
            <div class="flex flex-col gap-1">

                <div class="flex items-center gap-2 text-xs">

                    <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                        {{ member.roleName }}
                    </span>

                    <span class="text-slate-400">•</span>

                    <span class="text-slate-500">
                        Tham gia {{ formatDate(member.joinedAt) }}
                    </span>

                </div>

            </div>

        </div>

        <!-- RIGHT -->
        <div class="flex items-center gap-3">

            <div class="hidden sm:flex flex-col items-end mr-4">
                <span class="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">
                    {{ member.fullName }}
                </span>
            </div>

            <div v-if="!isAdmin(member)" class="flex items-center gap-1">

                <button class="p-2 text-slate-400 hover:text-[#d4a373] hover:bg-orange-50 rounded-lg transition-colors">
                    <Settings :size="18" />
                </button>

                <button v-if="member.roleName !== 'Chủ nhà'" @click="emit('remove', member.accountId)"
                    class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 :size="18" />
                </button>

            </div>

        </div>

    </div>
</template>