<template>
  <div class="products">
    <div class="section-header">
      <h2>{{ title }}</h2>
      <router-link to="/products" class="view-all">Xem tất cả →</router-link>
    </div>
    <div
      class="slider-container"
      @mouseenter="stopAutoPlay"
      @mouseleave="startAutoPlay"
    >
      <div class="slider-wrapper">
        <div
          class="slider-track"
          :style="{
            transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
          }"
        >
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
          >
            <div class="product-image">
              <img :src="product.fileFTP" :alt="product.tenSP" />
            </div>
            <h3>{{ product.tenSP }}</h3>
            <div class="product-info">
              <span>{{ product.mota }}</span>
              <span class="product-price">
                {{ product.giaThamKhao.toLocaleString()
                }}<span class="currency">đ</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <button class="nav-button nav-left" @click="prevSlide">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="nav-button nav-right" @click="nextSlide">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "Products",
  props: {
    title: String,
    type: String,
  },
  data() {
    return {
      products: [],
      currentIndex: 0,
      visibleCount: 5,
      autoPlayInterval: null,
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(
        (p) => p.cat === this.type && p.showUp === true && p.status === "OK"
      );
    },
    totalItems() {
      return this.filteredProducts.length;
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get("https://localhost:7210/api/sanpham");
        this.products = response.data;
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.totalItems;
    },
    prevSlide() {
      this.currentIndex =
        (this.currentIndex - 1 + this.totalItems) % this.totalItems;
    },
    startAutoPlay() {
      this.autoPlayInterval = setInterval(this.nextSlide, 3000);
    },
    stopAutoPlay() {
      clearInterval(this.autoPlayInterval);
    },
    updateVisibleCount() {
      const width = window.innerWidth;
      if (width >= 1200) {
        this.visibleCount = 5;
      } else if (width >= 768) {
        this.visibleCount = 3;
      } else {
        this.visibleCount = 1;
      }
    },
  },
  mounted() {
    this.fetchProducts();
    this.startAutoPlay();
    this.updateVisibleCount();
    window.addEventListener("resize", this.updateVisibleCount);
  },
  beforeUnmount() {
    clearInterval(this.autoPlayInterval);
    window.removeEventListener("resize", this.updateVisibleCount);
  },
};
</script>

<style scoped>
.products {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 15px;
  text-align: center;
}
.slider-container {
  position: relative;
  max-width: 1200px;
  margin: auto;
}

.slider-wrapper {
  overflow: hidden;
  width: 100%;
}

.slider-track {
  display: flex;
  transition: transform 0.5s ease;
  padding: 0 5px; /* Thêm padding nhẹ hai bên */
}

.product-card {
  flex: 0 0 calc(20% - 12px); /* ✅ Giữ 5 sản phẩm / 1 hàng trong 1200px */
  max-width: calc(20% - 12px);
  box-sizing: border-box;
  margin: 0 6px;
  padding: 10px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-image {
  width: 100%;
  padding-top: 100%; /* ✅ Vuông */
  position: relative;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-card h3 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
  text-align: center;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px; /* ✅ Chữ nhỏ hơn */
  color: #555;
}

.product-price {
  font-weight: bold;
  color: #e74c3c;
}

.currency {
  font-size: 0.7em;
  vertical-align: super;
}

/* Nút điều hướng đẹp hơn và chìm trong slider */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 10;
}

.nav-button:hover {
  background: #007bff;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.nav-left {
  left: 10px;
}

.nav-right {
  right: 10px;
}
/* Responsive số sản phẩm */
:root {
  --visible-count: 5;
}

.section-title {
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
  color: #333;
  position: relative;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
}
.section-header h2 {
  font-size: 24px;
}
.view-all {
  color: #e74c3c;
  text-decoration: none;
  font-size: 14px;
}

.scroll-target {
  scroll-margin-top: 135px; /* đúng bằng chiều cao header cố định */
}

@media (max-width: 1200px) {
  :root {
    --visible-count: 3;
  }
}

@media (max-width: 768px) {
  :root {
    --visible-count: 1;
  }
}
</style>
