<script setup lang="ts">
import { ref } from 'vue'

const inviteEmail = ref('')

const handleInvite = () => {
    if (!inviteEmail.value) return

    console.log('invite', inviteEmail.value)

    inviteEmail.value = ''
}
</script>

<template>

    <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-[#d4a373]">

        <h4 class="font-semibold text-slate-800 mb-2">
            Gửi lời mời nhanh
        </h4>

        <p class="text-sm text-slate-500 mb-4">
            Nhập email để gửi lời mời tham gia vào không gian chung của gia đình.
        </p>

        <div class="flex gap-2">

            <input v-model="inviteEmail" type="email" placeholder="nhap-email@example.com"
                class="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20" />

            <button @click="handleInvite" class="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900">
                Gửi
            </button>

        </div>

    </div>

</template>