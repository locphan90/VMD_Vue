<template>
  <section class="product-detail">
    <div class="back-button">
      <router-link to="/">← Quay lại</router-link>
    </div>
    <div class="detail-wrapper">
      <div class="product-image">
        <img :src="product.image" :alt="product.name" />
      </div>
      <div class="product-info">
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-price">Giá: {{ product.price }}</p>
        <p class="product-description">{{ product.description }}</p>
        <div class="product-meta">
          <span class="badge">{{ product.hot }}</span>
          <span class="badge">{{ product.status }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ProductDetail',
  data() {
    return {
      product: {
        name: '',
        price: '',
        image: '',
        description: '',
        hot: '',
        status: '',
      },
    };
  },
  mounted() {
    const products = [
      { image: '/api/placeholder/240/200', name: 'Cà Phê Nguyên Chất Cao Cấp K-Coffee', price: '450.000 đ', hot: 'Hot: 10%', status: 'New', description: 'Hương vị đậm đà, thơm ngon từ hạt cà phê tuyển chọn.' },
      { image: '/api/placeholder/240/200', name: 'Trà Hoa Táo Vị Đào Cam Sả', price: '150.000 đ', hot: 'Hot: 15%', status: 'Sale', description: 'Sự kết hợp hoàn hảo giữa vị trà thanh mát và hương thơm nhẹ nhàng.' },
      { image: '/api/placeholder/240/200', name: 'Sữa Đậu Lúa Mạch Đông', price: '150.000 đ', hot: 'Hot: 18%', status: 'New', description: 'Dinh dưỡng từ đậu nành và lúa mạch, tốt cho sức khỏe.' },
      { image: '/api/placeholder/240/200', name: 'Mỳ Rong Rưỡng Vị Măng Ngọt', price: '240.000 đ', hot: 'Hot: 22%', status: 'Sale', description: 'Hương vị măng ngọt tự nhiên, thơm ngon hấp dẫn.' },
      { image: '/api/placeholder/240/200', name: 'Phở Vina Hương Vị Gà Xé', price: '280.000 đ', hot: 'Hot: 25%', status: 'New', description: 'Phở Việt truyền thống với hương vị gà xé đậm đà.' },
      { image: '/api/placeholder/240/200', name: 'Trà Sen Vàng', price: '170.000 đ', hot: 'Hot: 12%', status: 'New', description: 'Trà sen vàng, tinh hoa của thiên nhiên Việt Nam.' },
      { image: '/api/placeholder/240/200', name: 'Nước ép Táo Tươi', price: '220.000 đ', hot: 'Hot: 18%', status: 'Sale', description: 'Nước ép táo tươi nguyên chất, giàu vitamin.' },
      { image: '/api/placeholder/240/200', name: 'Sữa Chua Uống Men Sống', price: '130.000 đ', hot: 'Hot: 20%', status: 'New', description: 'Sữa chua uống men sống, tốt cho hệ tiêu hóa.' },
    ];
    const name = this.$route.params.name;
    this.product = products.find(p => p.name === name) || products[0];
  },
};
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 15px;
}

.back-button {
  margin-bottom: 20px;
}

.back-button a {
  text-decoration: none;
  color: #e74c3c;
  font-weight: bold;
}

.detail-wrapper {
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  flex: 1 1 400px;
}

.product-image img {
  width: 100%;
  border-radius: 8px;
}

.product-info {
  flex: 1 1 400px;
}

.product-title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
}

.product-price {
  color: #e74c3c;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
}

.product-description {
  margin-bottom: 20px;
  line-height: 1.6;
  color: #555;
}

.product-meta .badge {
  display: inline-block;
  background: #e74c3c;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
  font-size: 12px;
}

.buy-button {
  display: inline-block;
  background: #e74c3c;
  color: #fff;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  transition: background 0.3s;
}

.buy-button:hover {
  background: #c0392b;
}

@media (max-width: 768px) {
  .detail-wrapper {
    flex-direction: column;
  }

  .product-title {
    font-size: 22px;
  }

  .product-price {
    font-size: 18px;
  }
}
</style>
