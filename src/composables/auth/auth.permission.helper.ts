import type { AccountDetailsRes } from "@/types/account/account.types";

export const getRoleNames = (user: AccountDetailsRes | null | undefined): string[] => {
    return user?.roles?.map(role => role.name) ?? [];
};

export const getPermissionNames = (user: AccountDetailsRes | null | undefined): string[] => {
    if (!user?.roles?.length) return [];

    const permissions = user.roles.flatMap(role =>
        role.permissions?.map(permission => permission.name) ?? []
    );

    return [...new Set(permissions)];
};

export const hasPermission = (
    user: AccountDetailsRes | null | undefined,
    permissionName: string
): boolean => {
    return getPermissionNames(user).includes(permissionName);
};

export const hasAnyPermission = (
    user: AccountDetailsRes | null | undefined,
    permissionNames: string[]
): boolean => {
    const ownedPermissions = getPermissionNames(user);
    return permissionNames.some(permission => ownedPermissions.includes(permission));
};
