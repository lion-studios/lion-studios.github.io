import { createLogger } from 'vuex'

export default {
    namespaced: true,
    plugins: [
        createLogger()
    ],
    state() {
        return {
            products: null,
            productsPerformance: {}
        }
    },
    mutations: {
        setProducts(state, data) {
            state.products = data;
        },
        setProductsPerformance(state, payload) {
            const key = (payload.search || 'default') + '-' + (payload.page || 'default') + '-' + (payload.limit || 'default') + '-' + (payload.sort || 'default');
            state.productsPerformance[key] = payload.data;
        }
    },
    actions: {
        setProductsPerformance(context, payload) {
            context.commit('setProductsPerformance', payload);
        },
        setProducts(context, data) {
            context.commit('setProducts', data);
        }
    },
    getters: {
        getProductsPerformance(state) {
            return (search, page, limit, sort) => {
                const key = (search || 'default') + '-' + (page || 'default') + '-' + (limit || 'default') + '-' + (sort || 'default');
                return state.productsPerformance[key];
            }
        },
        getProducts(state) {
            return state.products;
        }
    },
}

