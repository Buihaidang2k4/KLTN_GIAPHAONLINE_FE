<script setup lang="ts">

import PricingSection from '@/components/home_ui/price/PricingSection.vue'

const plans = [

    {
        id: "basic",
        name: "Basic",
        price: 0,
        description: "Perfect for getting started with your personal tree",
        buttonText: "Get Started",
        features: [
            "Up to 50 Family Members",
            "Basic Tree View",
            "Standard Community Support",
            "Cloud Document Storage"
        ]
    },

    {
        id: "premium",
        name: "Premium",
        price: 19,
        description: "The ultimate toolkit for dedicated family historians.",
        highlighted: true,
        buttonText: "Upgrade Now",
        features: [
            "Unlimited Family Members",
            "Cloud Storage for Documents",
            "Advanced Tree Visualization",
            "Priority Email Support",
            "Smart Historical Hints"
        ]
    },

    {
        id: "legacy",
        name: "Legacy",
        price: 49,
        description: "Comprehensive suite for genealogy professionals",
        buttonText: "Upgrade Now",
        features: [
            "Everything in Premium",
            "24/7 Priority Support",
            "DNA Data Analysis Tools",
            "Professional Research Suite"
        ]
    }

]

</script>

<template>
    <div class="bg-stone-50">

        <PricingSection :plans="plans" />
    </div>

</template>