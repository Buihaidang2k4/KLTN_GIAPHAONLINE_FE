import { useQuery } from '@tanstack/vue-query'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'
import { familyMemberService } from '@/services/family_member.service'
import { QUERY_KEYS } from '@/hooks/keys/query-keys'

export function useFamilyMembersQuery(familyId: MaybeRefOrGetter<number | null | undefined>) {
    const resolvedFamilyId = computed(() => toValue(familyId))

    const query = useQuery({
        queryKey: computed(() =>
            QUERY_KEYS.FAMILY.members(resolvedFamilyId.value ?? 'unknown')
        ),
        queryFn: () =>
            familyMemberService.getFamilyMembersByFamilyId(resolvedFamilyId.value!),
        enabled: computed(() => !!resolvedFamilyId.value),
        staleTime: 1000 * 60 * 5,
    })

    return {
        data: computed(() => query.data.value?.data ?? []),
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    }
}