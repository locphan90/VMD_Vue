<template>
  <div class="category-products-page">
    <!-- Header Categories -->
    <div class="industry-categories">
      <div
        v-for="category in categories"
        :key="category.name"
        class="category-item"
        :class="{ active: selectedIndustry === category.name }"
        @click="navigateToIndustry(category.name)"
      >
        <img :src="category.image" :alt="category.name" />
        <span>{{ category.name }}</span>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="search-container">
      <div class="search-box">
        <i class="fas fa-search search-icon"></i>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Tìm kiếm sản phẩm..."
          @input="handleSearch"
        />
        <button v-if="searchQuery" @click="clearSearch" class="clear-button">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Left Sidebar - Tree Structure -->
      <div class="sidebar">
        <h3>Danh mục sản phẩm</h3>
        <div class="tree-view">
          <div
            v-for="category in filteredCategories"
            :key="category"
            class="tree-item"
          >
            <div
              class="category-tree-main"
              :class="{ active: selectedCategory === category }"
              @click="toggleCategory(category)"
            >
              <i
                :class="
                  expandedCategories.includes(category)
                    ? 'fas fa-chevron-down'
                    : 'fas fa-chevron-right'
                "
              ></i>
              {{ category }}
            </div>

            <!-- Brand List under Category -->
            <div
              v-if="expandedCategories.includes(category)"
              class="brands-list"
            >
              <div
                v-for="brand in getBrandsByCategory(category)"
                :key="brand"
                class="brand-tree-item"
                :class="{ active: selectedBrand === brand }"
                @click="selectBrand(brand)"
              >
                {{ brand }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Content - Products Grid -->
      <div class="products-grid">
        <div
          v-if="searchQuery && searchResults.length > 0"
          class="search-results-info"
        >
          <p>
            Tìm thấy {{ searchResults.length }} kết quả cho "{{ searchQuery }}"
          </p>
          <button @click="clearSearch" class="clear-search-btn">
            <i class="fas fa-times"></i> Xóa tìm kiếm
          </button>
        </div>
        <div
          v-else-if="searchQuery && searchResults.length === 0"
          class="no-products"
        >
          <p>
            Không tìm thấy sản phẩm nào phù hợp với từ khóa "{{ searchQuery }}"
          </p>
          <button @click="clearSearch" class="clear-search-btn">
            <i class="fas fa-times"></i> Xóa tìm kiếm
          </button>
        </div>
        <h2 v-else-if="displayProducts.length > 0">
          {{ selectedBrand || selectedCategory || selectedIndustry }}
        </h2>
        <div v-else class="no-products">
          <p>Không có sản phẩm nào phù hợp với tiêu chí đã chọn</p>
        </div>
        <div class="products-container">
          <div
            v-for="product in displayProducts"
            :key="product.id"
            class="product-card"
          >
            <router-link
              :to="`/sanpham/${product.slug}`"
              class="product-item-link"
            >
              <div class="product-image">
                <img :src="product.fileFTP" :alt="product.tenSP" />
              </div>
            </router-link>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";
import { useRouter, useRoute } from "vue-router";

// Router
const router = useRouter();
const route = useRoute();

// State
const products = ref([]);
const selectedIndustry = ref("");
const selectedCategory = ref("");
const selectedBrand = ref("");
const expandedCategories = ref([]);
const searchQuery = ref("");
const searchResults = ref([]);

// Predefined categories with placeholder images
const categories = [
  {
    name: "FMCG",
    image: "/images/FMCG.png",
  },
  {
    name: "Mẹ & Bé",
    image: "/images/mother-day.png",
  },
  {
    name: "HealthCare",
    image: "/images/healthcare.png",
  },
  {
    name: "Industry",
    image: "/images/factory.png",
  },
];

// Fetch products from API
const fetchProducts = async () => {
  try {
    const response = await axios.get("/api/sanpham");
    products.value = response.data.map((product) => ({
      ...product,
      fileFTP: getFullFtpUrl(product.fileFTP),
    }));
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
  }
};

// Watch for route changes
watch(
  () => route.params.tennganhhang,
  (newIndustry) => {
    if (newIndustry) {
      // Find matching category, case-insensitive and URL-friendly comparison
      const industry = categories.find(
        (cat) => 
          cat.name.toLowerCase().replace(/\s+/g, "-") === 
          newIndustry.toLowerCase().replace(/\s+/g, "-")
      );
      
      if (industry) {
        selectedIndustry.value = industry.name;
        selectedCategory.value = "";
        selectedBrand.value = "";
        expandedCategories.value = [];
        searchQuery.value = "";
      }
    }
  },
  { immediate: true }
);

// Filter products by selected industry
const productsByIndustry = computed(() => {
  if (!selectedIndustry.value) return [];
  return products.value.filter(
    (product) =>
      product.nganh === selectedIndustry.value &&
      product.showUp === true &&
      product.status === "OK"
  );
});

// Get unique categories for the selected industry
const filteredCategories = computed(() => {
  const categories = new Set();
  productsByIndustry.value.forEach((product) => {
    if (product.danhMucSP) {
      categories.add(product.danhMucSP);
    }
  });
  return Array.from(categories).sort();
});

// Get brands by selected category
const getBrandsByCategory = (category) => {
  const brands = new Set();
  productsByIndustry.value
    .filter((product) => product.danhMucSP === category)
    .forEach((product) => {
      if (product.thuongHieu) {
        brands.add(product.thuongHieu);
      }
    });
  return Array.from(brands).sort();
};

// Products to display based on selections
const displayProducts = computed(() => {
  // If we have search results, display them
  if (searchQuery.value.trim() !== "" && searchResults.value.length > 0) {
    return searchResults.value;
  }

  let filtered = productsByIndustry.value;

  if (selectedCategory.value) {
    filtered = filtered.filter(
      (product) => product.danhMucSP === selectedCategory.value
    );
  }

  if (selectedBrand.value) {
    filtered = filtered.filter(
      (product) => product.thuongHieu === selectedBrand.value
    );
  }

  return filtered;
});

// Actions
const navigateToIndustry = (industry) => {
  // Convert industry name to URL-friendly format
  const urlFriendlyName = industry.toLowerCase().replace(/\s+/g, "-");
  router.push(`/nganhhang/${urlFriendlyName}`);
};

const toggleCategory = (category) => {
  selectedCategory.value = category;
  selectedBrand.value = "";
  searchQuery.value = "";

  // Toggle expand/collapse
  if (expandedCategories.value.includes(category)) {
    expandedCategories.value = expandedCategories.value.filter(
      (c) => c !== category
    );
  } else {
    expandedCategories.value.push(category);
  }
};

const selectBrand = (brand) => {
  selectedBrand.value = brand;
  searchQuery.value = "";
};

// Search functionality
const handleSearch = () => {
  if (searchQuery.value.trim() === "") {
    searchResults.value = [];
    return;
  }

  const query = searchQuery.value.toLowerCase();
  searchResults.value = products.value.filter((product) => {
    // Filter by active status
    if (product.showUp !== true || product.status !== "OK") {
      return false;
    }

    // Search in product name and description
    return (
      product.tenSP.toLowerCase().includes(query) ||
      product.mota.toLowerCase().includes(query)
    );
  });
};

const clearSearch = () => {
  searchQuery.value = "";
  searchResults.value = [];
};

// Lifecycle hooks
onMounted(() => {
  fetchProducts();
  
  // Check if route already has an industry parameter
  const industry = route.params.tennganhhang;
  if (!industry) {
    // Set default industry if no route parameter exists
    navigateToIndustry("FMCG");
  }
  document.title= "VMD - NGÀNH HÀNG";
});
</script>

<style scoped>
.category-products-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px;
}

/* Industry Categories Header */
.industry-categories {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
  gap: 30px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
  width: 120px;
}

.category-item.active {
  background-color: #f0f0f0;
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.category-item img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  margin-bottom: 8px;
}

.category-item span {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

/* Main Content Layout */
.main-content {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

/* ------- Sidebar Tree View ------- */
.sidebar {
  width: 250px;
  flex-shrink: 0;
  border-right: none;
  padding-right: 20px;
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tree-view {
  font-size: 16px;
}

.tree-item {
  margin-bottom: 0;
}

/* Tiêu đề danh mục sản phẩm */
.sidebar h3 {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
  font-size: 18px;
  color: #333;
}

/* Category item styling - giống form 1 */
.category-tree-main {
  position: relative;
  padding: 12px 8px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  background-color: transparent;
  border-radius: 0;
  font-weight: normal;
  display: flex;
  align-items: center;
}

.category-tree-main i {
  margin-right: 8px;
  font-size: 12px;
  transition: transform 0.3s ease;
}

/* Hiệu ứng hover giống form 1 */
.category-tree-main:hover {
  color: #e74c3c;
  background-color: #f9f9f9;
  padding-left: 15px;
}

.category-tree-main.active {
  color: #e74c3c;
  font-weight: bold;
  background-color: rgba(231, 76, 60, 0.05);
  padding-left: 15px;
}

/* Thêm indicator line (đường kẻ đỏ) khi hover và active như form 1 */
.category-tree-main::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background-color: #e74c3c;
  transition: width 0.3s ease-in-out;
}

.category-tree-main:hover::after,
.category-tree-main.active::after {
  width: 100%;
}

/* ------- Brands list styling ------- */
.brands-list {
  margin-left: 15px;
  margin-top: 5px;
}

.brand-tree-item {
  position: relative;
  padding: 12px 8px;
  cursor: pointer;
  border-bottom: 1px solid #f5f5f5;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  border-radius: 0;
}

.brand-tree-item:hover {
  color: #e74c3c;
  background-color: #f9f9f9;
  padding-left: 15px;
}

.brand-tree-item.active {
  color: #e74c3c;
  font-weight: bold;
  background-color: rgba(231, 76, 60, 0.05);
  padding-left: 15px;
}

/* Thêm indicator line (đường kẻ đỏ) cho brands */
.brand-tree-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 0;
  background-color: #e74c3c;
  transition: width 0.3s ease-in-out;
}

.brand-tree-item:hover::after,
.brand-tree-item.active::after {
  width: 100%;
}

/* Products Grid */
.products-grid {
  flex-grow: 1;
}

.products-grid h2 {
  margin-bottom: 15px;
  font-size: 20px;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.products-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.no-products {
  padding: 30px;
  text-align: left;
  background-color: #f9f9f9;
  border-radius: 8px;
  /* margin-top: 20px; */
}

/* Product Card Styling (copied from the provided example) */
.product-card {
  width: 100%;
  max-width: none;
  height: auto;
  padding: 10px;
  margin: 0;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), 
              box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  padding-top: 100%;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.product-image:hover {
  transform: scale(1.05);
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
  font-size: 15px;
  margin-bottom: 6px;
  margin-top: 8px;
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

/* Responsive */
@media (max-width: 992px) {
  .main-content {
    flex-direction: column;
  }
  
  .sidebar {
    flex: none;
    width: 100%;
    margin-bottom: 20px;
    border-bottom: none;
  }
}

/* Search Box */
.search-container {
  max-width: 1200px;
  margin: 0 auto 15px auto;
  padding: 0 15px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.search-box:focus-within {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-color: #007bff;
}

.search-icon {
  padding: 0 15px;
  color: #666;
}

.search-box input {
  flex: 1;
  border: none;
  padding: 12px 15px 12px 0;
  font-size: 14px;
  outline: none;
  width: 100%;
}

.clear-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0 15px;
  color: #999;
  transition: color 0.2s;
}

.clear-button:hover {
  color: #e74c3c;
}

/* Search results info */
.search-results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px 15px;
  background-color: #f9f9f9;
  border-radius: 5px;
  font-size: 14px;
}

.search-results-info p {
  color: #333;
  margin: 0;
}

.clear-search-btn {
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.clear-search-btn:hover {
  background-color: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

@media (min-width: 1200px) {
  .products-container {
    grid-template-columns: repeat(4, 1fr);
  }

  .product-card {
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .industry-categories {
    overflow-x: auto;
    padding-bottom: 10px;
    gap: 15px;
  }

  .category-item {
    min-width: 80px;
    width: 90px;
  }

  .category-item img {
    width: 60px;
    height: 60px;
  }

  .search-box input {
    padding: 10px 10px 10px 0;
  }

  .search-icon {
    padding: 0 10px;
  }

  .search-results-info {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  .products-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .product-card {
    width: 100%;
  }
}
@media (max-width: 480px) {
  .products-container {
    grid-template-columns: 1fr;
  }
}
</style>