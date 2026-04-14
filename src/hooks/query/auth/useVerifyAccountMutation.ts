import { authService } from "@/services/auth.service";
import { notify } from "@/utils/notify";
import { useMutation } from "@tanstack/vue-query";

export function useVerifyAccountMutation() {
    const mutation = useMutation({
        mutationFn: (token: string) => authService.verifyAccount(token),

        onSuccess: () => {
            notify.success("VERIFY_ACCOUNT_SUCCESS");
        },

        onError: (error: any) => {
            const msg =
                error?.response?.data?.message || "VERIFY_ACCOUNT_FAILED";
            notify.error(msg);
        },
    });

    return {
        verifyAccount: mutation.mutate,
        verifyAccountAsync: mutation.mutateAsync,
        isVerifyingAccount: mutation.isPending,
    };
}