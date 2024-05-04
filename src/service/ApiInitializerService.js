import LoginRepository from '../repository/LoginRepository';
import ProductRepository from '../repository/ProductRepository';
import SalesDashboardRepository from '../repository/SalesDashboardRepository';
import SalesRepository from '../repository/SalesRepository';
import ForecastRepository from '../repository/ForecastRepository';
import ExpensesRepository from '../repository/ExpensesRepository';

export default {
    initializeData,
    deleteAllData
};

async function initializeData() {
    return Promise.allSettled([SalesDashboardRepository.getData(), ProductRepository.getProducts(), ProductRepository.getProductsPerformance(), SalesRepository.getSales(), ForecastRepository.getForecast(), ExpensesRepository.getProductExpenses()]);
}

function deleteAllData() {
    ProductRepository.deleteProductsData();
    ProductRepository.deleteProductsPerformanceData();
    SalesDashboardRepository.deleteSalesDashboardData();
    SalesRepository.deleteSalesData();
    SalesRepository.deleteProfitabilityData();
    ForecastRepository.deleteForecastData();
    ExpensesRepository.deleteProductExpensesData();
    LoginRepository.deleteLoginData();
    LoginRepository.deleteAccessToken();
}
