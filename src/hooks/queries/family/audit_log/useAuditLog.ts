import { auditLogService } from "@/services/auditLog.service";
import type { PageParams } from "@/types/page-response.types";
import { useQuery } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";

export const auditLogKey = {
    all: ["audit-logs"] as const,

    lists: () => [...auditLogKey.all, "list"] as const,

    listByFamily: (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        params?: MaybeRefOrGetter<PageParams>
    ) => [
            ...auditLogKey.lists(),
            "family",
            toValue(familyId),
            toValue(params)?.page ?? 0,
            toValue(params)?.size ?? 10,
            toValue(params)?.sort ?? "createdAt,desc"
        ] as const
}

function normalizeParams(params?: MaybeRefOrGetter<PageParams>) {
    const p = toValue(params);

    return {
        page: p?.page ?? 0,
        size: p?.size ?? 10,
        sort: p?.sort ?? "createdAt,desc"
    }
}

export const useAuditLogsByFamilyQuery = (
    familyId: MaybeRefOrGetter<number | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>
) => {
    const resolvedFamilyId = computed(() => toValue(familyId));
    const normalizedParams = computed(() => normalizeParams(params));

    return useQuery({
        queryKey: computed(() => auditLogKey.listByFamily(resolvedFamilyId, normalizedParams)),
        queryFn: () => auditLogService.getByFamilyId(resolvedFamilyId.value!, normalizedParams),
        enabled: computed(() => !!resolvedFamilyId.value),
        staleTime: 30_000,
        placeholderData: (previousData) => previousData
    })
}
