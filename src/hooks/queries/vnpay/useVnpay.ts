import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { vnpayService } from '@/services/vnpay.service'
import { paymentKeys } from '@/hooks/payments/usePayments'

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
                queryKey: paymentKeys.lists()
            })

            queryClient.invalidateQueries({
                queryKey: [...paymentKeys.all, 'family']
            })
        }
    })
}
