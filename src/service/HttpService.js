import store from '../store';
import router from '../router';
import LoginRepository from '@/repository/LoginRepository';

export default {
    post,
    get
};

async function post(apiUrl, body, disableRouter) {
    let accessToken = LoginRepository.getAccessToken();
    let headers = { 'Content-Type': 'application/json' };
    if (accessToken) {
        headers['Authorization'] = 'Bearer ' + accessToken;
    }

    var response;
    try {
        response = await fetch(`${store.getters['globalConfig/getBaseUrl']}` + apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });
    } catch (e) {
        LoginRepository.deleteAccessToken();
        if (!disableRouter) {
            router.push('/login');
        }
        return false;
    }

    if (response.status == 401) {
        LoginRepository.deleteAccessToken();
        if (!disableRouter) {
            router.push('/login');
        }
        return false;
    }

    if (!response.ok) {
        return false;
    }

    return response.json();
}

async function get(apiUrl) {
    let accessToken = LoginRepository.getAccessToken();
    let headers = { 'Content-Type': 'application/json' };
    if (accessToken) {
        headers['Authorization'] = 'Bearer ' + accessToken;
    }

    var response;
    try {
        response = await fetch(`${store.getters['globalConfig/getBaseUrl']}` + apiUrl, {
            method: 'GET',
            headers: headers
        });
    } catch (e) {
        LoginRepository.deleteAccessToken();
        router.push('/login');
        return;
    }

    if (response.status == 401) {
        LoginRepository.deleteAccessToken();
        router.push('/login');
        return;
    }

    if (!response.ok) {
        return null;
    }

    return response.json();
}
