export type NotificationType = 'FAMILY_INVITATION' | 'FAMILY_MEMBER_ADDED_OR_REJECT' | 'FAMILY_MEMBER_REMOVED' | 'FAMILY_MEMBER_ROLE_CHANGED' | 'FAMILY_EVENT_UPCOMING' | 'FEEDBACK_USER' | 'SUBSCRIPTION_EXPIRES' | 'SUBSCRIPTION_EXPIRED' | 'FEEDBACK_ADMIN';

export interface NotificationRes {
    notificationId: number;
    recipientAccountId: number;
    recipientName: string;
    senderAccountId: number | null;
    senderName: string | null;
    type: NotificationType;
    title: string;
    content: string;
    isRead: boolean;
    referenceId: number | null;
    referenceType: string | null;
    actionUrl: string | null;
    createdAt: string;
    readAt: string | null;
}
