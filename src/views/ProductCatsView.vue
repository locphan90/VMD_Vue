<template>
  <div class="brands-products-page">
    <!-- Back Button -->
    <div class="back-button-container">
      <button class="back-button" @click="goBack">
        <span class="back-icon">&#8592;</span> Quay lại
      </button>
    </div>

    <div class="content-container">
      <!-- Left Sidebar - Brands -->
      <div class="brands-sidebar">
        <h3>Thương hiệu</h3>
        <ul class="brands-list">
          <li
            v-for="brand in brands"
            :key="brand"
            :class="{ active: selectedBrand === brand }"
            @click="selectBrand(brand)"
          >
            {{ brand }}
            <span class="brand-indicator"></span>
          </li>
        </ul>
      </div>

      <!-- Right Content - Products -->
      <div class="products-container">
        <div class="section-header">
          <h2>{{ selectedBrand ? selectedBrand : 'Tất cả sản phẩm' }}</h2>
          <div class="filters">
            <select v-model="sortOption" class="sort-select">
              <option value="price-asc">Giá: Thấp đến cao</option>
              <option value="price-desc">Giá: Cao đến thấp</option>
              <option value="newest">Mới nhất</option>
            </select>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="products-grid">
          <div v-for="product in filteredProducts" :key="product.id" class="product-card">
            <router-link :to="`/sanpham/${product.slug}`" class="product-item-link">
              <div class="product-image">
                <img :src="getFullFtpUrl(product.fileFTP) " :alt="product.tenSP" />
              </div>
            </router-link>
            <h3>{{ product.tenSP }}</h3>
            <div class="product-info">
              <span>{{ product.mota }}</span>
              <span class="product-price">
                {{ product.giaThamKhao.toLocaleString() }}<span class="currency">đ</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading-state">
          <p>Đang tải dữ liệu...</p>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && filteredProducts.length === 0" class="empty-state">
          <p>Không tìm thấy sản phẩm nào phù hợp.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "@/utils/axios";
import getFullFtpUrl from "/src/utils/pathHelper";

// Router
const router = useRouter();
const route = useRoute();

// State
const products = ref([]);
const brands = ref([]);
const selectedBrand = ref("");
const selectedCategory = ref(route.params.tendanhmuc || route.query.category || "");
const sortOption = ref("newest");
const loading = ref(false);

// Goback function
const goBack = () => {
  router.go(-1); // Quay lại trang trước đó
};

// Và đảm bảo hàm fetchProductsByCategory() xử lý dữ liệu tiếng Việt đúng cách:
const fetchProductsByCategory = async () => {
  if (!selectedCategory.value) return;
  loading.value = true;
  try {
    // Sử dụng encodeURIComponent để đảm bảo URL encoding đúng với tiếng Việt
    const encodedCategory = encodeURIComponent(selectedCategory.value);
    const response = await axios.get(`/api/sanpham/filter-or?danhMucSP=${encodedCategory}`);
    
    // Kiểm tra cấu trúc dữ liệu trả về và log ra để debug
    console.log("Dữ liệu API trả về:", response);
    
    // Kiểm tra xem response.data có phải là mảng không
    if (Array.isArray(response.data)) {
      products.value = response.data;
    } else if (response.data && typeof response.data === 'object') {
      // Nếu response.data là một object, có thể dữ liệu thực sự nằm trong một property khác
      // Ví dụ: response.data.items hoặc response.data.products
      console.log("Cấu trúc response.data:", Object.keys(response.data));
      
      // Thử tìm mảng sản phẩm trong các thuộc tính của response.data
      const possibleArrayProps = ['items', 'products', 'data', 'result', 'results'];
      for (const prop of possibleArrayProps) {
        if (Array.isArray(response.data[prop])) {
          console.log(`Tìm thấy mảng sản phẩm trong response.data.${prop}`);
          products.value = response.data[prop];
          break;
        }
      }
      
      // Nếu vẫn không tìm thấy mảng, gán một mảng rỗng
      if (!Array.isArray(products.value)) {
        console.error("Không tìm được mảng sản phẩm trong response");
        products.value = [];
      }
    } else {
      console.error("Dữ liệu không phải là mảng hoặc object:", response.data);
      products.value = [];
    }
    
    // Chỉ xử lý brands nếu products.value là mảng
    if (Array.isArray(products.value)) {
      // Extract unique brands
      const uniqueBrands = [...new Set(products.value
        .filter(product => product && product.status === "OK" && product.showUp === true)
        .map(product => product.thuongHieu)
        .filter(brand => brand)) // Filter out null/empty brands
      ];
      
      brands.value = uniqueBrands.sort();
    } else {
      brands.value = [];
    }
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
    console.error("Chi tiết lỗi:", error.response ? error.response.data : error.message);
    products.value = [];
    brands.value = [];
  } finally {
    loading.value = false;
  }
};
// Select brand
const selectBrand = (brand) => {
  selectedBrand.value = selectedBrand.value === brand ? "" : brand;
};

// Computed
const filteredProducts = computed(() => {
  let result = [...products.value].filter(product => 
    product.status === "OK" && product.showUp === true
  );
  
  // Filter by brand if selected
  if (selectedBrand.value) {
    result = result.filter(p => p.thuongHieu === selectedBrand.value);
  }
  
  // Sort based on selected option
  if (sortOption.value === "price-asc") {
    result.sort((a, b) => a.giaThamKhao - b.giaThamKhao);
  } else if (sortOption.value === "price-desc") {
    result.sort((a, b) => b.giaThamKhao - a.giaThamKhao);
  } else if (sortOption.value === "newest") {
    result.sort((a, b) => new Date(b.fstUpdate) - new Date(a.fstUpdate));
  }
  
  return result;
});

// Watch for route changes to update category
watch(
  [() => route.params.tendanhmuc, () => route.query.category],
  ([newParamCategory, newQueryCategory]) => {
    const newCategory = newParamCategory || newQueryCategory;
    if (newCategory) {
      selectedCategory.value = newCategory;
      selectedBrand.value = ""; // Reset selected brand when category changes
      fetchProductsByCategory();
    }
  },
  { immediate: true }
);

// Lifecycle
onMounted(() => {
  fetchProductsByCategory();
});
</script>

<style scoped>
.brands-products-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 15px;
}

/* Back button styling */
.back-button-container {
  margin-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  background-color: #f8f9fa;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  background-color: #e9ecef;
  transform: translateX(-3px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-icon {
  margin-right: 8px;
  font-size: 16px;
}

.content-container {
  display: flex;
  gap: 30px;
}

/* Brands Sidebar */
.brands-sidebar {
  flex: 0 0 250px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.brands-sidebar h3 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  font-size: 18px;
  color: #333;
}

.brands-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.brands-list li {
  position: relative;
  padding: 12px 8px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
}

.brands-list li:hover {
  color: #e74c3c;
  background-color: #f9f9f9;
  padding-left: 15px;
}

.brands-list li.active {
  color: #e74c3c;
  font-weight: bold;
  background-color: rgba(231, 76, 60, 0.05);
  padding-left: 15px;
}

.brand-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background-color: #e74c3c;
  transition: width 0.3s ease-in-out;
}

.brands-list li:hover .brand-indicator,
.brands-list li.active .brand-indicator {
  width: 100%;
}

/* Products Container */
.products-container {
  flex: 1;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.section-header h2 {
  font-size: 24px;
  margin: 0;
}

.filters {
  display: flex;
  align-items: center;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  transition: border-color 0.3s;
}

.sort-select:focus {
  outline: none;
  border-color: #e74c3c;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

/* Product Card */
.product-card {
  width: 100%;
  height: auto;
  padding: 10px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
              box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-image {
  width: 100%;
  padding-top: 100%; /* Square aspect ratio */
  position: relative;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
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
  transition: transform 0.3s ease;
}

.product-image:hover img {
  transform: scale(1.05);
}

.product-card h3 {
  font-size: 16px;
  margin: 10px 0 8px;
  color: #333;
  text-align: center;
}

.product-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
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

.empty-state, .loading-state {
  text-align: center;
  padding: 40px 0;
  color: #777;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 20px;
}

/* Responsive */
@media (max-width: 992px) {
  .content-container {
    flex-direction: column;
  }
  
  .brands-sidebar {
    flex: none;
    width: 100%;
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>