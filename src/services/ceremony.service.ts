import type { ApiResponse } from "@/types/api-response.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import type { CeremonyReq, CeremonyRes, CeremonyUpdateReq } from "@/types/family/ceremony.types";
import api from "./api.base";
import { toValue, type MaybeRefOrGetter } from "vue";
import type { un } from "vue-router/dist/router-CWoNjPRp.mjs";

export const ceremonyService = {
    getById: async (ceremonyId: MaybeRefOrGetter<number>): Promise<ApiResponse<CeremonyRes>> => {
        const res = await api.get<ApiResponse<CeremonyRes>>(`/ceremonies/${toValue(ceremonyId)}`);
        return res.data;
    },

    getByFamilyId: async (
        familyId: MaybeRefOrGetter<number | null>,
        keyword?: MaybeRefOrGetter<string | null | undefined>,
        params?: MaybeRefOrGetter<PageParams>
    ): Promise<ApiResponse<PageResponse<CeremonyRes>>> => {
        const resolvedParams = toValue(params);
        const res = await api.get<ApiResponse<PageResponse<CeremonyRes>>>(`/ceremonies/family/${toValue(familyId)}`, {
            params: {
                keyword: toValue(keyword) || "",
                page: resolvedParams?.page ?? 0,
                size: resolvedParams?.size ?? 10,
                sort: resolvedParams?.sort
            }
        });
        return res.data;
    },

    getCeremonyList: async (params?: MaybeRefOrGetter<PageParams>): Promise<ApiResponse<PageResponse<CeremonyRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<CeremonyRes>>>('/ceremonies', {
            params: toValue(params)
        });
        return res.data;
    },

    create: async (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        data: MaybeRefOrGetter<CeremonyReq>
    ): Promise<ApiResponse<CeremonyRes>> => {
        const res = await api.post<ApiResponse<CeremonyRes>>('/ceremonies', toValue(data),
            {
                params: {
                    familyId: toValue(familyId),
                }
            }
        );
        return res.data;
    },

    update: async (ceremonyId: MaybeRefOrGetter<number>, data: MaybeRefOrGetter<CeremonyUpdateReq>): Promise<ApiResponse<CeremonyRes>> => {
        const res = await api.put<ApiResponse<CeremonyRes>>(`/ceremonies/${toValue(ceremonyId)}`, toValue(data));
        return res.data;
    },

    deleteById: async (ceremonyId: MaybeRefOrGetter<number>): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/ceremonies/${toValue(ceremonyId)}`);
        return res.data;
    }
}