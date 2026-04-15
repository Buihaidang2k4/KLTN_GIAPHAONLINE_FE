export interface InviteInvitationMemberRes {
    familyInvitationId: number;
    familyName: string;
    invitedEmail: string;
    invitedByAccountId: number;
    invitationStatus: string;
    inviteToken: string;
    createdAt: string;
    expiredAt: string;
}


export interface CreateFamilyInvitationReq {
    invitedEmail: string;
    roleName: string;
    message: string;
}
