export const PlanName = {
    FREE: 'FREE',
    BASIC: 'BASIC',
    PREMIUM: 'PREMIUM',
    ENTERPRISE: 'ENTERPRISE'
} as any

export interface SubscriptionPlan {
    subscriptionPlanId: number;
    namePlan: PlanName;
    code: string;
    description: string;
    price: number;
    currency: string;
    maxPerson: number;
    maxStorageMb: number;
    durationMonth: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
