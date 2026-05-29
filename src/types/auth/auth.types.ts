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
export interface RegisterRes {
    accountId: number;
    email: string;
    phoneNumber: string;
    fullName: string;
    avatarPath: string | null;
    avatarUrl: string | null;
    accountStatus: string;
    lockReason: string | null;
    lockedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterByInvitationReq {
    fullName: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}

export interface FamilyRes {
    familyId: number;
    slug: string;
    familyName: string;
    description?: string | null;
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


export interface ResetPasswordReq {
    otp: string;
    newPassword: string;
    confirmPassword: string;
}