import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { familyMemberService } from '@/services/family_member.service'
import { QUERY_KEYS } from '@/hooks/keys/query-keys'
import { roleKey } from '@/hooks/queries/auth/useRoles'
import { notify } from '@/utils/notify'
import type { UpdateFamilyMemberRoleReq } from '@/types/family/family-member.types'

export const familyMemberKey = {
    all: ['family-members'] as const,
    lists: () => [...familyMemberKey.all, 'list'] as const,
    list: (familyId: MaybeRefOrGetter<number | null | undefined>) =>
        [...familyMemberKey.lists(), toValue(familyId)] as const,
}

export function useFamilyMembersQuery(familyId: MaybeRefOrGetter<number | null | undefined>) {
    const resolvedId = computed(() => toValue(familyId))

    return useQuery({
        queryKey: computed(() => familyMemberKey.list(resolvedId)),
        queryFn: () => familyMemberService.getFamilyMembersByFamilyId(resolvedId.value!),
        enabled: computed(() => !!resolvedId.value),
        staleTime: 1000 * 60 * 5,
    })
}

export function useUpdateMemberRoleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ familyId, targetAccountId, data }: {
            familyId: MaybeRefOrGetter<number | null | undefined>
            targetAccountId: MaybeRefOrGetter<number | null | undefined>
            data: UpdateFamilyMemberRoleReq
        }) => familyMemberService.updateMemberRole(familyId, targetAccountId, data),

        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: familyMemberKey.lists() })
            queryClient.invalidateQueries({ queryKey: familyMemberKey.all })
            queryClient.invalidateQueries({ queryKey: roleKey.myRoles() })
            queryClient.invalidateQueries({ queryKey: roleKey.myRolesByFamily(variables.familyId) })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ACCOUNT.MY_INFO })

            notify.success("Thông báo", "Cập nhật quyền thành viên thành công")
        },
        onError: (error: any) => {
            console.error("Lỗi cập nhật quyền:", error)
            notify.error("Thất bại", "Không thể cập nhật quyền thành viên")
        }
    })
}


export function useRemoveMemberMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ familyId, targetAccountId }: {
            familyId: MaybeRefOrGetter<number | null | undefined>
            targetAccountId: MaybeRefOrGetter<number | null | undefined>
        }) => familyMemberService.removeMember(familyId, targetAccountId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: familyMemberKey.lists() })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAMILY.all })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAMILY.list() })
            queryClient.invalidateQueries({ queryKey: familyMemberKey.all })
        },
    })
}
