<template>
  <div class="brand-page">
    <!-- Back Button -->
    <div class="back-button-container">
      <button class="back-button" @click="goBack">
        <span class="back-icon">&#8592;</span> Quay lại
      </button>
    </div>

    <div class="content-container">
      <!-- Left Sidebar - Categories -->
      <div class="categories-sidebar">
        <!-- Brand Header - Now inside sidebar at top -->
        <div class="brand-header-sidebar" v-if="brand">
          <img :src="getFullFtpUrl(brand.vaL2)" :alt="brand.val" class="brand-image" />
        </div>
        
        <h3>Danh mục sản phẩm</h3>
        <ul class="category-list">
          <li 
            v-for="category in categories" 
            :key="category"
            :class="{ active: selectedCategory === category }"
            @click="handleCategoryClick(category)"
          >
            {{ category }}
            <span class="category-indicator"></span>
          </li>
        </ul>
      </div>

      <!-- Right Content - Products -->
      <div class="products-container">
        <div class="section-header">
          <h2>{{ brand ? brand.val : 'Sản phẩm' }}</h2>
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
                <img :src="getFullFtpUrl(product.fileFTP)" :alt="product.tenSP" />
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

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="empty-state">
          <p>Không tìm thấy sản phẩm nào phù hợp.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

const route = useRoute();
const router = useRouter();
const brandCode = ref(route.params.tenthuonghieu || ""); // Lấy mã thương hiệu từ route

// State
const brand = ref(null);
const products = ref([]);
const categories = ref([]);
const selectedCategory = ref("Tất cả");
const sortOption = ref("newest");

// Goback function
const goBack = () => {
  router.go(-1); // Quay lại trang trước đó
};

// Handle category click with smooth animation
const handleCategoryClick = (category) => {
  selectedCategory.value = category;
};

// Fetch brand info
const fetchBrandInfo = async () => {
  try {
    const response = await axios.get("/api/MISC?cat=THUONGHIEU");
    const foundBrand = response.data.find(item => item.val === brandCode.value);
    if (foundBrand) {
      brand.value = foundBrand;
    }
  } catch (error) {
    console.error("Lỗi khi tải thông tin thương hiệu:", error);
  }
};

// Fetch products
const fetchProducts = async () => {
  try {
    const response = await axios.get("/api/sanpham");
    console.log(response.data);
    // Lọc sản phẩm theo thương hiệu của trang
    products.value = response.data.filter(
      product => product.thuongHieu === brandCode.value && product.status === "OK"
    );
    
    // Extract unique categories
    const uniqueCategories = [...new Set(products.value.map(p => p.danhMucSP))];
    categories.value = ["Tất cả", ...uniqueCategories];
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
  }
};

// Computed
const filteredProducts = computed(() => {
  let result = [...products.value];
  
  // Filter by category
  if (selectedCategory.value !== "Tất cả") {
    result = result.filter(p => p.danhMucSP === selectedCategory.value);
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

// Lifecycle
onMounted(async () => {
  await fetchBrandInfo();
  await fetchProducts();
  document.title="NHÃN HIỆU " + route.params.tenthuonghieu;
});
</script>

<style scoped>
.brand-page {
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

/* Brand header inside sidebar */
.brand-header-sidebar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding: 15px 0;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.brand-image {
  max-height: 100px;
  max-width: 100%;
  object-fit: contain;
}

.content-container {
  display: flex;
  gap: 30px;
}

/* Categories Sidebar - Improved animations */
.categories-sidebar {
  flex: 0 0 250px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.categories-sidebar h3 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  font-size: 18px;
  color: #333;
}

.category-list {
  list-style: none;
  font-size: 16px;
  padding: 0;
  margin: 0;
}

.category-list li {
  position: relative;
  padding: 12px 8px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
}

.category-list li:hover {
  color: #e74c3c;
  background-color: #f9f9f9;
  padding-left: 15px;
}

.category-list li.active {
  color: #e74c3c;
  font-weight: bold;
  background-color: rgba(231, 76, 60, 0.05);
  padding-left: 15px;
}

.category-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background-color: #e74c3c;
  transition: width 0.3s ease-in-out;
}

.category-list li:hover .category-indicator,
.category-list li.active .category-indicator {
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

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #777;
}

/* Responsive */
@media (max-width: 992px) {
  .content-container {
    flex-direction: column;
  }
  
  .categories-sidebar {
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