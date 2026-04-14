import { authService } from "@/services/auth.service";
import { QUERY_KEYS } from "@/hooks/key/query-keys";
import { useQuery } from "@tanstack/vue-query";

export function useIntrospectTokenQuery(enabled = true) {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: QUERY_KEYS.AUTH.introspect(),
        queryFn: () => authService.introspectToken(),
        retry: false,
        enabled,
        staleTime: 1000 * 60,
    });

    return {
        introspectData: data,
        isIntrospecting: isLoading,
        isTokenValid: !!data && !isError,
        isTokenInvalid: isError,
        refetchIntrospect: refetch,
    };
}