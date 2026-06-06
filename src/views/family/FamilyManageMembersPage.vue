<script setup lang="ts">
import { computed, ref } from "vue"

import { useFamilyMembers } from "@/composables/family_members/useFamilyMembers"
import { useFamilyMembersQuery, useRemoveMemberMutation, useUpdateMemberRoleMutation } from "@/hooks/queries/family/family_member/useFamilyMember"
import { useInviteMemberMutation } from "@/hooks/queries/family/family_invitaion/useFamilyInvitation"

import FamilyMemberList from "@/components/family_manage/FamilyMemberList.vue"
import AddFamilyMemberForm from "@/components/forms/common/AddFamilyInvitaionMemberForm.vue"
import type { CreateFamilyInvitationReq } from "@/types/family/family-invitation.types"
import type { FamilyMemberRes, FamilyMemberRoleType } from "@/types/family/family-member.types"
import { useRouter } from "vue-router"
import { useFamilyStore } from "@/store/family/useFamilyStore"
import { useFamilyPermissions } from "@/composables/family/useFamilyPermissions"
import { notify } from "@/utils/notify"
import { useMyInfoQuery } from "@/hooks/queries/account/useAccount"
import { useFamilySubscriptionStore } from "@/store/family/useFamilySubscriptionStore"
import UpdateMemberRoleForm from "@/components/forms/family_member/UpdateMemberRoleForm.vue"

const searchKeyword = ref("")
const router = useRouter();
const familyStore = useFamilyStore();

const familyId = computed(() => familyStore.currentFamilyId);
// check permission
const { canManageMember, withPermission } = useFamilyPermissions(familyId);

// check quota
const subStore = useFamilySubscriptionStore();

const {
    data: familyMembersData,
    isLoading,
    isError,
    refetch,
} = useFamilyMembersQuery(familyId)

const familyMembers = computed<FamilyMemberRes[]>(() => familyMembersData.value?.data ?? [])

const { safeMembers, getMemberStatusLabel } = useFamilyMembers(familyMembers)
const removeMememberMutation = useRemoveMemberMutation();
const { data: currentAccount } = useMyInfoQuery();
const updateMemeberRoleMutation = useUpdateMemberRoleMutation();
const inviteMember = useInviteMemberMutation();


const currentAccountId = computed(() => currentAccount.value?.data?.accountId);

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
const isShowFormUpdateMemberRole = ref(false);
const selectedMemberForUpdate = ref<FamilyMemberRes | null>(null)

const openForm = withPermission(canManageMember, () => isShowFormAddMember.value = true)
const closeFrom = () => isShowFormAddMember.value = false;
const handleOpenUpdateMemberRole = withPermission(canManageMember, (familyIdParam: number, memberId: number) => {
    const member = familyMembers.value.find((item) => item.familyId === familyIdParam && item.accountId === memberId)

    if (!member) return

    selectedMemberForUpdate.value = member
    isShowFormUpdateMemberRole.value = true
})
const closeFromUpdateRole = () => {
    selectedMemberForUpdate.value = null
    isShowFormUpdateMemberRole.value = false
};



function goToInvitationDetail() {
    router.push("/family/quan-li-loi-moi");
}

function handleAddMemberSubmit(form: CreateFamilyInvitationReq) {
    if (form.roleName === 'FAMILY_ADMIN' && !subStore.guardAddAdmin()) return;

    if (!familyId.value) return;
    closeFrom();

    //  api 
    inviteMember.mutate({
        familyId: familyId.value,
        data: form
    });
}


function handleUpdateRoleSubmit(newRole: FamilyMemberRoleType) {
    if (!familyId.value || !selectedMemberForUpdate.value) return;

    const targetId = selectedMemberForUpdate.value.accountId;
    closeFromUpdateRole();

    updateMemeberRoleMutation.mutate({
        familyId: familyId.value,
        targetAccountId: targetId,
        data: {
            roleName: newRole
        }
    })
}

const handleRemoveMemeber = withPermission(canManageMember, (memeberId: number) => {
    if (!familyId.value) {
        notify.error("Lỗi", "Không xác định được gia đình hiện tại")
        return
    }

    if (memeberId === currentAccountId.value) {
        notify.error("Lỗi", "Bạn không thể tự mình xóa tài khoản của mình")
        return
    }

    if (window.confirm("Bạn có muốn xóa thành viên này không")) {
        removeMememberMutation.mutate({
            familyId: familyId.value,
            targetAccountId: memeberId
        }, {
            onSuccess: () => notify.success("Thông báo", "Xóa thành công thành viên")
        })
    }
})

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

                    <UpdateMemberRoleForm v-if="isShowFormUpdateMemberRole && selectedMemberForUpdate"
                        :member="selectedMemberForUpdate" @close="closeFromUpdateRole"
                        @submit="handleUpdateRoleSubmit" />
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
                    <FamilyMemberList :members="filteredMembers" :get-status="getMemberStatusLabel"
                        @remove="handleRemoveMemeber" @update-member-role="handleOpenUpdateMemberRole" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>