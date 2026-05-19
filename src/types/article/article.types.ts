export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export type ArticleContentFormat = 'HTML' | 'MARKDOWN'

export interface ArticleReq {
    title: string
    summary?: string | null
    content?: string | null
    isFeatured?: boolean | null
    metaTitle?: string | null
    metaDescription?: string | null
    contentFormat: ArticleContentFormat
    articleCategoryId?: number | null
    thumbnail?: File | null
}

export interface ArticleRes {
    articleId: number
    articleCategoryId?: number | null
    articleCategoryName?: string | null
    title: string
    slug: string
    summary?: string | null
    content?: string | null
    status: ArticleStatus
    isFeatured: boolean
    metaTitle?: string | null
    metaDescription?: string | null
    contentFormat: ArticleContentFormat
    thumbnailUrl?: string | null
    createdAt: string
    updatedAt?: string | null
    publishedAt?: string | null
}
