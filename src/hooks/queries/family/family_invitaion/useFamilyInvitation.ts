import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query"
import { familyInvitationService } from "@/services/family_invitation.service"
import type { PageParams } from "@/types/page-response"
import { computed, unref, type MaybeRef, type Ref } from "vue"
import type {
    CreateFamilyInvitationReq,
    InviteInvitationMemberRes
} from "@/types/family/family-invitation"
import type { ApiResponse } from "@/types/api-response"
import { notify } from "@/utils/notify"
import { QUERY_KEYS } from "@/hooks/keys/query-keys"

function normalizeParams(params?: MaybeRef<PageParams>) {
    const p = unref(params)

    return {
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "createdAt,desc"
    }
}

export function useInvitationReceivedQuery(params?: Ref<PageParams>) {
    const resolved = computed(() => normalizeParams(params))

    return useQuery({
        queryKey: computed(() => QUERY_KEYS.INVITATION.received(resolved.value)),
        queryFn: () =>
            familyInvitationService.getMyReceivedInvitations(resolved.value),
        staleTime: 30_000,
        placeholderData: (prevData) => prevData
    })
}

export function useInvitationSentQuery(params?: MaybeRef<PageParams>) {
    const resolved = computed(() => normalizeParams(params))

    return useQuery({
        queryKey: computed(() => QUERY_KEYS.INVITATION.sent(resolved.value)),
        queryFn: () =>
            familyInvitationService.getMySendInvitations(resolved.value),
        staleTime: 30_000,
        placeholderData: (prevData) => prevData
    })
}

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
                queryKey: QUERY_KEYS.INVITATION.sentList()
            })

            notify.success("Thông báo", "Gửi lời mời thành công")
        }
        , retry: false
    })
}

export function useAcceptInvitationMutation() {
    const queryClient = useQueryClient()

    return useMutation<ApiResponse<void>, Error, string>({
        mutationFn: (token: string) => familyInvitationService.acceptInvitation(token),

        onSuccess: (_, token) => {
            // queryClient.invalidateQueries({
            //     queryKey: QUERY_KEYS.INVITATION.sentList()
            // })
            // queryClient.invalidateQueries({
            //     queryKey: QUERY_KEYS.INVITATION.receivedList(),
            //     refetchType: "active"
            // })

            // queryClient.invalidateQueries({
            //     queryKey: QUERY_KEYS.FAMILY.list()
            // })

            queryClient.setQueryData(
                QUERY_KEYS.INVITATION.receivedList(),

                (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        content: old.content.map((i: any) => {
                            i.token === token ?
                                { ...i, status: "ACCEPTED" }
                                : i
                        })

                    }
                }
            )

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
                queryKey: QUERY_KEYS.INVITATION.sent()
            })
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.INVITATION.received()
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
                queryKey: QUERY_KEYS.INVITATION.sent()
            })

            notify.success("Thông báo", "Hủy lời mời thành công")

        }
    })
}