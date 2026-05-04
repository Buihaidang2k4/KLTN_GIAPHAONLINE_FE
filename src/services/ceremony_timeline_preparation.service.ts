import type { ApiResponse } from "@/types/api-response.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import type {
    CeremonyTimelinePreparationReq,
    CeremonyTimelinePreparationRes,
} from "@/types/family/ceremony.types";
import api from "./api.base";
import { toValue, type MaybeRefOrGetter } from "vue";

export const ceremonyTimelinePreparationService = {

    create: async (
        timelineId: MaybeRefOrGetter<Number | null | undefined>
        , data: MaybeRefOrGetter<CeremonyTimelinePreparationReq>): Promise<ApiResponse<CeremonyTimelinePreparationRes>> => {
        const res = await api.post<ApiResponse<CeremonyTimelinePreparationRes>>('/ceremony-timeline-preparations', toValue(data),
            {
                params: {
                    timelineId: toValue(timelineId)
                }
            }
        );
        return res.data;
    },

    getById: async (preparationId: MaybeRefOrGetter<number>): Promise<ApiResponse<CeremonyTimelinePreparationRes>> => {
        const res = await api.get<ApiResponse<CeremonyTimelinePreparationRes>>(`/ceremony-timeline-preparations/${toValue(preparationId)}`);
        return res.data;
    },


    getByTimelineId: async (timelineId: MaybeRefOrGetter<number>, params?: MaybeRefOrGetter<PageParams>): Promise<ApiResponse<PageResponse<CeremonyTimelinePreparationRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<CeremonyTimelinePreparationRes>>>(`/ceremony-timeline-preparations/timeline/${toValue(timelineId)}`, {
            params: toValue(params)
        });
        return res.data;
    },


    getAll: async (params?: MaybeRefOrGetter<PageParams>): Promise<ApiResponse<PageResponse<CeremonyTimelinePreparationRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<CeremonyTimelinePreparationRes>>>('/ceremony-timeline-preparations', {
            params: toValue(params)
        });
        return res.data;
    },


    update: async (preparationId: MaybeRefOrGetter<number>, data: MaybeRefOrGetter<CeremonyTimelinePreparationReq>): Promise<ApiResponse<CeremonyTimelinePreparationRes>> => {
        const res = await api.put<ApiResponse<CeremonyTimelinePreparationRes>>(`/ceremony-timeline-preparations/${toValue(preparationId)}`, toValue(data));
        return res.data;
    },


    deleteById: async (preparationId: MaybeRefOrGetter<number>): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/ceremony-timeline-preparations/${toValue(preparationId)}`);
        return res.data;
    }
}
