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
    providerTransactionId: string | null;
    merchantTransactionId: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED' | 'REFUNDED';
    bankCode: string;
    bankTransactionNo: string | null;
    failureReason: string | null;
    paidAt: string | null;
    createdAt: string;
    updatedAt: string | null;
}
