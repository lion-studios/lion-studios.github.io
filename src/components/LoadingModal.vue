<script setup>
import ProgressSpinner from 'primevue/progressspinner';
defineProps({
    showLoadingModal: {
        type: Boolean,
        default: false,
    },
});
</script>

<template>
    <Teleport to="body">
        <Transition name="transition">
            <div class="modal-background" v-if="showLoadingModal">
                <div class="modal">
                    <ProgressSpinner />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style>
.modal-background {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background-color: #fff;
    padding: 50px;
    border-radius: 10px;
}

.transition-enter-active,
.transition-leave-active {
    transition: all 0.25s ease;
}

.transition-enter-from,
.transition-leave-to {
    opacity: 0;
    transform: scale(1.1);
}
</style>