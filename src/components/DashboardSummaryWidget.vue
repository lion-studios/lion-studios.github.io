<script setup>
const props = defineProps({
    data: Number | String,
    title: String,
    iconBg: String,
    icon: String,
    footerBoldedText: String,
    footerText: String,
    tooltip: String
});
</script>

<template>
    <div class="card mb-0">
        <div class="flex justify-content-between mb-3">
            <div>
                <span class="block text-500 font-medium mb-3">{{ props.title }}</span>
                <div class="text-900 font-medium text-xl">{{ props.data }}</div>
            </div>
            <div class="flex align-items-center justify-content-center border-round" :class="props.iconBg" style="width: 2.5rem; height: 2.5rem">
                <i v-tooltip.top="{ value: props.tooltip }" class="pi text-xl" :class="props.icon"></i>
            </div>
        </div>
        <span class="text-green-500 font-medium">{{ props.footerBoldedText }} </span>
        <span class="text-500">{{ props.footerText }}</span>
    </div>
</template>
