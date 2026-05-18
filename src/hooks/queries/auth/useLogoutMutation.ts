import { authService } from "@/services/auth.service";
import { QUERY_KEYS } from "@/hooks/keys/query-keys";
import { notify } from "@/utils/notify";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { clearRouterCache } from "@/app/router";

export function useLogoutMutation() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => authService.logout(),

        onSuccess: () => {
            clearRouterCache();
            queryClient.setQueryData(QUERY_KEYS.AUTH.profile(), null);
            queryClient.removeQueries({ queryKey: QUERY_KEYS.AUTH.all });
            notify.success("LOGOUT_SUCCESS");
            window.location.href = "/login";
        },
    });

    return {
        logout: mutation.mutate,
        isLoggingOut: mutation.isPending,
    };
}