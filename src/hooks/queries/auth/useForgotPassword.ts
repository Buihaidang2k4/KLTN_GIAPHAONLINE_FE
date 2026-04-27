import { authService } from "@/services/auth.service";
import { QUERY_KEYS } from "@/hooks/keys/query-keys";
import { notify } from "@/utils/notify";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { getApiErrorMessage } from "@/utils/get-api-error-message";
import type { ApiResponse } from "@/types/api-response";
import type { ResetPasswordReq } from "@/types/auth/auth";
import type { MaybeRef, MaybeRefOrGetter } from "vue";


export function useForgotPasswordSendOtp() {

    return useMutation<ApiResponse<void>, Error, MaybeRef>({
        mutationFn: (email: MaybeRef) => authService.forgotPasswordSendOTP(email),

        onSuccess: async () => {
            notify.success("Thông báo", "Gửi mã thành công đến mail");

        },

        onError: (err: any) => {
            const mess = getApiErrorMessage(err);
            notify.error("Thông báo", mess);
        },
        retry: false
    });

}

export function useForgotPasswordReSendOtp() {

    return useMutation<ApiResponse<void>, Error, MaybeRef>({
        mutationFn: (email: MaybeRef) => authService.resendOTPForgotPassword(email),

        onSuccess: async () => {
            notify.success("Thông báo", "Gửi lại mã thành công đến mail");

        },

        onError: (err: any) => {
            const mess = getApiErrorMessage(err);
            notify.error("Thông báo", mess);
        },
        retry: false
    });

}


export function useVerifyForgotPasswordOtp() {

    return useMutation<ApiResponse<void>, Error, MaybeRefOrGetter<string>>({
        mutationFn: (otp: MaybeRefOrGetter<string>) => authService.verifyForgotPasswordOtp(otp),

        onSuccess: async () => {
            notify.success("Thông báo", "Xác thực mã thành công !");

        },

        onError: (err: any) => {
            const mess = getApiErrorMessage(err);
            notify.error("Thông báo", mess);
        },
        retry: false
    });

}


export function useResetPassword() {

    return useMutation<ApiResponse<void>, Error, ResetPasswordReq>({
        mutationFn: (data: ResetPasswordReq) => authService.resetPassword(data),

        onSuccess: async () => {
            notify.success("Thông báo", "Thay đổi mật khẩu thành công !");

        },

        onError: (err: any) => {
            const mess = getApiErrorMessage(err);
            notify.error("Thông báo", mess);
        },
        retry: false
    });

}


