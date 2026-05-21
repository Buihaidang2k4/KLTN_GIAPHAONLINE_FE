<script setup lang="ts">
// hình ảnh demo sau thêm dữ liệu có thể chỉnh sửa từ admin 
// Bạn có thể thay các link ảnh này bằng ảnh thật của gia đình bạn
const anhOngNoi = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=500';
const anhGiaDinh = 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=500';
const anhAnhEm = 'https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=500';
</script>

<template>
    <section class="relative overflow-hidden py-16 lg:py-24 border-b border-sepia-dark/20">
        <div class="mx-auto max-w-7xl px-6 lg:flex lg:items-center lg:gap-12">

            <div class="max-w-2xl lg:flex-1">
                <div
                    class="mb-6 inline-flex items-center gap-2 rounded-full bg-amber-200/50 px-4 py-1 text-sm font-medium text-amber-900 border border-amber-300">
                    <span class="animate-pulse text-red-500">❤️</span>
                    Nơi lưu giữ linh hồn dòng tộc
                </div>

                <h1 class="text-5xl font-bold leading-tight tracking-tight sm:text-6xl mb-6 text-[#5e4632]">
                    Mọi Gia Đình Đều Có <br />
                    <span class="text-[#af944d] italic font-cursive text-7xl">Một Câu Chuyện.</span>
                </h1>

                <p class="text-lg text-[#2c1e12]/80 mb-10 max-w-lg leading-relaxed">
                    Chúng tôi giúp bạn kết nối các thế hệ trong gia đình, dựng lại những nhịp cầu thời gian và gìn giữ
                    ký ức, truyền thống của tổ tiên để những giá trị ấy luôn được lưu truyền cho mai sau.🌿
                </p>

                <div class="flex flex-col sm:flex-row gap-4">
                    <RouterLink to="/login"
                        class="flex items-center justify-center gap-2 rounded-lg bg-[#5e4632] px-8 py-4 text-lg font-bold text-[#f4ecd8] shadow-xl hover:bg-[#2c1e12] transition-all transform hover:-translate-y-1">
                        Bắt đầu
                        <span class="material-symbols-outlined">tạo gia phả đầu tiên</span>
                    </RouterLink>
                </div>
            </div>

            <div class="mt-16 lg:mt-0 lg:flex-1 relative flex justify-center">
                <div class="relative w-full max-w-md h-[500px]">

                    <div
                        class="absolute top-0 left-0 z-10 -rotate-12 hover:rotate-0 hover:z-50 transition-all duration-500 cursor-pointer group">
                        <div class="bg-white p-3 pb-12 shadow-2xl border border-gray-100 rounded-sm">
                            <div class="overflow-hidden">
                                <img :src="anhOngNoi"
                                    class="h-48 w-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            </div>
                            <p class="mt-4 text-center font-cursive text-xl text-sepia-dark">Kỷ niệm 1952 ❤️</p>
                        </div>
                    </div>

                    <div
                        class="absolute top-12 right-0 z-20 rotate-6 hover:rotate-0 hover:z-50 transition-all duration-500 cursor-pointer group">
                        <div class="bg-white p-3 pb-14 shadow-2xl border border-gray-100 rounded-sm relative">
                            <img :src="anhGiaDinh"
                                class="h-56 w-56 object-cover sepia group-hover:sepia-0 transition-all duration-700" />
                            <p class="mt-4 text-center font-cursive text-xl text-sepia-dark">Ngày đoàn viên 💖</p>
                            <span class="absolute -top-4 -right-4 text-3xl animate-bounce">💖</span>
                            <span
                                class="absolute top-1/2 -left-4 text-xl opacity-0 group-hover:opacity-100 transition-opacity">💝</span>
                        </div>
                    </div>

                    <div
                        class="absolute bottom-4 left-10 z-30 rotate-3 hover:rotate-0 hover:z-50 transition-all duration-500 cursor-pointer group">
                        <div class="bg-white p-3 pb-10 shadow-2xl border border-gray-100 rounded-sm">
                            <img :src="anhAnhEm"
                                class="h-40 w-60 object-cover brightness-90 group-hover:brightness-110 transition-all" />
                            <p class="mt-3 text-center font-cursive text-lg">Anh em một nhà</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>
</template>

<style scoped></style>