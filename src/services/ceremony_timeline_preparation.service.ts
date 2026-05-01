import type { ApiResponse } from "@/types/api-response.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import type {
    CeremonyTimelinePreparationReq,
    CeremonyTimelinePreparationRes,
    CeremonyTimelinePreparationUpdateReq,
} from "@/types/family/ceremony.types";
import api from "./api.base";

export const ceremonyTimelinePreparationService = {

    create: async (data: CeremonyTimelinePreparationReq): Promise<ApiResponse<CeremonyTimelinePreparationRes>> => {
        const res = await api.post<ApiResponse<CeremonyTimelinePreparationRes>>('/ceremony-timeline-preparations', data);
        return res.data;
    },

    getById: async (preparationId: number): Promise<ApiResponse<CeremonyTimelinePreparationRes>> => {
        const res = await api.get<ApiResponse<CeremonyTimelinePreparationRes>>(`/ceremony-timeline-preparations/${preparationId}`);
        return res.data;
    },


    getByTimelineId: async (timelineId: number, params?: PageParams): Promise<ApiResponse<PageResponse<CeremonyTimelinePreparationRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<CeremonyTimelinePreparationRes>>>(`/ceremony-timeline-preparations/timeline/${timelineId}`, {
            params
        });
        return res.data;
    },


    getAll: async (params?: PageParams): Promise<ApiResponse<PageResponse<CeremonyTimelinePreparationRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<CeremonyTimelinePreparationRes>>>('/ceremony-timeline-preparations', {
            params
        });
        return res.data;
    },


    update: async (preparationId: number, data: CeremonyTimelinePreparationUpdateReq): Promise<ApiResponse<CeremonyTimelinePreparationRes>> => {
        const res = await api.put<ApiResponse<CeremonyTimelinePreparationRes>>(`/ceremony-timeline-preparations/${preparationId}`, data);
        return res.data;
    },


    deleteById: async (preparationId: number): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/ceremony-timeline-preparations/${preparationId}`);
        return res.data;
    }
}