export interface FamilySubscriptionRes {
    subscriptionPlanId: number;
    familyId: number;
    createdByAccountId: number;
    planName: string;
    planCode: string;
    price: string;
    maxPerson: number;
    maxAdmin: number;
    maxStorageMb: number;
    durationMonth: number;
    status: string;
    autoRenewal: boolean;
    startDate: string;
    endDate: string;
    createdAt: string | null;
    updatedAt: string;
    canceledAt: string | null
    expiredAt: string | null
}

export interface FamilySubscriptionCheckQuotaRes {
    currentPersonCount: number;
    currentStorageUsedMb: number;
    currentAdminCount: number;
}
