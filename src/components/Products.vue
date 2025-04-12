// components/Products.vue
<template>
  <section class="products">
    <div class="section-header">
      <h2>{{ title }}</h2>
      <a href="#" class="view-all">Xem tất cả →</a>
    </div>
    <transition-group name="slide-fade" tag="div" class="product-grid">
      <router-link
        v-for="(product, index) in paginatedProducts"
        :key="product.name + index + currentPage"
        :to="{ name: 'ProductDetail', params: { name: product.name } }"
        class="product-card"
      >
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
        </div>
        <div class="product-info">
          <div class="product-title">{{ product.name }}</div>
          <div class="product-price">{{ product.price }}</div>
          <div class="product-meta">
            <span>{{ product.hot }}</span>
            <span>{{ product.status }}</span>
          </div>
        </div>
      </router-link>
    </transition-group>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Trước</button>
      <button
        v-for="page in totalPages"
        :key="page"
        :class="{ active: currentPage === page }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <button @click="nextPage" :disabled="currentPage === totalPages">Sau</button>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Products',
  props: ['title'],
  data() {
    return {
      products: [
        { image: '/api/placeholder/240/200', name: 'Cà Phê Nguyên Chất Cao Cấp K-Coffee', price: '450.000 đ', hot: 'Hot: 10%', status: 'New', description: 'Hương vị đậm đà, thơm ngon từ hạt cà phê tuyển chọn.' },
        { image: '/api/placeholder/240/200', name: 'Trà Hoa Táo Vị Đào Cam Sả', price: '150.000 đ', hot: 'Hot: 15%', status: 'Sale', description: 'Sự kết hợp hoàn hảo giữa vị trà thanh mát và hương thơm nhẹ nhàng.' },
        { image: '/api/placeholder/240/200', name: 'Sữa Đậu Lúa Mạch Đông', price: '150.000 đ', hot: 'Hot: 18%', status: 'New', description: 'Dinh dưỡng từ đậu nành và lúa mạch, tốt cho sức khỏe.' },
        { image: '/api/placeholder/240/200', name: 'Mỳ Rong Rưỡng Vị Măng Ngọt', price: '240.000 đ', hot: 'Hot: 22%', status: 'Sale', description: 'Hương vị măng ngọt tự nhiên, thơm ngon hấp dẫn.' },
        { image: '/api/placeholder/240/200', name: 'Phở Vina Hương Vị Gà Xé', price: '280.000 đ', hot: 'Hot: 25%', status: 'New', description: 'Phở Việt truyền thống với hương vị gà xé đậm đà.' },
        { image: '/api/placeholder/240/200', name: 'Trà Sen Vàng', price: '170.000 đ', hot: 'Hot: 12%', status: 'New', description: 'Trà sen vàng, tinh hoa của thiên nhiên Việt Nam.' },
        { image: '/api/placeholder/240/200', name: 'Nước ép Táo Tươi', price: '220.000 đ', hot: 'Hot: 18%', status: 'Sale', description: 'Nước ép táo tươi nguyên chất, giàu vitamin.' },
        { image: '/api/placeholder/240/200', name: 'Sữa Chua Uống Men Sống', price: '130.000 đ', hot: 'Hot: 20%', status: 'New', description: 'Sữa chua uống men sống, tốt cho hệ tiêu hóa.' },
      ],
      currentPage: 1,
      perPage: 4,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.products.length / this.perPage);
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.products.slice(start, start + this.perPage);
    },
  },
  methods: {
    goToPage(page) {
      if (this.currentPage !== page) {
        this.currentPage = page;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
};
</script>

<style scoped>
/* giữ nguyên style cũ */
.products { max-width: 1200px; margin: 40px auto; padding: 0 15px; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
.section-header h2 { font-size: 24px; }
.view-all { color: #e74c3c; text-decoration: none; font-size: 14px; }
.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.product-card { background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); transition: transform 0.3s; height: 100%; display: flex; flex-direction: column; text-decoration: none; color: inherit; }
.product-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
.product-image { position: relative; height: 200px; overflow: hidden; }
.product-image img { width: 100%; height: 100%; object-fit: cover; }
.product-info { padding: 15px; flex-grow: 1; display: flex; flex-direction: column; }
.product-title { font-size: 14px; font-weight: bold; margin-bottom: 10px; flex-grow: 1; }
.product-price { color: #e74c3c; font-weight: bold; font-size: 16px; margin-bottom: 10px; }
.product-meta { display: flex; justify-content: space-between; font-size: 12px; color: #777; }
.pagination { margin-top: 20px; text-align: center; }
.pagination button { background-color: #fff; border: 1px solid #ddd; margin: 0 5px; padding: 5px 10px; cursor: pointer; border-radius: 4px; transition: background-color 0.3s; }
.pagination button:hover { background-color: #e74c3c; color: #fff; }
.pagination button.active { background-color: #e74c3c; color: #fff; border-color: #e74c3c; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.3s ease; }
.slide-fade-enter-from { opacity: 0; transform: translateX(20px); }
.slide-fade-leave-to { opacity: 0; transform: translateX(-20px); }
@media (max-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .product-grid { grid-template-columns: 1fr; } }
</style>
