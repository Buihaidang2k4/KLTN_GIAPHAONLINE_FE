export interface LoginReq {
    email: string;
    password: string;
}

export interface LoginRes {
    exp: String;
}

export interface RegisterReq {
    email: string;
    phoneNumber: string;
    familyName: string;
    fullName: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterByInvitationReq {
    tokenInvitation: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    password: string;
    confirmPassword: string;
    invitationToken: string;
}

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

export interface FamilyRes {
    familyId: number;
    familyName: string;
    description?: string;
}

export interface RoleRes {
    name: string;
    scopeType: string;
    description: string;
    permissions: PermissionRes[];
}

export interface PermissionRes {
    name: string;
    scopeType: string;
    description: string;
}
