import { computed, type Ref } from 'vue'
import type { FamilyMemberRes } from '@/types/family/family-member'

const MEMBER_STATUS = {
    ACTIVE: 'Đang hoạt động',
    LEFT: 'Đã rời',
    REMOVED: 'Đã bị xóa',
    BLOCKED: 'Đã bị chặn',
} as const

export function useFamilyMembers(members: Ref<FamilyMemberRes[]>) {

    const safeMembers = computed(() =>
        members.value.filter(Boolean)
    )

    const getMemberStatusLabel = (status: FamilyMemberRes['status']) =>
        MEMBER_STATUS[status] ?? 'Không xác định'

    const activeMembers = computed(() =>
        safeMembers.value.filter(m => m.status === 'ACTIVE')
    )

    return {
        safeMembers,
        activeMembers,
        getMemberStatusLabel,
    }
}