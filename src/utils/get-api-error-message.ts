import axios from "axios";
import { AUTH_ERROR_MAP } from "@/types/error/auth-error-map.types";
import { APP_ERROR_MAP } from "@/types/error/app-error-map.types";

type ApiErrorPayload = {
    code?: number;
    message?: string;
    timestamp?: string;
    error?: string;
    errors?: unknown;
};

const FALLBACK_BY_STATUS: Record<number, string> = {
    400: "Dữ liệu gửi lên không hợp lệ",
    401: "Bạn cần đăng nhập để tiếp tục",
    403: "Bạn không có quyền thực hiện thao tác này",
    404: "Không tìm thấy dữ liệu yêu cầu",
    409: "Dữ liệu bị xung đột",
    410: "Liên kết đã hết hạn hoặc không còn tồn tại",
    422: "Dữ liệu không đúng định dạng",
    500: "Hệ thống đang bận, vui lòng thử lại sau",
};

export function getApiErrorMessage(error: unknown): string {
    if (!axios.isAxiosError(error)) {
        return "Có lỗi xảy ra, vui lòng thử lại";
    }

    const status = error.response?.status;
    const data = error.response?.data as ApiErrorPayload | undefined;
    const code = data?.code;

    if (typeof code === "number") {
        if (AUTH_ERROR_MAP[code]) return AUTH_ERROR_MAP[code];
        if (APP_ERROR_MAP[code]) return APP_ERROR_MAP[code];
    }

    if (typeof data?.message === "string" && data.message.trim()) {
        const safeRawMessages = [
            "Account already exists",
            "Account not existed",
            "Password does not match",
            "Phone number is already registered",
        ];

        if (safeRawMessages.includes(data.message)) {
            return data.message;
        }
    }

    if (status && FALLBACK_BY_STATUS[status]) {
        return FALLBACK_BY_STATUS[status];
    }

    return "Có lỗi xảy ra, vui lòng thử lại";
}