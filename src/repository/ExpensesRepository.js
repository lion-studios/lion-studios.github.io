import store from '@/store';
import HttpService from '@/service/HttpService';

export default {
    getProductExpenses,
    deleteProductExpensesData
}

async function getProductExpenses(search, page, limit, salesChannel) {
    if (store.getters["expensesStore/getProductExpenses"](search, page, limit, salesChannel)) {
        return store.getters["expensesStore/getProductExpenses"](search, page, limit, salesChannel);
    }

    page = page || 0;
    limit = limit || 20;
    search = search || '';
    salesChannel = salesChannel || 'ALL';

    const response = await HttpService.get('/v1/expenses/product?page=' + page + '&limit=' + limit + '&filter=' + search + '&salesChannel=' + salesChannel);

    if (!response) {
        return null;
    }

    await store.dispatch('expensesStore/setProductExpenses', { search, page, limit, salesChannel, data: response });
    return response;
}

function deleteProductExpensesData() {
    store.dispatch('expensesStore/setProductExpenses', {});
}
