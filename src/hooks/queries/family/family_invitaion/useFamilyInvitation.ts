import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { familyInvitationService } from "@/services/family_invitation.service"
import type { PageParams } from "@/types/page-response.types"
import { computed, toValue, unref, type MaybeRef, type MaybeRefOrGetter, type Ref } from "vue"
import type {
    CreateFamilyInvitationReq,
    InviteInvitationMemberRes
} from "@/types/family/family-invitation.types"
import type { ApiResponse } from "@/types/api-response.types"
import { notify } from "@/utils/notify"
import { QUERY_KEYS } from "@/hooks/keys/query-keys"

// ==================== Query Keys ====================

export const invitationKey = {
    all: ['family-invitation'] as const,

    receiveds: () => [...invitationKey.all, 'received'] as const,
    received: (params?: MaybeRefOrGetter<PageParams>) => [
        ...invitationKey.receiveds(),
        toValue(params)?.page ?? 0,
        toValue(params)?.size ?? 10,
        toValue(params)?.sort ?? '',
    ] as const,

    sents: () => [...invitationKey.all, 'sent'] as const,
    sent: (params?: MaybeRefOrGetter<PageParams>) => [
        ...invitationKey.sents(),
        toValue(params)?.page ?? 0,
        toValue(params)?.size ?? 10,
        toValue(params)?.sort ?? '',
    ] as const,
}

// ==================== Helpers ====================

function normalizeParams(params?: MaybeRef<PageParams>) {
    const p = unref(params)

    return {
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "createdAt,desc"
    }
}

// ==================== Queries ====================

export function useInvitationReceivedQuery(params?: Ref<PageParams>) {
    const resolved = computed(() => normalizeParams(params))

    return useQuery({
        queryKey: computed(() => invitationKey.received(resolved.value)),
        queryFn: () =>
            familyInvitationService.getMyReceivedInvitations(resolved.value),
        staleTime: 30_000,
        placeholderData: (prevData) => prevData
    })
}

export function useInvitationSentQuery(params?: MaybeRef<PageParams>) {
    const resolved = computed(() => normalizeParams(params))

    return useQuery({
        queryKey: computed(() => invitationKey.sent(resolved.value)),
        queryFn: () =>
            familyInvitationService.getMySendInvitations(resolved.value),
        staleTime: 30_000,
        placeholderData: (prevData) => prevData
    })
}

// ==================== Mutations ====================

type InviteMemberVariables = {
    familyId: number
    data: CreateFamilyInvitationReq
}

export function useInviteMemberMutation() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<InviteInvitationMemberRes>, Error, InviteMemberVariables>({
        mutationFn: ({ familyId, data }) =>
            familyInvitationService.inviteMember(familyId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: invitationKey.sents()
            })

            notify.success("Thông báo", "Gửi lời mời thành công")
        },
        retry: false
    })
}

export function useAcceptInvitationMutation() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<void>, Error, string>({
        mutationFn: (token: string) => familyInvitationService.acceptInvitation(token),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: invitationKey.receiveds()
            })

            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.FAMILY.all
            })

            notify.success("Thông báo", "Chấp nhận lời mời thành công")
        }
    })
}

export function useRejectInvitationMutation() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<void>, Error, string>({
        mutationFn: (token) => familyInvitationService.rejectInvitation(token),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: invitationKey.all
            })

            notify.success("Thông báo", "Từ chối lời mời thành công")
        }
    })
}

export function useCancelInvitationMutation() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<void>, Error, number>({
        mutationFn: (invitationId) =>
            familyInvitationService.cancelInvitation(invitationId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: invitationKey.sents()
            })

            notify.success("Thông báo", "Hủy lời mời thành công")
        }
    })
}