import { permissionService } from "@/services/permission.service";
import type { CreatePermissionReq, UpdatePermissionReq } from "@/types/auth/permission.types";
import type { PageParams } from "@/types/page-response.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export const permissionKey = {
    all: ['permissions'] as const,
    lists: () => [...permissionKey.all, 'list'] as const,
    list: (
        keyword?: MaybeRefOrGetter<string | null | undefined>,
        scopeType?: MaybeRefOrGetter<string | null | undefined>,
        params?: MaybeRefOrGetter<PageParams>
    ) => [
            ...permissionKey.lists(),
            toValue(keyword) || '',
            toValue(scopeType) || '',
            toValue(params)?.page ?? 0,
            toValue(params)?.size ?? 10,
            toValue(params)?.sort ?? ''
        ],
    details: () => [...permissionKey.all, 'detail'] as const,
    detail: (permissionName: MaybeRefOrGetter<string | null | undefined>) =>
        [
            ...permissionKey.details(),
            toValue(permissionName)
        ] as const
};

export const usePermissionsQuery = () => {
    return useQuery({
        queryKey: permissionKey.lists(),
        queryFn: () => permissionService.getAll()
    });
};

export const usePermissionsPagedQuery = (
    keyword?: MaybeRefOrGetter<string | null | undefined>,
    scopeType?: MaybeRefOrGetter<string | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>
) => {
    const resolvedKeyword = computed(() => toValue(keyword));
    const resolvedScope = computed(() => toValue(scopeType));
    const resolvedParams = computed(() => {
        const p = toValue(params);
        return {
            page: p?.page ?? 0,
            size: p?.size ?? 10,
            sort: p?.sort ?? "name,asc"
        };
    });

    return useQuery({
        queryKey: computed(() => permissionKey.list(resolvedKeyword, resolvedScope, resolvedParams)),
        queryFn: () => permissionService.getPaged(resolvedKeyword, resolvedScope, resolvedParams)
    });
};

export const usePermissionQuery = (permissionName: MaybeRefOrGetter<string | null | undefined>) => {
    const enabled = computed(() => !!toValue(permissionName));
    const resolvedName = computed(() => toValue(permissionName));

    return useQuery({
        queryKey: computed(() => permissionKey.detail(resolvedName)),
        queryFn: () => permissionService.getByName(resolvedName.value!),
        enabled: enabled
    });
};

export const useCreatePermissionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePermissionReq) => permissionService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: permissionKey.all });
        }
    });
};

export const useUpdatePermissionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            permissionName,
            data
        }: {
            permissionName: string;
            data: UpdatePermissionReq;
        }) => permissionService.update(permissionName, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: permissionKey.all });
        }
    });
};

export const useDeletePermissionMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (permissionName: string) => permissionService.deleteByName(permissionName),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: permissionKey.all });
        }
    });
};
