<script setup lang="ts">
import { ref } from 'vue'
import {
    UserPlus,
    Settings,
    ShieldCheck,
    Trash2,
    Mail,
    ChevronRight,
} from 'lucide-vue-next'
import type { FamilyMember } from '@/types/family/family-member'


const familyMembers = ref<FamilyMember[]>([
    {
        id: 1,
        name: 'Bùi Hải Đăng',
        email: 'haidang.bui@example.com',
        role: 'Chủ nhà',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
        status: 'active'
    },
    {
        id: 2,
        name: 'Nguyễn Thu Thảo',
        email: 'thuthao.ngo@example.com',
        role: 'Thành viên',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
        status: 'active'
    },
    {
        id: 3,
        name: 'Trần Minh Quân',
        email: 'minhquan.tran@example.com',
        role: 'Thành viên',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Boots',
        status: 'pending'
    }
])

const inviteEmail = ref('')

const handleInvite = () => {
    if (inviteEmail.value) {
        inviteEmail.value = ''
    }
}
</script>

<template>
    <div class="max-w-5xl mx-auto space-y-6">
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-slate-800">Cài đặt gia đình</h1>
                <p class="text-slate-500 text-sm mt-1">Quản lý thành viên và quyền truy cập trong ngôi nhà của bạn.</p>
            </div>
            <button @click="handleInvite"
                class="flex items-center justify-center gap-2 px-4 py-2 bg-[#d4a373] hover:bg-[#bc8a5f] text-white rounded-lg font-medium transition-all shadow-sm">
                <UserPlus :size="18" />
                Mời thành viên
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column: Member List -->
            <div class="lg:col-span-2 space-y-4">
                <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div class="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h3 class="font-semibold text-slate-700">Danh sách thành viên ({{ familyMembers.length }})</h3>
                    </div>

                    <div class="divide-y divide-slate-100">
                        <div v-for="member in familyMembers" :key="member.id"
                            class="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div class="flex items-center gap-4">
                                <div class="relative">
                                    <img :src="member.avatar" :alt="member.name"
                                        class="w-12 h-12 rounded-full border border-slate-200 bg-white" />
                                    <div v-if="member.status === 'active'"
                                        class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full">
                                    </div>
                                </div>
                                <div>
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium text-slate-800">{{ member.name }}</span>
                                        <span v-if="member.status === 'pending'"
                                            class="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold uppercase tracking-wider">
                                            Chờ xác nhận
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-1 text-slate-500 text-xs">
                                        <Mail :size="12" />
                                        {{ member.email }}
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center gap-3">
                                <div class="hidden sm:flex flex-col items-end mr-4">
                                    <span class="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600">
                                        {{ member.role }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <button
                                        class="p-2 text-slate-400 hover:text-[#d4a373] hover:bg-orange-50 rounded-lg transition-colors">
                                        <Settings :size="18" />
                                    </button>
                                    <button v-if="member.role !== 'Chủ nhà'"
                                        class="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 :size="18" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Quick Invite Box -->
                <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-[#d4a373]">
                    <h4 class="font-semibold text-slate-800 mb-2">Gửi lời mời nhanh</h4>
                    <p class="text-sm text-slate-500 mb-4">Nhập email để gửi lời mời tham gia vào không gian chung của
                        gia đình.</p>
                    <div class="flex gap-2">
                        <input v-model="inviteEmail" type="email" placeholder="nhap-email@example.com"
                            class="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373]/20 focus:border-[#d4a373] transition-all" />
                        <button @click="handleInvite"
                            class="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors">
                            Gửi
                        </button>
                    </div>
                </div>
            </div>

            <!-- Right Column: Settings & Security -->
            <div class="space-y-6">
                <!-- Role Permissions -->
                <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div class="flex items-center gap-2 mb-4">
                        <ShieldCheck class="text-[#d4a373]" :size="20" />
                        <h3 class="font-semibold text-slate-800">Quyền hạn chung</h3>
                    </div>
                    <div class="space-y-3">
                        <div
                            class="flex items-center justify-between p-3 border border-slate-50 rounded-lg bg-slate-50/50">
                            <span class="text-sm text-slate-700">Xem camera công cộng</span>
                            <div class="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer shadow-inner">
                                <div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                        <div
                            class="flex items-center justify-between p-3 border border-slate-50 rounded-lg bg-slate-50/50">
                            <span class="text-sm text-slate-700">Nhận thông báo báo động</span>
                            <div class="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer shadow-inner">
                                <div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                        <div
                            class="flex items-center justify-between p-3 border border-slate-50 rounded-lg bg-slate-50/50 opacity-60">
                            <span class="text-sm text-slate-700">Thay đổi cấu trúc nhà</span>
                            <div class="w-10 h-5 bg-slate-300 rounded-full relative cursor-pointer shadow-inner">
                                <div class="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                            </div>
                        </div>
                    </div>
                    <button
                        class="w-full mt-4 text-xs text-[#d4a373] font-medium hover:underline flex items-center justify-center gap-1">
                        Chỉnh sửa chi tiết quyền
                        <ChevronRight :size="14" />
                    </button>
                </div>

                <!-- Danger Zone -->
                <div class="bg-red-50/50 p-5 rounded-xl border border-red-100 shadow-sm">
                    <h3 class="font-semibold text-red-800 mb-1">Vùng nguy hiểm</h3>
                    <p class="text-xs text-red-600/70 mb-4">Các hành động này không thể hoàn tác.</p>
                    <button
                        class="w-full py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-600 hover:text-white transition-all">
                        Rời khỏi gia đình
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Đồng bộ với font chung của hệ thống */
h1,
h3,
h4 {
    letter-spacing: -0.01em;
}
</style>