// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../Home.vue';
import AllProducts from '../views/AllProducts.vue'
import ProductDetail from '../views/ProductDetail.vue';
import ProductForm from '../views/Admin/ProductForm.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/products',
    name: 'AllProducts',
    component: AllProducts
  },
  {
    path: '/product/:name',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true,
  },
  {
    path: '/admin/products',
    name: 'ProductForm',
    component: ProductForm
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
