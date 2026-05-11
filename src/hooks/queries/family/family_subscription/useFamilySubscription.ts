import { useQuery } from "@tanstack/vue-query"
import { computed, toValue, type MaybeRefOrGetter } from "vue"
import { familySubscriptionService } from "@/services/familySubscription.service"

export const familySubscriptionKeys = {
    all: ["family-subscriptions"] as const,

    byFamily: (familyId: string | number) =>
        [...familySubscriptionKeys.all, "family", familyId] as const
}

export function useFamilySubscriptionByFamilyQuery(
    familyId: MaybeRefOrGetter<number | null | undefined>
) {
    const resolvedFamilyId = computed(() => toValue(familyId))

    return useQuery({
        queryKey: computed(() =>
            familySubscriptionKeys.byFamily(resolvedFamilyId.value ?? "unknown")
        ),
        queryFn: () => familySubscriptionService.getByFamily(resolvedFamilyId.value!),
        enabled: computed(() => !!resolvedFamilyId.value),
        staleTime: 30_000
    })
}
