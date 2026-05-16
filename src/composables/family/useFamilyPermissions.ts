import { useMyRolesByFamilyQuery } from "@/hooks/queries/auth/useRoles";
import { notify } from "@/utils/notify";
import { computed, type ComputedRef, type MaybeRefOrGetter } from "vue";

export const FAMILY_PERMISSIONS = {
  // ===== FAMILY ADMIN =====
  FAM_DELETE: "FAM_DELETE",
  FAM_WRITE: "FAM_WRITE",
  FAM_SETTINGS_EDIT: "FAM_SETTINGS_EDIT",
  FAM_MEMBER_MANAGE: "FAM_MEMBER_MANAGE",
  FAM_SUBSCRIPTION_MANAGE: "FAM_SUBSCRIPTION_MANAGE",
  FAM_EXPORT: "FAM_EXPORT",

  // ===== TREE =====
  NODE_WRITE: "NODE_WRITE",
  NODE_DELETE: "NODE_DELETE",
  RELATIONSHIP_MANAGE: "RELATIONSHIP_MANAGE",

  // ===== CONTENT =====
  POST_MANAGE: "POST_MANAGE",
  EVENT_MANAGE: "EVENT_MANAGE",
  ALBUM_MANAGE: "ALBUM_MANAGE",
  CEREMONY_MANAGE: "CEREMONY_MANAGE",
  ACHIEVEMENT_MANAGE: "ACHIEVEMENT_MANAGE",

  // ===== VIEW =====
  SETTINGS_VIEW: "SETTINGS_VIEW",
  FAM_SUBSCRIPTION_VIEW: "FAM_SUBSCRIPTION_VIEW",
  FAM_VIEW_PUBLIC: "FAM_VIEW_PUBLIC",
  POST_VIEW_PUBLIC: "POST_VIEW_PUBLIC",
  ALBUM_VIEW_PUBLIC: "ALBUM_VIEW_PUBLIC",
  EVENT_VIEW_PUBLIC: "EVENT_VIEW_PUBLIC",
  ACHIEVEMENT_VIEW_PUBLIC: "ACHIEVEMENT_VIEW_PUBLIC",
  CEREMONY_VIEW_PUBLIC: "CEREMONY_VIEW_PUBLIC",

  // ===== SUBSCRIPTION =====
  FAM_SUBSCRIPTION_UPGRADE_REQUEST: "FAM_SUBSCRIPTION_UPGRADE_REQUEST",
} as const;

export type FamilyPermission = typeof FAMILY_PERMISSIONS[keyof typeof FAMILY_PERMISSIONS];

export const useFamilyPermissions = (familyId: MaybeRefOrGetter<number | null | undefined>) => {
  const { data: rolesData, isLoading } = useMyRolesByFamilyQuery(familyId);

  const permissionSet = computed<Set<string>>(() => {
    const roles = rolesData.value?.data ?? [];
    const names = roles.flatMap(role => role.permissions?.map(p => p.name) ?? []);
    return new Set(names);
  });

  const has = (permission: FamilyPermission) =>
    computed(() => permissionSet.value.has(permission));

  return {
    isLoading,
    permissionSet,

    // ===== FAMILY =====
    canDeleteFamily: has(FAMILY_PERMISSIONS.FAM_DELETE),
    canWriteFamily: has(FAMILY_PERMISSIONS.FAM_WRITE),
    canEditSettings: has(FAMILY_PERMISSIONS.FAM_SETTINGS_EDIT),
    canManageSubscription: has(FAMILY_PERMISSIONS.FAM_SUBSCRIPTION_MANAGE),
    canExport: has(FAMILY_PERMISSIONS.FAM_EXPORT),

    // ===== TREE =====
    canWriteNode: has(FAMILY_PERMISSIONS.NODE_WRITE),
    canDeleteNode: has(FAMILY_PERMISSIONS.NODE_DELETE),
    canManageRelationship: has(FAMILY_PERMISSIONS.RELATIONSHIP_MANAGE),

    // ===== CONTENT =====
    canManageMember: has(FAMILY_PERMISSIONS.FAM_MEMBER_MANAGE),
    canManagePost: has(FAMILY_PERMISSIONS.POST_MANAGE),
    canManageEvent: has(FAMILY_PERMISSIONS.EVENT_MANAGE),
    canManageAlbum: has(FAMILY_PERMISSIONS.ALBUM_MANAGE),
    canManageCeremony: has(FAMILY_PERMISSIONS.CEREMONY_MANAGE),
    canManageAchievement: has(FAMILY_PERMISSIONS.ACHIEVEMENT_MANAGE),

    // ===== VIEW =====
    canViewSettings: has(FAMILY_PERMISSIONS.SETTINGS_VIEW),
    canViewSubscription: has(FAMILY_PERMISSIONS.FAM_SUBSCRIPTION_VIEW),
    canViewFamily: has(FAMILY_PERMISSIONS.FAM_VIEW_PUBLIC),
    canViewPost: has(FAMILY_PERMISSIONS.POST_VIEW_PUBLIC),
    canViewAlbum: has(FAMILY_PERMISSIONS.ALBUM_VIEW_PUBLIC),
    canViewEvent: has(FAMILY_PERMISSIONS.EVENT_VIEW_PUBLIC),
    canViewAchievement: has(FAMILY_PERMISSIONS.ACHIEVEMENT_VIEW_PUBLIC),
    canViewCeremony: has(FAMILY_PERMISSIONS.CEREMONY_VIEW_PUBLIC),

    // ===== SUBSCRIPTION =====
    canRequestUpgrade: has(FAMILY_PERMISSIONS.FAM_SUBSCRIPTION_UPGRADE_REQUEST),

    // ===== HELPER =====
    withPermission: <T extends (...args: any[]) => any>(
      permission: ComputedRef<boolean>,
      fn: T,
      message = "Bạn không có quyền thực hiện thao tác này"
    ): T => {
      return ((...args: any[]) => {
        if (!permission.value) {
          notify.error("Thông báo", message);
          return;
        }
        return fn(...args);
      }) as T;
    },
  };
};
