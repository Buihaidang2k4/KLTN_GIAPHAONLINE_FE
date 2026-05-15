<script setup lang="ts">
import { computed, ref } from "vue"

import { useFamilyMembers } from "@/composables/family_members/useFamilyMembers"
import { useFamilyMembersQuery } from "@/hooks/queries/family/family_member/useFamilyMember"
import { useInviteMemberMutation } from "@/hooks/queries/family/family_invitaion/useFamilyInvitation"

import FamilyMemberList from "@/components/family_manage/FamilyMemberList.vue"
import AddFamilyMemberForm from "@/components/forms/common/AddFamilyInvitaionMemberForm.vue"
import type { CreateFamilyInvitationReq } from "@/types/family/family-invitation.types"
import { useRouter } from "vue-router"
import { useFamilyStore } from "@/store/family/useFamilyStore"

const searchKeyword = ref("")
const router = useRouter();
const familyStore = useFamilyStore();

const familyId = computed(() => familyStore.currentFamilyId);

const {
    data: familyMembers,
    isLoading,
    isError,
    refetch,
} = useFamilyMembersQuery(familyId)

const { safeMembers, getMemberStatusLabel } = useFamilyMembers(familyMembers)

const filteredMembers = computed(() => {
    const keyword = searchKeyword.value.trim().toLowerCase()

    if (!keyword) return safeMembers.value ?? []

    return (safeMembers.value ?? []).filter((member: any) => {
        const fullName = member.fullName?.toLowerCase() ?? ""
        const email = member.email?.toLowerCase() ?? ""
        const role = member.roleName?.toLowerCase() ?? member.role?.toLowerCase() ?? ""

        return (
            fullName.includes(keyword) ||
            email.includes(keyword) ||
            role.includes(keyword)
        )
    })
})

const isShowFormAddMember = ref(false);

const openForm = () => isShowFormAddMember.value = true;
const closeFrom = () => isShowFormAddMember.value = false;
const inviteMember = useInviteMemberMutation();


function goToInvitationDetail() {
    router.push("/family/quan-li-loi-moi");
}

function handleAddMemberSubmit(form: CreateFamilyInvitationReq) {
    if (!familyId.value) return;
    console.log("submitt add member", familyId.value, form.invitedEmail, form.message, form.roleName)
    closeFrom();

    //  api 
    inviteMember.mutate({
        familyId: familyId.value,
        data: form
    });
}

function handleSearch() {
}
</script>

<template>
    <div class="min-h-screen bg-[#fbfaf5] p-4 sm:p-6">
        <div class="mx-auto max-w-7xl space-y-4">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 class="text-2xl font-semibold text-slate-800">Quản trị viên</h1>

                <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div class="flex overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        <input v-model="searchKeyword" type="text" placeholder="Tìm kiếm thành viên..."
                            class="w-full min-w-60 px-4 py-2.5 text-sm text-slate-700 outline-none"
                            @keyup.enter="handleSearch" />
                        <button type="button"
                            class="cursor-pointer border-l border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            @click="handleSearch">
                            Tìm
                        </button>
                    </div>

                    <button type="button"
                        class="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                        @click="goToInvitationDetail">
                        Xem chi tiết lời mời
                    </button>

                    <button type="button"
                        class="cursor-pointer rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-700"
                        @click="openForm">
                        + Gửi lời mời tới thành viên
                    </button>

                    <AddFamilyMemberForm v-if="isShowFormAddMember" @close="closeFrom"
                        @submit="handleAddMemberSubmit" />
                </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div v-if="isLoading" class="flex min-h-60 items-center justify-center px-4 text-sm text-slate-500">
                    Đang tải danh sách thành viên...
                </div>

                <div v-else-if="isError" class="flex min-h-60 flex-col items-center justify-center px-4 text-center">
                    <h3 class="text-base font-semibold text-slate-700">Không tải được dữ liệu</h3>
                    <p class="mt-1 text-sm text-slate-500">Vui lòng thử lại sau.</p>
                    <button type="button"
                        class="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        @click="() => refetch()">
                        Tải lại
                    </button>
                </div>

                <div v-else-if="!filteredMembers.length"
                    class="flex min-h-60 flex-col items-center justify-center px-4 text-center">
                    <h3 class="text-base font-semibold text-slate-700">Không có thành viên phù hợp</h3>
                    <p class="mt-1 text-sm text-slate-500">
                        Hãy thử từ khóa khác hoặc thêm thành viên mới.
                    </p>
                </div>

                <div v-else class="p-4 sm:p-6">
                    <FamilyMemberList :members="filteredMembers" :get-status="getMemberStatusLabel" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>