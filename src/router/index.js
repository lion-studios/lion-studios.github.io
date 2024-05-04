import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    redirect: '/finance/dashboard'
                },
                {
                    path: '/finance/dashboard',
                    name: 'dashboard',
                    component: () => import('@/views/finance/Dashboard.vue')
                },
                {
                    path: '/finance/sales-profit',
                    name: 'salesProfit',
                    component: () => import('@/views/finance/SalesProfit.vue')
                },
                {
                    path: '/finance/forecast',
                    name: 'forecast',
                    component: () => import('@/views/finance/Forecast.vue')
                },
                {
                    path: '/finance/expenses',
                    name: 'expenses',
                    component: () => import('@/views/finance/Expenses.vue')
                },
                {
                    path: '/products',
                    name: 'products',
                    component: () => import('@/views/products/Products.vue')
                },
                {
                    path: '/products/performance',
                    name: 'productsPerformance',
                    component: () => import('@/views/products/Performance.vue')
                }
            ]
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        }
    ]
});

export default router;
