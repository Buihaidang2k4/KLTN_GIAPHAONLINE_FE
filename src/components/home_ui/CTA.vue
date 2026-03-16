<script setup lang="ts">
import { ref } from 'vue'
import { Send, Mail, User, MessageSquare, CheckCircle2 } from 'lucide-vue-next'

const form = ref({
    name: '',
    email: '',
    subject: '',
    message: ''
})

const sending = ref(false)
const success = ref(false)

const handleSubmit = async () => {
    sending.value = true
    success.value = false

    await new Promise((resolve) => setTimeout(resolve, 1000))

    success.value = true

    form.value = {
        name: '',
        email: '',
        subject: '',
        message: ''
    }

    sending.value = false
}
</script>

<template>
    <section class="py-28 bg-[#efe6d6] relative overflow-hidden">

        <!-- nền trang trí -->
        <div class="absolute inset-0 opacity-10">
            <div class="absolute top-0 left-0 w-96 h-96 bg-[#c4a46b] blur-3xl"></div>
            <div class="absolute bottom-0 right-0 w-96 h-96 bg-[#2f4a3d] blur-3xl"></div>
        </div>

        <div class="max-w-7xl mx-auto px-6 relative z-10">

            <!-- header -->
            <div class="text-center mb-16">

                <div class="flex justify-center items-center gap-4 mb-6">
                    <span class="w-16 h-[2px] bg-[#c4a46b]"></span>
                    <span class="text-[#6b5534] tracking-widest uppercase text-sm">
                        Liên hệ quản trị
                    </span>
                    <span class="w-16 h-[2px] bg-[#c4a46b]"></span>
                </div>

                <h2 class="text-4xl md:text-5xl font-bold text-[#2e4439] mb-6">
                    Gửi phản hồi cho GiaPhaOnline
                </h2>

                <p class="text-[#4b5d54] max-w-2xl mx-auto text-lg">
                    Chúng tôi luôn mong muốn hoàn thiện hệ thống gia phả tốt hơn.
                    Hãy gửi góp ý, báo lỗi hoặc đề xuất tính năng cho đội ngũ quản trị.
                </p>

            </div>

            <!-- layout -->
            <div class="grid lg:grid-cols-2 gap-12 items-center">

                <!-- FORM -->
                <div class="bg-[#f7f2e8] border border-[#d8c5a1] rounded-3xl p-10 shadow-xl relative">

                    <!-- hoa văn -->
                    <div class="absolute -top-5 left-10 flex items-center gap-3">
                        <span class="w-12 h-[2px] bg-[#c4a46b]"></span>
                        <span class="w-3 h-3 rounded-full border border-[#c4a46b]"></span>
                        <span class="w-12 h-[2px] bg-[#c4a46b]"></span>
                    </div>

                    <form class="space-y-6" @submit.prevent="handleSubmit">

                        <!-- name -->
                        <div>
                            <label class="block mb-2 text-sm font-semibold text-[#2e4439]">
                                Họ và tên
                            </label>

                            <div
                                class="flex items-center gap-3 border border-[#d8c5a1] rounded-xl px-4 py-3 focus-within:border-[#c4a46b]">
                                <User class="w-5 h-5 text-[#c4a46b]" />

                                <input v-model="form.name" type="text" placeholder="Nguyễn Văn A"
                                    class="w-full bg-transparent outline-none text-[#2e4439]" />
                            </div>
                        </div>

                        <!-- email -->
                        <div>
                            <label class="block mb-2 text-sm font-semibold text-[#2e4439]">
                                Email
                            </label>

                            <div
                                class="flex items-center gap-3 border border-[#d8c5a1] rounded-xl px-4 py-3 focus-within:border-[#c4a46b]">
                                <Mail class="w-5 h-5 text-[#c4a46b]" />

                                <input v-model="form.email" type="email" placeholder="email@example.com"
                                    class="w-full bg-transparent outline-none text-[#2e4439]" />
                            </div>
                        </div>

                        <!-- subject -->
                        <div>
                            <label class="block mb-2 text-sm font-semibold text-[#2e4439]">
                                Chủ đề
                            </label>

                            <div
                                class="flex items-center gap-3 border border-[#d8c5a1] rounded-xl px-4 py-3 focus-within:border-[#c4a46b]">
                                <MessageSquare class="w-5 h-5 text-[#c4a46b]" />

                                <input v-model="form.subject" type="text" placeholder="Báo lỗi / đề xuất..."
                                    class="w-full bg-transparent outline-none text-[#2e4439]" />
                            </div>
                        </div>

                        <!-- message -->
                        <div>
                            <label class="block mb-2 text-sm font-semibold text-[#2e4439]">
                                Nội dung
                            </label>

                            <textarea v-model="form.message" rows="5" placeholder="Nhập nội dung góp ý của bạn..."
                                class="w-full border border-[#d8c5a1] rounded-xl px-4 py-3 outline-none focus:border-[#c4a46b] text-[#2e4439]"></textarea>
                        </div>

                        <!-- success -->
                        <div v-if="success"
                            class="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-xl">
                            <CheckCircle2 class="w-5 h-5" />
                            Phản hồi đã được gửi thành công.
                        </div>

                        <!-- button -->
                        <div class="pt-2">

                            <button type="submit" :disabled="sending"
                                class="bg-[#2e4439] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#23352d] transition flex items-center gap-2 shadow-lg">
                                {{ sending ? 'Đang gửi...' : 'Gửi phản hồi' }}
                                <Send class="w-4 h-4" />
                            </button>

                        </div>

                    </form>

                </div>

                <!-- IMAGE -->
                <div class="relative">

                    <div class="rounded-3xl overflow-hidden shadow-2xl border border-[#d8c5a1]">

                        <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1600"
                            class="w-full h-[520px] object-cover" />

                    </div>

                    <!-- overlay text -->
                    <div class="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur rounded-2xl p-6">

                        <h3 class="text-xl font-bold text-[#2e4439] mb-2">
                            Lưu giữ lịch sử dòng họ
                        </h3>

                        <p class="text-[#4b5d54] text-sm leading-relaxed">
                            GiaPhaOnline giúp số hóa gia phả, lưu giữ hình ảnh và câu chuyện
                            gia đình qua nhiều thế hệ trong một không gian trang trọng.
                        </p>

                    </div>

                </div>

            </div>

        </div>

    </section>
</template>