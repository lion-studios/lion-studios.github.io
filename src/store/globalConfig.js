import { createLogger } from 'vuex';

export default {
    namespaced: true,
    state() {
        return {
            // baseUrl: 'https://predicate.biz/api'
            baseUrl: 'http://localhost:5000/api'
        };
    },
    getters: {
        getBaseUrl(state) {
            return state.baseUrl;
        }
    }
};
