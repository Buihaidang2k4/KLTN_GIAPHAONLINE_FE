import api from "./api.base"
import type { ApiResponse } from "@/types/api-response.types"
import type { PageParams, PageResponse } from "@/types/page-response.types"
import type { FamilyRes } from "@/types/family/family.types"

export const familyService = {

    getAllFamiliesCurrentAccount: async (
        params?: PageParams
    ): Promise<ApiResponse<PageResponse<FamilyRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<FamilyRes>>>("/families/current-account", { params })
        return res.data
    },

    getFamilyById: async (
        familyId: number
    ): Promise<ApiResponse<FamilyRes>> => {
        const res = await api.get<ApiResponse<FamilyRes>>(`/families/${familyId}`)
        return res.data
    },

    getAllFamilies: async (): Promise<ApiResponse<PageResponse<FamilyRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<FamilyRes>>>("/families")
        return res.data
    },

}