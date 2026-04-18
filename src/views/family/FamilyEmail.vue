<script setup lang="ts">
import { computed } from "vue"

import { useProfileQuery } from "@/hooks/query/auth/useProfileQuery"
import { useFamilyMembersQuery } from "@/hooks/query/family/family_member/useFamilyMember"
import { useFamilyMembers } from "@/composables/family_members/useFamilyMembers"

import FamilyInviteBox from "@/components/family_setting/FamilyInviteBox.vue"
import FamilyInvitationList from "@/components/family_setting/FamilyInvitationList.vue"

import FamilyMemberList from "@/components/family_setting/FamilyMemberList.vue"

const { user } = useProfileQuery()

const familyId = computed(() => {
    return user.value?.families?.[0]?.familyId ?? null
})

const { data: familyMembers } = useFamilyMembersQuery(familyId)

const { safeMembers, getMemberStatusLabel } =
    useFamilyMembers(familyMembers)
</script>
<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <!-- Header -->
        <div class="space-y-1">
            <h1 class="text-2xl font-semibold text-slate-900">Gia đình</h1>
            <p class="text-sm text-slate-500">
                Quản lý thành viên và quyền truy cập.
            </p>
        </div>

        <!-- Row 1 -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
            <!-- <div class="xl:col-span-2">
                <FamilyInviteBox />
            </div> -->

            <div class="xl:col-span-3">
            </div>
        </div>

        <!-- Row 2 -->
        <div>
            <FamilyInvitationList />
        </div>

    </div>
</template>