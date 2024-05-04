<script setup>
import ExpensesRepository from '@/repository/ExpensesRepository';
import { ref, onBeforeMount, toRaw } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import ErrorMessage from '@/components/ErrorMessage.vue';
import LoadingModal from '@/components/LoadingModal.vue';

const displayModal = ref(false);

useLayout();

const salesChannelOptions = ref([
    { name: 'All', code: 'ALL' },
    { name: 'Amazon', code: 'AMAZON' },
    { name: 'Walmart', code: 'WALMART' },
    { name: 'Etsy', code: 'ETSY' },
    { name: 'Shopify', code: 'SHOPIFY' }
]);

const salesChannelOption = ref();
const searchItem = ref('');
const page = ref(0);
const totalSize = ref(null);
const limit = ref(20);
const productExpenses = ref(null);
const showErrorMessage = ref(false);
const dates = ref();

onBeforeMount(() => {
    productExpenses.value = [];
    loadProductExpenses();
});

function getData(type, data) {
    let response = [];
    for (var i in data.items) {
        let temp = {};
        temp[type] = data.items[i][type];
        response.push(temp);
    }
    return response;
}

function getSalesChannels(data) {
    let salesChannelData = [];
    for (var i in data.items) {
        let temp = {};
        let salesChannels = [];
        for (var key in data.items[i].integrations) {
            salesChannels.push(key);
        }
        temp['salesChannel'] = salesChannels.join(', ');
        salesChannelData.push(temp);
    }
    return salesChannelData;
}

function getCostData(type, data) {
    let response = [];
    for (var i in data.items) {
        let temp = {};
        let expense = data.items[i].expense;
        if (expense) {
            temp[type] = expense[type];
            response.push(temp);
        }
    }
    return response;
}

function getFeeData(type, data) {
    let response = [];
    for (var i in data.items) {
        let temp = {};
        let amazonFee = data.items[i].platformFees.AMAZON[type];
        if (amazonFee) {
            temp[type] = amazonFee.feePerUnit;
            response.push(temp);
        }
    }
    return response;
}

function pageChange(pageState) {
    page.value = pageState.page;
    limit.value = pageState.rows;
    loadProductExpenses();
}

async function loadProductExpenses() {
    displayModal.value = true;

    if (productExpenses.value !== []) {
        productExpenses.value = [];
    }
    let salesChannel = salesChannelOption.value ? salesChannelOption.value.code : '';
    let data = await ExpensesRepository.getProductExpenses(searchItem.value, page.value, limit.value, salesChannel);
    if (data) {
        if (data.items) {
            totalSize.value = data.size;
            let namesData = getData('name', data);
            let salesChannelsData = getSalesChannels(data);
            let upcData = getData('upc', data);
            let costOfGoodsPerUnitData = getCostData('costOfGoodsPerUnit', data);
            let inboundShippingCostData = getCostData('inboundShippingCost', data);
            let selfShippingCostData = getCostData('selfShippingCost', data);
            let totalCostPerUnitData = getCostData('totalCostPerUnit', data);
            let referralFeeData = getFeeData('REFERRAL_FEE', data);
            let fbaFeeData = getFeeData('FBA_FEE', data);

            for (var i in data.items) {
                let expense = {
                    ...namesData[i],
                    ...salesChannelsData[i],
                    ...upcData[i],
                    ...costOfGoodsPerUnitData[i],
                    ...inboundShippingCostData[i],
                    ...selfShippingCostData[i],
                    ...totalCostPerUnitData[i],
                    ...referralFeeData[i],
                    ...fbaFeeData[i]
                };

                productExpenses.value[i] = expense;
            }
        }
    } else {
        showErrorMessage.value = true;
    }
    displayModal.value = false;
}

const formatCurrency = (value) => {
    if (!value) {
        return '$0.00';
    }
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

let timer;
function debounce() {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        loadProductExpenses();
    }, 2000);
}
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <ErrorMessage :showErrorMessage="showErrorMessage" />
                <div class="flex flex-row flex-wrap card-container">
                    <div class="w-7">
                        <h2>Expenses</h2>
                    </div>

                    <Dropdown @change="loadProductExpenses" v-model="salesChannelOption" :options="salesChannelOptions" optionLabel="name" placeholder="Sales Channel" />

                    <Calendar v-model="dates" selectionMode="multiple" :manualInput="false" showIcon />
                </div>
                <div class="col-12">
                    <span class="p-input-icon-left md:w-9">
                        <i class="pi pi-search" />
                        <InputText style="width: 400px" @update:modelValue="debounce" v-model="searchItem" placeholder="Search" />
                    </span>
                </div>
                <DataTable stripedRows :value="productExpenses" :paginator="false" class="p-datatable-gridlines" dataKey="id" :rowHover="true" filterDisplay="menu" responsiveLayout="scroll">
                    <template #empty> No product expenses found. </template>
                    <template #loading> Loading product expenses data. Please wait. </template>
                    <template> </template>
                    <Column field="name" header="Product Name"> </Column>
                    <Column field="upc" header="UPC Code"> </Column>
                    <Column header="COGS Per Unit">
                        <template #body="{ data }">
                            {{ formatCurrency(data.costOfGoodsPerUnit) }}
                        </template>
                    </Column>
                    <Column header="Inbound Shipping Cost">
                        <template #body="{ data }">
                            {{ formatCurrency(data.inboundShippingCost) }}
                        </template>
                    </Column>
                    <Column header="Referral Fees">
                        <template #body="{ data }">
                            {{ formatCurrency(data.REFERRAL_FEE) }}
                        </template>
                    </Column>
                    <Column header="FBA Fees">
                        <template #body="{ data }">
                            {{ formatCurrency(data.FBA_FEE) }}
                        </template>
                    </Column>
                    <Column header="Self Shipping Cost">
                        <template #body="{ data }">
                            {{ formatCurrency(data.selfShippingCost) }}
                        </template>
                    </Column>
                    <Column header="Total Cost Per Unit">
                        <template #body="{ data }">
                            {{ formatCurrency(data.totalCostPerUnit) }}
                        </template>
                    </Column>
                </DataTable>
                <Paginator @page="pageChange" :rows="20" :totalRecords="totalSize" :rowsPerPageOptions="[10, 20, 30]"> </Paginator>
            </div>
        </div>
    </div>

    <LoadingModal :showLoadingModal="displayModal" />
</template>
