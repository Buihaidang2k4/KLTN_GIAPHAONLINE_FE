import type { AccountDetailsRes, LoginReq, LoginRes, RegisterByInvitationReq, RegisterReq, RegisterRes } from "@/types/auth/auth";
import api from "./api.base";
import type { ApiResponse } from "@/types/api-response";
import { apiRefresh } from "./api-refresh.base";


export const authService = {
    login: async (data: LoginReq): Promise<ApiResponse<LoginRes>> => {
        const res = await api.post<ApiResponse<LoginRes>>('/auth/login', data);
        return res.data;
    },

    getMyInfo: async (): Promise<ApiResponse<AccountDetailsRes>> => {
        const res = await api.get<ApiResponse<AccountDetailsRes>>('/accounts/MyInfo');
        return res.data;
    },

    register: async (data: RegisterReq): Promise<ApiResponse<RegisterRes>> => {
        const res = await api.post<ApiResponse<RegisterRes>>('/auth/register', data);
        return res.data;
    },

    registerByInvitation: async (data: RegisterByInvitationReq): Promise<ApiResponse<void>> => {
        const res = await api.post<ApiResponse<void>>('/auth/register-by-invitation', data);
        return res.data;
    },

    refreshToken: async (): Promise<ApiResponse<void>> => {
        const res = await apiRefresh.post<ApiResponse<void>>('/auth/refresh-token');
        return res.data;
    },

    introspectToken: async (): Promise<ApiResponse<void>> => {
        const res = await api.post<ApiResponse<void>>('/auth/introspect');
        return res.data;
    },

    logout: async (): Promise<ApiResponse<void>> => {
        const res = await api.post<ApiResponse<void>>('/auth/logout');
        return res.data;
    },

    verifyAccount: async (token: string): Promise<ApiResponse<void>> => {
        const res = await api.post<ApiResponse<void>>(`/auth/verify-account/${token}`);
        return res.data;
    },

    reSendTokenVerify: async (email: string): Promise<ApiResponse<void>> => {
        const res = await api.post<ApiResponse<void>>(`/auth/re-send-token-verify/${email}`);
        return res.data;
    }
}