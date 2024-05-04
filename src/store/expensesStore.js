import { createLogger } from 'vuex'

export default {
    namespaced: true,
    plugins: [
        createLogger()
    ],
    state() {
        return {
            productExpenses: {}
        }
    },
    mutations: {
        setProductExpenses(state, payload) {
            const key = 
                (payload.search || 'default') + '-' + 
                (payload.page || 'default') + '-' + 
                (payload.limit || 'default') + '-' + 
                (payload.salesChannel || 'default');
            state.productExpenses[key] = payload.data;
        }
    },
    actions: {
        setProductExpenses(context, payload) {
            context.commit('setProductExpenses', payload);
        }
    },
    getters: {
        getProductExpenses(state) {
            return (search, page, limit, salesChannel) => {
                const key = (search || 'default') + '-' + (page || 'default') + '-' + (limit || 'default') + '-' + (salesChannel || 'default');
                return state.productExpenses[key];
            }
        }
    },
}

