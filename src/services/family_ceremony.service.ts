import api from "./api.base";
import type { ApiResponse } from "@/types/api-response.types";
import type { CeremonyReq, CeremonyRes, CeremonyTimelinePreparationReq, CeremonyTimelinePreparationRes, CeremonyTimelinePreparationUpdateReq, CeremonyTimelineReq, CeremonyTimelineRes, CeremonyTimelineUpdateReq, CeremonyUpdateReq } from "@/types/ceremony/ceremony.types";
import type { PageResponse } from "@/types/page-response.types";


export const familyCeremonyService = {

    getCeremoniesByFamilyId: async (familyId: number): Promise<ApiResponse<CeremonyRes[]>> => {
        const res = await api.get<ApiResponse<CeremonyRes[]>>(`/ceremonies/family/${familyId}`);
        return res.data;
    },

    getCeremoniesByCeremonyId: async (ceremonyId: number): Promise<ApiResponse<CeremonyRes>> => {
        const res = await api.get<ApiResponse<CeremonyRes>>(`/ceremonies/${ceremonyId}`);
        return res.data;
    },

    getCeremonies: async (): Promise<ApiResponse<CeremonyRes[]>> => {
        const res = await api.get<ApiResponse<CeremonyRes[]>>(`/ceremonies`);
        return res.data;
    },

    createCeremony: async (data: CeremonyReq): Promise<ApiResponse<CeremonyRes>> => {
        const res = await api.post<ApiResponse<CeremonyRes>>(`/ceremonies`, data);
        return res.data;
    },

    updateCeremony: async (ceremonyId: number, data: CeremonyUpdateReq): Promise<ApiResponse<CeremonyRes>> => {
        const res = await api.put<ApiResponse<CeremonyRes>>(`/ceremonies/${ceremonyId}`, data);
        return res.data;
    },

    deleteCeremonyById: async (ceremonyId: number): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/ceremonies/${ceremonyId}`);
        return res.data;
    },

    // CeremonyTimeline
    getCeremonyTimelineByCeremonyId: async (ceremonyId: number): Promise<ApiResponse<CeremonyTimelineRes[]>> => {
        const res = await api.get<ApiResponse<CeremonyTimelineRes[]>>(`/ceremonies/${ceremonyId}/timeline`);
        return res.data;
    },

    createCeremonyTimeline: async (ceremonyId: number, data: CeremonyTimelineReq): Promise<ApiResponse<CeremonyTimelineRes>> => {
        const res = await api.post<ApiResponse<CeremonyTimelineRes>>(`/ceremonies/${ceremonyId}/timeline`, data);
        return res.data;
    },

    updateCeremonyTimeline: async (ceremonyId: number, timelineId: number, data: CeremonyTimelineUpdateReq): Promise<ApiResponse<CeremonyTimelineRes>> => {
        const res = await api.put<ApiResponse<CeremonyTimelineRes>>(`/ceremonies/${ceremonyId}/timeline/${timelineId}`, data);
        return res.data;
    },

    deleteCeremonyTimelineById: async (ceremonyId: number, timelineId: number): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/ceremonies/${ceremonyId}/timeline/${timelineId}`);
        return res.data;
    },

    // CeremonyTimelinePreparation
    createPreparation: async (
        data: CeremonyTimelinePreparationReq
    ): Promise<ApiResponse<CeremonyTimelinePreparationRes>> => {
        const res = await api.post<ApiResponse<CeremonyTimelinePreparationRes>>(
            `/ceremony-timeline-preparations`,
            data
        );
        return res.data;
    },

    getPreparationById: async (
        preparationId: number
    ): Promise<ApiResponse<CeremonyTimelinePreparationRes>> => {
        const res = await api.get<ApiResponse<CeremonyTimelinePreparationRes>>(
            `/ceremony-timeline-preparations/${preparationId}`
        );
        return res.data;
    },

    getPreparationsByTimelineId: async (
        timelineId: number,
        page: number = 0,
        size: number = 10
    ): Promise<ApiResponse<PageResponse<CeremonyTimelinePreparationRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<CeremonyTimelinePreparationRes>>>(
            `/ceremony-timeline-preparations/timeline/${timelineId}?page=${page}&size=${size}`
        );
        return res.data;
    },

    getAllPreparations: async (
        page: number = 0,
        size: number = 10
    ): Promise<ApiResponse<PageResponse<CeremonyTimelinePreparationRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<CeremonyTimelinePreparationRes>>>(
            `/ceremony-timeline-preparations?page=${page}&size=${size}`
        );
        return res.data;
    },

    updatePreparation: async (
        preparationId: number,
        data: CeremonyTimelinePreparationUpdateReq
    ): Promise<ApiResponse<CeremonyTimelinePreparationRes>> => {
        const res = await api.put<ApiResponse<CeremonyTimelinePreparationRes>>(
            `/ceremony-timeline-preparations/${preparationId}`,
            data
        );
        return res.data;
    },

    deletePreparationById: async (
        preparationId: number
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(
            `/ceremony-timeline-preparations/${preparationId}`
        );
        return res.data;
    },
}