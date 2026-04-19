export interface CreateFamilyInvitationReq {
    invitedEmail: string;
    roleName: string;
    message: string;
}

export type FamilyInvitationStatus =
    | "PENDING"
    | "ACCEPTED"
    | "DECLINED"
    | "EXPIRED"
    | "CANCELED"

export interface InviteInvitationMemberRes {
    familyInvitationId: number
    familyName: string
    invitedEmail: string
    invitedByAccountId: number
    message: string
    invitationStatus: FamilyInvitationStatus
    inviteToken: string
    createdAt: string
    expiredAt: string
}