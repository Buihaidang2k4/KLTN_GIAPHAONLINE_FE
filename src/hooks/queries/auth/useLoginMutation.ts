import { authService } from "@/services/auth.service";
import { QUERY_KEYS } from "@/hooks/keys/query-keys";
import type { LoginReq } from "@/types/auth/auth.types";
import { notify } from "@/utils/notify";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { getApiErrorMessage } from "@/utils/get-api-error-message";

export function useLoginMutation() {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: LoginReq) => authService.login(data),

        onSuccess: async () => {
            notify.success("LOGIN_SUCCESS");

            await queryClient.refetchQueries({
                queryKey: QUERY_KEYS.AUTH.profile(),
            });
        },

        onError: (err: any) => {
            const mess = getApiErrorMessage(err);
            notify.error("Tài khoản hoặc mật khẩu không đúng", mess);
        },
    });

    return {
        login: mutation.mutate,
        loginAsync: mutation.mutateAsync,
        isLoggingIn: mutation.isPending,
    };
}