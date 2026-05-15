import { roleService } from "@/services/role.service";
import type { CreateRoleReq, UpdateRoleReq } from "@/types/auth/role.types";
import type { PageParams } from "@/types/page-response.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export const roleKey = {
  all: ["roles"] as const,

  lists: () => [...roleKey.all, "list"] as const,

  list: (params?: MaybeRefOrGetter<PageParams>) =>
    [...roleKey.lists(), toValue(params)?.page ?? 0, toValue(params)?.size ?? 10, toValue(params)?.sort ?? ""] as const,

  myRoles: () => [...roleKey.all, "me"] as const,

  myRolesByFamily: (familyId: MaybeRefOrGetter<number | null | undefined>) =>
    [...roleKey.myRoles(), "family", toValue(familyId)] as const,
};

// ==================== Queries ====================

export const useRolesQuery = (params?: MaybeRefOrGetter<PageParams>) => {
  const normalizedParams = computed(() => ({
    page: toValue(params)?.page ?? 0,
    size: toValue(params)?.size ?? 10,
    sort: toValue(params)?.sort ?? "name,asc",
  }));

  return useQuery({
    queryKey: computed(() => roleKey.list(normalizedParams)),
    queryFn: () => roleService.getAll(normalizedParams),
  });
};

export const useMyRolesQuery = () => {
  return useQuery({
    queryKey: roleKey.myRoles(),
    queryFn: () => roleService.getMyRoles(),
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
      queryClient.invalidateQueries({ queryKey: roleKey.lists() });
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
      queryClient.invalidateQueries({ queryKey: roleKey.lists() });
    },
  });
};
