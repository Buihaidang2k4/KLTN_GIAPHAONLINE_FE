import type { ApiResponse } from "@/types/api-response.types";
import type { DashboardRes, DashboardSystemRes } from "@/types/family/dashboard.types";
import api from "./api.base";
import { toValue, type MaybeRefOrGetter } from "vue";

export const dashboardService = {
    getDataDashboard: async (familyId: MaybeRefOrGetter<number>): Promise<ApiResponse<DashboardRes>> => {
        const res = await api.get<ApiResponse<DashboardRes>>(`/dashboard/family/${toValue(familyId)}`);
        return res.data;
    },

    getDataDashboardSystem: async (): Promise<ApiResponse<DashboardSystemRes>> => {
        const res = await api.get<ApiResponse<DashboardSystemRes>>("/dashboard/system");
        return res.data;
    }
}
