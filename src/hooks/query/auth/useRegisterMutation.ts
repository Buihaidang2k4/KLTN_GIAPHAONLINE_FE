import { authService } from "@/services/auth.service";
import type { RegisterReq } from "@/types/auth/auth";
import { getApiErrorMessage } from "@/utils/get-api-error-message";
import { notify } from "@/utils/notify";
import { useMutation } from "@tanstack/vue-query";

export function useRegisterMutation() {
    const mutation = useMutation({
        mutationFn: (data: RegisterReq) => authService.register(data),

        onSuccess: () => {
            notify.success("Đăng ký thành công", "Bạn hãy kiểm tra email để kích hoạt tài khoản trước khi đăng nhập nhé!");
        },

        onError: (error: any) => {
            const mess = getApiErrorMessage(error);
            notify.error("Có lỗi xảy ra khi đăng ký", mess);
        },
    });

    return {
        register: mutation.mutate,
        registerAsync: mutation.mutateAsync,
        isRegistering: mutation.isPending,
    };
}