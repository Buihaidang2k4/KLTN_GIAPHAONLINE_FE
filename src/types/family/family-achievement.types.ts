export type AchievementType =
    | "EDUCATION"
    | "AWARD"
    | "CERTIFICATE"
    | "TITLE"
    | "OTHER"

export interface FamilyAchievementReq {
    personName: string
    achievementType: AchievementType
    name: string
    rank?: string
    organization?: string
    achievedDate?: string
    description?: string
}

export interface UpdateFamilyAchievementReq {
    personName?: string
    achievementType?: AchievementType
    name?: string
    rank?: string
    organization?: string
    achievedDate?: string
    description?: string
}

export interface FamilyAchievementRes {
    achievementId: number
    familyId: number
    personName: string
    achievementType: AchievementType
    name: string
    rank?: string
    organization?: string
    achievedDate?: string
    description?: string
    evidencePath?: string
    evidenceUrl?: string
    createdAt: string
    updatedAt: string | null
}