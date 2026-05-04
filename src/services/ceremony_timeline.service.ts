import type { ApiResponse } from "@/types/api-response.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import type {
    CeremonyTimelineReq,
    CeremonyTimelineRes,
} from "@/types/family/ceremony.types";
import api from "./api.base";
import { toValue, type MaybeRefOrGetter } from "vue";

export const ceremonyTimelineService = {

    create: async (
        ceremonyId: MaybeRefOrGetter<Number | null | undefined>,
        data: MaybeRefOrGetter<CeremonyTimelineReq>): Promise<ApiResponse<CeremonyTimelineRes>> => {
        const res = await api.post('/ceremony-timelines', toValue(data), {
            params: {
                ceremonyId: toValue(ceremonyId)
            }
        })

        return res.data;
    },


    getById: async (timelineId: MaybeRefOrGetter<number>): Promise<ApiResponse<CeremonyTimelineRes>> => {
        const res = await api.get<ApiResponse<CeremonyTimelineRes>>(`/ceremony-timelines/${toValue(timelineId)}`);
        return res.data;
    },

    getByCeremonyId: async (ceremonyId: MaybeRefOrGetter<number>, params?: MaybeRefOrGetter<PageParams>): Promise<ApiResponse<PageResponse<CeremonyTimelineRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<CeremonyTimelineRes>>>(`/ceremony-timelines/ceremony/${toValue(ceremonyId)}`, {
            params: toValue(params)
        });
        return res.data;
    },

    getAll: async (params?: MaybeRefOrGetter<PageParams>): Promise<ApiResponse<PageResponse<CeremonyTimelineRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<CeremonyTimelineRes>>>('/ceremony-timelines', {
            params: toValue(params)
        });
        return res.data;
    },

    update: async (timelineId: MaybeRefOrGetter<number>, data: MaybeRefOrGetter<CeremonyTimelineReq>): Promise<ApiResponse<CeremonyTimelineRes>> => {
        const res = await api.put<ApiResponse<CeremonyTimelineRes>>(`/ceremony-timelines/${toValue(timelineId)}`, toValue(data));
        return res.data;
    },

    deleteById: async (timelineId: MaybeRefOrGetter<number>): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/ceremony-timelines/${toValue(timelineId)}`);
        return res.data;
    }
}