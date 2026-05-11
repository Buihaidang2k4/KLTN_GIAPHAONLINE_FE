import type { ApiResponse } from "@/types/api-response.types";
import type { PaymentCreateRes } from "@/types/vnpay/vnpay.types";
import api from "./api.base";


export const vnpayService = {
    createPaymentUrl: async (
        familyId: number,
        subscriptionPlanId: number,
        bankCode: string
    ): Promise<ApiResponse<PaymentCreateRes>> => {
        const res = await api.post("/payments/vnpay", null, {
            params: {
                familyId: familyId,
                subscriptionPlanId: subscriptionPlanId,
                bankCode: bankCode
            }
        })
        return res.data;
    }

}
