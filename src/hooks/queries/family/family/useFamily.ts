import { useQuery } from "@tanstack/vue-query"
import { computed, toValue, unref, type MaybeRef, type MaybeRefOrGetter } from "vue"
import { familyService } from "@/services/family.service"
import { QUERY_KEYS } from "@/hooks/keys/query-keys"
import type { PageParams } from "@/types/page-response.types"

function normalizeParams(params?: MaybeRef<PageParams>) {
    const p = unref(params)

    return {
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "createdAt,desc"
    }
}

export function useFamiliesCurrentAccountQuery(params?: MaybeRef<PageParams>) {
    const resolvedParams = computed(() => normalizeParams(params))

    return useQuery({
        queryKey: computed(() => QUERY_KEYS.FAMILY.list(resolvedParams.value)),
        queryFn: () => familyService.getAllFamiliesCurrentAccount(resolvedParams.value),
        staleTime: 30_000,
        placeholderData: (prev) => prev
    })
}

export function useFamilyByIdQuery(familyId: MaybeRefOrGetter<number | null>) {
    const resolvedFamilyId = computed(() => toValue(familyId))

    return useQuery({
        queryKey: computed(() => QUERY_KEYS.FAMILY.detail(resolvedFamilyId.value ?? "unknown")),
        queryFn: () => familyService.getFamilyById(resolvedFamilyId.value!),
        enabled: computed(() => !!resolvedFamilyId.value),
        staleTime: 30_000
    })
}

export function useAllFamiliesQuery() {
    return useQuery({
        queryKey: [...QUERY_KEYS.FAMILY.all, "all"],
        queryFn: () => familyService.getAllFamilies(),
        staleTime: 30_000
    })
}
