<script setup>
defineProps({
    showErrorMessage: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <div class="text-900 text-xl text-red-900 font-medium mb-2 bg-red-100" v-if="showErrorMessage">
        Hmm, something went wrong. We were unable to retrieve some data, please try again later.
    </div>
</template>

<style></style>