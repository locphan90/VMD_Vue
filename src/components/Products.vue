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
            transform: `translateX(-${currentIndex * 240}px)`, // 240 là 228 + 12 khoảng cách
          }"
        >
          <div
            v-for="product in filteredProducts"
            :key="product.id"
            class="product-card"
          >
            <div class="product-image">
              <img
                :src="product.fileFTP"
                :alt="product.tenSP"
                @click="goToDetail(product.slug)"
              />
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


<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";
import { useRouter } from "vue-router";
const router = useRouter();

const goToDetail = (slug) => {
  router.push(`/sanpham/${slug}`);
};

const props = defineProps({
  title: String,
  type: String,
});

// State
const products = ref([]);
const currentIndex = ref(0);
const visibleCount = ref(5);
let autoPlayInterval = null;

// Computed
const filteredProducts = computed(() =>
  products.value.filter(
    (p) => p.cat === props.type && p.showUp === true && p.status === "OK"
  )
);

const totalItems = computed(() => filteredProducts.value.length);

// Methods
const fetchProducts = async () => {
  try {
    const response = await axios.get("/api/sanpham");
    products.value = response.data.map((product) => ({
      ...product,
      fileFTP: getFullFtpUrl(product.fileFTP), // 👈 Gán lại đường dẫn đầy đủ
    }));
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
  }
};

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % totalItems.value;
};

const prevSlide = () => {
  currentIndex.value =
    (currentIndex.value - 1 + totalItems.value) % totalItems.value;
};

const startAutoPlay = () => {
  autoPlayInterval = setInterval(nextSlide, 3000);
};

const stopAutoPlay = () => {
  clearInterval(autoPlayInterval);
};

const updateVisibleCount = () => {
  const width = window.innerWidth;
  if (width >= 1200) {
    visibleCount.value = 5;
  } else if (width >= 992) {
    visibleCount.value = 4;
  } else if (width >= 768) {
    visibleCount.value = 3;
  } else if (width >= 500) {
    visibleCount.value = 2;
  } else {
    visibleCount.value = 1;
  }
};

// Lifecycle
onMounted(() => {
  fetchProducts();
  startAutoPlay();
  updateVisibleCount();
  window.addEventListener("resize", updateVisibleCount);
});

onBeforeUnmount(() => {
  stopAutoPlay();
  window.removeEventListener("resize", updateVisibleCount);
});
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
  overflow-x: hidden;
  width: 100%;
}

.slider-track {
  display: flex;
  transition: transform 0.5s ease;
  width: max-content; /* 👈 Cho phép dài hơn màn hình */
}

.product-card {
  flex: 0 0 228px; /* 👈 Giữ cố định kích thước sản phẩm */
  width: 228px;
  height: auto;
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
  cursor: pointer;
  transition: transform 0.2s;
}

.product-image:hover {
  transform: scale(1.05);
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
