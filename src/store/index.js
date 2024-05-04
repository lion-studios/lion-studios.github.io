import { createStore } from 'vuex'

import globalConfig from './globalConfig';
import loginStore from './loginStore';
import salesDashboardStore from './salesDashboardStore';
import productStore from './productStore';
import salesStore from './salesStore';
import forecastStore from './forecastStore';
import expensesStore from './expensesStore';


export default createStore({
    modules: {
        globalConfig,
        loginStore,
        productStore,
        salesDashboardStore,
        salesStore,
        forecastStore,
        expensesStore
    }
})
