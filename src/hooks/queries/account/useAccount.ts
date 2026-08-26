import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query"
import { accountService } from "@/services/account.service"
import { QUERY_KEYS } from "@/hooks/keys/query-keys"

import type { PageParams } from "@/types/page-response.types"
import { computed, toValue, type MaybeRefOrGetter } from "vue"
import { notify } from "@/utils/notify"
import type { ChangePasswordAccountReq, UpdateAccountReq } from "@/types/account/account.types"

export function useAccountsQuery(
    keyword?: MaybeRefOrGetter<string | null | undefined>,
    status?: MaybeRefOrGetter<string | null | undefined>,
    params?: MaybeRefOrGetter<PageParams>
) {
    const resolvedKeyword = computed(() => toValue(keyword));
    const resolvedStatus = computed(() => toValue(status));
    const resolvedParams = computed(() => {
        const p = toValue(params);
        return {
            page: p?.page ?? 0,
            size: p?.size ?? 10,
            sort: p?.sort ?? "createdAt,desc",
        };
    });

    return useQuery({
        queryKey: computed(() => [
            ...QUERY_KEYS.ACCOUNT.ALL,
            "list",
            resolvedKeyword.value || "",
            resolvedStatus.value || "",
            resolvedParams.value.page,
            resolvedParams.value.size,
            resolvedParams.value.sort
        ]),
        queryFn: () => accountService.getAccounts(resolvedKeyword, resolvedStatus, resolvedParams),
        staleTime: 1000 * 30
    })
}

export function useAccountQuery(accountId: MaybeRefOrGetter<number | null>) {
    const resolvedAccountId = computed(() => toValue(accountId));

    return useQuery({
        queryKey: QUERY_KEYS.ACCOUNT.DETAIL(resolvedAccountId.value ?? 'unknown'),
        queryFn: () => accountService.getAccountById(resolvedAccountId.value!),
        enabled: computed(() => !!resolvedAccountId.value)
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

export function useUpdateAccountMutation() {

    return useMutation({
        mutationFn: ({ accountId, data }: {
            accountId: number
            data: UpdateAccountReq
        }) => accountService.updateAccount(accountId, data),

        onSuccess: () => {
            notify.success("Thông báo", "Cập nhật thông tin thành công")
        },

        onError: () => {
            notify.error("Thông báo", "Cập nhật thông tin thất bại!")
        }
    })
}



export function useChangePasswordMutation() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            accountId,
            data
        }: {
            accountId: number
            data: ChangePasswordAccountReq
        }) => accountService.changePassword(accountId, data),

        onSuccess: () => {
            notify.success("Thông báo", "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.")
            localStorage.removeItem("current_user")
            queryClient.clear()
            setTimeout(() => {
                window.location.href = "/login"
            }, 800)
        },

        onError: () => {
            notify.error("Thông báo", "Mật khẩu hiện tại không đúng!")
        }
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
                queryKey: QUERY_KEYS.ACCOUNT.DETAILTEMP
            })

            notify.success("Cập nhật thông tin", "Thay đổi ảnh đại điện thành công")
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