<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import ProductRepository from '@/repository/ProductRepository';
import { ref, onBeforeMount, computed } from 'vue';
import ErrorMessage from "@/components/ErrorMessage.vue";

const filters1 = ref(null);
const products = ref(null);
const showErrorMessage = ref(false);

onBeforeMount(() => {
    products.value = [];
    loadProducts();
    initFilters1();
});

async function loadProducts() {
    let out = await ProductRepository.getProducts();
    if (out) {
        products.value = out.items;
    } else {
        showErrorMessage.value = true;
    }
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
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <ErrorMessage :showErrorMessage="showErrorMessage"/>
                
                <h2>Products</h2>
                <DataTable :value="products" :paginator="true" class="p-datatable-gridlines" :rows="10" dataKey="id"
                    :rowHover="true" filterDisplay="menu" 
                    responsiveLayout="scroll">
                    <template #empty> No products found. </template>
                    <template #loading> Loading products data. Please wait. </template>
                    <Column field="name" header="Product Name" style="min-width: 12rem"> </Column>
                    <Column field="upc" header="UPC code" style="min-width: 12rem"> </Column>
                    <Column field="sku" header="SKU" style="min-width: 12rem"> </Column>
                </DataTable>
            </div>
        </div>
    </div>
</template>
