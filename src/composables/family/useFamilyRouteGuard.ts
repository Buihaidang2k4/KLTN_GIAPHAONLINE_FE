import { useFamilyPermissions, type FamilyPermission } from '@/composables/family/useFamilyPermissions';
import { computed, watch, type MaybeRefOrGetter } from 'vue';
import { useRouter } from 'vue-router';

/**
 * Dùng trong component để guard theo family permission.
 * Nếu không có quyền → redirect /403
 *
 * @example
 * // Trong FamilyEventsPage.vue
 * useFamilyRouteGuard(familyId, 'EVENT_VIEW_PUBLIC')
 * useFamilyRouteGuard(familyId, ['EVENT_VIEW_PUBLIC', 'EVENT_MANAGE']) // có 1 trong 2 là được
 */
export function useFamilyRouteGuard(
    familyId: MaybeRefOrGetter<number | null | undefined>,
    requiredPermissions: FamilyPermission | FamilyPermission[]
) {
    const router = useRouter();
    const { permissionSet, isLoading } = useFamilyPermissions(familyId);

    const permissions = Array.isArray(requiredPermissions)
        ? requiredPermissions
        : [requiredPermissions];

    const hasAccess = computed(() =>
        permissions.some(p => permissionSet.value.has(p))
    );

    // Chờ load xong mới check
    watch([isLoading, hasAccess], ([loading, access]) => {
        if (!loading && !access) {
            router.replace('/403');
        }
    }, { immediate: true });

    return { hasAccess, isLoading };
}
