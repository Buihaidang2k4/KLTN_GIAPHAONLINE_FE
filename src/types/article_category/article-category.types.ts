export interface ArticleCategoryRes {
    articleCategoryId: number;
    name: string;
    slug: string;
    description: string | null;
    displayOrder: number;
    createdAt: string;
    updatedAt?: string | null;
}

export interface CreateArticleCategoryReq {
    name: string;
    description?: string | null;
    displayOrder: number;
}

export interface UpdateArticleCategoryReq {
    name?: string;
    description?: string | null;
    displayOrder?: number;
}
