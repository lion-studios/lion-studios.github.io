import store from '../store';
import HttpService from '../service/HttpService';

export default {
    getForecast,
    deleteForecastData
}

async function getForecast(salesChannel) {
    if (store.getters["forecastStore/getForecast"](salesChannel)) {
        return store.getters["forecastStore/getForecast"](salesChannel);
    }

    salesChannel = salesChannel || 'ALL';

    let response = await HttpService.get('/v2/forecast?salesChannel=' + salesChannel);

    if (!response) {
        return null;
    }

    await store.dispatch('forecastStore/setForecast', { salesChannel, data: response });
    return response;
}

function deleteForecastData() {
    store.dispatch('forecastStore/setForecast', {});
}
