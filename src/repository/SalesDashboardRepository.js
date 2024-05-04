import store from '../store';
import HttpService from '../service/HttpService';

export default {
    getData,
    deleteSalesDashboardData
};

async function getData(preset, from, to) {
    if (store.getters['salesDashboardStore/getSalesDashboardData'](preset, from, to)) {
        return store.getters['salesDashboardStore/getSalesDashboardData'](preset, from, to);
    }

    preset = preset || 'MTD';
    from = from || null;
    to = to || null;

    let response = null;
    response = await HttpService.get('/v1/sales/dashboard/?preset=' + preset + '&from=' + from + '&to=' + to);
    if (!response) {
        return null;
    }
    await store.dispatch('salesDashboardStore/updateSalesDashboardData', { preset, from, to, data: response });
    return response;
}

function deleteSalesDashboardData() {
    store.dispatch('salesDashboardStore/updateSalesDashboardData', null);
}
