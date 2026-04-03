<script setup lang="ts">
import { Check } from 'lucide-vue-next'

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
    plan: Plan
}>()

</script>

<template>
    <div class="rounded-2xl border p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 relative"
        :class="plan.highlighted
            ? 'bg-stone-800 text-white border-stone-700 shadow-2xl shadow-stone-900/30 scale-[1.03] z-10'
            : 'bg-white border-stone-200 hover:shadow-xl hover:border-stone-300'">

        <!-- Badge phổ biến -->
        <div v-if="plan.highlighted"
            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-stone-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
            Phổ biến nhất
        </div>

        <div>
            <!-- Plan name -->
            <div class="text-xs uppercase font-bold tracking-widest"
                :class="plan.highlighted ? 'text-amber-400' : 'text-stone-400'">
                {{ plan.name }}
            </div>

            <!-- Price -->
            <div class="mt-4 flex items-end gap-1">
                <span class="text-5xl font-extrabold tracking-tight"
                    :class="plan.highlighted ? 'text-white' : 'text-stone-800'">
                    {{ plan.price === 0 ? 'Miễn phí' : `$${plan.price}` }}
                </span>
                <span v-if="plan.price > 0" class="text-sm mb-1.5"
                    :class="plan.highlighted ? 'text-stone-400' : 'text-stone-400'">
                    /tháng
                </span>
            </div>

            <!-- Description -->
            <p class="text-sm mt-3 leading-relaxed" :class="plan.highlighted ? 'text-stone-300' : 'text-stone-500'">
                {{ plan.description }}
            </p>

            <!-- Divider -->
            <div class="w-full h-px my-6" :class="plan.highlighted ? 'bg-stone-700' : 'bg-stone-100'">
            </div>

            <!-- Features -->
            <ul class="space-y-4">
                <li v-for="feature in plan.features" :key="feature" class="flex items-center gap-3 text-sm">
                    <div class="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        :class="plan.highlighted ? 'bg-amber-400/20' : 'bg-stone-100'">
                        <Check :size="12" :class="plan.highlighted ? 'text-amber-400' : 'text-stone-600'" />
                    </div>
                    <span :class="plan.highlighted ? 'text-stone-200' : 'text-stone-600'">
                        {{ feature }}
                    </span>
                </li>
            </ul>
        </div>

        <!-- Button -->
        <button class="mt-10 w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300"
            :class="plan.highlighted
                ? 'bg-amber-400 text-stone-900 hover:bg-amber-300 shadow-lg shadow-amber-400/20'
                : 'bg-stone-800 text-white hover:bg-stone-700'">
            {{ plan.buttonText }}
        </button>
    </div>
</template>