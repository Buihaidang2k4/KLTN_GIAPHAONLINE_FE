<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import TopBar from './TopBar.vue';
</script>

<template>
    <div class="flex h-screen bg-gray-100">

        <Sidebar />

        <div class="flex-1 flex flex-col">

            <TopBar />

            <main class="p-6 overflow-y-auto">
                <RouterView />
            </main>

        </div>

    </div>
</template>