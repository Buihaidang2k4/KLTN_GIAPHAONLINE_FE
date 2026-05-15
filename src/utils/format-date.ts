/**
 * Chuyển đổi định dạng ngày tháng từ dữ liệu backend/ Balkan sang định dạng ISO (YYYY-MM-DD)
 * để sử dụng cho <input type="date">
 */
export const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr || dateStr === "-" || dateStr === "") return "";
    
    // Nếu đã là định dạng YYYY-MM-DD (ISO)
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    
    // Nếu là định dạng DD/MM/YYYY (Thường gặp từ dữ liệu Balkan hoặc Backend cũ)
    const parts = dateStr.split("/");
    if (parts.length === 3) {
        const [day, month, year] = parts;
        // Đảm bảo đủ 2 chữ số cho tháng và ngày
        const formattedDay = day.padStart(2, '0');
        const formattedMonth = month.padStart(2, '0');
        return `${year}-${formattedMonth}-${formattedDay}`;
    }
    
    return "";
};