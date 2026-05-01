import { reactive, computed, type MaybeRef, unref } from "vue"

export function usePagination(defaultSize = 10, defaultPage = 0) {

    const pagination = reactive({
        page: defaultPage,
        size: defaultSize,
        totalPages: 1
    })

    const currentPage = computed(() => pagination.page)

    const hasNextPage = computed(() => pagination.page + 1 < pagination.totalPages)

    const hasPrevPage = computed(() => pagination.page > 0)

    const nextPage = () => {
        if (hasNextPage.value) {
            pagination.page++
        }
    }

    const prevPage = () => {
        if (hasPrevPage.value) {
            pagination.page--
        }
    }

    const setPage = (page: MaybeRef<number>) => {
        const pageValue = unref(page)   
        if (pageValue >= 0 && pageValue < pagination.totalPages) {
            pagination.page = pageValue
        }
    }

    const setTotalPages = (total: MaybeRef<number>) => {
        pagination.totalPages = unref(total) || 0
    }

    return {
        pagination,

        currentPage,
        hasNextPage,
        hasPrevPage,

        nextPage,
        prevPage,

        setPage,
        setTotalPages
    }
}