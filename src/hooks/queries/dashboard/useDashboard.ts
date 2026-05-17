import { useQuery } from "@tanstack/vue-query";
import { computed, toValue, type MaybeRefOrGetter } from "vue";
import { dashboardService } from "@/services/dashboard.service";

export const dashboardKeys = {
    all: ['dashboard'] as const,
    byFamily: (familyId: MaybeRefOrGetter<number | null | undefined>) => [
        ...dashboardKeys.all,
        'family',
        toValue(familyId)
    ] as const,
};

export const useDashboardQuery = (familyId: MaybeRefOrGetter<number | null | undefined>) => {
    const resolvedFamilyId = computed(() => toValue(familyId));
    const enabled = computed(() => !!resolvedFamilyId.value);

    return useQuery({
        queryKey: computed(() => dashboardKeys.byFamily(resolvedFamilyId)),
        queryFn: () => dashboardService.getDataDashboard(resolvedFamilyId.value!),
        enabled,
        staleTime: 5 * 60 * 1000 // 5 minutes
    });
};
