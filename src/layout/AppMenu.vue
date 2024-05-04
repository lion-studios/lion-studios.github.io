<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Finance',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Sales & Profit', icon: 'pi pi-fw pi-money-bill', to: '/finance/sales-profit' },
            { label: 'Forecasting', icon: 'pi pi-fw pi-chart-bar', to: '/finance/forecast' }
        ]
    },
    {
        label: 'Products',
        items: [
            { label: 'Performance', icon: 'pi pi-fw pi-briefcase', to: '/products/performance' },
            { label: 'Expenses', icon: 'pi pi-fw pi-calculator', to: '/finance/expenses' }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        <li></li>
    </ul>
</template>

<style lang="scss" scoped></style>
