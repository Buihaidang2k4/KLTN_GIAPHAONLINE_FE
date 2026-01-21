import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore('auth', () => {
    const user = ref<any>(null)

    const setUser = (user: any) => {
        user.value = user   
    }

    const logout = () => {
        user.value = null
    }

    return {
        user,
        setUser,
        logout
    }
})

const emit = defineEmits<{
  save: [id: number]
  delete: [id: number]
  cancel: []
}>()
