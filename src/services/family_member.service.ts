import type { FamilyMemberRes } from "@/types/family/family-member.types";
import api from "./api.base";
import type { ApiResponse } from "@/types/api-response.types";
import { toValue, type MaybeRefOrGetter } from "vue";

export const familyMemberService = {

    getFamilyMembersByFamilyId: async (familyId: MaybeRefOrGetter<number | null | undefined>): Promise<ApiResponse<FamilyMemberRes[]>> => {
        const res = await api.get<ApiResponse<FamilyMemberRes[]>>(`/families-members/${toValue(familyId)}`);
        return res.data;
    },

    removeMember: async (familyId: MaybeRefOrGetter<number | null | undefined>, targetAccountId: MaybeRefOrGetter<number | null | undefined>, actorAccountId: MaybeRefOrGetter<number | null | undefined>): Promise<ApiResponse<void>> => {
        const res = await api.delete(`/families-members/${toValue(familyId)}/accounts/${toValue(targetAccountId)}?actorAccountId=${toValue(actorAccountId)}`);
        return res.data;
    }
}
