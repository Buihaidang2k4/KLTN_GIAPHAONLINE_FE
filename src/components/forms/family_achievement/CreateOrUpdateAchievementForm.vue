<script setup lang="ts">
import type { FamilyAchievementReq, FamilyAchievementRes, UpdateFamilyAchievementReq } from '@/types/family/family-achievement.types';


const props = defineProps<{
    show: boolean
    mode: 'create' | 'update'
    achievement?: FamilyAchievementRes | null | undefined
    isLoading?: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'submit', data: FamilyAchievementReq | UpdateFamilyAchievementReq): void
}>()


</script>

<template>
    <Teleport to="body">

    </Teleport>
</template>


<style scoped></style>