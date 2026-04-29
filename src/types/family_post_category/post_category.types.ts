export interface PostCategoryReq {
    name: string;
    description: string;
}


export interface FamilyPostCategoryRes {
    categoryId: number;
    familyId: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string | null;
}
