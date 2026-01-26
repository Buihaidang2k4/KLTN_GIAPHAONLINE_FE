import { toast } from "vue-sonner";

export const notify = {
  success: (message: string, title = "Success") => {
    toast.success(message, {
      description: title,
      duration: 2000,
    });
  },

  error: (message: string, title = "Error") => {
    toast.error(message, {
      description: title,
      duration: 2000,
    });
  },

  info: (message: string, title = "Info") => {
    toast(message, {
      description: title,
      duration: 2000,
    });
  },

  warning: (message: string, title = "Warning") => {
    toast.warning(message, {
      description: title,
      duration: 2000,
    });
  },
};
