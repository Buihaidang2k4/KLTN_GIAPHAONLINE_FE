export const QUERY_KEYS = {

    AUTH: {
        all: ['auth'] as const,

        introspect: () =>
            [...QUERY_KEYS.AUTH.all, 'introspect'] as const,

        profile: () =>
            [...QUERY_KEYS.AUTH.all, 'profile'] as const,
    },

    INVITATION: {
        all: ['invitations'] as const,

        list: () =>
            [...QUERY_KEYS.INVITATION.all, 'list'] as const,

        detail: (id: string | number) =>
            [...QUERY_KEYS.INVITATION.all, 'detail', id] as const,

        byToken: (token: string) =>
            [...QUERY_KEYS.INVITATION.all, 'token', token] as const,
    },

    NOTIFICATION: {
        all: ['notifications'] as const,

        unreadCount: () =>
            [...QUERY_KEYS.NOTIFICATION.all, 'unread-count'] as const,
    },

    FAMILY: {
        all: ['families'] as const,

        list: () =>
            [...QUERY_KEYS.FAMILY.all, 'list'] as const,

        detail: (familyId: string | number) =>
            [...QUERY_KEYS.FAMILY.all, 'detail', familyId] as const,

        members: (familyId: string | number) =>
            [...QUERY_KEYS.FAMILY.all, 'members', familyId] as const,
    }

} as const