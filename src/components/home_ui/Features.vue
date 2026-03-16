<script setup lang="ts">
import { Users, TreePine, Shield, Globe, Camera, BookMarked } from 'lucide-vue-next'

const bg_features =
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2000&auto=format&fit=crop'

const featureShowcase =
    'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1600&auto=format&fit=crop'

const features = [
    {
        icon: TreePine,
        title: 'Cây gia đình trực quan',
        description:
            'Xem toàn bộ dòng họ dưới dạng cây gia đình sinh động, dễ dàng tìm kiếm và khám phá.',
        image:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop'
    },
    {
        icon: Users,
        title: 'Quản lý thành viên',
        description:
            'Thêm, chỉnh sửa thông tin thành viên với đầy đủ chi tiết như ngày sinh, ảnh, tiểu sử.',
        image:
            'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=1200&auto=format&fit=crop'
    },
    {
        icon: Camera,
        title: 'Lưu trữ ảnh & tài liệu',
        description:
            'Bảo quản hình ảnh, giấy tờ, câu chuyện của gia đình qua nhiều thế hệ một cách an toàn.',
        image:
            'https://images.unsplash.com/photo-1516541196182-6bdb0516ed27?q=80&w=1200&auto=format&fit=crop'
    },
    {
        icon: Shield,
        title: 'Bảo mật tuyệt đối',
        description:
            'Dữ liệu gia đình được mã hóa và bảo vệ với các tiêu chuẩn bảo mật cao nhất.',
        image:
            'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&auto=format&fit=crop'
    },
    {
        icon: Globe,
        title: 'Chia sẻ dễ dàng',
        description:
            'Mời thành viên gia đình tham gia và cùng nhau xây dựng cây gia phả hoàn chỉnh.',
        image:
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop'
    },
    {
        icon: BookMarked,
        title: 'In ấn truyền thống',
        description:
            'Xuất gia phả theo định dạng truyền thống hoặc in thành sách để lưu giữ.',
        image:
            'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop'
    }
]
</script>

<template>
    <section id="features" class="relative overflow-hidden py-24 md:py-28 bg-cover bg-center bg-fixed"
        :style="{ backgroundImage: `url(${bg_features})` }">
        <!-- Background overlay -->
        <div class="absolute inset-0 bg-stone-950/60"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-stone-950/40 via-stone-900/30 to-stone-950/70"></div>

        <!-- Blur decorations -->
        <div class="absolute -top-20 -left-20 w-72 h-72 bg-amber-300/10 blur-3xl rounded-full"></div>
        <div class="absolute -bottom-20 -right-20 w-80 h-80 bg-stone-100/10 blur-3xl rounded-full"></div>

        <div class="relative z-10 max-w-7xl mx-auto px-6">
            <!-- Header -->
            <div class="text-center mb-16 md:mb-20">
                <div
                    class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-stone-100 mb-6">
                    <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span class="text-sm uppercase tracking-[0.2em]">
                        Gia phả số hiện đại
                    </span>
                </div>

                <div class="w-16 h-[2px] bg-amber-400 mx-auto mb-6"></div>

                <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
                    Tính năng nổi bật
                </h2>

                <p class="text-lg md:text-xl text-stone-200/90 max-w-3xl mx-auto leading-relaxed">
                    Công cụ hiện đại kết hợp giá trị truyền thống để bảo tồn và phát triển
                    di sản gia đình qua nhiều thế hệ một cách trực quan, sang trọng và dễ sử dụng.
                </p>
            </div>

            <!-- Main content -->
            <div class="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                <!-- Left -->
                <div class="lg:col-span-7 grid sm:grid-cols-2 gap-6">
                    <div v-for="(feature, index) in features" :key="index"
                        class="group overflow-hidden rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition-all duration-500 hover:-translate-y-2 hover:bg-white/15 hover:shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                        <!-- Image -->
                        <div class="relative h-48 overflow-hidden">
                            <img :src="feature.image" :alt="feature.title"
                                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-900/20 to-transparent">
                            </div>

                            <!-- Icon -->
                            <div
                                class="absolute top-4 left-4 w-14 h-14 rounded-2xl bg-white/85 backdrop-blur-md flex items-center justify-center shadow-lg">
                                <component :is="feature.icon" class="w-7 h-7 text-stone-800" />
                            </div>
                        </div>

                        <!-- Text -->
                        <div class="p-6">
                            <h3
                                class="text-xl md:text-2xl font-semibold text-white mb-3 transition-colors group-hover:text-amber-200">
                                {{ feature.title }}
                            </h3>

                            <p class="text-stone-200/85 leading-relaxed">
                                {{ feature.description }}
                            </p>

                            <div
                                class="mt-5 inline-flex items-center gap-2 text-amber-300 text-sm font-medium opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                                <span>Khám phá thêm</span>
                                <span>→</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right -->
                <div class="lg:col-span-5">
                    <div
                        class="sticky top-24 rounded-[32px] overflow-hidden border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                        <div class="relative h-[320px] md:h-[460px]">
                            <img :src="featureShowcase" alt="Gia phả minh họa" class="w-full h-full object-cover" />
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/25 to-transparent">
                            </div>

                            <div class="absolute inset-x-0 bottom-0 p-8">
                                <div
                                    class="inline-flex items-center px-3 py-1.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/20 text-sm mb-4 backdrop-blur-md">
                                    Lưu giữ giá trị gia đình
                                </div>

                                <h3 class="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
                                    Kết nối các thế hệ trong một không gian số trang trọng
                                </h3>

                                <p class="text-stone-200/85 leading-relaxed">
                                    Từ sơ đồ phả hệ, hồ sơ thành viên, thư viện ảnh đến in ấn truyền thống,
                                    tất cả được tích hợp trong một nền tảng thống nhất và dễ quản lý.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>