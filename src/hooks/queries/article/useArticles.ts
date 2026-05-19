import { articleService, type ArticleParams } from "@/services/article.service";
import type { ArticleReq } from "@/types/article/article.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export const articleKey = {
    all: ["articles"] as const,

    lists: () => [...articleKey.all, "list"] as const,

    list: (
        params?: MaybeRefOrGetter<ArticleParams>
    ) => [
            ...articleKey.lists(),
            toValue(params)?.page ?? 0,
            toValue(params)?.size ?? 10,
            toValue(params)?.sort ?? "createdAt,desc",
            toValue(params)?.keyword || "",
            toValue(params)?.status || "",
            toValue(params)?.categoryId || ""
        ] as const,

    details: () => [...articleKey.all, "detail"] as const,

    detail: (articleId: MaybeRefOrGetter<number | null | undefined>) => [
        ...articleKey.details(),
        toValue(articleId)
    ] as const,

    slug: (slug: MaybeRefOrGetter<string | null | undefined>) => [
        ...articleKey.details(),
        "slug",
        toValue(slug)
    ] as const
}

function normalizeParams(params?: MaybeRefOrGetter<ArticleParams>) {
    const p = toValue(params);

    return {
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "createdAt,desc",
        keyword: p?.keyword || "",
        status: p?.status || null,
        categoryId: p?.categoryId || null
    }
}

export const useArticlesQuery = (
    params?: MaybeRefOrGetter<ArticleParams>
) => {
    const normalizedParams = computed(() => normalizeParams(params));

    return useQuery({
        queryKey: computed(() => articleKey.list(normalizedParams)),
        queryFn: () => articleService.getAll(normalizedParams)
    })
}

export const useArticleQuery = (
    articleId: MaybeRefOrGetter<number | null | undefined>
) => {
    const resolvedArticleId = computed(() => toValue(articleId));
    const enabled = computed(() => !!resolvedArticleId.value);

    return useQuery({
        queryKey: computed(() => articleKey.detail(resolvedArticleId)),
        queryFn: () => articleService.getById(resolvedArticleId.value!),
        enabled
    })
}

export const useArticleBySlugQuery = (
    slug: MaybeRefOrGetter<string | null | undefined>
) => {
    const resolvedSlug = computed(() => toValue(slug));
    const enabled = computed(() => !!resolvedSlug.value);

    return useQuery({
        queryKey: computed(() => articleKey.slug(resolvedSlug)),
        queryFn: () => articleService.getBySlug(resolvedSlug.value!),
        enabled
    })
}

export const useCreateArticleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ArticleReq) => articleService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: articleKey.all });
        }
    })
}

export const useUpdateArticleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            articleId,
            data
        }: {
            articleId: number
            data: ArticleReq
        }) => articleService.update(articleId, data),
        onSuccess: (_res, variables) => {
            queryClient.invalidateQueries({ queryKey: articleKey.all });
            queryClient.invalidateQueries({ queryKey: articleKey.detail(variables.articleId) });
        }
    })
}

export const useDeleteArticleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (articleId: number) => articleService.deleteById(articleId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: articleKey.all });
        }
    })
}

export const usePublishArticleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (articleId: number) => articleService.publish(articleId),
        onSuccess: (_res, articleId) => {
            queryClient.invalidateQueries({ queryKey: articleKey.all });
            queryClient.invalidateQueries({ queryKey: articleKey.detail(articleId) });
        }
    })
}

export const useUnpublishArticleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (articleId: number) => articleService.unpublish(articleId),
        onSuccess: (_res, articleId) => {
            queryClient.invalidateQueries({ queryKey: articleKey.all });
            queryClient.invalidateQueries({ queryKey: articleKey.detail(articleId) });
        }
    })
}

export const useToggleFeaturedArticleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (articleId: number) => articleService.toggleFeatured(articleId),
        onSuccess: (_res, articleId) => {
            queryClient.invalidateQueries({ queryKey: articleKey.all });
            queryClient.invalidateQueries({ queryKey: articleKey.detail(articleId) });
        }
    })
}
