import { authService } from "@/services/auth.service";
import type { RegisterByInvitationReq } from "@/types/auth/auth.types";
import { notify } from "@/utils/notify";
import { useMutation } from "@tanstack/vue-query";

export function useRegisterByInvitationMutation() {
    const mutation = useMutation({
        mutationFn: (data: RegisterByInvitationReq) =>
            authService.registerByInvitation(data),

        onSuccess: () => {
            notify.success("REGISTER_SUCCESS");

            window.location.href = "/login";
        },

        onError: (error: any) => {
            const msg =
                error?.response?.data?.message || "REGISTER_FAILED";
            notify.error(msg);
        },
    });

    return {
        registerByInvitation: mutation.mutate,
        isRegisteringByInvitation: mutation.isPending,
    };
}