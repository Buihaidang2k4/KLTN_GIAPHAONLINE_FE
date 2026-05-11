import { toValue, type MaybeRefOrGetter } from "vue";
import type { ApiResponse } from "@/types/api-response.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import type { PaymentRes } from "@/types/payment/payment.types";
import api from "./api.base";

const BASE_URL = '/payments';

export const paymentService = {

    getPayments: async (params?: MaybeRefOrGetter<PageParams>): Promise<ApiResponse<PageResponse<PaymentRes>>> => {
        const response = await api.get<ApiResponse<PageResponse<PaymentRes>>>(`${BASE_URL}`, {
            params: toValue(params)
        });
        return response.data;
    },

    getPaymentsByFamilyId: async (
        familyId: MaybeRefOrGetter<number>,
        params?: MaybeRefOrGetter<PageParams>
    ): Promise<ApiResponse<PageResponse<PaymentRes>>> => {
        const response = await api.get<ApiResponse<PageResponse<PaymentRes>>>(`${BASE_URL}/family/${toValue(familyId)}`, {
            params: toValue(params)
        });
        return response.data;
    },

    getByTransactionId: async (
        transactionId: MaybeRefOrGetter<string>
    ): Promise<ApiResponse<PaymentRes>> => {
        const response = await api.get<ApiResponse<PaymentRes>>(
            `${BASE_URL}/transaction/${toValue(transactionId)}`
        );
        return response.data;
    },

    deletePayment: async (paymentId: number): Promise<ApiResponse<string>> => {
        const response = await api.delete<ApiResponse<string>>(`${BASE_URL}/${paymentId}`);
        return response.data;
    }
}
