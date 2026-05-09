<script setup lang="ts">
import { reactive } from "vue"
import { X, Send, UserPlus, Sparkles, Mail, ShieldCheck, MessageSquare, Scroll } from "lucide-vue-next"

type InvitePayload = {
    invitedEmail: string
    roleName: string
    message: string
}

type FormField = keyof InvitePayload

const emit = defineEmits<{
    (e: "close"): void
    (e: "submit", payload: InvitePayload): void
}>()

const form = reactive<InvitePayload>({
    invitedEmail: "",
    roleName: "",
    message: ""
})

const errors = reactive<Record<FormField, string>>({
    invitedEmail: "",
    roleName: "",
    message: ""
})

const touched = reactive<Record<FormField, boolean>>({
    invitedEmail: false,
    roleName: false,
    message: false
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const validators: Record<FormField, () => boolean> = {
    invitedEmail: () => {
        if (!form.invitedEmail.trim()) {
            errors.invitedEmail = "Email không được để trống"
            return false
        }

        if (!emailRegex.test(form.invitedEmail)) {
            errors.invitedEmail = "Email không hợp lệ"
            return false
        }

        errors.invitedEmail = ""
        return true
    },

    roleName: () => {
        if (!form.roleName.trim()) {
            errors.roleName = "Vui lòng chọn quyền"
            return false
        }

        errors.roleName = ""
        return true
    },

    message: () => {
        if (form.message.length > 200) {
            errors.message = "Lời nhắn không được vượt quá 200 ký tự"
            return false
        }

        errors.message = ""
        return true
    }
}

function validateField(field: FormField) {
    return validators[field]()
}

function handleBlur(field: FormField) {
    touched[field] = true
    validateField(field)
}

function handleInput(field: FormField) {
    if (!touched[field]) return
    validateField(field)
}

function validateForm() {
    return (Object.keys(form) as FormField[]).every((field) => {
        touched[field] = true
        return validateField(field)
    })
}

function handleSubmit() {
    if (!validateForm()) return
    emit("submit", { ...form })
}

function handleClose() {
    emit("close")
}

</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <!-- Backdrop -->
                <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" @click="handleClose"></div>

                <!-- Modal Container -->
                <div class="relative w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden rounded-[2.5rem] bg-[#fefaf6] shadow-2xl border border-amber-200/30 animate-in fade-in zoom-in duration-300">
                    
                    <!-- Subtle Decoration -->
                    <div class="absolute -top-12 -right-12 text-amber-900/[0.03] pointer-events-none">
                        <UserPlus :size="200" />
                    </div>

                    <!-- Header -->
                    <div class="relative shrink-0 px-8 pt-8 pb-4 text-center md:text-left">
                        <div class="inline-flex items-center gap-1.5 mb-2 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-100/50">
                            <Sparkles :size="12" class="text-amber-600" />
                            <span class="text-[9px] font-bold text-amber-700 uppercase tracking-widest">Gắn kết dòng tộc</span>
                        </div>
                        <h2 class="text-2xl font-black text-slate-900 tracking-tight">
                            Mời thành viên mới
                        </h2>
                        <p class="mt-1 text-xs text-slate-500 font-medium leading-relaxed max-w-sm">
                            Gửi lời mời tham gia quản trị gia phả trực tuyến đến những người thân trong gia đình.
                        </p>

                        <button @click="handleClose" 
                            class="absolute top-8 right-8 p-1.5 rounded-full hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-all active:scale-90">
                            <X :size="20" />
                        </button>
                    </div>

                    <!-- Form Body -->
                    <div class="custom-scrollbar flex-1 overflow-y-auto px-8 pb-4">
                        <form id="inviteForm" @submit.prevent="handleSubmit" class="space-y-6 pt-2">
                            
                            <!-- Email -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    <Mail :size="14" class="text-amber-600/70" />
                                    Email nhận lời mời <span class="text-red-400">*</span>
                                </label>
                                <input v-model="form.invitedEmail" type="email" placeholder="VD: nguyenvan@gmail.com"
                                    class="w-full rounded-xl border px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm"
                                    :class="touched.invitedEmail && errors.invitedEmail ? 'border-red-400 bg-red-50/10' : 'border-slate-200 bg-white'"
                                    @input="handleInput('invitedEmail')" @blur="handleBlur('invitedEmail')" />
                                <p v-if="touched.invitedEmail && errors.invitedEmail" class="mt-1 ml-1 block text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">
                                    {{ errors.invitedEmail }}
                                </p>
                            </div>

                            <!-- Vai trò -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    <ShieldCheck :size="14" class="text-amber-600/70" />
                                    Vai trò & Quyền hạn <span class="text-red-400">*</span>
                                </label>
                                <select v-model="form.roleName" 
                                    class="w-full rounded-xl border px-4 py-2.5 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all shadow-sm appearance-none cursor-pointer"
                                    :class="touched.roleName && errors.roleName ? 'border-red-400 bg-red-50/10' : 'border-slate-200 bg-white'"
                                    @change="handleInput('roleName')" @blur="handleBlur('roleName')">
                                    <option disabled value="">Chọn quyền hạn...</option>
                                    <option value="FAMILY_VIEWER">Người xem (Chỉ xem dữ liệu)</option>
                                    <option value="FAMILY_EDITOR">Biên tập viên (Chỉnh sửa dữ liệu)</option>
                                    <option value="FAMILY_ADMIN">Quản trị viên (Toàn quyền)</option>
                                </select>
                                <p v-if="touched.roleName && errors.roleName" class="mt-1 ml-1 block text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">
                                    {{ errors.roleName }}
                                </p>
                            </div>

                            <!-- Lời nhắn -->
                            <div class="space-y-1.5">
                                <label class="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">
                                    <MessageSquare :size="14" class="text-amber-600/70" />
                                    Lời nhắn thân mời
                                </label>
                                <textarea v-model="form.message" rows="3"
                                    placeholder="Nhập lời nhắn thân mật gửi tới thành viên..."
                                    class="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/5 transition-all leading-relaxed shadow-sm"
                                    :class="touched.message && errors.message ? 'border-red-400' : 'border-slate-200'"
                                    @input="handleInput('message')" @blur="handleBlur('message')" />
                                <p v-if="touched.message && errors.message" class="mt-1 ml-1 block text-[10px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">
                                    {{ errors.message }}
                                </p>
                            </div>

                            <!-- Note -->
                            <div class="mt-6 p-4 bg-amber-50/40 rounded-2xl border border-amber-100/30 flex items-start gap-3">
                                <Scroll :size="16" class="text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lưu ý</p>
                                    <p class="text-[11px] font-bold text-slate-700 leading-relaxed">
                                        Lời mời sẽ được gửi trực tiếp đến hòm thư của người thân. Họ sẽ chính thức tham gia sau khi xác nhận lời mời.
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>

                    <!-- Fixed Footer Actions -->
                    <div class="shrink-0 flex items-center justify-end gap-3 px-8 py-5 border-t border-amber-100/30 bg-[#fefaf6]/80 backdrop-blur-sm">
                        <button type="button" @click="handleClose"
                            class="px-8 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all">
                            Quay lại
                        </button>

                        <button type="submit" form="inviteForm"
                            class="flex items-center gap-2 px-10 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98]">
                            <Send :size="14" />
                            <span>Gửi lời mời</span>
                        </button>
                    </div>
                    
                    <!-- Decorative footer line -->
                    <div class="h-1.5 w-full bg-[linear-gradient(90deg,transparent_0%,#d97706_50%,transparent_100%)] opacity-10"></div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #3a3a2815;
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #3a3a2830;
}

select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2392400e' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' /%3E%3C/svg%3E");
    background-position: right 1rem center;
    background-repeat: no-repeat;
    background-size: 0.85rem;
}

.rounded-\[2\.5rem\]::before {
    content: '';
    position: absolute;
    top: 20px;
    left: 20px;
    width: 40px;
    height: 40px;
    border-top: 2px solid rgba(217, 119, 6, 0.08);
    border-left: 2px solid rgba(217, 119, 6, 0.08);
    border-radius: 12px 0 0 0;
    pointer-events: none;
}
</style>
