import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { computed, toValue, unref, type MaybeRef, type MaybeRefOrGetter } from "vue"
import { familyEventService } from "@/services/family_event.service"
import { QUERY_KEYS } from "@/hooks/keys/query-keys"
import { notify } from "@/utils/notify"
import type { ApiResponse } from "@/types/api-response.types"
import type { PageParams, PageParamsEvents } from "@/types/page-response.types"
import type {
    FamilyEventReq,
    FamilyEventRes,
    UpdateFamilyEventReq
} from "@/types/family/family-event.types"

function normalizeParams(params?: MaybeRef<PageParams>) {
    const p = unref(params)

    return {
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "createdAt,desc",
        keyword: (p as PageParamsEvents)?.keyword ?? "",
        option: (p as PageParamsEvents)?.option ?? "ALL"
    }
}

type CreateEventVariables = {
    familyId: number
    data: FamilyEventReq
}

type UpdateEventVariables = {
    familyId: number
    eventId: number
    data: UpdateFamilyEventReq
}

type DeleteEventVariables = {
    familyId: number
    eventId: number
}

export function useFamilyEventsByFamilyQuery(
    familyId: MaybeRefOrGetter<number | null | undefined>,
    params?: MaybeRef<PageParamsEvents>
) {
    const resolvedFamilyId = computed(() => toValue(familyId))
    const resolvedParams = computed(() => normalizeParams(params))

    return useQuery({
        queryKey: computed(() =>
            QUERY_KEYS.FAMILY_EVENT.listByFamily(resolvedFamilyId.value ?? "unknown", resolvedParams.value)
        ),
        queryFn: () =>
            familyEventService.getEventsByFamily(resolvedFamilyId.value!, resolvedParams.value),
        enabled: computed(() => !!resolvedFamilyId.value || resolvedParams.value.page > 0 || resolvedParams.value.size > 0 || !!resolvedParams.value.sort),
        staleTime: 30_000,
        placeholderData: (prev) => prev
    })
}

export function useFamilyEventByIdQuery(eventId: MaybeRefOrGetter<number | null | undefined>) {
    const resolvedEventId = computed(() => toValue(eventId))

    return useQuery({
        queryKey: computed(() => QUERY_KEYS.FAMILY_EVENT.detail(resolvedEventId.value ?? "unknown")),
        queryFn: () => familyEventService.getEventById(resolvedEventId.value!),
        enabled: computed(() => !!resolvedEventId.value),
        staleTime: 30_000
    })
}


export function useCreateFamilyEventMutation() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<FamilyEventRes>, Error, CreateEventVariables>({
        mutationFn: ({ familyId, data }) => familyEventService.createEvent(familyId, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAMILY_EVENT.familyList(variables.familyId)
            })

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAMILY_EVENT.searchList()
            })

            notify.success("Thông báo", "Tạo sự kiện thành công")
        },

        onError: () => {
            notify.error("Thông báo", "Tạo sự kiện thất bại")
        }
    })
}

export function useUpdateFamilyEventMutation() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<FamilyEventRes>, Error, UpdateEventVariables>({
        mutationFn: ({ familyId, eventId, data }) =>
            familyEventService.updateEvent(familyId, eventId, data),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAMILY_EVENT.familyList(variables.familyId)
            })

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAMILY_EVENT.detail(variables.eventId)
            })

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAMILY_EVENT.searchList()
            })

            notify.success("Thông báo", "Cập nhật sự kiện thành công")
        },

        onError: () => {
            notify.error("Thông báo", "Cập nhật sự kiện thất bại")
        }
    })
}

export function useDeleteFamilyEventMutation() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<void>, Error, DeleteEventVariables>({
        mutationFn: ({ familyId, eventId }) =>
            familyEventService.deleteEvent(familyId, eventId),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAMILY_EVENT.familyList(variables.familyId)
            })

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAMILY_EVENT.searchList()
            })

            queryClient.removeQueries({
                queryKey: QUERY_KEYS.FAMILY_EVENT.detail(variables.eventId)
            })

            notify.success("Thông báo", "Xóa sự kiện thành công")
        },

        onError: () => {
            notify.error("Thông báo", "Xóa sự kiện thất bại")
        }
    })
}
