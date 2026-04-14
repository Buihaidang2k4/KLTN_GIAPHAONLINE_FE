import { authService } from "@/services/auth.service";
import { QUERY_KEYS } from "@/hooks/key/query-keys";
import { useQuery } from "@tanstack/vue-query";

export function useProfileQuery() {
    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: QUERY_KEYS.AUTH.profile(),
        queryFn: () => authService.getMyInfo(),
        retry: false,
        staleTime: 1000 * 60 * 5,
    });

    return {
        user: data,
        isFetchingUser: isLoading,
        isLoggedIn: !!data && !isError,
    };
}