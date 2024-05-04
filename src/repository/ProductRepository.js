import store from '@/store';
import HttpService from '@/service/HttpService';

export default {
    getProducts,
    deleteProductsData,
    getProductsPerformance,
    deleteProductsPerformanceData
};

async function getProducts() {
    if (store.getters['productStore/getProducts']) {
        return store.getters['productStore/getProducts'];
    }

    const response = await HttpService.get('/v1/products');

    if (!response) {
        return null;
    }

    await store.dispatch('productStore/setProducts', response);
    return response;
}

function deleteProductsData() {
    store.dispatch('productStore/setProducts', null);
}

async function getProductsPerformance(search, page, limit, preset) {
    if (store.getters['productStore/getProductsPerformance'](search, page, limit, preset)) {
        return store.getters['productStore/getProductsPerformance'](search, page, limit, preset);
    }

    page = page || 0;
    limit = limit || 20;
    search = search || '';
    preset = preset || '';

    const response = await HttpService.get('/v1/products/performance?page=' + page + '&limit=' + limit + '&filter=' + search + '&preset=' + preset);

    if (!response) {
        return null;
    }

    await store.dispatch('productStore/setProductsPerformance', { search, page, limit, preset, data: response });
    return response;
}

function deleteProductsPerformanceData() {
    store.dispatch('productStore/setProductsPerformance', {});
}
