<template>
  <section class="all-products">
    <h2 class="section-title">TẤT CẢ SẢN PHẨM</h2>
    <div class="product-grid">
      <router-link
        v-for="(product, index) in products"
        :key="product.name + index"
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
    </div>
  </section>
</template>

<script>
export default {
  name: 'AllProducts',
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
    };
  },
};
</script>

<style scoped>
.all-products {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 15px;
}

.section-title {
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
  color: #333;
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  width: 50px;
  height: 3px;
  background-color: #e74c3c;
  margin: 10px auto;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.product-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 15px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}

.product-price {
  color: #e74c3c;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 10px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #777;
}

@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
