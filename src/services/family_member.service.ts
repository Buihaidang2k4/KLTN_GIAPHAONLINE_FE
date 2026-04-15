import type { FamilyMemberRes } from "@/types/family/family-member";
import api from "./api.base";
import type { ApiResponse } from "@/types/api-response";

export const familyMemberService = {

    getFamilyMembersByFamilyId: async (familyId: number): Promise<ApiResponse<FamilyMemberRes[]>> => {
        const res = await api.get<ApiResponse<FamilyMemberRes[]>>(`/families-members/${familyId}`);
        return res.data;
    },

    removeMember: async (familyId: number, targetAccountId: number, actorAccountId: number): Promise<ApiResponse<void>> => {
        const res = await api.delete(`/families-members/${familyId}/accounts/${targetAccountId}?actorAccountId=${actorAccountId}`);
        return res.data;
    }
}
