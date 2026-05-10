export interface PaymentRes {
    paymentId: number;
    accountId: number;
    subscriptionPlanId: number;
    planName: string;
    familyId: number;
    familySubscriptionId: number;
    amount: number;
    currency: string;
    provider: string;
    providerTransactionId: number;
    merchantTransactionId: number;
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'REFUNDED';
    bankCode: string;
    bankTransactionNo: string;
    failureReason: string;
    paidAt: string | null;
    createdAt: string;
    updatedAt: string | null;
}
