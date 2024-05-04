import store from '@/store';
import HttpService from '@/service/HttpService';
export default {
    login,
    deleteAccessToken,
    getAccessToken,
    deleteLoginData
}

async function login(email, password) {
    const response = await HttpService.post('/v1/login', { email, password });

    if (!response) {
        return false;
    }

    store.dispatch('loginStore/updateLoginData', response);
    localStorage.setItem('access_token', response.access_token);

    return true;
}

function deleteAccessToken() {
    localStorage.removeItem('access_token');
}

function getAccessToken() {
    if (localStorage.getItem('access_token')) {
        return localStorage.getItem('access_token');
    }

    return store.getters['loginStore/getLoginData']?.access_token;
}

function deleteLoginData() {
    store.dispatch('loginStore/updateLoginData', null);
}
