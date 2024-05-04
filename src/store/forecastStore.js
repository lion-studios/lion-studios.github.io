import { createLogger } from 'vuex'

export default {
    namespaced: true,
    plugins: [
        createLogger()
    ],
    state() {
        return {
            forecast: {}
        }
    },
    mutations: {
        setForecast(state, payload) {
            const key = (payload.salesChannel || 'default');
            state.forecast[key] = payload.data;
        }
    },
    actions: {
        setForecast(context, payload) {
            context.commit('setForecast', payload);
        }
    },
    getters: {
        getForecast(state) {
            return (salesChannel) => {
                const key = (salesChannel || 'default');
                return state.forecast[key];
            }
        }
    }
}
