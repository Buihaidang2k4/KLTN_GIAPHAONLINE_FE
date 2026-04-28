export interface FamilyRes {
    familyId: number;
    slug: string;
    familyName: string;
    description: string;
    createdAt: string;
    updatedAt: string | null;
}

export interface FamilyReq {
    familyName: string;
    description: string;
    ownerAccountId: number;
}