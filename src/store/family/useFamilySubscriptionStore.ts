import { defineStore } from 'pinia'
import { computed, type MaybeRefOrGetter } from 'vue'
import {
  useFamilySubscriptionByFamilyQuery,
  useFamilySubscriptionCheckQuotaQuery
} from '@/hooks/queries/family/family_subscription/useFamilySubscription'
import { notify } from '@/utils/notify'

export const useFamilySubscriptionStore = defineStore('familySubscription', () => {

  let _subQuery: ReturnType<typeof useFamilySubscriptionByFamilyQuery> | null = null
  let _quotaQuery: ReturnType<typeof useFamilySubscriptionCheckQuotaQuery> | null = null

  const init = (familyId: MaybeRefOrGetter<number | null | undefined>) => {
    _subQuery = useFamilySubscriptionByFamilyQuery(familyId)
    _quotaQuery = useFamilySubscriptionCheckQuotaQuery(familyId)
  }

  // ==================== Data ====================

  const subscription = computed(() => _subQuery?.data.value?.data ?? null)
  const quota = computed(() => _quotaQuery?.data.value?.data ?? null)
  const isLoading = computed(() => _subQuery?.isLoading.value || _quotaQuery?.isLoading.value)

  // ==================== Giới hạn từ gói ====================

  const maxPerson = computed(() => subscription.value?.maxPerson ?? 0)
  const maxAdmin = computed(() => subscription.value?.maxAdmin ?? 0)
  const maxStorageMb = computed(() => subscription.value?.maxStorageMb ?? 0)
  const planName = computed(() => subscription.value?.planName ?? null)
  const planCode = computed(() => subscription.value?.planCode ?? null)

  // ==================== Số liệu thực tế ====================

  const currentPersonCount = computed(() => quota.value?.currentPersonCount ?? 0)
  const currentAdminCount = computed(() => quota.value?.currentAdminCount ?? 0)
  const usedStorageMb = computed(() => quota.value?.currentStorageUsedMb ?? 0)

  // ==================== Check giới hạn ====================

  const canAddPerson = computed(() =>
    maxPerson.value === 0 || currentPersonCount.value < maxPerson.value
  )

  const canAddAdmin = computed(() =>
    maxAdmin.value === 0 || currentAdminCount.value < maxAdmin.value
  )

  const canUploadStorage = (fileSizeMb: number) =>
    maxStorageMb.value === 0 || (usedStorageMb.value + fileSizeMb) <= maxStorageMb.value

  // ==================== Guard với notify ====================

  const guardAddPerson = (): boolean => {
    if (!canAddPerson.value) {
      notify.error('Thông báo', `Đã đạt giới hạn ${maxPerson.value} thành viên của gói ${planName.value}`)
      return false
    }
    return true
  }

  const guardAddAdmin = (): boolean => {
    if (!canAddAdmin.value) {
      notify.error('Thông báo', `Đã đạt giới hạn ${maxAdmin.value} quản trị viên của gói ${planName.value} `)
      return false
    }
    return true
  }

  const guardUploadStorage = (fileSizeMb: number): boolean => {
    // Nếu chưa load xong subscription thì cho phép upload
    if (isLoading.value || !subscription.value) return true
    if (!canUploadStorage(fileSizeMb)) {
      notify.error('Thông báo', `Dung lượng lưu trữ đã đầy (${maxStorageMb.value} MB)`)
      return false
    }
    return true
  }

  // ==================== Thông tin hiển thị ====================

  const personUsagePercent = computed(() =>
    maxPerson.value > 0 ? Math.round((currentPersonCount.value / maxPerson.value) * 100) : 0
  )

  const storageUsagePercent = computed(() =>
    maxStorageMb.value > 0 ? Math.round((usedStorageMb.value / maxStorageMb.value) * 100) : 0
  )

  const isExpired = computed(() => {
    if (!subscription.value?.endDate) return false
    return new Date(subscription.value.endDate) < new Date()
  })

  return {
    init,
    isLoading,
    subscription,
    quota,

    maxPerson, maxAdmin, maxStorageMb,
    planName, planCode,

    currentPersonCount, currentAdminCount, usedStorageMb,

    canAddPerson, canAddAdmin, canUploadStorage,
    guardAddPerson, guardAddAdmin, guardUploadStorage,

    personUsagePercent, storageUsagePercent,
    isExpired,
  }
})
