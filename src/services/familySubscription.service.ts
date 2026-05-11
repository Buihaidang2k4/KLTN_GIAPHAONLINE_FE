import type { ApiResponse } from "@/types/api-response.types";
import type { FamilySubscriptionRes } from "@/types/family/familySubscription";
import api from "./api.base";


export const familySubscriptionService = {
    getByFamily: async (familyId: number): Promise<ApiResponse<FamilySubscriptionRes>> => {
        const res = await api.get(`/family-subscriptions/family/${familyId}`);
        return res.data
    }
}