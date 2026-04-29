import api from "./api.base";
import type { ApiResponse } from "@/types/api-response.types";
import type { CreateFamilyInvitationReq, InviteInvitationMemberRes } from "@/types/family/family-invitation.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";

export const familyInvitationService = {
    getMySendInvitations: async (params?: PageParams): Promise<ApiResponse<PageResponse<InviteInvitationMemberRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<InviteInvitationMemberRes>>>('/family-invitations/sent', { params });
        return res.data;
    },

    getMyReceivedInvitations: async (params?: PageParams): Promise<ApiResponse<PageResponse<InviteInvitationMemberRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<InviteInvitationMemberRes>>>('/family-invitations/received', { params });
        return res.data;
    },

    inviteMember: async (familyId: number, data: CreateFamilyInvitationReq): Promise<ApiResponse<InviteInvitationMemberRes>> => {
        const res = await api.post<ApiResponse<InviteInvitationMemberRes>>(`/family-invitations/${familyId}/invite`, data);
        return res.data;
    },

    acceptInvitation: async (token: string): Promise<ApiResponse<void>> => {
        const res = await api.post<ApiResponse<void>>(`/family-invitations/accept/${token}`);
        return res.data;
    },

    rejectInvitation: async (token: string): Promise<ApiResponse<void>> => {
        const res = await api.post<ApiResponse<void>>(`/family-invitations/reject/${token}`);
        return res.data;
    },

    cancelInvitation: async (invitationId: number): Promise<ApiResponse<void>> => {
        const res = await api.post<ApiResponse<void>>(`/family-invitations/${invitationId}/cancel`);
        return res.data;
    }
}