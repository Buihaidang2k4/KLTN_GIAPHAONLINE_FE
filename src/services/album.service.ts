import type { ApiResponse } from "@/types/api-response.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import type { AlbumMediaRes, AlbumReq, AlbumRes } from "@/types/family/album.types";
import { toValue, type MaybeRefOrGetter } from "vue";
import api from "./api.base";

const buildAlbumMediaFormData = (files: File[]) => {
    const formData = new FormData();

    files.forEach((file) => {
        formData.append("files", file);
    });

    return formData;
};

export const albumService = {
    create: async (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        data: MaybeRefOrGetter<AlbumReq>
    ): Promise<ApiResponse<AlbumRes>> => {
        const res = await api.post<ApiResponse<AlbumRes>>("/albums", toValue(data), {
            params: {
                familyId: toValue(familyId)
            }
        });

        return res.data;
    },

    update: async (
        albumId: MaybeRefOrGetter<number | null | undefined>,
        data: MaybeRefOrGetter<AlbumReq>
    ): Promise<ApiResponse<AlbumRes>> => {
        const res = await api.put<ApiResponse<AlbumRes>>(
            `/albums/${toValue(albumId)}`,
            toValue(data)
        );

        return res.data;
    },

    deleteById: async (
        albumId: MaybeRefOrGetter<number | null | undefined>
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/albums/${toValue(albumId)}`);

        return res.data;
    },

    getById: async (
        albumId: MaybeRefOrGetter<number | null | undefined>
    ): Promise<ApiResponse<AlbumRes>> => {
        const res = await api.get<ApiResponse<AlbumRes>>(`/albums/${toValue(albumId)}`);

        return res.data;
    },

    getByFamilyId: async (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        keyword?: MaybeRefOrGetter<string | null | undefined>,
        params?: MaybeRefOrGetter<PageParams>
    ): Promise<ApiResponse<PageResponse<AlbumRes>>> => {
        const resolvedParams = toValue(params);
        const res = await api.get<ApiResponse<PageResponse<AlbumRes>>>(
            `/albums/family/${toValue(familyId)}`,
            {
                params: {
                    keyword: toValue(keyword) || "",
                    page: resolvedParams?.page ?? 0,
                    size: resolvedParams?.size ?? 10,
                    sort: resolvedParams?.sort
                }
            }
        );

        return res.data;
    },

    uploadMedia: async (
        albumId: MaybeRefOrGetter<number | null | undefined>,
        file: File
    ): Promise<ApiResponse<AlbumMediaRes>> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post<ApiResponse<AlbumMediaRes>>(
            `/albums/${toValue(albumId)}/media`,
            formData
        );

        return res.data;
    },

    uploadMultipleMedia: async (
        albumId: MaybeRefOrGetter<number | null | undefined>,
        files: File[]
    ): Promise<ApiResponse<AlbumMediaRes[]>> => {
        const res = await api.post<ApiResponse<AlbumMediaRes[]>>(
            `/albums/${toValue(albumId)}/media/multiple`,
            buildAlbumMediaFormData(files)
        );

        return res.data;
    },

    getMediaByAlbumId: async (
        albumId: MaybeRefOrGetter<number | null | undefined>,
        mediaType?: MaybeRefOrGetter<string | null | undefined>,
        params?: MaybeRefOrGetter<PageParams>
    ): Promise<ApiResponse<PageResponse<AlbumMediaRes>>> => {
        const resolvedParams = toValue(params);
        const res = await api.get<ApiResponse<PageResponse<AlbumMediaRes>>>(
            `/albums/${toValue(albumId)}/media`,
            {
                params: {
                    mediaType: toValue(mediaType) || '',
                    page: resolvedParams?.page ?? 0,
                    size: resolvedParams?.size ?? 10,
                    sort: resolvedParams?.sort
                }
            }
        );

        return res.data;
    },

    deleteMediaById: async (
        mediaId: MaybeRefOrGetter<number | null | undefined>
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/albums/media/${toValue(mediaId)}`);

        return res.data;
    }
};
