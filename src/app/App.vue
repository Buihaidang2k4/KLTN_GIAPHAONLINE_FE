<script setup lang="ts">
import { RouterView } from 'vue-router';
import { Toaster } from 'vue-sonner';
</script>

<template>
    <div class="app-container">
        <main class="main-content">
            <RouterView />
        </main>

        <Toaster rich-colors position="top-right" :close-button="true" :expand="false" :visible-toasts="5"
            :toast-options="{
                style: { padding: '12px 16px', borderRadius: '12px' },
                class: 'my-custom-toast',
            }" />
    </div>
</template>

<style>
.app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.main-content {
    flex: 1;
}

body,
html {
    margin: 0;
    padding: 0;
    height: 100%;
    scroll-behavior: smooth;
}
</style>
