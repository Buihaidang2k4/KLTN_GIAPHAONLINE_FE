import type { ApiResponse } from "@/types/api-response.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import type { CreateRoleReq, RoleRes, UpdateRoleReq } from "@/types/auth/role.types";
import api from "./api.base";
import { toValue, type MaybeRefOrGetter } from "vue";

export const roleService = {

  getAll: async (
    keyword?: MaybeRefOrGetter<string | null | undefined>,
    scopeType?: MaybeRefOrGetter<string | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>
  ): Promise<ApiResponse<PageResponse<RoleRes>>> => {
    const queryParams: Record<string, any> = {
      ...toValue(params),
    };

    const resolvedKeyword = toValue(keyword);
    if (resolvedKeyword) {
      queryParams.keyword = resolvedKeyword;
    }

    const resolvedScope = toValue(scopeType);
    if (resolvedScope && resolvedScope !== "ALL") {
      queryParams.scopeType = resolvedScope;
    }

    const res = await api.get<ApiResponse<PageResponse<RoleRes>>>("/roles", {
      params: queryParams,
    });
    return res.data;
  },

  getMyRoles: async (): Promise<ApiResponse<RoleRes[]>> => {
    const res = await api.get<ApiResponse<RoleRes[]>>("/roles/me");
    return res.data;
  },

  isSystemAccount: async (): Promise<ApiResponse<boolean>> => {
    const res = await api.get<ApiResponse<boolean>>("/roles/me/is-system");
    return res.data;
  },

  getMyRolesByFamily: async (
    familyId: MaybeRefOrGetter<number | null | undefined>
  ): Promise<ApiResponse<RoleRes[]>> => {
    const res = await api.get<ApiResponse<RoleRes[]>>(
      `/roles/me/family/${toValue(familyId)}`
    );
    return res.data;
  },

  create: async (data: CreateRoleReq): Promise<ApiResponse<RoleRes>> => {
    const res = await api.post<ApiResponse<RoleRes>>("/roles", data);
    return res.data;
  },

  addPermission: async (
    roleName: MaybeRefOrGetter<string>,
    data: UpdateRoleReq
  ): Promise<ApiResponse<RoleRes>> => {
    const res = await api.put<ApiResponse<RoleRes>>(
      `/roles/add-permission/${toValue(roleName)}`,
      data
    );
    return res.data;
  },

  removePermission: async (
    roleName: MaybeRefOrGetter<string>,
    data: UpdateRoleReq
  ): Promise<ApiResponse<void>> => {
    const res = await api.delete<ApiResponse<void>>(
      `/roles/remove-permission/${toValue(roleName)}`,
      { data }
    );
    return res.data;
  },

  deleteRole: async (roleName: MaybeRefOrGetter<string>): Promise<ApiResponse<void>> => {
    const res = await api.delete<ApiResponse<void>>(
      `/roles/${toValue(roleName)}`
    );
    return res.data;
  },
};
