import { roleService } from "@/services/role.service";
import type { CreateRoleReq, UpdateRoleReq } from "@/types/auth/role.types";
import type { PageParams } from "@/types/page-response.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export const roleKey = {
  all: ["roles"] as const,

  lists: () => [...roleKey.all, "list"] as const,

  list: (
    keyword?: MaybeRefOrGetter<string | null | undefined>,
    scopeType?: MaybeRefOrGetter<string | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>
  ) =>
    [
      ...roleKey.lists(),
      toValue(keyword) || "",
      toValue(scopeType) || "",
      toValue(params)?.page ?? 0,
      toValue(params)?.size ?? 10,
      toValue(params)?.sort ?? "name,asc"
    ] as const,

  myRoles: () => [...roleKey.all, "me"] as const,

  isSystem: () => [...roleKey.all, "me", "is-system"] as const,

  myRolesByFamily: (familyId: MaybeRefOrGetter<number | null | undefined>) =>
    [...roleKey.myRoles(), "family", toValue(familyId)] as const,
};

// ==================== Queries ====================

export const useRolesQuery = (
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
      sort: p?.sort ?? "name,asc",
    };
  });

  return useQuery({
    queryKey: computed(() => roleKey.list(resolvedKeyword, resolvedScope, resolvedParams)),
    queryFn: () => roleService.getAll(resolvedKeyword, resolvedScope, resolvedParams),
  });
};

export const useMyRolesQuery = () => {
  return useQuery({
    queryKey: roleKey.myRoles(),
    queryFn: () => roleService.getMyRoles(),
  });
};

export const useIsSystemAccountQuery = () => {
  return useQuery({
    queryKey: roleKey.isSystem(),
    queryFn: () => roleService.isSystemAccount(),
  });
};

export const useMyRolesByFamilyQuery = (
  familyId: MaybeRefOrGetter<number | null | undefined>
) => {
  const enabled = computed(() => !!toValue(familyId));
  const resolvedId = computed(() => toValue(familyId));

  return useQuery({
    queryKey: computed(() => roleKey.myRolesByFamily(resolvedId)),
    queryFn: () => roleService.getMyRolesByFamily(resolvedId.value),
    enabled,
  });
};

// ==================== Mutations ====================

export const useCreateRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRoleReq) => roleService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKey.all });
    },
  });
};

export const useAddPermissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleName, data }: { roleName: string; data: UpdateRoleReq }) =>
      roleService.addPermission(roleName, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKey.all });
    },
  });
};

export const useRemovePermissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roleName, data }: { roleName: string; data: UpdateRoleReq }) =>
      roleService.removePermission(roleName, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKey.all });
    },
  });
};

export const useDeleteRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleName: string) => roleService.deleteRole(roleName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKey.all });
    },
  });
};
