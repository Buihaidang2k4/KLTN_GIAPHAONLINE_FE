import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { computed, toValue, type MaybeRefOrGetter } from "vue"
import { familyPostCategoryService } from "@/services/family_post_category.service"
import { QUERY_KEYS } from "@/hooks/keys/query-keys"
import { notify } from "@/utils/notify"
import type { ApiResponse } from "@/types/api-response.types"
import type { PageParams } from "@/types/page-response.types"
import type {
    FamilyPostCategoryRes,
    PostCategoryReq
} from "@/types/family/post_category.types"

type CreatePostCategoryVariables = {
    familyId: number
    data: PostCategoryReq
}

type UpdatePostCategoryVariables = {
    familyId: number
    categoryId: number
    data: PostCategoryReq
}

type DeletePostCategoryVariables = {
    familyId: number
    categoryId: number
}


function normalizeParams(params?: MaybeRefOrGetter<PageParams>) {
    const p = toValue(params)

    return {
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "createdAt,desc"
    }
}

/**
 * Query: Lấy danh sách category theo familyId

 */export function useFamilyPostCategoriesByFamilyQuery(
    familyId: MaybeRefOrGetter<number | null | undefined>,
    keyword?: MaybeRefOrGetter<string | null>,
    params?: MaybeRefOrGetter<PageParams>
) {

    const resolvedFamilyId = computed(() => toValue(familyId))
    const resolvedKeyword = computed(() => keyword ? toValue(keyword) : null)
    const normalizedParams = computed(() => normalizeParams(params))

    return useQuery({
        queryKey: computed(() =>
            [...QUERY_KEYS.FAMILY_POST_CATEGORY.listByFamily(resolvedFamilyId.value ?? "unknown", normalizedParams.value), resolvedKeyword.value] as const
        ),
        queryFn: () =>
            familyPostCategoryService.getPostCategoriesByFamilyId(
                resolvedFamilyId.value!,
                resolvedKeyword.value,
                normalizedParams.value
            ),
        enabled: computed(() => !!resolvedFamilyId.value),
        staleTime: 30_000,
        placeholderData: (prev) => prev
    })
}

/**
 * Query: Lấy category theo id
 */
export function useFamilyPostCategoryByIdQuery(
    familyId: MaybeRefOrGetter<number | null | undefined>,
    categoryId: MaybeRefOrGetter<number | null | undefined>
) {
    const resolvedFamilyId = computed(() => toValue(familyId))
    const resolvedCategoryId = computed(() => toValue(categoryId))

    return useQuery({
        queryKey: computed(() =>
            QUERY_KEYS.FAMILY_POST_CATEGORY.detail(resolvedCategoryId.value ?? "unknown")
        ),
        queryFn: () =>
            familyPostCategoryService.getPostCategoryById(resolvedFamilyId.value!, resolvedCategoryId.value!),
        enabled: computed(() => !!resolvedFamilyId.value && !!resolvedCategoryId.value),
        staleTime: 30_000
    })
}

/**
 * Query: Lấy tất cả category
 */
export function useAllFamilyPostCategoriesQuery(params?: MaybeRefOrGetter<PageParams>) {
    const normalizedParams = computed(() => normalizeParams(params))

    return useQuery({
        queryKey: computed(() => [...QUERY_KEYS.FAMILY_POST_CATEGORY.allCategories(), normalizedParams.value]),
        queryFn: () => familyPostCategoryService.getPostCategories(normalizedParams.value),
        staleTime: 30_000,
        placeholderData: (prev) => prev
    })
}

/**
 * Mutation: Tạo category mới
 */
export function useCreateFamilyPostCategoryMutation() {
    const queryClient = useQueryClient()

    const mutation = useMutation<ApiResponse<FamilyPostCategoryRes>, Error, CreatePostCategoryVariables>({
        mutationFn: ({ familyId, data }) =>
            familyPostCategoryService.createFamilyPostCategory(familyId, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["family-post-categories", "family", variables.familyId],
                exact: false
            })

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAMILY_POST_CATEGORY.allCategories(),
                exact: false
            })

            notify.success("Thông báo", "Tạo danh mục thành công")
        },

        onError: () => {
            notify.error("Thông báo", "Tạo danh mục thất bại")
        }
    })

    return {
        mutate: mutation.mutate,
        isPending: mutation.isPending
    }
}

/**
 * Mutation: Cập nhật category
 */
export function useUpdateFamilyPostCategoryMutation() {
    const queryClient = useQueryClient()

    const mutation = useMutation<ApiResponse<FamilyPostCategoryRes>, Error, UpdatePostCategoryVariables>({
        mutationFn: ({ familyId, categoryId, data }) =>
            familyPostCategoryService.updatePostCategory(familyId, categoryId, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["family-post-categories", "family", variables.familyId],
                exact: false
            })

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAMILY_POST_CATEGORY.detail(variables.categoryId),
                exact: false
            })

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAMILY_POST_CATEGORY.allCategories(),
                exact: false
            })

            notify.success("Thông báo", "Cập nhật danh mục thành công")
        },

        onError: () => {
            notify.error("Thông báo", "Cập nhật danh mục thất bại")
        }
    })

    return {
        mutate: mutation.mutate,
        isPending: mutation.isPending
    }
}

/**
 * Mutation: Xóa category
 */
export function useDeleteFamilyPostCategoryMutation() {
    const queryClient = useQueryClient()

    const mutation = useMutation<ApiResponse<void>, Error, DeletePostCategoryVariables>({
        mutationFn: ({ familyId, categoryId }) =>
            familyPostCategoryService.deletePostCategory(familyId, categoryId),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["family-post-categories", "family", variables.familyId],
                exact: false
            })

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAMILY_POST_CATEGORY.allCategories(),
                exact: false
            })

            queryClient.removeQueries({
                queryKey: QUERY_KEYS.FAMILY_POST_CATEGORY.detail(variables.categoryId)
            })

            notify.success("Thông báo", "Xóa danh mục thành công")
        },

        onError: () => {
            notify.error("Thông báo", "Xóa danh mục thất bại")
        }
    })

    return {
        mutate: mutation.mutate,
        isPending: mutation.isPending
    }
}
