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
    }
} as const