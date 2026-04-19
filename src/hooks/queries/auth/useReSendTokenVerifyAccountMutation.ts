import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/utils/get-api-error-message";
import { notify } from "@/utils/notify";
import { useMutation } from "@tanstack/vue-query";

export function useReSendTokenVerifyAccountMutation() {
    const mutation = useMutation({
        mutationFn: (accountId: string) => authService.reSendTokenVerify(accountId),

        onSuccess: () => {
            notify.success("RE_SEND_TOKEN_VERIFY_SUCCESS");
        },

        onError: (error: any) => {
            const mess = getApiErrorMessage(error);
            notify.error("Mã xác thực sai", mess);
        },
    });

    return {
        reSendTokenVerify: mutation.mutate,
        reSendTokenVerifyAsync: mutation.mutateAsync,
        isVerifyingAccount: mutation.isPending,
    };
}