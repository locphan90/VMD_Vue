<template>
  <div class="all-products">
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

        <!-- Nội dung sản phẩm, click mới điều hướng -->
        <div class="product-clickable" @click="goToDetail(product.tenSP)">
          <div class="product-image">
            <img :src="product.fileFTP" :alt="product.tenSP" />
          </div>
          <h3>{{ product.tenSP }}</h3>
          <div class="product-info">
            <span>{{ product.mota }}</span>
            <span class="product-price"
              >{{ product.giaThamKhao.toLocaleString()
              }}<span class="currency">đ</span></span
            >
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

<script>
import axios from "axios";

export default {
  name: "AllProducts",
  data() {
    return {
      products: [],
      isAdmin: true,
      filterType: "",
      currentPage: 1,
      perPage: 12,
      filterCat: "",
      filterNganh: "",
      filterPrice: "",
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter((p) => {
        const matchCat = this.filterCat ? p.cat === this.filterCat : true;
        const matchNganh = this.filterNganh
          ? p.nganh === this.filterNganh
          : true;

        let matchGia = true;
        if (this.filterPrice === "1") matchGia = p.giaThamKhao < 5000000;
        else if (this.filterPrice === "2")
          matchGia = p.giaThamKhao >= 5000000 && p.giaThamKhao <= 10000000;
        else if (this.filterPrice === "3") matchGia = p.giaThamKhao > 10000000;

        return matchCat && matchNganh && matchGia;
      });
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredProducts.slice(start, start + this.perPage);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.perPage);
    },
  },
  methods: {
    goToDetail(name) {
      this.$router.push({ name: "ProductDetail", params: { name } });
    },
    async fetchProducts() {
      try {
        const res = await axios.get("https://localhost:7210/api/sanpham");
        this.products = res.data.filter((p) => p.status !== "XX"); // Ẩn sản phẩm đã xóa
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
      }
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    async toggleShowUp(id, checked) {
      const showUpValue = checked ? true : false;
      try {
        await axios.put(`https://localhost:7210/api/sanpham/${id}`, {
          showUp: showUpValue,
        });
        const product = this.products.find((p) => p.id === id);
        if (product) product.showUp = showUpValue;
      } catch (err) {
        console.error("Lỗi cập nhật showUp:", err);
      }
    },

    async markProductDeleted(id) {
      if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
      try {
        await axios.put(`https://localhost:7210/api/sanpham/${id}`, {
          status: "XX",
        });
        this.fetchProducts(); // Load lại dữ liệu sau khi xóa
      } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
      }
    },
  },
  watch: {
    filterType() {
      this.currentPage = 1;
    },
    filterCat() {
      this.currentPage = 1;
    },
    filterNganh() {
      this.currentPage = 1;
    },
    filterPrice() {
      this.currentPage = 1;
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.all-products {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  text-align: center;
}

.filter-bar {
  margin-bottom: 20px;
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
}

@media (max-width: 480px) {
  .product-card {
    flex: 0 0 100%;
  }
}
</style>
