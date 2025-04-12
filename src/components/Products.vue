<template>
  <section class="products">
    <div class="section-header">
      <h2>{{ title }}</h2>
      <a href="#" class="view-all">Xem tất cả →</a>
    </div>
    <div class="product-grid">
      <div class="product-card" v-for="(product, index) in products" :key="index">
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
      </div>
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
        {
          image: '/api/placeholder/240/200',
          name: 'Cà Phê Nguyên Chất Cao Cấp K-Coffee',
          price: '450.000 đ',
          hot: 'Hot: 10%',
          status: 'New',
        },
        {
          image: '/api/placeholder/240/200',
          name: 'Trà Hoa Táo Vị Đào Cam Sả',
          price: '150.000 đ',
          hot: 'Hot: 15%',
          status: 'Sale',
        },
        {
          image: '/api/placeholder/240/200',
          name: 'Sữa Đậu Lúa Mạch Đông',
          price: '150.000 đ',
          hot: 'Hot: 18%',
          status: 'New',
        },
        {
          image: '/api/placeholder/240/200',
          name: 'Mỳ Rong Rưỡng Vị Măng Ngọt',
          price: '240.000 đ',
          hot: 'Hot: 22%',
          status: 'Sale',
        },
        {
          image: '/api/placeholder/240/200',
          name: 'Phở Vina Hương Vị Gà Xé',
          price: '280.000 đ',
          hot: 'Hot: 25%',
          status: 'New',
        },
      ],
    };
  },
};
</script>

<style scoped>
.products {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.view-all {
  color: #e74c3c;
  text-decoration: none;
  font-size: 14px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.product-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  flex-grow: 1;
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
</style>
