
export interface FamilyMember {
    id: number
    name: string
    email: string
    role: 'Chủ nhà' | 'Thành viên'
    avatar: string
    status: 'active' | 'pending'
}

export interface FamilyMemberRes {
    familyId: number;
    accountId: number;
    roleName: string;
    status: 'active' | 'pending';
    joinedAt: string;
    removedAt: string;
    createdAt: string;
    updatedAt: string;
}
