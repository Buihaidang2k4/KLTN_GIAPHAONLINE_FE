<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import TopBar from './Topbar.vue';
</script>

<template>
    <div class="flex h-screen bg-gray-100">

        <Sidebar />

        <div class="flex-1 flex flex-col">

            <TopBar />

            <main class="flex-1 overflow-y-auto overflow-x-hidden p-6">
                <RouterView />
            </main>

        </div>

    </div>
</template>