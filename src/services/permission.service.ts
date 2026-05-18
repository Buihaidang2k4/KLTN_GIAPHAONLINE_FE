import type { ApiResponse } from "@/types/api-response.types";
import type { CreatePermissionReq, PermissionRes, UpdatePermissionReq } from "@/types/auth/permission.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import api from "./api.base";
import { toValue, type MaybeRefOrGetter } from "vue";

export const permissionService = {
    getAll: async (): Promise<ApiResponse<PermissionRes[]>> => {
        const res = await api.get<ApiResponse<PermissionRes[]>>('/permissions');
        return res.data;
    },

    getPaged: async (
        keyword?: MaybeRefOrGetter<string | null | undefined>,
        scopeType?: MaybeRefOrGetter<string | null | undefined>,
        params?: MaybeRefOrGetter<PageParams>
    ): Promise<ApiResponse<PageResponse<PermissionRes>>> => {
        const resolvedParams = toValue(params);
        const resolvedScope = toValue(scopeType);
        
        // If resolvedScope is "ALL" or empty, don't pass it to the backend (takes all)
        const scope = resolvedScope && resolvedScope !== "ALL" ? resolvedScope : undefined;

        const res = await api.get<ApiResponse<PageResponse<PermissionRes>>>('/permissions', {
            params: {
                keyword: toValue(keyword) || "",
                scopeType: scope,
                page: resolvedParams?.page ?? 0,
                size: resolvedParams?.size ?? 10,
                sort: resolvedParams?.sort ?? "name,asc"
            }
        });
        return res.data;
    },

    getByName: async (permissionName: MaybeRefOrGetter<string>): Promise<ApiResponse<PermissionRes>> => {
        const res = await api.get<ApiResponse<PermissionRes>>(`/permissions/${toValue(permissionName)}`);
        return res.data;
    },

    create: async (data: MaybeRefOrGetter<CreatePermissionReq>): Promise<ApiResponse<PermissionRes>> => {
        const res = await api.post<ApiResponse<PermissionRes>>('/permissions', toValue(data));
        return res.data;
    },

    update: async (
        permissionName: MaybeRefOrGetter<string>,
        data: MaybeRefOrGetter<UpdatePermissionReq>
    ): Promise<ApiResponse<PermissionRes>> => {
        const res = await api.put<ApiResponse<PermissionRes>>(`/permissions/${toValue(permissionName)}`, toValue(data));
        return res.data;
    },

    deleteByName: async (permissionName: MaybeRefOrGetter<string>): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/permissions/${toValue(permissionName)}`);
        return res.data;
    }
};
