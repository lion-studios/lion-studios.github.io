import { createLogger } from 'vuex'

export default {
    namespaced: true,
    plugins: [
        createLogger()
    ],
    state() {
        return {
            loginData: null,
        }
    },
    mutations: {
        updateLoginData(state, data) {
            state.loginData = data;
        },
    },
    actions: {
        updateLoginData(context, data) {
            context.commit('updateLoginData', data);
        },
    },
    getters: {
        getLoginData(state) {
            return state.loginData;
        },
    },
}
