<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavBar from './NavBar.vue';
import TopBar from './TopBar.vue';
import { useFamilyStore } from '@/store/family/useFamilyStore';
import { computed } from 'vue';
import { useFamilySubscriptionStore } from '@/store/family/useFamilySubscriptionStore';



const familyStore = useFamilyStore()
const familyId = computed(() => familyStore.currentFamilyId)
const subStore = useFamilySubscriptionStore()
subStore.init(familyId)

</script>

<template>
    <div class="flex h-screen bg-[#f6f1e7]">
        <NavBar />
        <main class="flex-1 overflow-auto">
            <TopBar />
            <RouterView />
        </main>
    </div>
</template>

<style scoped></style>