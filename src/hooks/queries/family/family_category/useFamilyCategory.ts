import { familyCategoryService } from "@/services/family_category.service";
import type { FamilyCategoryReq } from "@/types/family/family-category.types";
import type { PageParams } from "@/types/page-response.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export const familyCategoryKey = {
    all: ["family-category"] as const,

    lists: () => [...familyCategoryKey.all, "list"] as const,

    list: (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        params?: MaybeRefOrGetter<PageParams>
    ) => [
        ...familyCategoryKey.lists(),
        toValue(familyId),
        toValue(params)?.page ?? 0,
        toValue(params)?.size ?? 10,
        toValue(params)?.sort ?? ""
    ] as const,

    details: () => [...familyCategoryKey.all, "detail"] as const,

    detail: (categoryId: MaybeRefOrGetter<number | null | undefined>) => [
        ...familyCategoryKey.details(),
        toValue(categoryId)
    ] as const
};

function normalizeParams(params?: MaybeRefOrGetter<PageParams>) {
    const p = toValue(params);

    return {
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "createdAt,desc"
    };
}

export const useFamilyCategoriesQuery = (
    familyId: MaybeRefOrGetter<number | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>
) => {
    const enabled = computed(() => !!toValue(familyId));
    const resolvedFamilyId = computed(() => toValue(familyId));
    const normalizedParams = computed(() => normalizeParams(params));

    return useQuery({
        queryKey: computed(() => familyCategoryKey.list(resolvedFamilyId, normalizedParams)),
        queryFn: () => familyCategoryService.getByFamilyId(resolvedFamilyId.value!, normalizedParams),
        enabled
    });
};

export const useFamilyCategoryQuery = (
    categoryId: MaybeRefOrGetter<number | null | undefined>
) => {
    const enabled = computed(() => !!toValue(categoryId));
    const resolvedCategoryId = computed(() => toValue(categoryId));

    return useQuery({
        queryKey: computed(() => familyCategoryKey.detail(resolvedCategoryId)),
        queryFn: () => familyCategoryService.getById(resolvedCategoryId.value!),
        enabled
    });
};

export const useCreateFamilyCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            familyId,
            data
        }: {
            familyId: MaybeRefOrGetter<number | null | undefined>;
            data: FamilyCategoryReq;
        }) => familyCategoryService.create(familyId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: familyCategoryKey.all });
        }
    });
};

export const useUpdateFamilyCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            categoryId,
            data
        }: {
            categoryId: number;
            data: FamilyCategoryReq;
        }) => familyCategoryService.update(categoryId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: familyCategoryKey.all });
        }
    });
};

export const useDeleteFamilyCategoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (categoryId: number) => familyCategoryService.deleteById(categoryId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: familyCategoryKey.all });
        }
    });
};
