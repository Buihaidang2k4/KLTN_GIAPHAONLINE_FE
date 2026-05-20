<script setup lang="ts">

import PricingCard from './PricingCard.vue'

interface Plan {
    id: string
    name: string
    price: number
    description: string
    features: string[]
    highlighted?: boolean
    buttonText: string
}

defineProps<{
    plans: Plan[]
}>()

const emit = defineEmits<{
    (e: 'select', plan: Plan): void
}>()

</script>

<template>
    <section class="max-w-6xl mx-auto py-24 px-6">

        <div class="text-center mb-16">
            <div class="w-14 h-[2px] bg-stone-600 mx-auto mb-6"></div>

            <h2 class="text-5xl font-bold text-stone-800 tracking-tight">
                Gói dịch vụ
            </h2>

            <p class="text-lg text-stone-500 mt-4 max-w-xl mx-auto leading-relaxed">
                Chọn gói phù hợp để bắt đầu hành trình gìn giữ di sản gia đình
            </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 items-stretch">
            <PricingCard v-for="plan in plans" :key="plan.id" :plan="plan" @select="emit('select', $event)" />
        </div>

    </section>
</template>