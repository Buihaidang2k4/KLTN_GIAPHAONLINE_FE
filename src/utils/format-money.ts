/**
 * Format số tiền theo chuẩn Việt Nam
 * @param amount - Số tiền cần format
 * @param currency - Đơn vị tiền tệ (mặc định: 'VND')
 * @returns Chuỗi đã format, ví dụ: "500.000 VND"
 */
export const formatMoney = (amount: number, currency?: string): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num)) return '0'

    const formatted = new Intl.NumberFormat('vi-VN').format(num)
    return currency ? `${formatted} ${currency}` : formatted
}
