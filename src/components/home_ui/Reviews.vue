<script setup lang="ts">
import { Star } from 'lucide-vue-next'

const testimonials = [
    {
        name: 'Ông Nguyễn Văn An',
        role: 'Trưởng họ Nguyễn',
        content: 'Tôi đã tìm được cách để lưu giữ thông tin gia đình qua 8 đời. Con cháu giờ đây có thể dễ dàng tìm hiểu về tổ tiên của mình.',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80'
    },
    {
        name: 'Bà Trần Thị Mai',
        role: 'Chủ tộc họ Trần',
        content: 'Ứng dụng rất dễ sử dụng, tôi 65 tuổi vẫn tự mình thêm được hơn 100 thành viên vào gia phả. Rất hữu ích!',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80'
    },
    {
        name: 'Anh Lê Minh Tuấn',
        role: 'Kỹ sư IT',
        content: 'Giao diện đẹp, tính năng đầy đủ. Tôi đã giới thiệu cho cả họ hàng sử dụng để cùng nhau xây dựng gia phả số.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80'
    }
]
</script>

<template>
    <section id="testimonials" class="py-24 bg-gradient-to-b from-white to-amber-50">
        <div class="max-w-7xl mx-auto px-6">

            <!-- Header -->
            <div class="text-center mb-16">
                <div class="w-16 h-1 bg-amber-600 mx-auto mb-4"></div>

                <h2 class="text-5xl font-bold text-amber-900 mb-4">
                    Người dùng nói gì
                </h2>

                <p class="text-xl text-amber-800 max-w-2xl mx-auto">
                    Hàng ngàn gia đình đã tin tưởng và sử dụng Gia Phả Việt
                </p>
            </div>

            <!-- Cards -->
            <div class="grid md:grid-cols-3 gap-8">
                <div v-for="(testimonial, index) in testimonials" :key="index" class="bg-white p-8 rounded-xl border border-amber-200 
                 shadow-md hover:shadow-xl transition-all duration-300">
                    <!-- Stars -->
                    <div class="flex gap-1 mb-6">
                        <Star v-for="i in 5" :key="i" class="w-5 h-5 fill-amber-500 text-amber-500" />
                    </div>

                    <!-- Content -->
                    <p class="text-amber-900 leading-relaxed mb-6 text-lg italic">
                        "{{ testimonial.content }}"
                    </p>

                    <!-- User -->
                    <div class="flex items-center gap-4">
                        <img :src="testimonial.image" :alt="testimonial.name"
                            class="w-16 h-16 rounded-full object-cover border-2 border-amber-500" />

                        <div>
                            <div class="font-semibold text-amber-900">
                                {{ testimonial.name }}
                            </div>
                            <div class="text-sm text-amber-700">
                                {{ testimonial.role }}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </section>
</template>