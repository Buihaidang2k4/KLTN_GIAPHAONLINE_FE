export const PlanName = {
    FREE: 'FREE',
    BASIC: 'BASIC',
    PREMIUM: 'PREMIUM',
    ENTERPRISE: 'ENTERPRISE'
} as const

export interface SubscriptionPlanRes {
    subscriptionPlanId: number;
    namePlan: string;
    code: string;
    description: string;
    price: number;
    currency: string;
    maxPerson: number;
    maxAdmin: number;
    maxStorageMb: number;
    durationMonth: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface SubscriptionPlanReq {
    namePlan: string;
    code: string;
    description?: string;
    price: number;
    currency: string;
    maxPerson: number;
    maxAdmin: number;
    maxStorageMb: number;
    durationMonth: number;
    isActive?: boolean;
}
