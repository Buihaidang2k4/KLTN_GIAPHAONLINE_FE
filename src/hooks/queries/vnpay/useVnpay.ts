import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { vnpayService } from '@/services/vnpay.service'

export const vnpayPaymentKeys = {
    all: ['payments'] as const,

    lists: () => [...vnpayPaymentKeys.all, 'list'] as const,

    familyLists: () => [...vnpayPaymentKeys.all, 'family'] as const
}

/**
 * Tạo URL thanh toán VNPay
 */
export const useCreateVnpayPaymentMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            familyId,
            subscriptionPlanId,
            bankCode
        }: {
            familyId: number
            subscriptionPlanId: number
            bankCode: string
        }) => vnpayService.createPaymentUrl(familyId, subscriptionPlanId, bankCode),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: vnpayPaymentKeys.lists()
            })

            queryClient.invalidateQueries({
                queryKey: vnpayPaymentKeys.familyLists()
            })
        }
    })
}
