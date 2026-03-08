<script setup lang="ts">
import TheFooter from './TheFooter.vue';
import TheHeader from './TheHeader.vue';
import { RouterView } from 'vue-router';
</script>

<template>
    <div>
        <TheHeader />
        <main class="main-content">
            <RouterView />
        </main>
        <TheFooter />
    </div>
</template>

<style scoped></style>