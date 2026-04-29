import type { PageParams } from "@/types/page-response.types"
import { reactive } from "vue"

export function usePagination() {
    const params = reactive<PageParams>({
        page: 0,
        size: 10,
        sort: ""
    })

    const nextPage = () => params?.page++
    const prevPage = () => params?.page--

    return { params, nextPage, prevPage }
}