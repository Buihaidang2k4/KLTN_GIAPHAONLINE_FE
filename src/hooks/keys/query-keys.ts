import type { PageParams } from "@/types/page-response";

export const QUERY_KEYS = {
    AUTH: {
        all: ["auth"] as const,
        introspect: () => ["auth", "introspect"] as const,
        profile: () => ["auth", "profile"] as const,
    },

    INVITATION: {
        all: ["invitations"] as const,

        received: (params?: PageParams) =>
            ["invitations", "received", params] as const,

        sent: (params?: PageParams) =>
            ["invitations", "sent", params] as const,

        detail: (id: string | number) =>
            ["invitations", "detail", id] as const,

        byToken: (token: string) =>
            ["invitations", "token", token] as const,

        receivedList: () =>
            [...QUERY_KEYS.INVITATION.all, "received"],

        sentList: () =>
            [...QUERY_KEYS.INVITATION.all, "sent"]
    },

    FAMILY: {
        all: ["families"] as const,

        list: (params?: PageParams) =>
            ["families", "list", params] as const,

        detail: (id: string | number) =>
            ["families", "detail", id] as const,

        members: (id: string | number) =>
            ["families", "members", id] as const,
    },

    FAMILY_EVENT: {
        all: ["family-events"] as const,

        listByFamily: (familyId: string | number, params?: PageParams) =>
            ["family-events", "family", familyId, params] as const,

        detail: (eventId: string | number) =>
            ["family-events", "detail", eventId] as const,

        search: (search?: unknown, params?: PageParams) =>
            ["family-events", "search", search, params] as const,

        familyList: (familyId: string | number) =>
            ["family-events", "family", familyId] as const,

        searchList: () =>
            ["family-events", "search"] as const
    },

    ACCOUNT: {
        ALL: ["accounts"] as const,

        LIST: (params?: any) =>
            ["accounts", "list", params] as const,

        DETAIL: (accountId: string | number) =>
            ["accounts", "detail", accountId] as const,

        DETAILTEMP: ["accounts", "detail"] as const,
        MY_INFO: ["accounts", "my-info"] as const
    }
} as const
