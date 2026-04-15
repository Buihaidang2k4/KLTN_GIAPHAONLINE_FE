import type { FamilyRes } from "@/types/auth/auth";
import type { RoleRes } from "@/types/auth/auth";

export interface AccountDetailsRes {
    accountId: number;
    email: string;
    fullName: string;
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