import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { accountService } from "@/services/account.service"
import { QUERY_KEYS } from "@/hooks/keys/query-keys"

import type { PageParams } from "@/types/page-response"

export function useAccountsQuery(params?: PageParams) {
    return useQuery({
        queryKey: QUERY_KEYS.ACCOUNT.LIST(params),
        queryFn: () => accountService.getAccounts(params),
        staleTime: 1000 * 30
    })
}

export function useAccountQuery(accountId: number) {
    return useQuery({
        queryKey: QUERY_KEYS.ACCOUNT.DETAIL(accountId),
        queryFn: () => accountService.getAccountById(accountId),
        enabled: !!accountId
    })
}

export function useMyInfoQuery() {
    return useQuery({
        queryKey: QUERY_KEYS.ACCOUNT.MY_INFO,
        queryFn: () => accountService.getMyInfo(),
        staleTime: 1000 * 60
    })
}

export function useCreateAccountMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: accountService.createAccount,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.ACCOUNT.ALL
            })
        }
    })
}

export function useChangePasswordMutation() {
    return useMutation({
        mutationFn: ({
            accountId,
            data
        }: {
            accountId: number
            data: any
        }) => accountService.changePassword(accountId, data)
    })
}

export function useChangeStatusLockMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            accountId,
            data
        }: {
            accountId: number
            data: any
        }) => accountService.changeStatusLock(accountId, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.ACCOUNT.ALL
            })
        }
    })
}

export function useChangeAvatarMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            accountId,
            file
        }: {
            accountId: number
            file: File
        }) => accountService.changeAvatar(accountId, file),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.ACCOUNT.MY_INFO
            })
        }
    })
}

export function useAddRoleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            accountId,
            roleName
        }: {
            accountId: number
            roleName: string
        }) => accountService.addRole(accountId, roleName),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.ACCOUNT.ALL
            })
        }
    })
}

export function useRemoveRoleMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            accountId,
            roleName
        }: {
            accountId: number
            roleName: string
        }) => accountService.removeRoleFromAccount(accountId, roleName),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.ACCOUNT.ALL
            })
        }
    })
}

export function useSoftDeleteAccountMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: accountService.softDeleteAccount,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.ACCOUNT.ALL
            })
        }
    })
}

export function useHardDeleteAccountMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: accountService.hardDeleteAccount,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.ACCOUNT.ALL
            })
        }
    })
}