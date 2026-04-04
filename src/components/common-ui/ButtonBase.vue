<script setup lang="ts">
import { computed } from 'vue'
import { Loader2 } from 'lucide-vue-next'

interface Props {
    type?: 'button' | 'submit' | 'reset'
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'amber'
    size?: 'sm' | 'md' | 'lg' | 'icon'
    isLoading?: boolean
    disabled?: boolean
    leftIcon?: any
    rightIcon?: any
    fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    type: 'button',
    variant: 'primary',
    size: 'md',
    isLoading: false,
    disabled: false,
    fullWidth: false
})

const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900 shadow-md shadow-slate-200',
    outline: 'bg-white border-2 border-slate-200 text-slate-600 hover:border-indigo-500 hover:text-indigo-600',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-100',
    amber: 'bg-amber-500 text-white hover:bg-amber-600 shadow-md shadow-amber-100'
}

const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-2xl gap-2',
    lg: 'px-8 py-4 text-base rounded-[1.25rem] gap-3',
    icon: 'p-2.5 rounded-xl'
}

const buttonClasses = computed(() => [
    'inline-flex items-center justify-center font-bold transition-all duration-200 active:scale-95 select-none cursor-pointer',
    'disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100',
    variants[props.variant],
    sizes[props.size],
    props.fullWidth ? 'w-full' : ''
])
</script>

<template>
    <button v-bind="$attrs" :type="type" :disabled="disabled || isLoading" :class="buttonClasses">
        <Loader2 v-if="isLoading" class="w-4 h-4 animate-spin" />

        <component :is="leftIcon" v-if="leftIcon && !isLoading" class="w-[1.2em] h-[1.2em]" />

        <span v-if="size !== 'icon'" class="truncate">
            <slot />
        </span>

        <component :is="rightIcon" v-if="rightIcon && !isLoading" class="w-[1.2em] h-[1.2em]" />
    </button>
</template>

<style scoped>
button {
    font-family: 'Plus Jakarta Sans', sans-serif;
    outline: none;
}
</style>