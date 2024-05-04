<script setup>
const props = defineProps({
    data: Number | String,
    title: String,
    icon: String,
    tooltip: String,
    bgColor: String
});
</script>

<template>
    <div class="card dashboard-widget-card mb-0" :class="props.bgColor">
        <div class="flex flex-column">
            <div class="mb-5">
                <span :class="props.icon" />
            </div>
            <div class="">
                <span class="text-900 font-medium font-bold text-xl">{{ props.data }}</span>
            </div>
            <div class="flex flex-row align-items-center">
                <span class="block text-500 font-medium font-bold">{{ props.title }}</span>
                <p>&nbsp;</p>
                <i v-tooltip.top="{ value: props.tooltip }" class="pi pi-info-circle"></i>
            </div>
        </div>
    </div>
</template>

<style>
.dashboard-widget-card {
    box-sizing: inherit;
    padding: 1rem;
    border: unset;
}
</style>
