<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
    <div class="app-container">
        <main class="main-content">
            <RouterView />
        </main>
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
