import store from '../store';
import HttpService from '../service/HttpService';

export default {
    getSales,
    getProfitability,
    deleteSalesData
};

async function getSales(preset, salesChannel, from, to, filter, page, limit) {
    preset = preset || 'MTD';
    salesChannel = salesChannel || 'ALL';
    from = from || null;
    to = to || null;
    filter = filter || '';
    page = page || 0;
    limit = limit || 20;
    if (store.getters['salesStore/getSales'](preset, salesChannel, from, to, filter, page, limit)) {
        return store.getters['salesStore/getSales'](preset, salesChannel, from, to, filter, page, limit);
    }

    let response = null;

    if (preset === 'CUSTOM' && from && to) {
        response = await HttpService.get('/v2/sales?preset=' + preset + '&salesChannel=' + salesChannel + '&from=' + from + '&to=' + to + '&filter=' + filter + '&page=' + page + '&limit=' + limit);
    } else {
        response = await HttpService.get('/v2/sales?preset=' + preset + '&salesChannel=' + salesChannel + '&filter=' + filter + '&page=' + page + '&limit=' + limit);
    }

    if (!response) {
        return null;
    }

    await store.dispatch('salesStore/setSales', { preset, salesChannel, from, to, filter, page, limit, data: response });
    return response;
}

async function getProfitability(preset, salesChannel, from, to) {
    preset = preset || 'MTD';
    salesChannel = salesChannel || 'ALL';
    from = from || null;
    to = to || null;

    if (store.getters['salesStore/getProfitability'](preset, salesChannel, from, to)) {
        return store.getters['salesStore/getProfitability'](preset, salesChannel, from, to);
    }
    let response = null;

    if (preset === 'CUSTOM' && from && to) {
        response = await HttpService.get('/v1/products/profit?preset=' + preset + '&salesChannel=' + salesChannel + '&from=' + from + '&to=' + to);
    } else {
        response = await HttpService.get('/v1/products/profit?preset=' + preset + '&salesChannel=' + salesChannel);
    }

    if (!response) {
        return null;
    }

    await store.dispatch('salesStore/setProfitability', { preset, salesChannel, from, to, data: response });
    return response;
}

function deleteSalesData() {
    store.dispatch('salesStore/setSales', {});
    store.dispatch('salesStore/setProfitability', {});
}
