import { useProfileQuery } from "@/hooks/query/auth/useProfileQuery";
import { useLoginMutation } from "@/hooks/query/auth/useLoginMutation";
import { useLogoutMutation } from "@/hooks/query/auth/useLogoutMutation";
import { useRegisterMutation } from "@/hooks/query/auth/useRegisterMutation";
import { useRegisterByInvitationMutation } from "@/hooks/query/auth/useRegisterByInvitationMutation";
import { useRefreshTokenMutation } from "@/hooks/query/auth/useRefreshTokenMutation";
import { useVerifyAccountMutation } from "@/hooks/query/auth/useVerifyAccountMutation";

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