import type { ApiResponse } from "@/types/api-response.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import type { CeremonyReq, CeremonyRes, CeremonyUpdateReq } from "@/types/ceremony/ceremony.types";
import api from "./api.base";

export const ceremonyService = {
    getById: async (ceremonyId: number): Promise<ApiResponse<CeremonyRes>> => {
        const res = await api.get<ApiResponse<CeremonyRes>>(`/ceremonies/${ceremonyId}`);
        return res.data;
    },

    getByFamilyId: async (familyId: number, params?: PageParams): Promise<ApiResponse<PageResponse<CeremonyRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<CeremonyRes>>>(`/ceremonies/family/${familyId}`, {
            params
        });
        return res.data;
    },

    getCeremonyList: async (params?: PageParams): Promise<ApiResponse<PageResponse<CeremonyRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<CeremonyRes>>>('/ceremonies', {
            params
        });
        return res.data;
    },

    create: async (data: CeremonyReq): Promise<ApiResponse<CeremonyRes>> => {
        const res = await api.post<ApiResponse<CeremonyRes>>('/ceremonies', data);
        return res.data;
    },

    update: async (ceremonyId: number, data: CeremonyUpdateReq): Promise<ApiResponse<CeremonyRes>> => {
        const res = await api.put<ApiResponse<CeremonyRes>>(`/ceremonies/${ceremonyId}`, data);
        return res.data;
    },

    deleteById: async (ceremonyId: number): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/ceremonies/${ceremonyId}`);
        return res.data;
    }
}