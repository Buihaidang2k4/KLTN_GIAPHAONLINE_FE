<script setup lang="ts">
import type { FamilyMemberRes } from '@/types/family/family-member'
import FamilyMemberItem from './FamilyMemberItem.vue'

defineProps<{
    members: FamilyMemberRes[]
    getStatus: (status: FamilyMemberRes['status']) => string
}>()
</script>

<template>
    <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">

        <div class="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 class="font-semibold text-slate-700">
                Danh sách thành viên ({{ members.length }})
            </h3>
        </div>

        <div class="divide-y divide-slate-100">

            <FamilyMemberItem v-for="member in members" :key="member.accountId" :member="member"
                :get-status="getStatus" />

        </div>

    </div>
</template>