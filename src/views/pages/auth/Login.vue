<script setup>
import { ref } from "vue";
import { useLayout } from '@/layout/composables/layout';
import AppConfig from '@/layout/AppConfig.vue';
import LoginRepository from '@/repository/LoginRepository';
import ApiInitializerService from '@/service/ApiInitializerService';
import router from '@/router';
import LoadingModal from '@/components/LoadingModal.vue';

const { layoutConfig } = useLayout();

const email = ref('');
const password = ref('');
const checked = ref('');
const logoUrl = ref(`images/predicate_logo.svg`);
const showLoadingModal = ref(false);
const showErrorMessage = ref(false);

const userLogin = async () => {
    showLoadingModal.value = true;
    const loginSuccessful = await LoginRepository.login(email.value, password.value, true);
    if (!loginSuccessful) {
        showErrorMessage.value = true;
        showLoadingModal.value = false;
    } else {
        await ApiInitializerService.initializeData();
        showLoadingModal.value = false;
        router.push('/');
    }
}

</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Predicate logo" class="mb-7 w-12rem flex-shrink-10" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div class="text-900 text-xl text-red-900 font-medium mb-2 bg-red-100" v-if="showErrorMessage">
                        You have entered an invalid email or password
                    </div>

                    <div>
                        <label xfor="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5"
                            style="padding: 1rem" v-model="email" />

                        <label xfor="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true"
                            class="w-full mb-3" inputClass="w-full"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label xfor="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer"
                                style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        <Button label="Sign In" class="w-full p-3 text-xl" @click="userLogin"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
    <LoadingModal :showLoadingModal="showLoadingModal" />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
