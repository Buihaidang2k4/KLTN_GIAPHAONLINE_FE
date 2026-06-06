import type { ApiResponse } from "@/types/api-response.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import type { NotificationRes } from "@/types/notification/notification.types";
import api from "./api.base";
import { toValue, type MaybeRefOrGetter } from "vue";

export const notificationService = {
    getNotifications: async (
        params?: MaybeRefOrGetter<PageParams>
    ): Promise<ApiResponse<PageResponse<NotificationRes>>> => {
        const resolvedParams = toValue(params);
        const res = await api.get<ApiResponse<PageResponse<NotificationRes>>>('/notifications', {
            params: {
                page: resolvedParams?.page ?? 0,
                size: resolvedParams?.size ?? 10,
                sort: resolvedParams?.sort
            }
        });
        return res.data;
    },


    countUnreadNotifications: async (
        recipientAccountId: MaybeRefOrGetter<number | null | undefined>
    ): Promise<ApiResponse<number>> => {
        const res = await api.get<ApiResponse<number>>('/notifications/unread-count', {
            params: {
                recipientAccountId: toValue(recipientAccountId)
            }
        });
        return res.data;
    },

    markAsRead: async (
        notificationId: MaybeRefOrGetter<number>,
    ): Promise<ApiResponse<NotificationRes>> => {
        const res = await api.patch<ApiResponse<NotificationRes>>(`/notifications/${toValue(notificationId)}/read`);
        return res.data;
    },

    markAllAsRead: async (): Promise<ApiResponse<void>> => {
        const res = await api.patch<ApiResponse<void>>('/notifications/read-all');
        return res.data;
    },

    deleteNotification: async (
        notificationId: MaybeRefOrGetter<number>,
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/notifications/${toValue(notificationId)}`);
        return res.data;
    },
}
