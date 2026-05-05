import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { albumService } from "@/services/album.service";
import type { AlbumReq } from "@/types/family/album.types";
import type { PageParams } from "@/types/page-response.types";

export const albumKey = {
    all: ["family-album"] as const,

    lists: () => [...albumKey.all, "list"] as const,

    list: (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        keyword?: MaybeRefOrGetter<string | null | undefined>,
        params?: MaybeRefOrGetter<PageParams>
    ) =>
        [
            ...albumKey.lists(),
            toValue(familyId),
            toValue(keyword) || "",
            toValue(params)?.page ?? 0,
            toValue(params)?.size ?? 10,
            toValue(params)?.sort ?? ""
        ] as const,

    details: () => [...albumKey.all, "detail"] as const,

    detail: (albumId: MaybeRefOrGetter<number | null | undefined>) =>
        [...albumKey.details(), toValue(albumId)] as const,

    mediaLists: () => [...albumKey.all, "media-list"] as const,

    mediaList: (
        albumId: MaybeRefOrGetter<number | null | undefined>,
        mediaType: MaybeRefOrGetter<string | null | undefined>,
        params?: MaybeRefOrGetter<PageParams>
    ) =>
        [
            ...albumKey.mediaLists(),
            toValue(albumId),
            toValue(mediaType),
            toValue(params)?.page ?? 0,
            toValue(params)?.size ?? 10,
            toValue(params)?.sort ?? ""
        ] as const
};

function normalizeParams(params?: MaybeRefOrGetter<PageParams>) {
    const p = toValue(params);

    return {
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "createdAt,desc"
    };
}

export const useFamilyAlbumsQuery = (
    familyId: MaybeRefOrGetter<number | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>,
    keyword?: MaybeRefOrGetter<string | null | undefined>
) => {
    const enabled = computed(() => !!toValue(familyId));
    const normalizedParams = computed(() => normalizeParams(params));
    const resolvedFamilyId = computed(() => toValue(familyId));
    const resolvedKeyword = computed(() => toValue(keyword));

    return useQuery({
        queryKey: computed(() => albumKey.list(resolvedFamilyId, resolvedKeyword, normalizedParams)),
        queryFn: () => albumService.getByFamilyId(resolvedFamilyId.value!, resolvedKeyword, normalizedParams),
        enabled
    });
};

export const useAlbumQuery = (
    albumId: MaybeRefOrGetter<number | null | undefined>
) => {
    const enabled = computed(() => !!toValue(albumId));
    const resolvedAlbumId = computed(() => toValue(albumId));

    return useQuery({
        queryKey: computed(() => albumKey.detail(resolvedAlbumId)),
        queryFn: () => albumService.getById(resolvedAlbumId.value!),
        enabled
    });
};

export const useAlbumMediaQuery = (
    albumId: MaybeRefOrGetter<number | null | undefined>,
    mediaType: MaybeRefOrGetter<string | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>
) => {
    const enabled = computed(() => !!toValue(albumId));
    const normalizedParams = computed(() => normalizeParams(params));
    const resolvedMediaType = computed(() => toValue(mediaType));
    const resolvedAlbumId = computed(() => toValue(albumId));

    return useQuery({
        queryKey: computed(() => albumKey.mediaList(resolvedAlbumId, resolvedMediaType, normalizedParams)),
        queryFn: () => albumService.getMediaByAlbumId(resolvedAlbumId.value!, resolvedMediaType, normalizedParams),
        enabled
    });
};

export const useCreateAlbumMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            familyId,
            data
        }: {
            familyId: MaybeRefOrGetter<number | null | undefined>;
            data: AlbumReq;
        }) => albumService.create(familyId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: albumKey.all });
        }
    });
};

export const useUpdateAlbumMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            albumId,
            data
        }: {
            albumId: MaybeRefOrGetter<number | null | undefined>;
            data: AlbumReq;
        }) => albumService.update(albumId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: albumKey.all });
        }
    });
};

export const useDeleteAlbumMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (albumId: MaybeRefOrGetter<number | null | undefined>) =>
            albumService.deleteById(albumId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: albumKey.all });
        }
    });
};

export const useUploadAlbumMediaMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            albumId,
            file
        }: {
            albumId: MaybeRefOrGetter<number | null | undefined>;
            file: File;
        }) => albumService.uploadMedia(albumId, file),
        onSuccess: (_res, variables) => {
            queryClient.invalidateQueries({ queryKey: albumKey.detail(variables.albumId) });
            queryClient.invalidateQueries({ queryKey: albumKey.mediaLists() });
        }
    });
};

export const useUploadMultipleAlbumMediaMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            albumId,
            files
        }: {
            albumId: MaybeRefOrGetter<number | null | undefined>;
            files: File[];
        }) => albumService.uploadMultipleMedia(albumId, files),
        onSuccess: (_res, variables) => {
            queryClient.invalidateQueries({ queryKey: albumKey.detail(variables.albumId) });
            queryClient.invalidateQueries({ queryKey: albumKey.mediaLists() });
        }
    });
};

export const useDeleteAlbumMediaMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            mediaId
        }: {
            mediaId: MaybeRefOrGetter<number | null | undefined>;
        }) => albumService.deleteMediaById(mediaId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: albumKey.all });
            queryClient.invalidateQueries({ queryKey: albumKey.mediaLists() });
        }
    });
};
