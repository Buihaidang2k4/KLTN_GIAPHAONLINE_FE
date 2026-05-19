export interface DashboardRes {
    totalMembersInFamilyTree: number;
    totalEvents: number;
    totalAlbumMedias: number;
    totalAchievement: number;
    totalCustoms: number;
    totalAdmin: number;
    totalStorages: number;
    totalUsedStorages: number;
    currentFamilyName: string;
    currentSubscriptionPlanName: string;
    currentSubscriptionPlanPrice: string;
    currentSubscriptionStartDate: string;
    currentSubscriptionEndDate: string;
}

export interface MonthlyStatRes {
    month: string;
    count: number;
    value: number;
}

export interface DashboardSystemRes {
    totalAccounts: number;
    totalAccountsActive: number;
    totalAccountsLocked: number;
    totalFamilies: number;
    totalFamiliesWithActiveSub: number;
    totalActiveSubscriptions: number;
    totalExpiredSubscriptions: number;
    revenueThisMonth: number;
    revenueLastMonth: number;
    revenueTotal: number;
    totalPayments: number;
    totalPaymentsSuccess: number;
    totalPaymentsFailed: number;
    accountGrowth: MonthlyStatRes[];
    revenueGrowth: MonthlyStatRes[];
}

