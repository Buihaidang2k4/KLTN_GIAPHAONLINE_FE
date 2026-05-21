import api from "./api.base";
import type { ApiResponse } from "@/types/api-response.types";
import type { PageParams, PageResponse } from "@/types/page-response.types";
import type { AuditLogRes } from "@/types/family/audit-log.types";
import { toValue, type MaybeRefOrGetter } from "vue";

export const auditLogService = {
    getByFamilyId: async (
        familyId: MaybeRefOrGetter<number | null | undefined>,
        params?: MaybeRefOrGetter<PageParams>
    ): Promise<ApiResponse<PageResponse<AuditLogRes>>> => {
        const resolvedParams = toValue(params);

        const res = await api.get<ApiResponse<PageResponse<AuditLogRes>>>(
            `/audit-logs/family/${toValue(familyId)}`,
            {
                params: {
                    page: resolvedParams?.page ?? 0,
                    size: resolvedParams?.size ?? 10,
                    sort: resolvedParams?.sort ?? "createdAt,desc"
                }
            }
        );

        return res.data;
    }
}
