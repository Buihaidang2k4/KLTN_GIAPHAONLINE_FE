import axios from "axios";
import { authService } from "./auth.service";
import { notify } from "@/utils/notify";

// instance api base 
const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
    timeout: 15000
})

api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
)

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const orginalRequest = error.config;
        const status = error.response?.status;

        if (!orginalRequest._retry && error.response?.status === 401) {
            orginalRequest._retry = true;

            // Bỏ qua interceptor cho chính các request auth như login, refresh-token
            if (orginalRequest.url?.includes('/auth/login') || orginalRequest.url?.includes('/auth/refresh-token')) {
                return Promise.reject(error);
            }

            try {
                await authService.refreshToken();
                return api(orginalRequest);
            } catch (refreshErr) {
                // Xóa sạch user trong LocalStorage để tránh router loop
                localStorage.removeItem("current_user");
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshErr);
            }
        }

        //  403: Không có quyền (Forbidden)
        if (status === 403) {
            notify.error("Truy cập bị từ chối", "Bạn không có quyền thực hiện hành động này.");
        }

        //  500 trở lên: Hệ thống lỗi
        if (status >= 500) {
            notify.error("Lỗi hệ thống", "Máy chủ đang bảo trì, vui lòng quay lại sau.");
        }

        // Xử lý lỗi mất mạng (Network Error)
        if (error.code === "ERR_NETWORK") {
            notify.error("Lỗi kết nối", "Vui lòng kiểm tra đường truyền internet.");
        }

        return Promise.reject(error);
    }
)

export default api;