<template>
  <div class="all-products">
    <div class="search-bar">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Tìm kiếm sản phẩm..."
      />
    </div>
    <div class="filter-bar">
      <select v-model="filterCat">
        <option value="">Tất cả</option>
        <option value="MOI">Mới</option>
        <option value="NOIBAT">Nổi bật</option>
      </select>

      <select v-model="filterNganh">
        <option value="">Tất cả Ngành</option>
        <option value="FMCG">FMCG</option>
        <option value="Mẹ & Bé">Mẹ & Bé</option>
        <option value="HealthCare">HealthCare</option>
        <option value="Industry">Industry</option>
      </select>

      <select v-model="filterThuongHieu">
        <option value="">Tất cả thương hiệu</option>
        <option v-for="brand in uniqueThuongHieu" :key="brand" :value="brand">
          {{ brand }}
        </option>
      </select>

      <select v-model="filterPrice">
        <option value="">Tất cả giá</option>
        <option value="1">Dưới 5 triệu</option>
        <option value="2">Từ 5–10 triệu</option>
        <option value="3">Trên 10 triệu</option>
      </select>
    </div>
    <div class="product-grid">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="product-card"
      >
        <!-- Nút X -->
        <button
          v-if="isAdmin"
          class="delete-btn"
          @click.stop="markProductDeleted(product.id)"
          title="Xóa sản phẩm"
        >
          ❌
        </button>

        <!-- Hiển thị trang chủ -->
        <div v-if="isAdmin" class="checkbox-showup">
          <label>
            <input
              type="checkbox"
              :checked="product.showUp"
              @change.stop="toggleShowUp(product.id, $event.target.checked)"
            />
            Hiển thị lên trang chủ
          </label>
        </div>

        <!-- Nội dung sản phẩm -->
        <div class="product-clickable">
          <!-- Bọc chỉ phần hình ảnh -->
          <router-link :to="`/sanpham/${product.id}`" class="product-item-link">
            <div class="product-image">
              <img :src="product.fileFTP" :alt="product.tenSP" />
            </div>
          </router-link>

          <h3>{{ product.tenSP }}</h3>
          <div class="product-info">
            <span>{{ product.mota }}</span>
            <span class="product-price">
              {{ product.giaThamKhao.toLocaleString() }}
              <span class="currency">đ</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">◀</button>
      <span>Trang {{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        ▶
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

const products = ref([]);
const isAdmin = ref(false);
const filterType = ref("");
const currentPage = ref(1);
const perPage = 12;
const filterCat = ref("");
const filterNganh = ref("");
const filterPrice = ref("");
const filterThuongHieu = ref("");
const searchQuery = ref("");

const uniqueThuongHieu = computed(() => {
  const brands = products.value.map((p) => p.thuongHieu).filter(Boolean);
  return [...new Set(brands)];
});

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchCat = filterCat.value ? p.cat === filterCat.value : true;
    const matchNganh = filterNganh.value ? p.nganh === filterNganh.value : true;
    const matchThuongHieu = filterThuongHieu.value
      ? p.thuongHieu === filterThuongHieu.value
      : true;
    let matchGia = true;
    if (filterPrice.value === "1") matchGia = p.giaThamKhao < 5000000;
    else if (filterPrice.value === "2")
      matchGia = p.giaThamKhao >= 5000000 && p.giaThamKhao <= 10000000;
    else if (filterPrice.value === "3") matchGia = p.giaThamKhao > 10000000;

    const matchSearch = searchQuery.value
      ? p.tenSP.toLowerCase().includes(searchQuery.value.toLowerCase())
      : true;

    return matchCat && matchNganh && matchGia && matchThuongHieu && matchSearch;
  });
});

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return filteredProducts.value.slice(start, start + perPage);
});

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / perPage);
});

const fetchProducts = async () => {
  try {
    const res = await axios.get("/api/sanpham");
    products.value = res.data
      .filter((p) => p.status !== "XX")
      .map((product) => {
        product.fileFTP = getFullFtpUrl(product.fileFTP);
        return product;
      });
  } catch (err) {
    console.error("Lỗi khi tải sản phẩm:", err);
  }
};

const toggleShowUp = async (id, checked) => {
  try {
    await axios.put(`/api/sanpham/${id}`, {
      showUp: checked,
    });
    const product = products.value.find((p) => p.id === id);
    if (product) product.showUp = checked;
  } catch (err) {
    console.error("Lỗi cập nhật showUp:", err);
  }
};

const markProductDeleted = async (id) => {
  if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
  try {
    await axios.put(`/api/sanpham/${id}`, { status: "XX" });
    fetchProducts();
  } catch (err) {
    console.error("Lỗi khi xóa sản phẩm:", err);
  }
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

watch(
  [filterType, filterCat, filterNganh, filterPrice, filterThuongHieu],
  () => {
    currentPage.value = 1;
  }
);

onMounted(() => {
  fetchProducts();
  const adminFlag = localStorage.getItem("isAdmin");
  isAdmin.value = adminFlag === "true";
});
</script>

<style scoped>
.all-products {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  text-align: center;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  justify-content: center;
}

.filter-bar select {
  min-width: 150px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
}

.filter-bar button {
  margin: 0 5px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.filter-bar button.active,
.filter-bar button:hover {
  background: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.product-card {
  flex: 0 0 calc(25% - 20px);
  text-decoration: none;
  color: inherit;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  background: #fff;
  transition: transform 0.3s, box-shadow 0.3s;
  display: block;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 100%;
  padding-top: 100%;
  position: relative;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-top: 10px;
}

.product-price {
  font-weight: bold;
  color: #e74c3c;
}

.currency {
  font-size: 0.7em;
  vertical-align: super;
}

.pagination {
  margin-top: 30px;
}

.pagination button {
  padding: 5px 10px;
  margin: 0 10px;
  border: none;
  background: #e74c3c;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
  justify-content: center;
}

.filter-bar select {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
  height: 34px;
  min-width: 150px;
  cursor: pointer;
  transition: border-color 0.3s;
}

.filter-bar select:focus {
  border-color: #007bff;
  outline: none;
}

.delete-btn {
  position: absolute;
  top: 6px;
  right: 6px; /* ✅ Chuyển sang phải */
  background: rgba(255, 0, 0, 0.1);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  color: red;
  z-index: 2;
}

.checkbox-showup {
  margin-top: 8px;
  font-size: 12px;
  text-align: left;
  color: #007bff;
}

.search-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.search-bar input {
  width: calc(4 * 150px + 3 * 16px); /* 4 ô filter + 3 khoảng cách */
  max-width: 100%;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  transition: border-color 0.3s;
}

.search-bar input:focus {
  outline: none;
  border-color: #007bff;
}

/* Responsive */
@media (max-width: 992px) {
  .product-card {
    flex: 0 0 calc(33.333% - 20px);
  }
}

@media (max-width: 768px) {
  .product-card {
    flex: 0 0 calc(50% - 20px);
  }
  .search-bar input {
    width: 100%;
  }
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-bar select {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .product-card {
    flex: 0 0 100%;
  }
}
</style>
