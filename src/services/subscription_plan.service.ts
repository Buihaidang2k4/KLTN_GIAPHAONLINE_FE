
import api from "./api.base"
import type { ApiResponse } from "@/types/api-response.types"
import type { SubscriptionPlanReq, SubscriptionPlanRes } from "@/types/family/subscription.types"

export const subscriptionService = {

    getAllPlans: async (): Promise<ApiResponse<SubscriptionPlanRes[]>> => {
        const res = await api.get<ApiResponse<SubscriptionPlanRes[]>>("/subscription-plans")
        return res.data
    },

    getActivePlans: async (): Promise<ApiResponse<SubscriptionPlanRes[]>> => {
        const res = await api.get<ApiResponse<SubscriptionPlanRes[]>>("/subscription-plans/active")
        return res.data
    },

    getPlanById: async (
        planId: number
    ): Promise<ApiResponse<SubscriptionPlanRes>> => {
        const res = await api.get<ApiResponse<SubscriptionPlanRes>>(`/subscription-plans/${planId}`)
        return res.data
    },

    createPlan: async (
        data: SubscriptionPlanReq
    ): Promise<ApiResponse<SubscriptionPlanRes>> => {
        const res = await api.post<ApiResponse<SubscriptionPlanRes>>("/subscription-plans", data)
        return res.data
    },

    updatePlan: async (
        planId: number,
        data: SubscriptionPlanReq
    ): Promise<ApiResponse<SubscriptionPlanRes>> => {
        const res = await api.put<ApiResponse<SubscriptionPlanRes>>(`/subscription-plans/${planId}`, data)
        return res.data
    },

    deletePlan: async (
        planId: number
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/subscription-plans/${planId}`)
        return res.data
    }
}