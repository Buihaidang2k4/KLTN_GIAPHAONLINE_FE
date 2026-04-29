export type FamilyEventStatus = "ACTIVE" | "INACTIVE"
export type CalendarType = "SOLAR" | "LUNAR"
export type RepeatType = "NONE" | "YEARLY" | "MONTHLY"
export type ReminderEventType = "DAY_1" | "DAY_3" | "DAY_7" | "DAY_15" | "MONTH_1"

export interface FamilyEventReq {
    eventName: string
    eventTime?: string | null
    solarDate?: string | null
    lunarDate?: string | null
    location?: string | null
    locationMapUrl?: string | null
    note?: string | null
    status?: FamilyEventStatus | null
    calendarType?: CalendarType | null
    repeatType?: RepeatType | null
    reminderType?: ReminderEventType | null
}

export interface UpdateFamilyEventReq {
    eventName?: string | null
    eventTime?: string | null
    solarDate?: string | null
    lunarDate?: string | null
    calendarType?: CalendarType | null
    repeatType?: RepeatType | null
    reminderType?: ReminderEventType | null
    status?: FamilyEventStatus | string
    locationMapUrl?: string | null
    location?: string | null
    note?: string | null
}

export interface FamilyEventRes {
    familyEventId: number
    familyId: number
    createdByAccountId: number
    eventName: string
    eventTime?: string | null
    solarDate?: string | null
    lunarDate?: string | null
    status?: FamilyEventStatus | null
    calendarType?: CalendarType | null
    repeatType?: RepeatType | null
    reminderType?: ReminderEventType | null
    location?: string | null
    locationMapUrl?: string | null
    note?: string | null
    createdAt?: string
    updatedAt?: string
}
