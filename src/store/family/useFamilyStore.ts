// stores/useFamilyStore.ts
import { defineStore } from "pinia"
import { ref } from "vue"

export const useFamilyStore = defineStore(
    "family",
    () => {
        const currentFamilyId = ref<number | null | undefined>(null)

        const setFamily = (id: number) => {
            currentFamilyId.value = id
        }

        return { currentFamilyId, setFamily }
    },
    {
        persist: true
    }
)