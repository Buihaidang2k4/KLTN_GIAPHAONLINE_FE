import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { paymentService } from '@/services/payment.service'
import type { PageParams } from '@/types/page-response.types'

// ──────────────────────────────────────────────
// Query Keys
// ──────────────────────────────────────────────
export const paymentKeys = {
    all: ['payments'] as const,

    lists: () => [...paymentKeys.all, 'list'] as const,

    list: (
        params?: MaybeRefOrGetter<PageParams | undefined>
    ) =>
        [
            ...paymentKeys.lists(),
            toValue(params)?.page ?? 0,
            toValue(params)?.size ?? 10,
            toValue(params)?.sort ?? ''
        ] as const,

    byFamily: (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        params?: MaybeRefOrGetter<PageParams | undefined>
    ) =>
        [
            ...paymentKeys.all,
            'family',
            toValue(familyId),
            toValue(params)?.page ?? 0,
            toValue(params)?.size ?? 10,
            toValue(params)?.sort ?? ''
        ] as const
}


// ──────────────────────────────────────────────
// Normalize Params
// ──────────────────────────────────────────────
function normalizeParams(params?: MaybeRefOrGetter<PageParams>) {
    const p = toValue(params)

    return {
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "createdAt,desc",
    }
}



/**
 * Lấy danh sách tất cả giao dịch thanh toán (có phân trang)
 */
export const usePaymentsQuery = (
    params?: MaybeRefOrGetter<PageParams>
) => {
    const normalizedParams = computed(() => normalizeParams(params))

    return useQuery({
        queryKey: computed(() => paymentKeys.list(normalizedParams)),
        queryFn: () => paymentService.getPayments(normalizedParams.value),
        placeholderData: previousData => previousData,
        staleTime: 30_000
    })
}

/**
 * Lấy danh sách giao dịch thanh toán theo familyId (có phân trang)
 */
export const usePaymentsByFamilyQuery = (
    familyId: MaybeRefOrGetter<number | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>
) => {
    const enabled = computed(() => !!toValue(familyId))
    const normalizedParams = computed(() => normalizeParams(params))
    const resolvedFamilyId = computed(() => toValue(familyId))

    return useQuery({
        queryKey: computed(() => paymentKeys.byFamily(resolvedFamilyId, normalizedParams)),
        queryFn: () =>
            paymentService.getPaymentsByFamilyId(
                resolvedFamilyId.value!,
                normalizedParams.value
            ),
        enabled,
        placeholderData: previousData => previousData,
        staleTime: 30_000
    })
}

/**
 * Xóa giao dịch thanh toán
 */
export const useDeletePaymentMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ paymentId }: { paymentId: number }) =>
            paymentService.deletePayment(paymentId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: paymentKeys.lists()
            })

            queryClient.invalidateQueries({
                queryKey: [...paymentKeys.all, 'family']
            })
        }
    })
}
