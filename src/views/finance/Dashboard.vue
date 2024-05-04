<script setup>
import { onMounted, ref, watch } from 'vue';
import { _adapters } from 'chart.js';
import { useLayout } from '@/layout/composables/layout';
import ErrorMessage from '@/components/ErrorMessage.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import SalesDashboardRepository from '@/repository/SalesDashboardRepository';
import DashboardSummaryWidgetWidget from '@/components/DashboardSummaryWidget.vue';
import CalendarDropdown from '@/components/CalendarDropdown.vue';
import DataGraphService from '@/service/DataGraphService';

const salesDashboardData = ref(null);
const salesDashboardGraphData = ref(null);
const lineData = ref(null);
const lineOptions = ref(null);
const showErrorMessage = ref(false);
const presetOption = ref({ name: 'Month To Date', code: 'MTD' });
const calendarDateRange = ref();
const displayModal = ref(false);

let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');

onMounted(() => {
    SalesDashboardRepository.getData().then((data) => {
        if (data) {
            salesDashboardData.value = data;
            setSalesGraph(data);
        } else {
            showErrorMessage.value = true;
        }
    });
});

useLayout();

async function getDashboardData() {
    if (presetOption.value?.code === 'CUSTOM' && (!calendarDateRange?.value?.[0] || !calendarDateRange?.value?.[1])) {
        return;
    }
    displayModal.value = true;
    showErrorMessage.value = false;

    let preset = presetOption ? presetOption.value.code : 'MTD';
    let from = calendarDateRange?.value?.[0] ? DataGraphService.extractCalendarDateString(calendarDateRange?.value?.[0]) : null;
    let to = calendarDateRange?.value?.[1] ? DataGraphService.extractCalendarDateString(calendarDateRange?.value?.[1]) : null;
    const data = await SalesDashboardRepository.getData(preset, from, to);
    if (data) {
        salesDashboardData.value = data;
        setSalesGraph(data);
    } else {
        showErrorMessage.value = true;
    }
    displayModal.value = false;
}

function getDataSets(data, labels) {
    var out = [];
    data.forEach((d, idx) => {
        out.push(buildDataSet(d, idx, labels));
    });
    return out;
}

function getNumberOfItems(labelIndex, orders) {
    let number;
    orders.forEach((o) => {
        if (o.order === labelIndex) {
            number = o.numberOfItems;
        }
    });
    return number;
}

function buildDataSet(data, idx, labels) {
    var dataSet = [];
    const colors = ['#324aa8', '#63f280', '#fa4b7d'];
    labels.forEach((l, idx) => {
        dataSet.push(getNumberOfItems(idx, data.orders));
    });
    return {
        label: data.label,
        data: dataSet,
        fill: false,
        // backgroundColor: documentStyle.getPropertyValue('--primary-' + prop),
        backgroundColor: colors[idx],
        borderColor: colors[idx],
        // borderColor: documentStyle.getPropertyValue('--primary-' + prop),
        tension: 0.4
    };
}

function setSalesGraph(data) {
    salesDashboardGraphData.value = {
        labels: data.periodLabels,
        datasets: getDataSets(data.periods, data.periodLabels)
    };

    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    fontColor: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                },
                title: {
                    display: true,
                    text: getGraphPeriodTitle(data),
                    font: {
                        size: 15,
                        weight: 'bold'
                    },
                    padding: { top: 20 }
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                },
                title: {
                    display: true,
                    text: 'Units Ordered',
                    font: {
                        size: 15,
                        weight: 'bold'
                    },
                    padding: { bottom: 20 }
                }
            }
        }
    };
}

function getGraphPeriodTitle(data) {
    if (!data.periods[0].label) {
        return '';
    }
    const date = new Date();
    if (date.getFullYear() < 1970) {
        return '';
    }
    const timeRange = data.periods[0].label;
    if (timeRange === 'Month to date') {
        return `${DataGraphService.getMonthString(date)} (${timeRange})`;
    } else if (timeRange === 'Year to date') {
        return `${date.getFullYear()} (${timeRange})`;
    } else {
        return timeRange;
    }
}

const totalOrdersProps = {
    title: 'Total Orders',
    iconBg: 'bg-blue-100',
    icon: 'pi-shopping-cart text-blue-500',
    footerBoldedText: `${24} new`,
    footerText: ' since last visit',
    tooltip: 'Total orders are totaled for the current date range selected across all sales channels toggled.'
};

const unitsOrderedProps = {
    title: 'Units Ordered',
    iconBg: 'bg-blue-100',
    icon: 'pi-shopping-cart text-blue-500',
    footerText: ' since last visit',
    footerBoldText: '24 new',
    tooltip: 'Units ordered are totaled across all orders for the current date range selected across all sales channels toggled.'
};

const productSalesProps = {
    title: 'Product Sales',
    iconBg: 'bg-orange-100',
    icon: 'pi-map-marker text-orange-500',
    footerText: ' since last week',
    footerBoldedText: '%52+',
    tooltip: 'Product sales are totaled for the current date range selected across all sales channels toggled.'
};

const avgUnitsProps = {
    title: 'Avg Units per Order',
    iconBg: 'bg-cyan-100',
    icon: 'pi-inbox text-cyan-500',
    footerText: ' new orders',
    footerBoldedText: '520',
    tooltip: 'Average Unit per ordered for the current date range selected across all sales channels toggled.'
};

const avgSalesProps = {
    title: 'Avg Sales Item',
    iconBg: 'bg-purple-100',
    icon: 'pi-comment text-purple-500',
    footerText: ' responded',
    footerBoldedText: '42 ',
    tooltip: 'Average sale cost per item for the current date range selected across all sales channels toggled.'
};
</script>

<template>
    <ErrorMessage :showErrorMessage="showErrorMessage" />

    <div class="card" v-if="salesDashboardData">
        <div class="flex justify-content-between align-items-center col-12 xl:col-12">
            <h2 style="margin: unset">Sales Dashboard</h2>
            <CalendarDropdown @handlePresetChange="getDashboardData" @handleDateChange="getDashboardData" v-model:preset="presetOption" v-model:dates="calendarDateRange" />
        </div>
        <div class="flex flex-wrap m-auto justify-content-center">
            <div className="dashboard-widget">
                <DashboardSummaryWidgetWidget v-bind="totalOrdersProps" :data="salesDashboardData?.numberOfOrders" />
            </div>
            <div className="dashboard-widget">
                <DashboardSummaryWidgetWidget v-bind="unitsOrderedProps" :data="salesDashboardData?.numberOfItems" />
            </div>
            <div className="dashboard-widget">
                <DashboardSummaryWidgetWidget v-bind="productSalesProps" :data="DataGraphService.formatCurrency(salesDashboardData?.totalSales)" />
            </div>
            <div className="dashboard-widget">
                <DashboardSummaryWidgetWidget v-bind="avgUnitsProps" :data="DataGraphService.formatDecimal(salesDashboardData?.averageUnitsPerOrder)" />
            </div>
            <div className="dashboard-widget">
                <DashboardSummaryWidgetWidget v-bind="avgSalesProps" :data="DataGraphService.formatCurrency(salesDashboardData?.averageUnitPrice)" />
            </div>
        </div>

        <div class="col-12 xl:col-12">
            <div class="card">
                <div class="flex flex-row justify-content-between">
                    <h5>Sales Comparisons</h5>
                </div>
                <Chart type="line" :data="salesDashboardGraphData" :options="lineOptions"></Chart>
            </div>
        </div>
        <LoadingModal :showLoadingModal="displayModal" />
    </div>
</template>

<style>
.dashboard-widget {
    box-sizing: inherit;
    width: 17rem;
    margin: 1rem;
}
</style>
