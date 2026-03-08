<script setup lang="ts">
const imageUrl =
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80";
</script>

<template>
    <section id="about" class="py-24 bg-amber-50">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid md:grid-cols-2 gap-12 items-center">

                <!-- LEFT CONTENT -->
                <div>
                    <div class="w-16 h-1 bg-amber-500 mb-6"></div>

                    <h2 class="text-5xl font-bold text-amber-900 mb-6">
                        Kết nối quá khứ <br />
                        với tương lai
                    </h2>

                    <p class="text-xl text-amber-800 mb-6 leading-relaxed">
                        Trong văn hóa Việt Nam, gia phả không chỉ là sự ghi chép - đó là cầu nối
                        giữa các thế hệ, là nơi lưu giữ tình yêu thương và truyền thống gia đình.
                    </p>

                    <p class="text-lg text-amber-700 mb-8 leading-relaxed">
                        Gia Phả Việt giúp bạn số hóa di sản quý giá này, bảo tồn câu chuyện gia đình
                        và chia sẻ với thế hệ mai sau một cách dễ dàng, an toàn và hiện đại.
                    </p>

                    <!-- FEATURES LIST -->
                    <div class="space-y-4">

                        <div class="flex items-start gap-4">
                            <div class="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center mt-1">
                                <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-bold text-amber-900 text-lg mb-1">
                                    Dễ dàng sử dụng
                                </h3>
                                <p class="text-amber-700">
                                    Giao diện đơn giản, phù hợp với mọi lứa tuổi trong gia đình
                                </p>
                            </div>
                        </div>

                        <div class="flex items-start gap-4">
                            <div class="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center mt-1">
                                <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-bold text-amber-900 text-lg mb-1">
                                    Lưu trữ vĩnh viễn
                                </h3>
                                <p class="text-amber-700">
                                    Dữ liệu được sao lưu tự động, không lo mất mát thông tin
                                </p>
                            </div>
                        </div>

                        <div class="flex items-start gap-4">
                            <div class="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center mt-1">
                                <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                                        d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-bold text-amber-900 text-lg mb-1">
                                    Cộng tác thời gian thực
                                </h3>
                                <p class="text-amber-700">
                                    Nhiều thành viên cùng đóng góp xây dựng gia phả
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- RIGHT IMAGE -->
                <div class="relative">
                    <div class="absolute inset-0 bg-amber-200 rounded-lg rotate-3"></div>

                    <div class="relative bg-white rounded-lg p-8 border-4 border-amber-300 shadow-xl">
                        <img :src="imageUrl" alt="Gia đình Việt Nam truyền thống"
                            class="w-full h-96 object-cover rounded-lg mb-6" />

                        <div class="bg-amber-600 text-white p-6 rounded-lg">
                            <p class="text-lg italic leading-relaxed">
                                "Uống nước nhớ nguồn - Ăn quả nhớ người trồng cây"
                            </p>
                            <p class="text-sm mt-2 text-amber-100">
                                Tục ngữ Việt Nam
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>
</template>