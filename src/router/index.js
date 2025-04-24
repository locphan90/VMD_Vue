import { createRouter, createWebHistory } from 'vue-router';
import Home from '../Home.vue';
import AllProducts from '../views/AllProducts.vue';
import AllBrands from '../views/AllBrands.vue';
import AllEvents from '../views/AllEvents.vue';
import ProductDetail from '../views/ProductDetail.vue';
import ProductForm from '../views/Admin/ProductForm.vue';
import BrandForm from '../views/Admin/BrandForm.vue';
import Partners from '../views/Admin/PartnerForm.vue';
import Events from '../views/Admin/EventForm.vue';
import EventDisplay from '../views/EventDisplay.vue';
import DaiLyForm from '../components/DaiLyForm.vue';
import DaiLyManager from '../views/Admin/DaiLyManager.vue';
import EmailManager from '../views/Admin/RegisteredEmails.vue';
import BannerManager from '../views/Admin/BannerManager.vue';
import StaticPageManager from '../views/Admin/StaticPageManager.vue';

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
    path: '/allbrands',
    name: 'allbrands',
    component: AllBrands
  },
  {
    path: '/allevents',
    name: 'allevent',
    component: AllEvents
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
  },
  {
    path: '/news/:id',
    name: 'EventDisplay',
    component: EventDisplay
  },
  {
    path: '/dangkydaily',
    name: 'DaiLyForm',
    component: DaiLyForm
  },
  {
    path: '/admin/dailymanager',
    name: 'DaiLyManager',
    component: DaiLyManager,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/emailmanager',
    name: 'EmailManager',
    component: EmailManager,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  // routes.js
  {
    path: '/sanpham/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true
  },
  {
    path: '/admin/bannermanager',
    name: 'BannerManager',
    component: BannerManager,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/staticpagemanager',
    name: 'StaticPageManager',
    component: StaticPageManager,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Luôn scroll lên đầu trang khi route thay đổi
    return { top: 0 }
  }
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
