import type { ApiResponse } from "@/types/api-response.types";
import type { FamilySubscriptionRes, FamilySubscriptionCheckQuotaRes } from "@/types/family/familySubscription";
import api from "./api.base";


export const familySubscriptionService = {
    getByFamily: async (familyId: number): Promise<ApiResponse<FamilySubscriptionRes>> => {
        const res = await api.get(`/family-subscriptions/family/${familyId}`);
        return res.data
    },
    getFamilySubByQuotaUsage: async (familyId: number): Promise<ApiResponse<FamilySubscriptionCheckQuotaRes>> => {
        const res = await api.get(`/family-subscriptions/family/${familyId}/usageStorage`);
        return res.data;
    }
}