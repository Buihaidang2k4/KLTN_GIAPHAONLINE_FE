<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
} from 'chart.js'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
)

const props = defineProps<{
    labels: string[]
    accounts: number[]
    revenue: number[]
    activeTab: 'both' | 'revenue' | 'accounts'
}>()

const chartData = computed(() => {
    const datasets = []
    
    if (props.activeTab === 'both' || props.activeTab === 'revenue') {
        datasets.push({
            label: 'Doanh thu (VND)',
            data: props.revenue,
            borderColor: '#d97706',
            backgroundColor: 'rgba(217,119,6,0.1)',
            tension: 0.4,
            fill: true,
            yAxisID: 'y'
        })
    }
    
    if (props.activeTab === 'both' || props.activeTab === 'accounts') {
        datasets.push({
            label: 'Tài khoản mới',
            data: props.accounts,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37,99,235,0.1)',
            tension: 0.4,
            fill: true,
            yAxisID: props.activeTab === 'both' ? 'y1' : 'y'
        })
    }
    
    return {
        labels: props.labels,
        datasets
    }
})

const options = computed(() => {
    const isBoth = props.activeTab === 'both'
    return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                type: 'linear' as const,
                display: props.activeTab === 'both' || props.activeTab === 'revenue',
                position: 'left' as const,
                ticks: {
                    callback: (value: any) => {
                        if (value >= 1000000) return (value / 1000000) + 'M'
                        if (value >= 1000) return (value / 1000) + 'K'
                        return value
                    }
                },
                grid: {
                    drawOnChartArea: true
                }
            },
            y1: {
                type: 'linear' as const,
                display: isBoth,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    precision: 0
                }
            }
        },
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true,
                    boxWidth: 6
                }
            },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            if (context.dataset.yAxisID === 'y') {
                                label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y);
                            } else {
                                label += context.parsed.y + ' tài khoản';
                            }
                        }
                        return label;
                    }
                }
            }
        }
    }
})
</script>

<template>
    <div class="h-[260px] w-full">
        <Line :data="chartData" :options="options" />
    </div>
</template>