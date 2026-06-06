import { notificationService } from "@/services/notification.service";
import type { PageParams } from "@/types/page-response.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export const notificationKey = {
    all: ['notification'] as const,

    lists: () => [...notificationKey.all, 'list'] as const,

    list: (
        recipientAccountId: MaybeRefOrGetter<number | null | undefined>,
        params?: MaybeRefOrGetter<PageParams>,
        isUnread?: boolean
    ) => [
        ...notificationKey.lists(),
        toValue(recipientAccountId),
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
    recipientAccountId: MaybeRefOrGetter<number | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>
) => {
    const enabled = computed(() => !!toValue(recipientAccountId))
    const normalizedParams = computed(() => normalizeParams(params))
    const resolvedRecipientId = computed(() => toValue(recipientAccountId))

    return useQuery({
        queryKey: computed(() => notificationKey.list(resolvedRecipientId, normalizedParams, false)),
        queryFn: () => notificationService.getNotifications(resolvedRecipientId, normalizedParams),
        enabled: enabled
    })
}

export const useUnreadNotificationsQuery = (
    recipientAccountId: MaybeRefOrGetter<number | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>
) => {
    const enabled = computed(() => !!toValue(recipientAccountId))
    const normalizedParams = computed(() => normalizeParams(params))
    const resolvedRecipientId = computed(() => toValue(recipientAccountId))

    return useQuery({
        queryKey: computed(() => notificationKey.list(resolvedRecipientId, normalizedParams, true)),
        queryFn: () => notificationService.getUnreadNotifications(resolvedRecipientId, normalizedParams),
        enabled: enabled
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
            recipientAccountId
        }: {
            notificationId: number
            recipientAccountId: number | null | undefined
        }) => notificationService.markAsRead(notificationId, recipientAccountId),
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
            recipientAccountId
        }: {
            notificationId: number
            recipientAccountId: number | null | undefined
        }) => notificationService.deleteNotification(notificationId, recipientAccountId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: notificationKey.all })
        }
    })
}
