import type { ApiResponse } from "@/types/api-response.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import type {
    CeremonyTimelineReq,
    CeremonyTimelineRes,
    CeremonyTimelineUpdateReq,
} from "@/types/ceremony/ceremony.types";
import api from "./api.base";

export const ceremonyTimelineService = {

    create: async (data: CeremonyTimelineReq): Promise<ApiResponse<CeremonyTimelineRes>> => {
        const res = await api.post<ApiResponse<CeremonyTimelineRes>>('/ceremony-timelines', data);
        return res.data;
    },


    getById: async (timelineId: number): Promise<ApiResponse<CeremonyTimelineRes>> => {
        const res = await api.get<ApiResponse<CeremonyTimelineRes>>(`/ceremony-timelines/${timelineId}`);
        return res.data;
    },

    getByCeremonyId: async (ceremonyId: number, params?: PageParams): Promise<ApiResponse<PageResponse<CeremonyTimelineRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<CeremonyTimelineRes>>>(`/ceremony-timelines/ceremony/${ceremonyId}`, {
            params
        });
        return res.data;
    },

    getAll: async (params?: PageParams): Promise<ApiResponse<PageResponse<CeremonyTimelineRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<CeremonyTimelineRes>>>('/ceremony-timelines', {
            params
        });
        return res.data;
    },

    update: async (timelineId: number, data: CeremonyTimelineUpdateReq): Promise<ApiResponse<CeremonyTimelineRes>> => {
        const res = await api.put<ApiResponse<CeremonyTimelineRes>>(`/ceremony-timelines/${timelineId}`, data);
        return res.data;
    },

    deleteById: async (timelineId: number): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/ceremony-timelines/${timelineId}`);
        return res.data;
    }
}