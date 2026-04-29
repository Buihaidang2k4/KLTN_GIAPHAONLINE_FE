<script setup lang="ts">
import type { FamilyMemberRes } from '@/types/family/family-member.types'
import FamilyMemberItem from '@/components/family_manage/FamilyMemberItem.vue'

defineProps<{
    members: FamilyMemberRes[]
    getStatus: (status: FamilyMemberRes['status']) => string
}>()
</script>

<template>
    <div>
        <div class="p-4 border-b border-slate-100 bg-slate-50/50">
            <h3 class="text-xl font-bold text-slate-900 mb-3">
                Danh sách thành viên trong gia đình
                <span class="ml-2 text-base font-medium text-slate-500">
                    ({{ members.length }} thành viên)
                </span>
            </h3>
        </div>

        <div
            class="grid grid-cols-12 items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wide rounded-t-xl">
            <div class="col-span-12 md:col-span-5">Họ và tên</div>
            <div class="col-span-6 md:col-span-2">Chức vụ</div>
            <div class="col-span-6 md:col-span-2">Trạng thái</div>
            <div class="col-span-8 md:col-span-2">Ngày tham gia</div>
            <div class="col-span-4 md:col-span-1 text-right">Hành động</div>
        </div>


        <div class="divide-y divide-slate-100">
            <FamilyMemberItem v-for="member in members" :key="member.accountId" :member="member"
                :get-status="getStatus" />
        </div>

    </div>
</template>