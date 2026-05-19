import { subscriptionService, type SubscriptionPlanParams } from "@/services/subscription_plan.service"
import type { SubscriptionPlanReq } from "@/types/family/subscription.types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { computed, toValue, type MaybeRefOrGetter } from "vue"

export const subscriptionPlanKey = {
    all: ['subscription-plan'] as const,

    lists: () => [...subscriptionPlanKey.all, 'list'] as const,

    list: (params?: MaybeRefOrGetter<SubscriptionPlanParams>) => [
        ...subscriptionPlanKey.lists(),
        toValue(params)
    ] as const,

    active: () => [...subscriptionPlanKey.all, 'active'] as const,

    details: () => [...subscriptionPlanKey.all, 'detail'] as const,

    detail: (planId: MaybeRefOrGetter<number | null | undefined>) => [
        ...subscriptionPlanKey.details(),
        toValue(planId)
    ] as const
}

export const useSubscriptionPlansQuery = (
    params?: MaybeRefOrGetter<SubscriptionPlanParams>
) => {
    return useQuery({
        queryKey: computed(() => subscriptionPlanKey.list(params)),
        queryFn: () => subscriptionService.getAllPlans(params)
    })
}

export const useActiveSubscriptionPlansQuery = () => {
    return useQuery({
        queryKey: computed(() => subscriptionPlanKey.active()),
        queryFn: () => subscriptionService.getActivePlans()
    })
}

export const useSubscriptionPlanQuery = (
    planId: MaybeRefOrGetter<number | null | undefined>
) => {
    const resolvedPlanId = computed(() => toValue(planId))
    const enabled = computed(() => !!resolvedPlanId.value)

    return useQuery({
        queryKey: computed(() => subscriptionPlanKey.detail(resolvedPlanId)),
        queryFn: () => subscriptionService.getPlanById(resolvedPlanId.value!),
        enabled
    })
}

export const useCreateSubscriptionPlanMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: SubscriptionPlanReq) => subscriptionService.createPlan(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: subscriptionPlanKey.all })
        }
    })
}

export const useUpdateSubscriptionPlanMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ planId, data }: { planId: number; data: SubscriptionPlanReq }) =>
            subscriptionService.updatePlan(planId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: subscriptionPlanKey.all })
        }
    })
}

export const useDeleteSubscriptionPlanMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (planId: number) => subscriptionService.deletePlan(planId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: subscriptionPlanKey.all })
        }
    })
}

export const useToggleActiveSubscriptionPlanMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (planId: number) => subscriptionService.toggleActivePlan(planId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: subscriptionPlanKey.all })
        }
    })
}
