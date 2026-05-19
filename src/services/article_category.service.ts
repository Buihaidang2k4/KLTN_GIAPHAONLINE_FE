import type { ApiResponse } from "@/types/api-response.types";
import type {
    ArticleCategoryRes,
    CreateArticleCategoryReq,
    UpdateArticleCategoryReq
} from "@/types/article_category/article-category.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import { toValue, type MaybeRefOrGetter } from "vue";
import api from "./api.base";

export interface ArticleCategoryParams extends PageParams {
    keyword?: string
}

export const articleCategoryService = {
    getById: async (
        articleCategoryId: MaybeRefOrGetter<number>
    ): Promise<ApiResponse<ArticleCategoryRes>> => {
        const res = await api.get<ApiResponse<ArticleCategoryRes>>(
            `/article-categories/${toValue(articleCategoryId)}`
        );
        return res.data;
    },

    getAll: async (
        params?: MaybeRefOrGetter<ArticleCategoryParams>
    ): Promise<ApiResponse<PageResponse<ArticleCategoryRes>>> => {
        const resolvedParams = toValue(params);

        const res = await api.get<ApiResponse<PageResponse<ArticleCategoryRes>>>(
            "/article-categories",
            {
                params: {
                    keyword: resolvedParams?.keyword || "",
                    page: resolvedParams?.page ?? 0,
                    size: resolvedParams?.size ?? 10,
                    sort: resolvedParams?.sort ?? "displayOrder,asc"
                }
            }
        );
        return res.data;
    },

    create: async (
        data: MaybeRefOrGetter<CreateArticleCategoryReq>
    ): Promise<ApiResponse<ArticleCategoryRes>> => {
        const res = await api.post<ApiResponse<ArticleCategoryRes>>(
            "/article-categories",
            toValue(data)
        );
        return res.data;
    },

    update: async (
        articleCategoryId: MaybeRefOrGetter<number>,
        data: MaybeRefOrGetter<UpdateArticleCategoryReq>
    ): Promise<ApiResponse<ArticleCategoryRes>> => {
        const res = await api.put<ApiResponse<ArticleCategoryRes>>(
            `/article-categories/${toValue(articleCategoryId)}`,
            toValue(data)
        );
        return res.data;
    },

    deleteById: async (
        articleCategoryId: MaybeRefOrGetter<number>
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(
            `/article-categories/${toValue(articleCategoryId)}`
        );
        return res.data;
    }
}
