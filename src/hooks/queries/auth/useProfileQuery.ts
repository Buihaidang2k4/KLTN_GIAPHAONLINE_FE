import { QUERY_KEYS } from "@/hooks/keys/query-keys"
import { authService } from "@/services/auth.service"
import { useQuery } from "@tanstack/vue-query"
import { computed } from "vue"

export function useProfileQuery() {
    const query = useQuery({
        queryKey: QUERY_KEYS.AUTH.profile(),

        queryFn: async () => {
            const res = await authService.getMyInfo()
            return res.data
        },

        staleTime: 1000 * 60 * 5,

        retry: false,

        enabled: computed(() => !!authService.introspectToken())
    })

    const user = computed(() => query.data.value ?? null)

    const isLoggedIn = computed(() => !!user.value)

    const isActiveAccount = computed(
        () => user.value?.accountStatus === "ACTIVE"
    )

    return {
        user,
        isLoggedIn,
        isActiveAccount,

        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        error: query.error,

        refetch: query.refetch
    }
}