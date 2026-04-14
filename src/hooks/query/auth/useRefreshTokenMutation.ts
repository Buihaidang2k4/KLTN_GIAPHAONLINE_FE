import { authService } from "@/services/auth.service";
import { QUERY_KEYS } from "@/hooks/key/query-keys";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

export function useRefreshTokenMutation() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => authService.refreshToken(),

        onSuccess: async () => {
            await queryClient.refetchQueries({
                queryKey: QUERY_KEYS.AUTH.profile(),
            });
        },
    });

    return {
        refreshToken: mutation.mutate,
        refreshTokenAsync: mutation.mutateAsync,
        isRefreshingToken: mutation.isPending,
    };
}