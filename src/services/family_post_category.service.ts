import { toValue, type MaybeRefOrGetter } from "vue";
import api from "./api.base";
import type { ApiResponse } from "@/types/api-response.types";
import type { FamilyPostCategoryRes, PostCategoryReq } from "@/types/family_post_category/post_category.types";
import type { PageParams } from "@/types/page-response.types";


export const familyPostCategoryService = {
    createFamilyPostCategory: async (
        familyId: MaybeRefOrGetter<number>
        , data: PostCategoryReq): Promise<ApiResponse<FamilyPostCategoryRes>> => {
        const res = await api.post(`/family-post-categories`,
            data,
            {
                params: {
                    familyId: toValue(familyId)
                }
            }

        )
        return res.data;
    },

    updatePostCategory: async (
        familyId: MaybeRefOrGetter<number>
        , categoryId: MaybeRefOrGetter<number>
        , data: PostCategoryReq
    ): Promise<ApiResponse<FamilyPostCategoryRes>> => {
        const res = await api.put(`/family-post-categories/${toValue(categoryId)}`,
            data, {
            params: {
                familyId: toValue(familyId)
            }
        }
        );
        return res.data;
    },

    deletePostCategory: async (
        familyId: MaybeRefOrGetter<number>
        , categoryId: MaybeRefOrGetter<number>
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete(`/family-post-categories/${toValue(categoryId)}`, {
            params: {
                familyId: toValue(familyId)
            }
        });
        return res.data;
    },


    getPostCategoryById: async (
        familyId: MaybeRefOrGetter<number>
        , categoryId: MaybeRefOrGetter<number>
    ): Promise<ApiResponse<FamilyPostCategoryRes>> => {
        const res = await api.get(`/family-post-categories/${toValue(categoryId)}`, {
            params: {
                familyId: toValue(familyId)
            }
        });
        return res.data;
    },


    getPostCategoriesByFamilyId: async (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        keyword?: MaybeRefOrGetter<string | null | undefined>,
        params?: PageParams
    ): Promise<ApiResponse<FamilyPostCategoryRes[]>> => {
        const res = await api.get(`/family-post-categories`, {
            params: {
                familyId: toValue(familyId),
                keyword: toValue(keyword),
                ...params
            }
        });
        return res.data;
    },


    getPostCategories: async (params?: PageParams): Promise<ApiResponse<FamilyPostCategoryRes[]>> => {
        const res = await api.get(`/family-post-categories/all`, { params });
        return res.data;
    }

}