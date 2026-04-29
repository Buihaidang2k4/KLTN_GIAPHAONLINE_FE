import { computed, type Ref } from "vue"
import { useAccountQuery } from "@/hooks/queries/account/useAccount"
import type { AccountRes } from "@/types/account/account.types"

export function useAccount(accountId: Ref<number | null>) {
    const query = useAccountQuery(accountId)

    const account = computed<AccountRes | null>(() => {
        const acc = query.data.value?.data
        if (!acc) return null

        return {
            accountId: acc.accountId,
            email: acc.email,
            phoneNumber: acc.phoneNumber,
            fullName: acc.fullName,
            avatarPath: acc.avatarPath ?? null,
            avatarUrl: acc.avatarUrl ?? null,
            accountStatus: acc.accountStatus,
            lockReason: acc.lockReason ?? null,
            lockedAt: acc.lockedAt ?? null,
            createdAt: acc.createdAt,
            updatedAt: acc.updatedAt,
            roles: acc.roles ?? []
        }
    })

    return {
        account,
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch
    }
}