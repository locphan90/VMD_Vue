import { createRouter, createWebHistory } from 'vue-router';
import Home from '../Home.vue';
import AllProducts from '../views/AllProducts.vue';
import ProductDetail from '../views/ProductDetail.vue';
import ProductForm from '../views/Admin/ProductForm.vue';
import BrandForm from '../views/Admin/BrandForm.vue';
import Partners from '../views/Admin/PartnerForm.vue';
import Events from '../views/Admin/EventForm.vue';

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
    component: ProductForm,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/brands',
    name: 'BrandForm',
    component: BrandForm,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/partners',
    name: 'Partners',
    component: Partners,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/events',
    name: 'Events',
    component: Events,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 👇 Thêm đoạn kiểm tra trước mỗi lần chuyển route
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('username');
    const isAdmin = localStorage.getItem('role') === 'Admin';
  
    if (to.meta.requiresAuth && !isAuthenticated) {
      next('/'); // Chưa đăng nhập
    } else if (to.meta.requiresAdmin && !isAdmin) {
      next('/'); // Không phải admin
    } else {
      next(); // Cho đi tiếp
    }
  });

export default router;
