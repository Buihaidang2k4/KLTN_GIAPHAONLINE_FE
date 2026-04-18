
import { QueryClient } from '@tanstack/vue-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Thời gian dữ liệu được coi là "fresh" (không gọi lại API trong 5 phút)
            staleTime: 1000 * 60 * 5,
            // Thời gian dữ liệu được lưu trong bộ nhớ đệm (10 phút)
            gcTime: 1000 * 60 * 10,

            // Tự động gọi lại API khi người dùng quay lại tab trình duyệt
            refetchOnWindowFocus: true,

            // Tự động gọi lại API khi kết nối mạng được khôi phục
            refetchOnReconnect: true,

            // Không tự động gọi lại API khi component được mount nếu dữ liệu chưa stale
            refetchOnMount: true,

            /**
                 * Cơ chế Retry:
                 * Nếu API lỗi, sẽ thử lại tối đa 3 lần.
                 * Sử dụng exponential backoff (giống yêu cầu xử lý lỗi của hệ thống).
                 */
            retry: (failureCount: number, error: any) => {
                if ([401, 403, 404].includes(error?.response?.status)) {
                    return false;
                }
                return failureCount < 3;
            },

            retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
        },
        mutations: {
            retry: false,
        },
    },
}

);