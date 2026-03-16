<script setup lang="ts">
import About from '@/components/home_ui/About.vue';
import Banner from '@/components/home_ui/Banner.vue';
import CTA from '@/components/home_ui/CTA.vue';
import Features from '@/components/home_ui/Features.vue';
import Reviews from '@/components/home_ui/Reviews.vue';
import Pricing from '@/components/home_ui/price/Pricing.vue';

</script>

<template>
    <div class="bg-[#f4ecd8] min-h-screen font-sans text-[#2c1e12] bg-hero">

        <div id="banner">
            <Banner />
        </div>

        <div id="feature">
            <Features />
        </div>

        <div id="price">
            <Pricing />
        </div>

        <div id="about">
            <About />
        </div>
        <div id="reviews">
            <Reviews />
        </div>
        <div id="cta">
            <CTA />
        </div>
    </div>
</template>

<style scoped></style>