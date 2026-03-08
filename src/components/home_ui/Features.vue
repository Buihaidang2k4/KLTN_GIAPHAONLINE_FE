<script setup lang="ts">
import { Users, TreePine, Shield, Globe, Camera, BookMarked } from 'lucide-vue-next'
import bg_features from '@/assets/images/bg_features.jpg'


const features = [
    {
        icon: TreePine,
        title: 'Cây gia đình trực quan',
        description: 'Xem toàn bộ dòng họ dưới dạng cây gia đình sinh động, dễ dàng tìm kiếm và khám phá.'
    },
    {
        icon: Users,
        title: 'Quản lý thành viên',
        description: 'Thêm, chỉnh sửa thông tin thành viên với đầy đủ chi tiết như ngày sinh, ảnh, tiểu sử.'
    },
    {
        icon: Camera,
        title: 'Lưu trữ ảnh & tài liệu',
        description: 'Bảo quản hình ảnh, giấy tờ, câu chuyện của gia đình qua nhiều thế hệ một cách an toàn.'
    },
    {
        icon: Shield,
        title: 'Bảo mật tuyệt đối',
        description: 'Dữ liệu gia đình được mã hóa và bảo vệ với các tiêu chuẩn bảo mật cao nhất.'
    },
    {
        icon: Globe,
        title: 'Chia sẻ dễ dàng',
        description: 'Mời thành viên gia đình tham gia và cùng nhau xây dựng cây gia phả hoàn chỉnh.'
    },
    {
        icon: BookMarked,
        title: 'In ấn truyền thống',
        description: 'Xuất gia phả theo định dạng truyền thống hoặc in thành sách để lưu giữ.'
    }
]
</script>

<template>
    <section id="features" class="py-28 relative bg-cover bg-center bg-fixed"
        :style="{ backgroundImage: `url(${bg_features})` }">
        <!-- Overlay để nội dung dễ đọc -->
        <div class="absolute inset-0 bg-stone-100/50 backdrop-blur-sm"></div>

        <div class="max-w-7xl mx-auto px-6 relative z-10">

            <!-- Header -->
            <div class="text-center mb-20">
                <div class="w-14 h-[2px] bg-stone-600 mx-auto mb-6"></div>

                <h2 class="text-5xl font-bold text-stone-800 mb-6 tracking-tight">
                    Tính năng nổi bật
                </h2>

                <p class="text-xl text-stone-700/80 max-w-2xl mx-auto leading-relaxed">
                    Công cụ hiện đại kết hợp giá trị truyền thống để bảo tồn
                    và phát triển di sản gia đình qua nhiều thế hệ.
                </p>
            </div>

            <!-- Grid -->
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div v-for="(feature, index) in features" :key="index" class="bg-white
                 p-10 rounded-2xl
                 border border-stone-300/40
                 transition-all duration-300
                 hover:-translate-y-2
                 hover:shadow-lg
                 hover:border-stone-400/60
                 group cursor-pointer">

                    <!-- Icon -->
                    <div class="w-16 h-16
                   bg-stone-200
                   rounded-xl
                   flex items-center justify-center
                   mb-6
                   group-hover:bg-stone-300
                   transition-colors duration-300">
                        <component :is="feature.icon" class="w-8 h-8 text-stone-700
                     group-hover:text-stone-900
                     transition-colors duration-300" />
                    </div>

                    <!-- Title -->
                    <h3 class="text-2xl font-semibold text-stone-800
                   mb-4
                   group-hover:text-stone-900
                   transition-colors">
                        {{ feature.title }}
                    </h3>

                    <!-- Description -->
                    <p class="text-stone-700/80 leading-relaxed text-lg">
                        {{ feature.description }}
                    </p>

                </div>
            </div>

        </div>
    </section>
</template>