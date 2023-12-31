import { createRouter, createWebHashHistory } from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import CartPage from '@/pages/CartPage.vue';
import OrderPage from '@/pages/OrderPage.vue';
import OrderInfoPage from '@/pages/OrderInfoPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue'

const routes = [
    {name: 'main', component: MainPage, path: '/'},
    {name: 'product', component: ProductPage, path: '/product/:id'},
    {name: 'cart', component: CartPage, path: '/cart'},
    {name: 'order', component: OrderPage, path: '/order'},
    {name: 'orderInfo', component: OrderInfoPage, path: '/orders/:id'},
    {name: 'notFound', component: NotFoundPage, path: '/:pathMatch(.*)*'}
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
  });
  
export default router;