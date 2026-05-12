
import type { ApiResponse } from "@/types/api-response.types";
import type { FamilyCategoryReq, FamilyCategoryRes } from "@/types/family/family-category.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import { toValue, type MaybeRefOrGetter } from "vue";
import api from "./api.base";

export const familyCategoryService = {
    getById: async (
        categoryId: MaybeRefOrGetter<number>
    ): Promise<ApiResponse<FamilyCategoryRes>> => {
        const res = await api.get<ApiResponse<FamilyCategoryRes>>(
            `/family-categories/${toValue(categoryId)}`
        );
        return res.data;
    },

    getByFamilyId: async (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        params?: MaybeRefOrGetter<PageParams>
    ): Promise<ApiResponse<PageResponse<FamilyCategoryRes>>> => {
        const resolvedParams = toValue(params);

        const res = await api.get<ApiResponse<PageResponse<FamilyCategoryRes>>>(
            `/family-categories/family/${toValue(familyId)}`,
            {
                params: {
                    page: resolvedParams?.page ?? 0,
                    size: resolvedParams?.size ?? 10,
                    sort: resolvedParams?.sort
                }
            }
        );
        return res.data;
    },

    create: async (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        data: MaybeRefOrGetter<FamilyCategoryReq>
    ): Promise<ApiResponse<FamilyCategoryRes>> => {
        const res = await api.post<ApiResponse<FamilyCategoryRes>>(
            `/family-categories/family/${toValue(familyId)}`,
            toValue(data)
        );
        return res.data;
    },

    update: async (
        categoryId: MaybeRefOrGetter<number>,
        data: MaybeRefOrGetter<FamilyCategoryReq>
    ): Promise<ApiResponse<FamilyCategoryRes>> => {
        const res = await api.put<ApiResponse<FamilyCategoryRes>>(
            `/family-categories/${toValue(categoryId)}`,
            toValue(data)
        );
        return res.data;
    },

    deleteById: async (
        categoryId: MaybeRefOrGetter<number>
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(
            `/family-categories/${toValue(categoryId)}`
        );
        return res.data;
    }
}
