<script setup>
import { ref, computed } from 'vue';
import Calendar from 'primevue/calendar';

// preset and dates are custom v-model names passed as props from the parent component

const emit = defineEmits(['update:preset', 'update:dates', 'handlePresetChange', 'handleDateChange']);

const props = defineProps({
    preset: {
        type: Object
    },
    dates: {
        type: Object
    }
});

const presetDateOption = computed({
    get() {
        return props.preset;
    },
    set(newValue) {
        emit('update:preset', newValue);
        emit('handlePresetChange');
    }
});

const customDateRange = computed({
    get() {
        return props.dates;
    },
    set(newValues) {
        emit('update:dates', newValues);
        emit('handleDateChange');
    }
});

const presetOptions = ref([
    { name: 'Custom', code: 'CUSTOM' },
    { name: 'Last 7 Days', code: 'L7' },
    { name: 'Last 30 Days', code: 'L30' },
    { name: 'Month To Date', code: 'MTD' },
    { name: 'Year To Date', code: 'YTD' }
]);

const handlePresetChange = (presetOption) => {
    const dropdownClick = new MouseEvent('click');
    const datepickerButton = document.getElementsByClassName('p-datepicker-trigger');
    if (presetOption?.value?.code === 'CUSTOM') {
        datepickerButton[0].dispatchEvent(dropdownClick);
    }
};
</script>

<template>
    <div class="flex flex-row flex-wrap">
        <Dropdown @change="handlePresetChange" class="col-sm-12 col-md-12 m-1" v-model="presetDateOption" :options="presetOptions" optionLabel="name" placeholder="Preset" />
        <Calendar class="col-sm-12 col-md-12 m-1" v-model="customDateRange" selectionMode="range" showButtonBar showIcon />
    </div>
</template>
