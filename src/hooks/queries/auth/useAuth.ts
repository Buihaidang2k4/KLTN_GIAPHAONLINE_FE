import { useLoginMutation } from "@/hooks/queries/auth/useLoginMutation";
import { useLogoutMutation } from "@/hooks/queries/auth/useLogoutMutation";
import { useRegisterMutation } from "@/hooks/queries/auth/useRegisterMutation";
import { useRegisterByInvitationMutation } from "@/hooks/queries/auth/useRegisterByInvitationMutation";
import { useRefreshTokenMutation } from "@/hooks/queries/auth/useRefreshTokenMutation";
import { useVerifyAccountMutation } from "@/hooks/queries/auth/useVerifyAccountMutation";

export function useAuth() {
    const login = useLoginMutation();
    const logout = useLogoutMutation();
    const register = useRegisterMutation();
    const registerByInvitation = useRegisterByInvitationMutation();
    const refresh = useRefreshTokenMutation();
    const verify = useVerifyAccountMutation();

    return {

        login: login.login,
        loginAsync: login.loginAsync,
        isLoggingIn: login.isLoggingIn,

        logout: logout.logout,
        isLoggingOut: logout.isLoggingOut,

        register: register.register,
        isRegistering: register.isRegistering,

        registerByInvitation: registerByInvitation.registerByInvitation,
        isRegisteringByInvitation:
            registerByInvitation.isRegisteringByInvitation,

        refreshToken: refresh.refreshToken,
        refreshTokenAsync: refresh.refreshTokenAsync,
        isRefreshingToken: refresh.isRefreshingToken,

        verifyAccount: verify.verifyAccount,
        verifyAccountAsync: verify.verifyAccountAsync,
        isVerifyingAccount: verify.isVerifyingAccount,
    };
}