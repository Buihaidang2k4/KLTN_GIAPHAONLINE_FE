
export interface FamilyCategoryRes {
    familyCategoryId: number | string;
    createdByAccountId: number | string;
    familyId: number | string;
    familyName: string;
    totalPerson: number;
    origin: string;
    description: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface FamilyCategoryReq {
    familyName: string;
    origin: string;
    description: string;
    isPublic: boolean;
}