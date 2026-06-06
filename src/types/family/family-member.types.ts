
export interface FamilyMember {
    id: number
    name: string
    email: string
    role: 'Chủ nhà' | 'Thành viên'
    avatar: string
    status: 'ACTIVE' | 'LEFT' | 'REMOVED' | 'BLOCKED'
}

export interface FamilyMemberRes {
    familyId: number;
    accountId: number;
    fullName: string;
    email: string;
    roleName: string;
    status: 'ACTIVE' | 'LEFT' | 'REMOVED' | 'BLOCKED';
    joinedAt: string;
    removedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export type FamilyMemberRoleType = 'FAMILY_ADMIN' | 'FAMILY_VIEWER' | 'FAMILY_EDITOR';

export interface UpdateFamilyMemberRoleReq {
    roleName: FamilyMemberRoleType
}