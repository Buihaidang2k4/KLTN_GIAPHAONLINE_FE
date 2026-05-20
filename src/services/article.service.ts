import type { ApiResponse } from "@/types/api-response.types";
import type { ArticleReq, ArticleRes, ArticleStatus } from "@/types/article/article.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import { toValue, type MaybeRefOrGetter } from "vue";
import api from "./api.base";

export interface ArticleParams extends PageParams {
    keyword?: string
    status?: ArticleStatus | null
    categoryId?: number | null
}

const appendIfPresent = (formData: FormData, key: string, value: unknown) => {
    if (value === undefined || value === null || value === "") return;
    formData.append(key, String(value));
}

const buildArticleFormData = (data: ArticleReq) => {
    const formData = new FormData();

    appendIfPresent(formData, "title", data.title);
    appendIfPresent(formData, "summary", data.summary);
    appendIfPresent(formData, "content", data.content);
    appendIfPresent(formData, "isFeatured", data.isFeatured);
    appendIfPresent(formData, "metaTitle", data.metaTitle);
    appendIfPresent(formData, "metaDescription", data.metaDescription);
    appendIfPresent(formData, "contentFormat", data.contentFormat);
    appendIfPresent(formData, "articleCategoryId", data.articleCategoryId);

    if (data.thumbnail) {
        formData.append("thumbnail", data.thumbnail);
    }

    return formData;
}

export const articleService = {
    create: async (
        data: MaybeRefOrGetter<ArticleReq>
    ): Promise<ApiResponse<ArticleRes>> => {
        const res = await api.post<ApiResponse<ArticleRes>>(
            "/articles",
            buildArticleFormData(toValue(data)),
        );
        return res.data;
    },

    update: async (
        articleId: MaybeRefOrGetter<number>,
        data: MaybeRefOrGetter<ArticleReq>
    ): Promise<ApiResponse<ArticleRes>> => {
        const res = await api.put<ApiResponse<ArticleRes>>(
            `/articles/${toValue(articleId)}`,
            buildArticleFormData(toValue(data)),
        );
        return res.data;
    },

    deleteById: async (
        articleId: MaybeRefOrGetter<number>
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/articles/${toValue(articleId)}`);
        return res.data;
    },

    getById: async (
        articleId: MaybeRefOrGetter<number>
    ): Promise<ApiResponse<ArticleRes>> => {
        const res = await api.get<ApiResponse<ArticleRes>>(`/articles/${toValue(articleId)}`);
        return res.data;
    },

    getBySlug: async (
        slug: MaybeRefOrGetter<string>
    ): Promise<ApiResponse<ArticleRes>> => {
        const res = await api.get<ApiResponse<ArticleRes>>(`/articles/slug/${toValue(slug)}`);
        return res.data;
    },

    getAll: async (
        params?: MaybeRefOrGetter<ArticleParams>
    ): Promise<ApiResponse<PageResponse<ArticleRes>>> => {
        const resolvedParams = toValue(params);

        const res = await api.get<ApiResponse<PageResponse<ArticleRes>>>(
            "/articles",
            {
                params: {
                    keyword: resolvedParams?.keyword || "",
                    status: resolvedParams?.status || undefined,
                    categoryId: resolvedParams?.categoryId || undefined,
                    page: resolvedParams?.page ?? 0,
                    size: resolvedParams?.size ?? 10,
                    sort: resolvedParams?.sort ?? "createdAt,desc"
                }
            }
        );
        return res.data;
    },

    publish: async (
        articleId: MaybeRefOrGetter<number>
    ): Promise<ApiResponse<ArticleRes>> => {
        const res = await api.patch<ApiResponse<ArticleRes>>(`/articles/${toValue(articleId)}/publish`);
        return res.data;
    },

    unpublish: async (
        articleId: MaybeRefOrGetter<number>
    ): Promise<ApiResponse<ArticleRes>> => {
        const res = await api.patch<ApiResponse<ArticleRes>>(`/articles/${toValue(articleId)}/unpublish`);
        return res.data;
    },

    toggleFeatured: async (
        articleId: MaybeRefOrGetter<number>
    ): Promise<ApiResponse<ArticleRes>> => {
        const res = await api.patch<ApiResponse<ArticleRes>>(`/articles/${toValue(articleId)}/toggle-featured`);
        return res.data;
    },

    uploadImage: async (file: File): Promise<ApiResponse<{ url: string }>> => {
        const formData = new FormData();
        formData.append('file', file);
        const res = await api.post<ApiResponse<{ url: string }>>('/articles/upload-image', formData);
        return res.data;
    }
}
