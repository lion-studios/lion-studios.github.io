<script setup>
import { onMounted, ref } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import ErrorMessage from '@/components/ErrorMessage.vue';
import LoadingModal from '@/components/LoadingModal.vue';
import SalesRepository from '@/repository/SalesRepository';
import CalendarDropdown from '@/components/CalendarDropdown.vue';
import SalesChannelDropdown from '@/components/SalesChannelDropdown.vue';
import DataGraphService from '@/service/DataGraphService';
import SalesProfitSummaryWidget from '@/components/SalesProfitSummaryWidget.vue';

const salesData = ref(null);
const salesChartData = ref(null);
const presetOption = ref({ name: 'Month To Date', code: 'MTD' });
const salesChannelOption = ref(null);
const filter = ref('');
const page = ref(0);
const totalSize = ref(null);
const limit = ref(20);
const dates = ref();
const displayModal = ref(false);
const showErrorMessage = ref(false);
const chartProfitData = ref([]);
const chartSalesData = ref([]);
const chartLabels = ref([]);
const chartOptions = ref();
const documentStyle = getComputedStyle(document.documentElement);
const mostProfitableToggle = ref(true);
const profitabilityData = ref(null);
const grossMarginData = ref(null);
const grossMarginToggle = ref(true);

useLayout();

onMounted(() => {
    salesData.value = [];
    loadSalesData();
    chartOptions.value = setChartOptions();
});

function setChartData(data) {
    getChartData(data);
    return {
        labels: chartLabels.value,
        datasets: [
            {
                type: 'bar',
                label: 'Profit',
                backgroundColor: documentStyle.getPropertyValue('--blue-500'),
                data: chartProfitData.value
            },
            {
                type: 'bar',
                label: 'Sales',
                backgroundColor: documentStyle.getPropertyValue('--green-500'),
                data: chartSalesData.value
            }
        ]
    };
}

function setChartOptions() {
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                stacked: false,
                beginAtZero: true,
                ticks: {
                    color: textColorSecondary,
                    callback: function (value) {
                        if (parseInt(value) >= 1000) {
                            return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        } else {
                            return '$' + value;
                        }
                    }
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}

async function loadSalesData() {
    if (presetOption.value?.code === 'CUSTOM' && (!dates.value?.[0] || !dates.value?.[1])) {
        return;
    }
    displayModal.value = true;
    showErrorMessage.value = false;

    if (salesData.value) {
        salesData.value = [];
    }
    if (chartLabels.value) {
        chartLabels.value = [];
    }
    if (chartProfitData.value) {
        chartProfitData.value = [];
    }
    if (chartSalesData.value) {
        chartSalesData.value = [];
    }

    let preset = presetOption.value ? presetOption.value.code : 'MTD';
    let salesChannel = salesChannelOption.value ? salesChannelOption.value.code : '';
    let from = dates?.value?.[0] ? DataGraphService.extractCalendarDateString(dates.value[0]) : null;
    let to = dates?.value?.[1] ? DataGraphService.extractCalendarDateString(dates.value[1]) : null;
    let salesResponse = await SalesRepository.getSales(preset, salesChannel, from, to, filter.value, page.value, limit.value);
    let profitabilityResponse = await SalesRepository.getProfitability(preset, salesChannel, from, to);
    if (salesResponse?.items && profitabilityResponse) {
        totalSize.value = salesResponse.size;
        salesData.value = getTableData(salesResponse);
        profitabilityData.value = profitabilityResponse;
        handleProfitabilityToggleChange(mostProfitableToggle.value);
        handleGrossMarginToggleChange(grossMarginToggle.value);
    } else {
        showErrorMessage.value = true;
    }
    displayModal.value = false;
}

function getTableData(data) {
    let response = [];
    for (var item in data.items) {
        let temp = {};
        temp['name'] = data.items[item]['productName'];
        temp['upc'] = data.items[item]['sku'];
        temp['unitsSold'] = data.items[item]['unitsSold'];
        temp['totalSales'] = data.items[item]['sales'];
        temp['unitsRefunded'] = data.items[item]['unitsRefunded'];
        temp['elc'] = data.items[item]['elc'];
        temp['totalCosts'] = data.items[item]['totalCosts'];
        temp['totalProfit'] = data.items[item]['totalProfit'];
        temp['roi'] = data.items[item]['roi'];
        temp['grossMargin'] = data.items[item]['grossMargin'];
        response.push(temp);
    }
    return response;
}

function getChartData(data) {
    for (let item in data) {
        chartLabels.value[item] = data[item]['sku'];
        chartProfitData.value[item] = data[item]['totalProfit'];
        chartSalesData.value[item] = data[item]['sales'];
    }
}

function pageChange(pageState) {
    page.value = pageState.page;
    limit.value = pageState.rows;
    loadSalesData();
}

function handleProfitabilityToggleChange(value) {
    mostProfitableToggle.value = value;
    if (mostProfitableToggle.value) {
        salesChartData.value = setChartData(profitabilityData.value.mostProfitable);
    } else {
        salesChartData.value = setChartData(profitabilityData.value.leastProfitable);
    }
}

function handleGrossMarginToggleChange(value) {
    grossMarginToggle.value = value;
    if (grossMarginToggle.value) {
        grossMarginData.value = profitabilityData.value.mostProfitable;
    } else {
        grossMarginData.value = profitabilityData.value.leastProfitable;
    }
}

const widgetTotalSales = {
    title: 'Total Sales',
    icon: 'pi pi-dollar',
    tooltip: 'Total Sales',
    bgColor: 'bg-blue-100'
};

const widgetTotalProfit = {
    data: '',
    title: 'Total Profit',
    icon: 'pi pi-tag',
    tooltip: 'Total Profit',
    bgColor: 'bg-gray-100'
};

const widgetTotalCOGS = {
    data: '',
    title: 'Total COGS',
    icon: 'pi pi-chart-line',
    tooltip: 'Total COGS',
    bgColor: 'bg-orange-100'
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <ErrorMessage :showErrorMessage="showErrorMessage" />
                <div class="flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 style="margin: unset">Sales & Profit</h2>
                    </div>
                    <div class="flex flex-colunm flex-wrap justify-content-around">
                        <SalesChannelDropdown @change="loadSalesData" v-model:salesChannelOption="salesChannelOption" />
                        <CalendarDropdown class="flex flex-colunm flex-wrap" @handleDateChange="loadSalesData" @handlePresetChange="loadSalesData" v-model:preset="presetOption" v-model:dates="dates" />
                    </div>
                </div>

                <div class="flex flex-row flex-wrap">
                    <div class="dashboard-widget">
                        <SalesProfitSummaryWidget v-bind="widgetTotalSales" :data="'$431,227.00'" />
                    </div>
                    <div class="dashboard-widget">
                        <SalesProfitSummaryWidget v-bind="widgetTotalProfit" :data="'$123,152.00'" />
                    </div>
                    <div class="dashboard-widget">
                        <SalesProfitSummaryWidget v-bind="widgetTotalCOGS" :data="'$308,075.00'" />
                    </div>
                </div>

                <div class="flex col-12">
                    <div class="card col-8 m-0">
                        <div class="flex justify-content-between">
                            <h4>Product Sales & Profitability</h4>
                            <div>
                                <button @click="handleProfitabilityToggleChange(true)" class="toggle-button" :class="mostProfitableToggle ? 'active' : ''">most profitable</button>
                                <button @click="handleProfitabilityToggleChange(false)" class="toggle-button" :class="!mostProfitableToggle ? 'active' : ''">least profitable</button>
                            </div>
                        </div>
                        <Chart style="height: 350px" type="bar" :data="salesChartData" :options="chartOptions" />
                    </div>
                    <div class="card col-4 ml-3">
                        <div class="flex justify-content-between">
                            <h4>Gross Margin</h4>
                            <div>
                                <button @click="handleGrossMarginToggleChange(true)" class="toggle-button" :class="grossMarginToggle ? 'active' : null">highest</button>
                                <button @click="handleGrossMarginToggleChange(false)" class="toggle-button" :class="!grossMarginToggle ? 'active' : null">lowest</button>
                            </div>
                        </div>
                        <div class="card flex gross-margin-card" v-for="item of grossMarginData">
                            <div class="col-8 sales-profit-product-name" v-tooltip.top="{ value: item.productName, class: 'item-name-tooltip' }">{{ item.productName }}</div>
                            <div class="col-4 text-center">{{ item.grossMargin }}%</div>
                        </div>
                    </div>
                </div>

                <div class="col-12">
                    <span class="p-input-icon-left md:w-9">
                        <i class="pi pi-search" />
                        <InputText style="width: 400px" @keydown.enter="DataGraphService.searchOnEnter(loadSalesData)" @update:modelValue="DataGraphService.debounce(loadSalesData)" v-model="filter" placeholder="Search by Product Name or UPC Code" />
                    </span>
                </div>
                <DataTable stripedRows :value="salesData" :paginator="false" class="p-datatable-gridlines" dataKey="id" :rowHover="true" filterDisplay="menu" responsiveLayout="scroll">
                    <template #empty> No sales data. </template>
                    <template #loading> Loading sales data. Please wait. </template>
                    <Column header="Product Name">
                        <template #body="{ data }">
                            <p class="sales-profit-product-name" v-tooltip.top="{ value: data.name, class: 'item-name-tooltip' }">
                                {{ data.name }}
                            </p>
                        </template>
                    </Column>
                    <Column field="upc" header="UPC Code"> </Column>
                    <Column field="unitsSold" header="Units Sold"> </Column>
                    <Column header="Total Sales">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.totalSales) }}
                        </template>
                    </Column>
                    <Column field="unitsRefunded" header="Units Refunded"> </Column>
                    <Column header="ELC">
                        <template #body="{ data }">
                            <span class="text-red-500">{{ DataGraphService.formatCurrency(data.elc) }}</span>
                        </template>
                    </Column>
                    <Column header="Total Costs">
                        <template #body="{ data }">
                            <span class="text-red-500">{{ DataGraphService.formatCurrency(data.totalCosts) }}</span>
                        </template>
                    </Column>
                    <Column header="Total Profit">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.totalProfit) }}
                        </template>
                    </Column>
                    <Column field="roi" header="ROI"> </Column>
                    <Column header="Gross Margin">
                        <template #body="{ data }">
                            {{ DataGraphService.formatPercentage(data.grossMargin) }}
                        </template>
                    </Column>
                </DataTable>
                <Paginator @page="pageChange" :rows="20" :totalRecords="totalSize" :rowsPerPageOptions="[10, 20, 30]"> </Paginator>
            </div>
        </div>
    </div>

    <LoadingModal :showLoadingModal="displayModal" />
</template>

<style>
.sales-profit-product-name {
    max-width: 25vw;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.item-name-tooltip {
    min-width: fit-content;
}

.toggle-button {
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-weight: 1000;
    color: grey;
}
.active {
    color: rgb(79, 218, 218);
}

.gross-margin-card {
    padding: unset;
    margin-bottom: 1rem;
}

.dashboard-widget {
    box-sizing: inherit;
    min-width: 15rem;
    margin: 1rem;
}
</style>
