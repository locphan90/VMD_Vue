<template>
  <div class="related-products-section" v-if="relatedProducts.length > 0">
    <h2 class="section-title">Sản phẩm liên quan</h2>

    <div class="carousel-container">
      <div class="products-container">
        <div
          v-for="product in displayedProducts"
          :key="product.id"
          class="product-card"
          @click="navigateToProduct(product.slug)"
        >
          <div class="product-image">
            <img :src="getFullFtpUrl(product.fileFTP)" :alt="product.tenSP" />
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.tenSP }}</h3>
            <p class="product-price" v-if="product.giaThamKhao">
              {{ product.giaThamKhao.toLocaleString() }}<sup>đ</sup>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

const props = defineProps({
  currentProduct: {
    type: Object,
    required: true,
  },
});

const router = useRouter();
const relatedProducts = ref([]);

// Hiển thị chỉ 5 sản phẩm ngẫu nhiên
const displayedProducts = computed(() => {
  if (relatedProducts.value.length <= 5) {
    return relatedProducts.value;
  }
  
  // Lấy 5 sản phẩm ngẫu nhiên từ danh sách
  const shuffled = [...relatedProducts.value].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5);
});

// Fetch related products
const fetchRelatedProducts = async () => {
  if (!props.currentProduct || !props.currentProduct.danhMucSP) return;

  try {
    const response = await axios.get(
      `/api/sanpham/filter-or?danhMucSP=${encodeURIComponent(
        props.currentProduct.danhMucSP
      )}`
    );

    // Kiểm tra cấu trúc API trả về
    console.log("API response:", response.data);

    // Kiểm tra xem response.data có thuộc tính data không (cấu trúc mới)
    if (
      response.data &&
      response.data.status === "OK" &&
      Array.isArray(response.data.data)
    ) {
      // Lấy mảng sản phẩm từ response.data.data
      const productsArray = response.data.data;

      // Filter out the current product
      relatedProducts.value = productsArray.filter(
        (product) => product.id !== props.currentProduct.id
      );
    } else if (response.data && Array.isArray(response.data)) {
      // Trường hợp API trả về mảng trực tiếp (cấu trúc cũ)
      relatedProducts.value = response.data.filter(
        (product) => product.id !== props.currentProduct.id
      );
    } else {
      console.log("Dữ liệu không đúng định dạng mong đợi:", response.data);
    }
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu sản phẩm liên quan:", error);
  }
};

// Navigate to product detail page
const navigateToProduct = (slug) => {
  router.push({
    path: `/sanpham/${slug}`,
    replace: true, // Thay thế lịch sử thay vì thêm vào
  });
};

// Watch for changes in the current product
watch(
  () => props.currentProduct,
  (newVal) => {
    fetchRelatedProducts();
  },
  { immediate: true }
);

onMounted(() => {
  fetchRelatedProducts();
});
</script>

<style scoped>
.related-products-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin-top: 20px;
  margin-bottom: 30px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 25px;
  position: relative;
  padding-bottom: 10px;
}

.section-title:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background-color: #3498db;
}

.carousel-container {
  position: relative;
  width: 100%;
}

.products-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 10px 0;
  width: 100%;
}

.product-card {
  width: calc(20% - 16px);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  background-color: white;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}

.product-image {
  height: 180px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 15px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.3;
  height: 42px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  color: #e74c3c;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

@media (max-width: 992px) {
  .product-card {
    width: calc(20% - 12px);
  }
  
  .product-image {
    height: 160px;
  }
}

@media (max-width: 768px) {
  .products-container {
    gap: 15px;
  }
  
  .product-card {
    width: calc(20% - 12px);
  }
  
  .product-image {
    height: 140px;
  }
  
  .product-info {
    padding: 12px;
  }
  
  .product-name {
    font-size: 14px;
    height: 38px;
  }
  
  .product-price {
    font-size: 16px;
  }
}

@media (max-width: 576px) {
  .section-title {
    font-size: 18px;
    margin-bottom: 15px;
  }
  
  .products-container {
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 12px;
  }
  
  .product-card {
    width: calc(50% - 10px);
    margin-bottom: 15px;
  }
  
  .product-image {
    height: 120px;
  }
  
  .product-info {
    padding: 10px;
  }
  
  .product-name {
    font-size: 14px;
    height: 36px;
  }
  
  .product-price {
    font-size: 15px;
  }
}
</style>