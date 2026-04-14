export const QUERY_KEYS = {
    AUTH: {
        all: ['auth'] as const,
        introspect: () => ['introspect'] as const,
        profile: () => [...QUERY_KEYS.AUTH.all, 'profile'] as const,
    },

    // Module Invitations (Lời mời)
    INVITATION: {
        all: ['invitations'] as const,
        list: () => [...QUERY_KEYS.INVITATION.all, 'list'] as const,
        details: (id: string | number) => [...QUERY_KEYS.INVITATION.all, 'detail', id] as const,
        byToken: (token: string) => [...QUERY_KEYS.INVITATION.all, 'token', token] as const,
    },

    // Module Notifications
    NOTIFICATION: {
        all: ['notifications'] as const,
        unreadCount: () => [...QUERY_KEYS.NOTIFICATION.all, 'unread-count'] as const,
    },

    // Module Family (Dòng họ)
    FAMILY: {
        all: ['families'] as const,
        detail: (id: string | number) => [...QUERY_KEYS.FAMILY.all, 'detail', id] as const,
        members: (familyId: string | number) => [...QUERY_KEYS.FAMILY.all, familyId, 'members'] as const,
    }
};