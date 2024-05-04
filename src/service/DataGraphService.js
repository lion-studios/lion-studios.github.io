const presetOptions = [
    { name: 'Custom', code: 'CUSTOM' },
    { name: 'Last 7 Days', code: 'L7' },
    { name: 'Last 30 Days', code: 'L30' },
    { name: 'Month To Date', code: 'MTD' },
    { name: 'Year To Date', code: 'YTD' }
];

const salesChannelOptions = [
    { name: 'All', code: 'ALL' },
    { name: 'Amazon', code: 'AMAZON' },
    { name: 'Walmart', code: 'WALMART' },
    { name: 'Etsy', code: 'ETSY' },
    { name: 'Shopify', code: 'SHOPIFY' }
];

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

let timer;
function debounce(loadDataFunction) {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        loadDataFunction();
    }, 1000);
}

function searchOnEnter(loadDataFunction) {
    if (timer) {
        clearTimeout(timer);
    }
    loadDataFunction();
}

function formatCurrency(value) {
    if (!value) {
        return '$0.00';
    }
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function formatDecimal(value) {
    if (!value) {
        return '0';
    }
    return value.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 1 });
}

function formatPercentage(value) {
    if (!value) {
        return '0%';
    }
    return (value / 100).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 });
}

function pageChange(pageState, loadData) {
    page.value = pageState.page;
    limit.value = pageState.rows;
    loadData();
}

function extractCalendarDateString(dateString) {
    if (!dateString) {
        return null;
    }
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toLocaleString('en-US', { minimumIntegerDigits: 2 });
    const day = date.getDate().toLocaleString('en-US', { minimumIntegerDigits: 2 });
    const year = date.getFullYear();
    return year + '-' + month + '-' + day;
}

function getMonthString(dateObject) {
    const monthInt = dateObject.getMonth();
    return months[monthInt];
}

export default {
    presetOptions,
    salesChannelOptions,
    debounce,
    formatCurrency,
    formatDecimal,
    formatPercentage,
    pageChange,
    extractCalendarDateString,
    searchOnEnter,
    getMonthString
};
