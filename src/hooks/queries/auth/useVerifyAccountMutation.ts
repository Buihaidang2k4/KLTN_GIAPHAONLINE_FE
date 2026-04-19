import router from "@/app/router";
import { authService } from "@/services/auth.service";
import { getApiErrorMessage } from "@/utils/get-api-error-message";
import { notify } from "@/utils/notify";
import { useMutation } from "@tanstack/vue-query";

export function useVerifyAccountMutation() {
    const mutation = useMutation({
        mutationFn: (token: string) => authService.verifyAccount(token),

        onSuccess: () => {
            notify.success("Verify account successful! You can now log in.");
            router.push("/family");
        },

        onError: (error: any) => {
            const msg = getApiErrorMessage(error);
            notify.error("Xác thực tài khoản thất bại", msg);
        },
    });

    return {
        verifyAccount: mutation.mutate,
        verifyAccountAsync: mutation.mutateAsync,
        isVerifyingAccount: mutation.isPending,
    };
}