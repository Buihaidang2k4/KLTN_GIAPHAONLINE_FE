import api from "./api.base"
import type { ApiResponse } from "@/types/api-response.types"
import type { PageParamsEvents, PageResponse } from "@/types/page-response.types"
import type {
    FamilyEventReq,
    FamilyEventRes,
    UpdateFamilyEventReq
} from "@/types/family/family-event.types"

export const familyEventService = {
    createEvent: async (
        familyId: number,
        data: FamilyEventReq
    ): Promise<ApiResponse<FamilyEventRes>> => {
        const res = await api.post<ApiResponse<FamilyEventRes>>("/family-events", data, {
            params: { familyId }
        })
        return res.data
    },

    updateEvent: async (
        familyId: number,
        eventId: number,
        data: UpdateFamilyEventReq
    ): Promise<ApiResponse<FamilyEventRes>> => {
        const res = await api.put<ApiResponse<FamilyEventRes>>(
            `/family-events/family/${familyId}/event/${eventId}`,
            data
        )
        return res.data
    },

    deleteEvent: async (
        familyId: number,
        eventId: number
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(
            `/family-events/family/${familyId}/event/${eventId}`
        )
        return res.data
    },

    getEventsByFamily: async (
        familyId: number,
        params?: PageParamsEvents
    ): Promise<ApiResponse<PageResponse<FamilyEventRes>>> => {
        const res = await api.get<ApiResponse<PageResponse<FamilyEventRes>>>(
            `/family-events/family/${familyId}`,
            { params }
        )
        return res.data
    },

    getEventById: async (
        eventId: number
    ): Promise<ApiResponse<FamilyEventRes>> => {
        const res = await api.get<ApiResponse<FamilyEventRes>>(`/family-events/${eventId}`)
        return res.data
    }
}
