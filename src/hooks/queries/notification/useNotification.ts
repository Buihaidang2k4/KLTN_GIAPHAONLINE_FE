import { notificationService } from "@/services/notification.service";
import type { PageParams } from "@/types/page-response.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export const notificationKey = {
    all: ['notification'] as const,

    lists: () => [...notificationKey.all, 'list'] as const,

    list: (
        params?: MaybeRefOrGetter<PageParams>,
        isUnread?: boolean
    ) => [
            ...notificationKey.lists(),
            isUnread ? 'unread' : 'all',
            toValue(params)?.page ?? 0,
            toValue(params)?.size ?? 10,
            toValue(params)?.sort ?? ''
        ],

    counts: () => [...notificationKey.all, 'count'] as const,

    count: (recipientAccountId: MaybeRefOrGetter<number | null | undefined>) =>
        [
            ...notificationKey.counts(),
            toValue(recipientAccountId)
        ] as const
}

function normalizeParams(params?: MaybeRefOrGetter<PageParams>) {
    const p = toValue(params)
    return {
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "createdAt,desc",
    }
}

export const useNotificationsQuery = (
    params?: MaybeRefOrGetter<PageParams>
) => {
    const normalizedParams = computed(() => normalizeParams(params))

    return useQuery({
        queryKey: computed(() => notificationKey.list(normalizedParams)),
        queryFn: () => notificationService.getNotifications(normalizedParams),
    })
}


export const useUnreadCountQuery = (
    recipientAccountId: MaybeRefOrGetter<number | null | undefined>
) => {
    const enabled = computed(() => !!toValue(recipientAccountId))
    const resolvedRecipientId = computed(() => toValue(recipientAccountId))

    return useQuery({
        queryKey: computed(() => notificationKey.count(resolvedRecipientId)),
        queryFn: () => notificationService.countUnreadNotifications(resolvedRecipientId),
        enabled: enabled
    })
}

export const useMarkAsReadMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            notificationId,
        }: {
            notificationId: number
        }) => notificationService.markAsRead(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKey.all })
        }
    })
}

export const useMarkAllAsReadMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => notificationService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKey.all })
        }
    })
}

export const useDeleteNotificationMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            notificationId,
        }: {
            notificationId: number
        }) => notificationService.deleteNotification(notificationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKey.all })
        }
    })
}
