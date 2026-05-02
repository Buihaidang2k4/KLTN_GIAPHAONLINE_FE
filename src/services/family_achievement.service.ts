import type { ApiResponse } from "@/types/api-response.types"
import type {
    FamilyAchievementReq,
    FamilyAchievementRes,
    UpdateFamilyAchievementReq
} from "@/types/family/family-achievement.types"
import { toValue, type MaybeRefOrGetter } from "vue"
import api from "./api.base"
import type { PageParams, PageResponse } from "@/types/page-response.types"

const buildAchievementFormData = (
    data: FamilyAchievementReq | UpdateFamilyAchievementReq,
    evidenceFile?: File | null
) => {
    const formData = new FormData()

    formData.append(
        "data",
        new Blob([JSON.stringify(data)], {
            type: "application/json"
        })
    )

    if (evidenceFile) {
        formData.append("evidence", evidenceFile)
    }

    return formData
}

export const achievementService = {
    create: async (
        familyId: MaybeRefOrGetter<number | null>,
        data: MaybeRefOrGetter<FamilyAchievementReq>,
        evidenceFile?: File | null
    ): Promise<ApiResponse<FamilyAchievementRes>> => {
        const res = await api.post(
            `/families/${toValue(familyId)}/achievements`,
            buildAchievementFormData(toValue(data), evidenceFile)
        )

        return res.data
    },

    update: async (
        familyId: MaybeRefOrGetter<number | null>,
        achievementId: MaybeRefOrGetter<number | null>,
        data: MaybeRefOrGetter<UpdateFamilyAchievementReq>,
        evidenceFile?: File | null
    ): Promise<ApiResponse<FamilyAchievementRes>> => {
        const res = await api.put(
            `/families/${toValue(familyId)}/achievements/${toValue(achievementId)}`,
            buildAchievementFormData(toValue(data), evidenceFile)
        )

        return res.data
    },

    delete: async (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        achievementId: MaybeRefOrGetter<number | null | undefined>
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete(
            `/families/${toValue(familyId)}/achievements/${toValue(achievementId)}`
        )

        return res.data
    },

    getById: async (
        familyId: MaybeRefOrGetter<number | null>,
        achievementId: MaybeRefOrGetter<number | null>
    ): Promise<ApiResponse<FamilyAchievementRes>> => {
        const res = await api.get(
            `/families/${toValue(familyId)}/achievements/${toValue(achievementId)}`
        )

        return res.data
    },

    getByFamily: async (
        familyId: MaybeRefOrGetter<number | null>,
        keyword?: MaybeRefOrGetter<string>,
        params?: PageParams
    ): Promise<ApiResponse<PageResponse<FamilyAchievementRes>>> => {
        const res = await api.get(
            `/families/${toValue(familyId)}/achievements`,
            {
                params: {
                    keyword: toValue(keyword) || "",
                    page: params?.page ?? 0,
                    size: params?.size ?? 10,
                    sort: params?.sort
                }
            }
        )

        return res.data
    }
}