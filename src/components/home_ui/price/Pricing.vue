<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PricingSection from '@/components/home_ui/price/PricingSection.vue'
import { useSubscriptionPlansQuery } from '@/hooks/queries/subscription_plan/useSubscriptionPlan'

const router = useRouter()

// Lấy danh sách các gói dịch vụ đang hoạt động
const { data: plansData } = useSubscriptionPlansQuery({ isActive: true })

const plans = computed(() => {
    const rawPlans = plansData.value?.data?.items ?? []
    return rawPlans.map((plan) => {
        // Tự tạo các tính năng dựa trên thông số gói dịch vụ
        const features = [
            `Tối đa ${plan.maxPerson} thành viên`,
            `Tối đa ${plan.maxAdmin} quản trị viên`,
            `Dung lượng ${plan.maxStorageMb >= 1024 ? (plan.maxStorageMb / 1024).toFixed(0) + ' GB' : plan.maxStorageMb + ' MB'}`,
            `Thời gian ${plan.durationMonth} tháng`
        ]
        
        return {
            id: String(plan.subscriptionPlanId),
            name: plan.namePlan,
            price: plan.price,
            description: plan.description || `Gói dịch vụ ${plan.namePlan} chất lượng cao.`,
            buttonText: plan.price === 0 ? 'Bắt đầu miễn phí' : 'Đăng ký ngay',
            highlighted: plan.code.toUpperCase().includes('PREMIUM'),
            features: features
        }
    })
})

const handleSelect = () => {
    router.push('/login')
}
</script>

<template>
    <div class="bg-stone-50">
        <PricingSection :plans="plans" @select="handleSelect" />
    </div>
</template>