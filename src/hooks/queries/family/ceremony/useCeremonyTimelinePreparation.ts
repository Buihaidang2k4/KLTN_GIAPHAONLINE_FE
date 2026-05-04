import { ceremonyTimelinePreparationService } from "@/services/ceremony_timeline_preparation.service";
import type { CeremonyTimelinePreparationReq, CeremonyTimelinePreparationUpdateReq } from "@/types/family/ceremony.types";
import type { PageParams } from "@/types/page-response.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { ceremonyTimelineKey } from "./useCeremonyTimeline";
import { ceremonyKey } from "./useCeremony";

export const ceremonyTimelinePreparationKey = {
    all: ['ceremony-timeline-preparation'] as const,

    lists: () => [...ceremonyTimelinePreparationKey.all, 'list'] as const,

    listByTimeline: (
        timelineId: MaybeRefOrGetter<number | null | undefined>,
        params?: MaybeRefOrGetter<PageParams | undefined>
    ) => [
            ...ceremonyTimelinePreparationKey.lists(),
            'by-timeline',
            toValue(timelineId),
            toValue(params)?.page ?? 0,
            toValue(params)?.size ?? 10,
            toValue(params)?.sort ?? ''
        ],

    details: () => [...ceremonyTimelinePreparationKey.all, 'detail'] as const,

    detail: (preparationId: MaybeRefOrGetter<number | null | undefined>) =>
        [
            ...ceremonyTimelinePreparationKey.details(),
            toValue(preparationId)
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

export const useCeremonyTimelinePreparationsQuery = (
    timelineId: MaybeRefOrGetter<number | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>
) => {
    const enabled = computed(() => !!toValue(timelineId))
    const normalizedParams = computed(() => normalizeParams(params))
    const resolvedTimelineId = computed(() => toValue(timelineId))

    return useQuery({
        queryKey: computed(() => ceremonyTimelinePreparationKey.listByTimeline(resolvedTimelineId, normalizedParams)),
        queryFn: () => ceremonyTimelinePreparationService.getByTimelineId(resolvedTimelineId.value!, normalizedParams),
        enabled: enabled
    })
}

export const useCeremonyTimelinePreparationQuery = (
    preparationId: MaybeRefOrGetter<number | null | undefined>
) => {
    const enabled = computed(() => !!toValue(preparationId))
    const resolvedPreparationId = computed(() => toValue(preparationId))

    return useQuery({
        queryKey: computed(() => ceremonyTimelinePreparationKey.detail(resolvedPreparationId)),
        queryFn: () => ceremonyTimelinePreparationService.getById(resolvedPreparationId.value!),
        enabled: enabled
    })
}

export const useCeremonyTimelinePreparationsAllQuery = (
    params?: MaybeRefOrGetter<PageParams>
) => {
    const normalizedParams = computed(() => normalizeParams(params))

    return useQuery({
        queryKey: computed(() => [...ceremonyTimelinePreparationKey.lists(), 'all', normalizedParams.value]),
        queryFn: () => ceremonyTimelinePreparationService.getAll(normalizedParams)
    })
}

export const useCreateCeremonyTimelinePreparationMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ timelineId, data }:
            {
                timelineId: MaybeRefOrGetter<Number | null | undefined>
                data: CeremonyTimelinePreparationReq
            }) => ceremonyTimelinePreparationService.create(timelineId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ceremonyTimelinePreparationKey.all })
            queryClient.invalidateQueries({ queryKey: ceremonyTimelineKey.all })
            queryClient.invalidateQueries({ queryKey: ceremonyKey.all })


        }
    })
}

export const useUpdateCeremonyTimelinePreparationMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ preparationId, data }: { preparationId: number; data: CeremonyTimelinePreparationReq }) =>
            ceremonyTimelinePreparationService.update(preparationId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ceremonyTimelinePreparationKey.all })
            queryClient.invalidateQueries({ queryKey: ceremonyTimelineKey.all })
            queryClient.invalidateQueries({ queryKey: ceremonyKey.all })

        }
    })
}

export const useDeleteCeremonyTimelinePreparationMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (preparationId: number) => ceremonyTimelinePreparationService.deleteById(preparationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ceremonyTimelinePreparationKey.all })
            queryClient.invalidateQueries({ queryKey: ceremonyTimelineKey.all })

        }
    })
}