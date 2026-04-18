export const formatDate = (
    date: string | Date | null | undefined,
    options?: Intl.DateTimeFormatOptions
): string => {
    if (!date) return "-";

    const parsedDate = typeof date === "string" ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) return "-";

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        ...options
    }).format(parsedDate);
};


export const formatDateTime = (
    date: string | Date | null | undefined,
    options?: Intl.DateTimeFormatOptions
): string => {
    if (!date) return "-";

    const parsedDate = typeof date === "string" ? new Date(date) : date;

    if (isNaN(parsedDate.getTime())) return "-";

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        ...options
    }).format(parsedDate);
};


export const formatRelativeTime = (date: string | Date) => {
    const now = new Date();
    const parsed = typeof date === "string" ? new Date(date) : date;

    const diff = now.getTime() - parsed.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 60) return `${minutes} phút trước`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;

    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
};