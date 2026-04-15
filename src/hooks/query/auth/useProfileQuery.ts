import { authService } from "@/services/auth.service";
import { QUERY_KEYS } from "@/hooks/key/query-keys";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";

export function useProfileQuery() {
    const query = useQuery({
        queryKey: QUERY_KEYS.AUTH.profile(),
        queryFn: () => authService.getMyInfo(),
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    const user = computed(() => query.data.value?.data ?? null);
    const isLoggedIn = computed(() => !!user.value && !query.isError.value);
    const isAcctiveAccount = computed(() => user.value?.accountSatus === "ACTIVE");

    return {
        user,
        profileResponse: query.data,
        isFetchingUser: query.isLoading,
        isError: query.isError,
        isLoggedIn,
        isAcctiveAccount,
    };
}