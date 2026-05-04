import { ceremonyTimelineService } from "@/services/ceremony_timeline.service";
import type { CeremonyTimelineReq, CeremonyTimelineUpdateReq } from "@/types/family/ceremony.types";
import type { PageParams } from "@/types/page-response.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { ceremonyKey } from "./useCeremony";

export const ceremonyTimelineKey = {
    all: ['ceremony-timeline'] as const,

    lists: () => [...ceremonyTimelineKey.all, 'list'] as const,

    listByCeremony: (
        ceremonyId: MaybeRefOrGetter<number | null | undefined>,
        params?: MaybeRefOrGetter<PageParams | undefined>
    ) => [
            ...ceremonyTimelineKey.lists(),
            'by-ceremony',
            toValue(ceremonyId),
            toValue(params)?.page ?? 0,
            toValue(params)?.size ?? 10,
            toValue(params)?.sort ?? ''
        ],

    details: () => [...ceremonyTimelineKey.all, 'detail'] as const,

    detail: (timelineId: MaybeRefOrGetter<number | null | undefined>) =>
        [
            ...ceremonyTimelineKey.details(),
            toValue(timelineId)
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

export const useCeremonyTimelinesQuery = (
    ceremonyId: MaybeRefOrGetter<number | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>
) => {
    const enabled = computed(() => !!toValue(ceremonyId))
    const normalizedParams = computed(() => normalizeParams(params))
    const resolvedCeremonyId = computed(() => toValue(ceremonyId))

    return useQuery({
        queryKey: computed(() => ceremonyTimelineKey.listByCeremony(resolvedCeremonyId, normalizedParams)),
        queryFn: () => ceremonyTimelineService.getByCeremonyId(resolvedCeremonyId.value!, normalizedParams),
        enabled: enabled
    })
}

export const useCeremonyTimelineQuery = (
    timelineId: MaybeRefOrGetter<number | null | undefined>
) => {
    const enabled = computed(() => !!toValue(timelineId))
    const resolvedTimelineId = computed(() => toValue(timelineId))

    return useQuery({
        queryKey: computed(() => ceremonyTimelineKey.detail(resolvedTimelineId)),
        queryFn: () => ceremonyTimelineService.getById(resolvedTimelineId.value!),
        enabled: enabled
    })
}

export const useCeremonyTimelinesAllQuery = (
    params?: MaybeRefOrGetter<PageParams>
) => {
    const normalizedParams = computed(() => normalizeParams(params))

    return useQuery({
        queryKey: computed(() => [...ceremonyTimelineKey.lists(), 'all', normalizedParams.value]),
        queryFn: () => ceremonyTimelineService.getAll(normalizedParams)
    })
}

export const useCreateCeremonyTimelineMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ ceremonyId, data }:
            {
                ceremonyId: MaybeRefOrGetter<number | null | undefined>
                data: CeremonyTimelineReq
            }) => ceremonyTimelineService.create(ceremonyId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ceremonyTimelineKey.all })
            queryClient.invalidateQueries({ queryKey: ceremonyKey.all })
        }
    })
}

export const useUpdateCeremonyTimelineMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ timelineId, data }: { timelineId: number; data: CeremonyTimelineReq }) =>
            ceremonyTimelineService.update(timelineId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ceremonyTimelineKey.all })
            queryClient.invalidateQueries({ queryKey: ceremonyKey.all })

        }
    })
}

export const useDeleteCeremonyTimelineMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (timelineId: number) => ceremonyTimelineService.deleteById(timelineId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ceremonyTimelineKey.all })
            queryClient.invalidateQueries({ queryKey: ceremonyKey.all })

        }
    })
}
