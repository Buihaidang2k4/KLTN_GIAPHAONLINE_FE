<script setup lang="ts">
import { computed, reactive, ref, toRef } from "vue"
import InvitationTable from "@/components/family_email/InvitationTable.vue"
import {
  useAcceptInvitationMutation,
  useCancelInvitationMutation,
  useInvitationReceivedQuery,
  useInvitationSentQuery,
  useRejectInvitationMutation,
} from "@/hooks/queries/family/family_invitaion/useFamilyInvitation"
import AppPagination from "@/components/forms/common/AppPagination.vue"

const activeTab = ref<"received" | "sent">("sent")

const pagination = reactive({
  sent: { page: 0, size: 5 },
  received: { page: 0, size: 5 }
})

const params = computed(() => ({
  page: pagination[activeTab.value].page,
  size: pagination[activeTab.value].size
}))


const receivedQuery = useInvitationReceivedQuery(toRef(params))
const sentQuery = useInvitationSentQuery(toRef(params))

const acceptInvitation = useAcceptInvitationMutation();
const rejectInvitation = useRejectInvitationMutation();
const cancelInvitation = useCancelInvitationMutation();

const receivedItems = computed(
  () => receivedQuery.data.value?.data?.items ?? []
)

const sentItems = computed(
  () => sentQuery.data.value?.data?.items ?? []
)
const handleAccept = (token: string) => acceptInvitation.mutate(token)

const handleReject = (token: string) => rejectInvitation.mutate(token)

const handleCancel = (id: number) => cancelInvitation.mutate(id)

//  panagtion
const currentTotalPages = computed(() => {
  return activeTab.value === 'sent'
    ? (sentQuery.data.value?.data?.totalPages ?? 0)
    : (receivedQuery.data.value?.data?.totalPages ?? 0)
})

const currentPage = computed(() => pagination[activeTab.value].page)
const hasNextPage = computed(() => currentPage.value + 1 < currentTotalPages.value)
const hasPrevPage = computed(() => currentPage.value > 0)

const nextPage = () => { if (hasNextPage.value) pagination[activeTab.value].page++ }
const prevPage = () => { if (hasPrevPage.value) pagination[activeTab.value].page-- }
</script>

<template>
  <div class="min-h-screen bg-[#f7f4ec]">
    <div class="mx-auto w-full max-w-[1600px] px-3 py-5 sm:px-5 lg:px-8 xl:px-10">
      <!-- Tabs -->
      <div class="mb-5">
        <div class="inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">


          <button class="px-5 py-2.5 text-sm font-semibold rounded-xl transition-all" :class="activeTab === 'sent'
            ? 'bg-indigo-50 text-indigo-600 shadow-sm'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            " @click="activeTab = 'sent'">
            Lời mời đã gửi

            <span
              class="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-semibold rounded-full bg-indigo-100 text-indigo-700">
              {{ sentItems.length }}
            </span>
          </button>
          <button class="px-5 py-2.5 text-sm font-semibold rounded-xl transition-all" :class="activeTab === 'received'
            ? 'bg-indigo-50 text-indigo-600 shadow-sm'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            " @click="activeTab = 'received'">
            Lời mời đã nhận
            <span
              class="ml-2 inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-semibold rounded-full bg-indigo-100 text-indigo-700">
              {{ receivedItems.length }}
            </span>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="rounded-2xl">
        <InvitationTable v-if="activeTab === 'received'" title="Lời mời đã nhận"
          description="Danh sách các lời mời bạn nhận được từ các gia đình khác." :items="receivedItems"
          :loading="receivedQuery.isLoading.value" mode="received" @accept="handleAccept" @reject="handleReject" />

        <InvitationTable v-else title="Lời mời đã gửi" description="Danh sách các lời mời bạn đã gửi."
          :items="sentItems" :loading="sentQuery.isLoading.value" mode="sent" @cancel="handleCancel" />
      </div>
      <!-- panagtion -->
      <div class="flex justify-end">
        <AppPagination :page="currentPage" :total-pages="currentTotalPages" :has-next="hasNextPage"
          :has-prev="hasPrevPage" @next="nextPage" @prev="prevPage" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
