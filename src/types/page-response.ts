export interface PageResponse<T> {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;

    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;

    sortBy: string;
    sortDirection: string;

    items: T[];
}
