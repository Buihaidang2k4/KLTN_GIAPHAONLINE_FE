import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { achievementService } from '@/services/family_achievement.service'
import type {
    FamilyAchievementReq,
    UpdateFamilyAchievementReq
} from '@/types/family/family-achievement.types'
import type { PageParams } from '@/types/page-response.types'

export const achievementKeys = {
    all: ['family-achievements'] as const,

    lists: () => [...achievementKeys.all, 'list'] as const,

    list: (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        params?: MaybeRefOrGetter<PageParams | undefined>,
        keyword?: MaybeRefOrGetter<string | undefined>
    ) =>
        [
            ...achievementKeys.lists(),
            toValue(familyId),
            toValue(keyword) || '',
            toValue(params)?.page ?? 0,
            toValue(params)?.size ?? 10,
            toValue(params)?.sort ?? ''
        ] as const,

    detail: (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        achievementId: MaybeRefOrGetter<number | null | undefined>
    ) =>
        [
            ...achievementKeys.all,
            'detail',
            toValue(familyId),
            toValue(achievementId)
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

export const useFamilyAchievementsQuery = (
    familyId: MaybeRefOrGetter<number | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>,
    keyword?: MaybeRefOrGetter<string | undefined>
) => {

    const enabled = computed(() => !!toValue(familyId))
    const normalizedParams = computed(() => normalizeParams(params))
    const resolvedFamilyId = computed(() => toValue(familyId))
    const resolvedKeyword = computed(() => toValue(keyword))

    return useQuery({
        queryKey: computed(() => achievementKeys.list(resolvedFamilyId, normalizedParams, resolvedKeyword)),
        queryFn: () =>
            achievementService.getByFamily(
                resolvedFamilyId.value!,
                resolvedKeyword.value || '',
                normalizedParams.value
            ),
        enabled,
        placeholderData: previousData => previousData,
        staleTime: 30_000
    })
}
export const useFamilyAchievementByIdQuery = (
    familyId: MaybeRefOrGetter<number | null | undefined>,
    achievementId: MaybeRefOrGetter<number | null | undefined>
) => {
    const resolvedFamilyId = computed(() => toValue(familyId))
    const resolvedAchievementId = computed(() => toValue(achievementId))

    const enabled = computed(
        () => !!resolvedFamilyId.value && !!resolvedAchievementId.value
    )

    return useQuery({
        queryKey: computed(() =>
            achievementKeys.detail(
                resolvedFamilyId.value,
                resolvedAchievementId.value
            )
        ),
        queryFn: () =>
            achievementService.getById(
                resolvedFamilyId.value!,
                resolvedAchievementId.value!
            ),
        enabled,
        staleTime: 30_000
    })
}

export const useCreateFamilyAchievementMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            familyId,
            data,
            evidenceFile
        }: {
            familyId: number
            data: FamilyAchievementReq
            evidenceFile?: File | null
        }) => achievementService.create(familyId, data, evidenceFile),

        onSuccess: (_res, variables) => {
            queryClient.invalidateQueries({
                queryKey: achievementKeys.lists()
            })

            queryClient.invalidateQueries({
                queryKey: [...achievementKeys.all, 'list', variables.familyId]
            })
        }
    })
}

export const useUpdateFamilyAchievementMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            familyId,
            achievementId,
            data,
            evidenceFile
        }: {
            familyId: number
            achievementId: number
            data: UpdateFamilyAchievementReq
            evidenceFile?: File | null
        }) =>
            achievementService.update(
                familyId,
                achievementId,
                data,
                evidenceFile
            ),

        onSuccess: (_res, variables) => {
            queryClient.invalidateQueries({
                queryKey: achievementKeys.lists()
            })

            queryClient.invalidateQueries({
                queryKey: [...achievementKeys.all, 'list', variables.familyId]
            })

            queryClient.invalidateQueries({
                queryKey: achievementKeys.detail(
                    variables.familyId,
                    variables.achievementId
                )
            })
        }
    })
}

export const useDeleteFamilyAchievementMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            familyId,
            achievementId
        }: {
            familyId: MaybeRefOrGetter<number | null | undefined>
            achievementId: MaybeRefOrGetter<number | null | undefined>
        }) =>
            achievementService.delete(
                toValue(familyId),
                toValue(achievementId)
            ),

        onSuccess: (_res, variables) => {
            queryClient.invalidateQueries({
                queryKey: achievementKeys.lists()
            })

            queryClient.invalidateQueries({
                queryKey: [...achievementKeys.all, 'list', toValue(variables.familyId)]
            })

            queryClient.removeQueries({
                queryKey: achievementKeys.detail(
                    toValue(variables.familyId),
                    toValue(variables.achievementId)
                )
            })
        }
    })
}