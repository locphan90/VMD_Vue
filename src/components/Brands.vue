<template>
  <section class="brands">
    <h2 class="section-title">THƯƠNG HIỆU</h2>
    <div class="brand-grid">
      <div class="brand-card" v-for="(brand, index) in brands" :key="index">
        <img :src="brand.image" :alt="brand.name" />
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Brands',
  data() {
    return {
      brands: [
        { image: '/api/placeholder/280/100', name: 'F-Coffee' },
        { image: '/api/placeholder/280/100', name: 'Của Mẹ' },
        { image: '/api/placeholder/280/100', name: 'Perfume' },
        { image: '/api/placeholder/280/100', name: 'Brand' },
      ],
    };
  },
};
</script>

<style scoped>
.brands {
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

.brand-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.brand-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.brand-card img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@media (max-width: 1024px) {
  .brand-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .brand-grid {
    grid-template-columns: 1fr;
  }
}
</style>
