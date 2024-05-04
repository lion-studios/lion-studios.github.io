<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import ProductRepository from '@/repository/ProductRepository';
import { ref, onBeforeMount, computed } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import ErrorMessage from '@/components/ErrorMessage.vue';
import LoadingModal from '@/components/LoadingModal.vue';

let documentStyle = getComputedStyle(document.documentElement);
let textColor = documentStyle.getPropertyValue('--text-color');
let textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
let surfaceBorder = documentStyle.getPropertyValue('--surface-border');
const displayModal = ref(false);

useLayout();

const sortOptions = ref([
    { name: 'Month to date', code: 'mtd' },
    { name: 'Last year - month to date', code: 'lastYearMtd' },
    { name: 'Last month', code: 'lastMonth' },
    { name: 'Year to date', code: 'ytd' },
    { name: 'Last Year', code: 'lastYear' }
]);
const sortOption = ref({ name: 'Month to date', code: 'mtd' });
const searchItem = ref('');
const page = ref(0);
const totalSize = ref(null);
const limit = ref(20);
const filters1 = ref(null);
const products = ref(null);
const productsDetails = ref(null);
const showErrorMessage = ref(false);
const visibleRight = ref(false);

const barOptions = ref(null);
const detailsSalesData = ref(null);
const detailsUnitsData = ref(null);

onBeforeMount(() => {
    products.value = [];
    loadProducts();
    initFilters1();
});

const colors = ['#7bcee3', '#f7a223', '#fa4b7d'];

function pageChange(pageState) {
    page.value = pageState.page;
    limit.value = pageState.rows;
    loadProducts();
}

function setBarData(data) {
    detailsSalesData.value = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'This year so far',
                backgroundColor: colors[0],
                borderColor: colors[0],
                data: buildBarDataSet(data.monthlyPerformance, 0, true)
            },
            {
                label: 'Last year',
                backgroundColor: colors[1],
                borderColor: colors[1],
                data: buildBarDataSet(data.monthlyPerformance, 1, true)
            }
        ]
    };
    detailsUnitsData.value = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'This year so far',
                backgroundColor: colors[0],
                borderColor: colors[0],
                data: buildBarDataSet(data.monthlyPerformance, 0)
            },
            {
                label: 'Last year',
                backgroundColor: colors[1],
                borderColor: colors[1],
                data: buildBarDataSet(data.monthlyPerformance, 1)
            }
        ]
    };
}

function buildBarDataSet(data, yearOffset, useSales) {
    var yearMarker = new Date().getFullYear() - yearOffset;
    var out = [];

    for (var x = 1; x <= 12; x++) {
        var value = null;
        for (var key in data) {
            var time = key.split('-');
            if (parseInt(time[0]) == yearMarker && parseInt(time[1]) == x) {
                if (useSales) {
                    value = data[key].totalSales;
                } else {
                    value = data[key].unitsSold;
                }
            }
        }
        out.push(value);
    }

    return out;
}

barOptions.value = {
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
                color: textColorSecondary,
                font: {
                    weight: 500
                }
            },
            grid: {
                display: false,
                drawBorder: false
            }
        },
        y: {
            ticks: {
                color: textColorSecondary
            },
            grid: {
                color: surfaceBorder,
                drawBorder: false
            }
        }
    }
};

async function loadProducts() {
    displayModal.value = true;

    let sort = sortOption.value ? sortOption.value.code : '';
    let out = await ProductRepository.getProductsPerformance(searchItem.value, page.value, limit.value, sort);
    if (out) {
        products.value = out.items;
        totalSize.value = out.size;
    } else {
        showErrorMessage.value = true;
    }
    displayModal.value = false;
}

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: [0, 50], matchMode: FilterMatchMode.BETWEEN },
        verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    };
};

const truncateString = (value) => {
    var suffix = value.length > 80 ? '...' : '';
    return value.slice(0, 80) + suffix;
};

const formatCurrency = (value) => {
    if (!value) {
        return '$0.00';
    }
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

const formatDecimal = (value) => {
    if (!value) {
        return;
    }
    return value.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 1 });
};

const clearFilter1 = () => {
    initFilters1();
};

const formatDate = (value) => {
    return value.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

function showDetails(data) {
    visibleRight.value = true;
    productsDetails.value = data;
    setBarData(data);
}

let timer;
function debounce() {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        loadProducts();
    }, 2000);
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <ErrorMessage :showErrorMessage="showErrorMessage" />

                <h2>Product Performance</h2>
                <div class="col-12">
                    <span class="p-input-icon-left md:w-9">
                        <i class="pi pi-search" />
                        <InputText style="width: 400px" @update:modelValue="debounce" v-model="searchItem" placeholder="Search by SKU, ASIN, Product Name" />
                    </span>
                    <Dropdown @change="loadProducts" v-model="sortOption" :options="sortOptions" optionLabel="name" placeholder="Sort by" class="w-full lg:w-3" />
                </div>
                <DataTable stripedRows :value="products" :paginator="false" class="p-datatable-gridlines" :rows="15" dataKey="id" :rowHover="true" filterDisplay="menu" responsiveLayout="scroll">
                    <template #empty> No products found. </template>
                    <template #loading> Loading products data. Please wait. </template>
                    <Column field="sku" header="SKU" style="min-width: 12rem"> </Column>
                    <Column field="productName" header="Product Name" style="min-width: 22rem"> </Column>
                    <Column header="MTD" style="min-width: 6rem">
                        <template #body="{ data }">
                            {{ formatCurrency(data.mtd) }}
                        </template>
                    </Column>
                    <Column header="Last year MTD" style="min-width: 6rem">
                        <template #body="{ data }">
                            {{ formatCurrency(data.lastYearMtd) }}
                        </template>
                    </Column>
                    <Column header="Last Month" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ formatCurrency(data.lastMonth) }}
                        </template>
                    </Column>
                    <Column header="YTD" style="min-width: 8rem">
                        <template #body="{ data }">
                            {{ formatCurrency(data.ytd) }}
                        </template>
                    </Column>
                    <Column header="Last year" style="min-width: 6rem">
                        <template #body="{ data }">
                            {{ formatCurrency(data.lastYear) }}
                        </template>
                    </Column>
                    <Column header="Details" style="min-width: 6rem">
                        <template #body="{ data }">
                            <Button label="Details" plain text raised xicon="pi pi-arrow-left" class="xp-button-warning" @click="showDetails(data)" style="margin-right: 0.25em"> </Button>
                        </template>
                    </Column>
                </DataTable>
                <Paginator @page="pageChange" :rows="20" :totalRecords="totalSize" :rowsPerPageOptions="[10, 20, 30]"> </Paginator>

                <Sidebar v-model:visible="visibleRight" :baseZIndex="1000" position="right" class="sm:w-full md:w-9 lg:w-6">
                    <h5 style="font-weight: normal">{{ truncateString(productsDetails.productName) }}</h5>
                    <b>{{ productsDetails.sku }}</b>
                    <p>ASIN: {{ productsDetails.asin }}</p>

                    <p />
                    <div class="grid" v-if="productsDetails">
                        <div class="col-12 lg:col-6 xl:col-4">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Average Sales Price</span>
                                        <div class="text-900 font-medium text-xl">{{ productsDetails?.unitsSoldYtd ? formatCurrency(productsDetails?.ytd / productsDetails?.unitsSoldYtd) : '$0.00' }}</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                        <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                                    </div>
                                </div>
                                <span class="text-green-500 font-medium">24 new </span>
                                <span class="text-500">since last visit</span>
                            </div>
                        </div>
                        <div class="col-12 lg:col-6 xl:col-4">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Units sold YTD</span>
                                        <div class="text-900 font-medium text-xl">{{ productsDetails?.unitsSoldYtd }}</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                        <i class="pi pi-map-marker text-orange-500 text-xl"></i>
                                    </div>
                                </div>
                                <span class="text-green-500 font-medium">%52+ </span>
                                <span class="text-500">since last week</span>
                            </div>
                        </div>
                        <div class="col-12 lg:col-6 xl:col-4">
                            <div class="card mb-0">
                                <div class="flex justify-content-between mb-3">
                                    <div>
                                        <span class="block text-500 font-medium mb-3">Total sales YTD</span>
                                        <div class="text-900 font-medium text-xl">{{ formatCurrency(productsDetails?.ytd) }}</div>
                                    </div>
                                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                                        <i class="pi pi-inbox text-cyan-500 text-xl"></i>
                                    </div>
                                </div>
                                <span class="text-green-500 font-medium">520 </span>
                                <span class="text-500">new orders</span>
                            </div>
                        </div>

                        <div class="col-12 xl:col-12">
                            <div class="card">
                                <TabView>
                                    <TabPanel header="Sales by Month">
                                        <Chart type="bar" :data="detailsSalesData" :options="barOptions"></Chart>
                                    </TabPanel>

                                    <TabPanel header="Units by Month">
                                        <Chart type="bar" :data="detailsUnitsData" :options="barOptions"></Chart>
                                    </TabPanel>
                                </TabView>
                            </div>
                        </div>
                    </div>
                </Sidebar>
            </div>
        </div>
    </div>
    <LoadingModal :showLoadingModal="displayModal" />
</template>
