export interface AlbumRes {
    albumId: number;
    familyId: number;
    createdByAccountId: number;
    title: string;
    slug: string;
    description: string;
    coverUrl: string;
    totalSize: number;
    mediaCount: number;
    createdAt: string;
    updatedAt: string | null;
}

export interface AlbumReq {
    title: string;
    description: string;
}

export interface AlbumMediaRes {
    albumMediaId: number;
    albumId: number;
    title: string;
    description: string;
    mediaPath: string;
    mediaUrl: string;
    thumbnailPath: string;
    thumbnailUrl: string;
    mimeType: string;
    fileSizeBytes: number;
    mediaType: MediaType;
}

export enum MediaType {
    IMAGE = 'IMAGE',
    VIDEO = 'VIDEO',
    DOCUMENT = 'DOCUMENT',
    OTHER = 'OTHER'
}
