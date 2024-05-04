<script setup>
import { onMounted, ref } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import ErrorMessage from "@/components/ErrorMessage.vue";
import LoadingModal from '@/components/LoadingModal.vue';
import ForecastRepository from "@/repository/ForecastRepository";
import DataGraphService from "@/service/DataGraphService";

const tableData = ref(null);
const chartData = ref(null);
const salesChannelOption = ref(null);
const displayModal = ref(false);
const showErrorMessage = ref(false);
const chartSalesData = ref([]);
const chartOperatingIncomeData = ref([]);
const chartLabels = ref([]);
const chartOptions = ref();
const documentStyle = getComputedStyle(document.documentElement);
useLayout();

onMounted(() => {
    tableData.value = [];
    loadData();
    chartOptions.value = setChartOptions();
});

function setChartData() {
    return {
        labels: chartLabels.value,
        datasets: [
            {
                label: 'Sales',
                fill: false,
                tension: 0.4,
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: chartSalesData.value
            },
            {
                label: 'Operating Income',
                fill: false,
                tension: 0.4,
                borderColor: documentStyle.getPropertyValue('--green-500'),
                data: chartOperatingIncomeData.value
            }
        ]
    };
};

function setChartOptions() {
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary,
                    callback: function (value) {
                        if (parseInt(value) >= 1000) {
                            return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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

async function loadData() {
    displayModal.value = true;
    showErrorMessage.value = false;

    if (tableData.value) {
        tableData.value = [];
    }
    if (chartLabels.value) {
        chartLabels.value = [];
    }
    if (chartSalesData.value) {
        chartSalesData.value = [];
    }
    if (chartOperatingIncomeData.value) {
        chartOperatingIncomeData.value = [];
    }

    let salesChannel = (salesChannelOption.value) ? salesChannelOption.value.code : '';
    let data = await ForecastRepository.getForecast(salesChannel);
    if (data) {
        tableData.value = getData(data);
        chartData.value = setChartData();
    } else {
        showErrorMessage.value = true;
    }
    displayModal.value = false;
}

function getData(data) {
    let forecasts = [];
    if (data.forecastStatus === "DONE") {
        forecasts = [...data.pastMonthForecast, ...data.futureForecast];
        for (var index in forecasts) {
            chartLabels.value[index] = forecasts[index].month;
            chartSalesData.value[index] = forecasts[index].netSales;
            chartOperatingIncomeData.value[index] = forecasts[index].operatingIncome;
        }
    }
    return forecasts;
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <ErrorMessage :showErrorMessage="showErrorMessage" />
                <div class="flex flex-row flex-wrap card-container">
                    <div class="w-6">
                        <h2>Forecasting</h2>
                    </div>

                    <Dropdown @change="loadData" v-model="salesChannelOption" :options="DataGraphService.salesChannelOptions"
                        optionLabel="name" placeholder="Sales Channel" />
                    
                    <Button label="Forecast Settings" severity="secondary" outlined />
                </div>

                <div class="card">
                    <h4>12 Month Sales Forecast</h4>
                    <Chart type="line" :data="chartData" :options="chartOptions" />
                </div>

                <DataTable stripedRows :value="tableData" :paginator="false" class="p-datatable-gridlines" dataKey="month"
                    :rowHover="true" filterDisplay="menu" responsiveLayout="scroll">
                    <template #empty> No forecast data. </template>
                    <template #loading> Loading forecast data. Please wait. </template>
                    <Column header="Gross Sales">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.grossSales.ALL) }}
                        </template>
                    </Column>
                    <Column header="Refunds">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.refunds) }}
                        </template>
                    </Column>
                    <Column header="Reimbursements">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.reimbursements.ALL) }}
                        </template>
                    </Column>
                    <Column header="Promo Rebates">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.promoRebates) }}
                        </template>
                    </Column>
                    <Column header="Net Sales">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.netSales) }}
                        </template>
                    </Column>
                    <Column header="Cost Of Goods Sold">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.costOfGoods.ALL) }}
                        </template>
                    </Column>
                    <Column header="Gross Profit">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.grossProfit) }}
                        </template>
                    </Column>
                    <Column header="Gross Margin">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.grossMargin) }}
                        </template>
                    </Column>
                    <Column header="Seller Fees">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.sellerFees) }}
                        </template>
                    </Column>
                    <Column header="Advertising Spend">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.advertisingSpend) }}
                        </template>
                    </Column>
                    <Column header="Operating Expenses">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.operatingExpenses) }}
                        </template>
                    </Column>
                    <Column header="Operating Income">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.operatingIncome) }}
                        </template>
                    </Column>
                    <Column header="Operating Margin">
                        <template #body="{ data }">
                            {{ DataGraphService.formatCurrency(data.operatingMargin) }}
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

    <LoadingModal :showLoadingModal="displayModal" />
</template>

