import { ceremonyService } from "@/services/ceremony.service";
import type { CeremonyReq, CeremonyUpdateReq } from "@/types/family/ceremony.types";
import type { PageParams } from "@/types/page-response.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export const ceremonyKey = {
    all: ['family-ceremony'] as const,

    lists: () => [...ceremonyKey.all, 'list'] as const,

    list: (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        keyword?: MaybeRefOrGetter<string | null | undefined>,
        params?: MaybeRefOrGetter<PageParams>
    ) => [
            ...ceremonyKey.lists(),
            toValue(familyId),
            toValue(keyword) || '',
            toValue(params)?.page ?? 0,
            toValue(params)?.size ?? 10,
            toValue(params)?.sort ?? ''
        ],

    details: () => [...ceremonyKey.all, 'detail'] as const,

    detail: (ceremonyId: MaybeRefOrGetter<number | null | undefined>) =>
        [
            ...ceremonyKey.details(),
            toValue(ceremonyId)
        ] as const
}

function normalizeParams(params?: MaybeRefOrGetter<PageParams>) {
    const p = toValue(params)

    return {
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "createdAt,desc",
    }
}

export const useFamilyCeremonysQuery = (
    familyId: MaybeRefOrGetter<number | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>,
    keyword?: MaybeRefOrGetter<string | null | undefined>
) => {
    const enabled = computed(() => !!toValue(familyId))
    const normalizedParams = computed(() => normalizeParams(params))
    const resolvedFamilyId = computed(() => toValue(familyId))
    const resolvedKeyword = computed(() => toValue(keyword))

    return useQuery({
        queryKey: computed(() => ceremonyKey.list(resolvedFamilyId, resolvedKeyword, normalizedParams)),
        queryFn: () => ceremonyService.getByFamilyId(resolvedFamilyId.value!, resolvedKeyword, normalizedParams),
        enabled: enabled
    })
}

export const useCeremonyQuery = (
    ceremonyId: MaybeRefOrGetter<number | null | undefined>
) => {
    const enabled = computed(() => !!toValue(ceremonyId))
    const resolvedCeremonyId = computed(() => toValue(ceremonyId))

    return useQuery({
        queryKey: computed(() => ceremonyKey.detail(resolvedCeremonyId)),
        queryFn: () => ceremonyService.getById(resolvedCeremonyId.value!),
        enabled: enabled
    })
}

export const useCeremonysQuery = (
    params?: PageParams
) => {
    const normalizedParams = computed(() => normalizeParams(params))

    return useQuery({
        queryKey: computed(() => [...ceremonyKey.lists(), 'all', normalizedParams.value]),
        queryFn: () => ceremonyService.getCeremonyList(normalizedParams)
    })
}


export const useCreateCeremonyMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            familyId,
            data
        }: {
            familyId: MaybeRefOrGetter<number | null | undefined> 
            data: CeremonyReq
        }) => ceremonyService.create(familyId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ceremonyKey.all })
        }
    })
}

export const useUpdateCeremonyMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ ceremonyId, data }: { ceremonyId: number; data: CeremonyUpdateReq }) =>
            ceremonyService.update(ceremonyId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ceremonyKey.all })
        }
    })
}

export const useDeleteCeremonyMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (ceremonyId: number) => ceremonyService.deleteById(ceremonyId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ceremonyKey.all })
        }
    })
}