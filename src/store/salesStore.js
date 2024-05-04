import { createLogger } from 'vuex';

export default {
    namespaced: true,
    plugins: [createLogger()],
    state() {
        return {
            sales: {},
            profitability: {}
        };
    },
    mutations: {
        setSales(state, payload) {
            const key =
                (payload.preset || 'default') +
                '-' +
                (payload.salesChannel || 'default') +
                '-' +
                (payload.from || 'default') +
                '-' +
                (payload.to || 'default') +
                '-' +
                (payload.filter || 'default') +
                '-' +
                (payload.page || 'default') +
                '-' +
                (payload.limit || 'default');
            state.sales[key] = payload.data;
        },
        setProfitability(state, payload) {
            const key =
                (payload.preset || 'default') +
                '-' +
                (payload.salesChannel || 'default') +
                '-' +
                (payload.from || 'default') +
                '-' +
                (payload.to || 'default') +
                '-' +
                (payload.filter || 'default') +
                '-' +
                (payload.page || 'default') +
                '-' +
                (payload.limit || 'default');
            state.profitability[key] = payload.data;
        }
    },
    actions: {
        setSales(context, payload) {
            context.commit('setSales', payload);
        },
        setProfitability(context, payload) {
            context.commit('setProfitability', payload);
        }
    },
    getters: {
        getSales(state) {
            return (preset, salesChannel, from, to, filter, page, limit) => {
                const key = (preset || 'default') + '-' + (salesChannel || 'default') + '-' + (from || 'default') + '-' + (to || 'default') + '-' + (filter || 'default') + '-' + (page || 'default') + '-' + (limit || 'default');
                return state.sales[key];
            };
        },
        getProfitability(state) {
            return (preset, salesChannel, from, to, filter, page, limit) => {
                const key = (preset || 'default') + '-' + (salesChannel || 'default') + '-' + (from || 'default') + '-' + (to || 'default') + '-' + (filter || 'default') + '-' + (page || 'default') + '-' + (limit || 'default');
                return state.profitability[key];
            };
        }
    }
};
