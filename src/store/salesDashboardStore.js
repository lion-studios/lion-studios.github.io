import { createLogger } from 'vuex';

export default {
    namespaced: true,
    plugins: [createLogger()],
    state() {
        return {
            salesDashboardData: {}
        };
    },
    mutations: {
        updateSalesDashboardData(state, payload) {
            const key = (payload.preset || 'default') + '-' + (payload.from || 'default') + '-' + (payload.to || 'default');
            state.salesDashboardData[key] = payload.data;
        }
    },
    actions: {
        updateSalesDashboardData(context, data) {
            context.commit('updateSalesDashboardData', data);
        }
    },
    getters: {
        getSalesDashboardData: (state) => (preset, from, to) => {
            const key = (preset || 'default') + '-' + (from || 'default') + '-' + (to || 'default');
            return state.salesDashboardData[key];
        }
    }
};
