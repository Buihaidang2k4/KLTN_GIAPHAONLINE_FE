import { toast } from 'vue-sonner'

export const notify = {
  success(message: string) {
    toast.success(message)
  },

  error(message: string) {
    toast.error(message)
  },

  warning(message: string) {
    toast.warning(message)
  },

  info(message: string) {
    toast.info(message)
  },

  apiError(error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Đã xảy ra lỗi hệ thống'

    toast.error(message)
  }
}
