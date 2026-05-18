import api from "./api.base"
import type { ApiResponse } from "@/types/api-response.types"
import type { AccountDetailsRes, AccountRes, ChangePasswordAccountReq, ChangeStatusLockReq, CreateAccountReq, UpdateAccountReq } from "@/types/account/account.types"
import type { PageParams, PageResponse } from "@/types/page-response.types"
import { toValue, type MaybeRefOrGetter } from "vue"

export const accountService = {

    getAccounts: async (
        keyword?: MaybeRefOrGetter<string | null | undefined>,
        status?: MaybeRefOrGetter<string | null | undefined>,
        params?: MaybeRefOrGetter<PageParams>
    ): Promise<ApiResponse<PageResponse<AccountRes>>> => {
        const resolvedParams = toValue(params);
        const resolvedKeyword = toValue(keyword);
        const resolvedStatus = toValue(status);

        const queryParams: Record<string, any> = {
            ...resolvedParams,
        };

        if (resolvedKeyword) {
            queryParams.keyword = resolvedKeyword;
        }

        if (resolvedStatus && resolvedStatus !== "ALL") {
            queryParams.status = resolvedStatus;
        }

        const res = await api.get<ApiResponse<PageResponse<AccountRes>>>("/accounts", {
            params: queryParams
        });
        return res.data
    },

    getAccountById: async (
        accountId: number
    ): Promise<ApiResponse<AccountRes>> => {
        const res = await api.get<ApiResponse<AccountRes>>(`/accounts/${accountId}`)
        return res.data
    },

    getMyInfo: async (): Promise<ApiResponse<AccountDetailsRes>> => {
        const res = await api.get<ApiResponse<AccountDetailsRes>>("/accounts/MyInfo")
        return res.data
    },

    createAccount: async (
        data: CreateAccountReq
    ): Promise<ApiResponse<AccountRes>> => {
        const res = await api.post<ApiResponse<AccountRes>>("/accounts", data)
        return res.data
    },

    changePassword: async (
        accountId: number,
        data: ChangePasswordAccountReq
    ): Promise<ApiResponse<void>> => {
        const res = await api.put<ApiResponse<void>>(`/accounts/change-pass/${accountId}`, data)
        return res.data
    },

    changeStatusLock: async (
        accountId: number,
        data: ChangeStatusLockReq
    ): Promise<ApiResponse<AccountRes>> => {
        const res = await api.put<ApiResponse<AccountRes>>(`/accounts/change-status-lock/${accountId}`, data)
        return res.data
    },

    changeAvatar: async (
        accountId: number,
        file: File
    ): Promise<ApiResponse<void>> => {

        const formData = new FormData()
        formData.append("accountId", String(accountId))
        formData.append("file", file)

        const res = await api.put<ApiResponse<void>>("/accounts/change-avatar", formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        )

        return res.data
    },

    updateAccount: async (
        accountId: number,
        data: UpdateAccountReq
    ) => {
        const res = await api.put<ApiResponse<void>>(`/accounts/${accountId}`, data)
        return res.data
    },

    addRole: async (
        accountId: number,
        roleName: string
    ): Promise<ApiResponse<void>> => {
        const res = await api.post<ApiResponse<void>>("/accounts/add-role-to-account", null,
            {
                params: {
                    accountId,
                    roleName
                }
            }
        )
        return res.data
    },

    removeRoleFromAccount: async (
        accountId: number,
        roleName: string
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>("/accounts/remove-role-from-account",
            {
                params: {
                    accountId,
                    roleName
                }
            }
        )
        return res.data
    },

    softDeleteAccount: async (
        accountId: number
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/accounts/soft-delete/${accountId}`)
        return res.data
    },

    hardDeleteAccount: async (
        accountId: number
    ): Promise<ApiResponse<void>> => {
        const res = await api.delete<ApiResponse<void>>(`/accounts/hard-delete/${accountId}`)
        return res.data
    }

}