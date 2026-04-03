<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
    Trophy,
    Medal,
    Award,
    GraduationCap,
    Building2,
    Search,
    ChevronLeft,
    ChevronRight,
    User,
    CalendarDays,
    Eye
} from 'lucide-vue-next'

interface Person {
    name: string
    avatar?: string
}

interface Achievement {
    achievementId: number
    person: Person
    achievementType: 'ACADEMIC' | 'SOCIAL' | 'SPORT' | 'PROFESSIONAL'
    name: string
    rank: string
    organization: string
    achievedDate: string
    description: string
    evidenceUrl: string
}

const achievements = ref<Achievement[]>([
    {
        achievementId: 1,
        person: { name: 'Bùi Hải Đăng', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dang' },
        achievementType: 'ACADEMIC',
        name: 'Thủ khoa xuất sắc tốt nghiệp Đại học Bách Khoa',
        rank: 'Xuất sắc',
        organization: 'Đại học Bách Khoa Hà Nội',
        achievedDate: '2023-07-15',
        description: 'Sinh viên tiêu biểu toàn khóa, đạt điểm rèn luyện và học tập cao nhất ngành kỹ thuật máy tính.',
        evidenceUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=800'
    },
    {
        achievementId: 2,
        person: { name: 'Bùi Xuân Huấn', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Huan' },
        achievementType: 'SOCIAL',
        name: 'Huân chương Lao động hạng Ba',
        rank: 'Hạng Ba',
        organization: 'Chủ tịch nước',
        achievedDate: '2022-12-20',
        description: 'Đóng góp tích cực trong công tác xây dựng nông thôn mới và các hoạt động thiện nguyện vùng cao.',
        evidenceUrl: 'https://images.unsplash.com/photo-1621352973024-958564030676?q=80&w=800'
    },
    {
        achievementId: 3,
        person: { name: 'Bùi Thị Lan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lan' },
        achievementType: 'SPORT',
        name: 'Huy chương Vàng Seagames 31',
        rank: 'Vô địch',
        organization: 'Liên đoàn Điền kinh Việt Nam',
        achievedDate: '2022-05-18',
        description: 'Phá kỷ lục Seagames nội dung chạy 400m rào nữ với thành tích nổi bật.',
        evidenceUrl: 'https://images.unsplash.com/photo-1578267139713-267bc033999e?q=80&w=800'
    },
    {
        achievementId: 4,
        person: { name: 'Bùi Văn An', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An' },
        achievementType: 'PROFESSIONAL',
        name: 'Kỹ sư tiêu biểu năm 2023',
        rank: 'Tiêu biểu',
        organization: 'Tập đoàn Công nghệ FPT',
        achievedDate: '2023-11-10',
        description: 'Có nhiều sáng kiến cải tiến quy trình sản xuất phần mềm giúp tăng hiệu quả làm việc.',
        evidenceUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800'
    }
])

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(8)

watch([searchQuery, itemsPerPage], () => {
    currentPage.value = 1
})

const filteredItems = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return achievements.value

    return achievements.value.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.person.name.toLowerCase().includes(query) ||
        item.organization.toLowerCase().includes(query) ||
        item.rank.toLowerCase().includes(query)
    )
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredItems.value.length / itemsPerPage.value)))

const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredItems.value.slice(start, start + itemsPerPage.value)
})

const startIndex = computed(() => {
    if (filteredItems.value.length === 0) return 0
    return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endIndex = computed(() => {
    return Math.min(currentPage.value * itemsPerPage.value, filteredItems.value.length)
})

const getTypeStyle = (type: string) => {
    switch (type) {
        case 'ACADEMIC':
            return {
                icon: GraduationCap,
                label: 'Học thuật',
                badge: 'bg-blue-50 text-blue-700 border-blue-100'
            }
        case 'SOCIAL':
            return {
                icon: Award,
                label: 'Xã hội',
                badge: 'bg-purple-50 text-purple-700 border-purple-100'
            }
        case 'SPORT':
            return {
                icon: Trophy,
                label: 'Thể thao',
                badge: 'bg-orange-50 text-orange-700 border-orange-100'
            }
        default:
            return {
                icon: Medal,
                label: 'Sự nghiệp',
                badge: 'bg-emerald-50 text-emerald-700 border-emerald-100'
            }
    }
}

const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    })
}

const visiblePages = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const pages: (number | string)[] = []

    if (total <= 7) {
        for (let i = 1; i <= total; i++) pages.push(i)
        return pages
    }

    pages.push(1)

    if (current > 3) pages.push('...')

    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    if (current < total - 2) pages.push('...')

    pages.push(total)

    return pages
})

const goToPage = (page: number | string) => {
    if (typeof page === 'number') currentPage.value = page
}
</script>

<template>
    <div class="min-h-screen bg-slate-50 p-4 md:p-8">
        <div class="max-w-7xl mx-auto space-y-6">

            <!-- Header -->
            <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <div
                        class="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-100">
                        <Trophy :size="14" />
                        Bảng vàng dòng họ
                    </div>
                    <h1 class="mt-3 text-2xl md:text-3xl font-bold text-slate-900">
                        Thành tích dòng họ
                    </h1>
                    <p class="mt-2 text-sm text-slate-500">
                        Danh sách thành tích được trình bày gọn gàng, dễ theo dõi khi số lượng thành viên lớn.
                    </p>
                </div>
            </div>

            <!-- Toolbar -->
            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div class="relative w-full md:max-w-md">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" :size="18" />
                        <input v-model="searchQuery" type="text" placeholder="Tìm theo tên, giải thưởng, tổ chức..."
                            class="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:bg-white" />
                    </div>

                    <div class="flex items-center gap-3">
                        <span class="text-sm text-slate-500">Hiển thị</span>
                        <select v-model="itemsPerPage"
                            class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500">
                            <option :value="6">6</option>
                            <option :value="8">8</option>
                            <option :value="12">12</option>
                            <option :value="16">16</option>
                        </select>
                        <span class="text-sm text-slate-500">/ trang</span>
                    </div>
                </div>
            </div>

            <!-- Grid -->
            <div v-if="filteredItems.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div v-for="item in paginatedItems" :key="item.achievementId"
                    class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all">
                    <!-- top -->
                    <div class="flex items-start gap-3">
                        <img :src="item.person.avatar || item.evidenceUrl" alt="avatar"
                            class="h-12 w-12 rounded-full object-cover border border-slate-200" />

                        <div class="min-w-0 flex-1">
                            <div class="flex items-start justify-between gap-2">
                                <div class="min-w-0">
                                    <h3 class="truncate text-sm font-bold text-slate-900">
                                        {{ item.person.name }}
                                    </h3>
                                    <p class="mt-0.5 text-xs text-slate-500 flex items-center gap-1">
                                        <CalendarDays :size="13" />
                                        {{ formatDate(item.achievedDate) }}
                                    </p>
                                </div>

                                <div class="shrink-0 inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold"
                                    :class="getTypeStyle(item.achievementType).badge">
                                    <component :is="getTypeStyle(item.achievementType).icon" :size="12" />
                                    {{ getTypeStyle(item.achievementType).label }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- content -->
                    <div class="mt-4 space-y-3">
                        <h2 class="line-clamp-2 text-base font-semibold leading-6 text-slate-800">
                            {{ item.name }}
                        </h2>

                        <div class="flex flex-wrap gap-2">
                            <span
                                class="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-100">
                                {{ item.rank }}
                            </span>
                            <span
                                class="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 border border-slate-100 max-w-full">
                                <Building2 :size="12" />
                                <span class="truncate max-w-[180px]">{{ item.organization }}</span>
                            </span>
                        </div>

                        <p class="line-clamp-2 text-sm text-slate-500 leading-6">
                            {{ item.description }}
                        </p>
                    </div>

                    <!-- footer -->
                    <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <button
                            class="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition">
                            <Eye :size="16" />
                            Xem chi tiết
                        </button>

                        <div class="text-xs text-slate-400">
                            ID: #{{ item.achievementId }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty -->
            <div v-else class="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <Search :size="20" class="text-slate-400" />
                </div>
                <h3 class="text-base font-semibold text-slate-800">Không tìm thấy kết quả</h3>
                <p class="mt-1 text-sm text-slate-500">
                    Không có dữ liệu phù hợp với từ khóa "{{ searchQuery }}"
                </p>
            </div>

            <!-- Pagination -->
            <div v-if="filteredItems.length > 0"
                class="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
                <div class="text-sm text-slate-500">
                    Hiển thị
                    <span class="font-semibold text-slate-900">{{ startIndex }}</span>
                    -
                    <span class="font-semibold text-slate-900">{{ endIndex }}</span>
                    trong tổng
                    <span class="font-semibold text-slate-900">{{ filteredItems.length }}</span>
                    thành tích
                </div>

                <div class="flex items-center gap-2">
                    <button @click="currentPage > 1 && currentPage--" :disabled="currentPage === 1"
                        class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed">
                        <ChevronLeft :size="18" />
                    </button>

                    <template v-for="page in visiblePages" :key="`${page}`">
                        <button v-if="page !== '...'" @click="goToPage(page)" :class="[
                            'h-10 min-w-[40px] rounded-xl px-3 text-sm font-medium transition',
                            currentPage === page
                                ? 'bg-indigo-600 text-white'
                                : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-500 hover:text-indigo-600'
                        ]">
                            {{ page }}
                        </button>

                        <span v-else class="px-1 text-sm text-slate-400">
                            ...
                        </span>
                    </template>

                    <button @click="currentPage < totalPages && currentPage++" :disabled="currentPage === totalPages"
                        class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-indigo-500 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed">
                        <ChevronRight :size="18" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>