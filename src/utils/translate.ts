import { translate } from '@vitalets/google-translate-api';

/**
 * Lấy message từ error object hoặc string
 */
function getErrorMessage(error: unknown): string {
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error?.response.data?.message || error?.message;
    return String(error);
}
