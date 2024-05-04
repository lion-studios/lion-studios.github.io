<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    salesChannelOption: {
        type: Object
    }
});

const emit = defineEmits(['update:salesChannelOption']);

const presetValue = computed({
    get() {
        return props.salesChannelOption;
    },
    set(newValue) {
        emit('update:salesChannelOption', newValue);
    }
});

const salesChannelOptions = ref([
    { name: 'All', code: 'ALL' },
    { name: 'Amazon', code: 'AMAZON' },
    { name: 'Walmart', code: 'WALMART' },
    { name: 'Etsy', code: 'ETSY' },
    { name: 'Shopify', code: 'SHOPIFY' }
]);
</script>

<template>
    <Dropdown class="col-sm-12 col-md-12 m-1" v-model="presetValue" :options="salesChannelOptions" optionLabel="name" placeholder="Sales Channel" />
</template>
