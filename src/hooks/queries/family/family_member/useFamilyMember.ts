import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { familyMemberService } from '@/services/family_member.service'

const familyMemberKey = {
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

export function useRemoveMemberMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ familyId, targetAccountId, actorAccountId }: {
            familyId: MaybeRefOrGetter<number | null | undefined>
            targetAccountId: MaybeRefOrGetter<number | null | undefined>
            actorAccountId: MaybeRefOrGetter<number | null | undefined>
        }) => familyMemberService.removeMember(familyId, targetAccountId, actorAccountId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: familyMemberKey.lists() })
        },
    })
}
