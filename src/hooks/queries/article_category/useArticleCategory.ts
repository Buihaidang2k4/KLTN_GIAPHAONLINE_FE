import { articleCategoryService, type ArticleCategoryParams } from "@/services/article_category.service";
import type {
    CreateArticleCategoryReq,
    UpdateArticleCategoryReq
} from "@/types/article_category/article-category.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export const articleCategoryKey = {
    all: ["article-categories"] as const,

    lists: () => [...articleCategoryKey.all, "list"] as const,

    list: (
        params?: MaybeRefOrGetter<ArticleCategoryParams>
    ) => [
            ...articleCategoryKey.lists(),
            toValue(params)?.page ?? 0,
            toValue(params)?.size ?? 10,
            toValue(params)?.sort ?? "displayOrder,asc",
            toValue(params)?.keyword || ""
        ] as const,

    details: () => [...articleCategoryKey.all, "detail"] as const,

    detail: (articleCategoryId: MaybeRefOrGetter<number | null | undefined>) =>
        [
            ...articleCategoryKey.details(),
            toValue(articleCategoryId)
        ] as const
}

function normalizeParams(params?: MaybeRefOrGetter<ArticleCategoryParams>) {
    const p = toValue(params);

    return {
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "displayOrder,asc",
        keyword: p?.keyword || ""
    }
}

export const useArticleCategoriesQuery = (
    params?: MaybeRefOrGetter<ArticleCategoryParams>
) => {
    const normalizedParams = computed(() => normalizeParams(params));

    return useQuery({
        queryKey: computed(() => articleCategoryKey.list(normalizedParams)),
        queryFn: () => articleCategoryService.getAll(normalizedParams)
    })
}

export const useArticleCategoryQuery = (
    articleCategoryId: MaybeRefOrGetter<number | null | undefined>
) => {
    const enabled = computed(() => !!toValue(articleCategoryId));
    const resolvedArticleCategoryId = computed(() => toValue(articleCategoryId));

    return useQuery({
        queryKey: computed(() => articleCategoryKey.detail(resolvedArticleCategoryId)),
        queryFn: () => articleCategoryService.getById(resolvedArticleCategoryId.value!),
        enabled
    })
}

export const useCreateArticleCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateArticleCategoryReq) => articleCategoryService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: articleCategoryKey.all });
        }
    })
}

export const useUpdateArticleCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            articleCategoryId,
            data
        }: {
            articleCategoryId: number
            data: UpdateArticleCategoryReq
        }) => articleCategoryService.update(articleCategoryId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: articleCategoryKey.all });
        }
    })
}

export const useDeleteArticleCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (articleCategoryId: number) =>
            articleCategoryService.deleteById(articleCategoryId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: articleCategoryKey.all });
        }
    })
}
