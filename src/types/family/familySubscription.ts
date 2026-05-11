export interface FamilySubscriptionRes {
    subscriptionPlanId: number;
    familyId: number;
    createdByAccountId: number;
    planName: string;
    planCode: string;
    status: string;
    autoRenewal: boolean;
    startDate: string;
    endDate: string;
    createdAt: string | null;
    updatedAt: string;
    canceledAt: string | null
    expiredAt: string | null
}
