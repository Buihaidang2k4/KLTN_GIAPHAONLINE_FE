import type { FamilyRes } from "@/types/auth/auth.types";
import type { RoleRes } from "@/types/auth/auth.types";

export interface AccountDetailsRes {
    accountId: number;
    email: string;
    fullName: string;
    phoneNumber: string;
    avatarPath: string | null;
    avatarUrl: string | null;
    accountStatus: string;
    lockReason: string | null;
    lockedAt: string | null;
    createdAt: string;
    updatedAt: string;

    roles: RoleRes[];
    families: FamilyRes[];
}

export type AccountStatus = "ACTIVE" | "LOCKED" | "DELETED" | "PENDING"

export interface AccountRes {
    accountId: number;
    email: string;
    phoneNumber: string;
    fullName: string;
    avatarPath: string | null;
    avatarUrl: string | null;
    accountStatus: AccountStatus;
    lockReason: string | null;
    lockedAt: string | null;
    createdAt: string;
    updatedAt: string;
    roles: RoleRes[];
}

export interface CreateAccountReq {
    roleEnums: string;
    fullName: string;
    email: string;
    phoneNumber: string,
    familyName: string,
    password: string,
    rePassword: string
}

export interface ChangePasswordAccountReq {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangeStatusLockReq {
    accountStatus: string;
    lockReason: string | null;
}

export interface UpdateAccountReq {
    fullName: string
    phoneNumber: string
}