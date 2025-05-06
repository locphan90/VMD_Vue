<template>
  <div class="recipe-grid-container">
    <h1 class="grid-title">Danh sách công thức</h1>

    <!-- Tìm kiếm -->
    <div class="search-container">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="Tìm kiếm công thức..."
          class="search-input"
        />
      </div>
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>

    <!-- Hiển thị lưới công thức -->
    <div v-else>
      <div v-if="paginatedRecipes.length === 0" class="no-data">
        <p>Không tìm thấy công thức nào</p>
      </div>

      <div v-else class="recipe-grid">
        <div
          v-for="recipe in paginatedRecipes"
          :key="recipe.id"
          class="recipe-card"
        >
          <router-link :to="`/congthuc/${recipe.slug}`">
            <div class="recipe-image-container">
              <img
                :src="getImageUrl(recipe.fileFTP)"
                :alt="recipe.tenCongThuc"
                class="recipe-image"
                @error="handleImageError($event)"
              />
            </div>
          </router-link>

          <div class="recipe-info">
            <h3 class="recipe-title">{{ recipe.tenCongThuc }}</h3>
            <p class="recipe-date">{{ formatDate(recipe.fstUpdate) }}</p>
          </div>
        </div>
      </div>

      <!-- Phân trang -->
      <div class="pagination-container" v-if="totalPages > 1">
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="changePage(1)"
          title="Trang đầu"
        >
          «
        </button>
        <button
          class="pagination-btn"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          title="Trang trước"
        >
          ‹
        </button>

        <!-- Hiển thị số trang -->
        <div class="page-numbers">
          <button
            v-for="page in displayedPages"
            :key="page"
            @click="changePage(page)"
            class="page-number"
            :class="{ active: currentPage === page }"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          title="Trang sau"
        >
          ›
        </button>
        <button
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="changePage(totalPages)"
          title="Trang cuối"
        >
          »
        </button>

        <div class="pagination-size">
          <span>Hiển thị</span>
          <select
            v-model="pageSize"
            @change="handlePageSizeChange"
            class="page-size-select"
          >
            <option value="8">8</option>
            <option value="12">12</option>
            <option value="16">16</option>
            <option value="24">24</option>
          </select>
          <span>mục mỗi trang</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

export default {
  name: "CongThucGrid",
  data() {
    return {
      recipes: [],
      filteredRecipes: [],
      loading: true,

      // Phân trang
      currentPage: 1,
      pageSize: 12,

      // Tìm kiếm
      searchQuery: "",

      // Placeholder cho ảnh lỗi
      placeholderImage: "/images/recipe-placeholder.jpg",
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredRecipes.length / this.pageSize);
    },
    paginatedRecipes() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.filteredRecipes.slice(startIndex, endIndex);
    },
    displayedPages() {
      // Hiển thị tối đa 5 số trang cùng lúc
      const totalPages = this.totalPages;
      const currentPage = this.currentPage;

      if (totalPages <= 5) {
        // Nếu tổng số trang <= 5, hiển thị tất cả
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }

      // Luôn hiển thị 5 trang với trang hiện tại ở giữa khi có thể
      if (currentPage <= 3) {
        return [1, 2, 3, 4, 5];
      } else if (currentPage >= totalPages - 2) {
        return [
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        ];
      } else {
        return [
          currentPage - 2,
          currentPage - 1,
          currentPage,
          currentPage + 1,
          currentPage + 2,
        ];
      }
    },
  },
  mounted() {
    this.fetchRecipes();
  },
  methods: {
    async fetchRecipes() {
      this.loading = true;
      try {
        const response = await axios.get("api/CongThuc");
        this.recipes = response.data;
        this.filteredRecipes = [...this.recipes];
      } catch (error) {
        console.error("Lỗi khi lấy danh sách công thức:", error);
        // Có thể hiển thị thông báo lỗi cho người dùng ở đây
      } finally {
        this.loading = false;
      }
    },
    getImageUrl(fileFTP) {
      // Sử dụng hàm getFullFtpUrl từ utils để lấy đường dẫn đầy đủ
      return fileFTP ? getFullFtpUrl(fileFTP) : this.placeholderImage;
    },
    handleImageError(event) {
      // Khi ảnh lỗi, thay thế bằng ảnh placeholder
      event.target.src = this.placeholderImage;
    },
    formatDate(dateString) {
      // Định dạng ngày tháng
      if (!dateString) return "";

      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },
    changePage(page) {
      if (page < 1) {
        this.currentPage = 1;
      } else if (page > this.totalPages) {
        this.currentPage = this.totalPages;
      } else {
        this.currentPage = page;
      }
      // Cuộn lên đầu trang khi chuyển trang
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    handlePageSizeChange() {
      // Khi thay đổi số lượng hiển thị mỗi trang, quay lại trang 1
      this.currentPage = 1;
    },
    handleSearch() {
      this.currentPage = 1; // Reset về trang 1 khi tìm kiếm

      if (!this.searchQuery.trim()) {
        this.filteredRecipes = [...this.recipes];
        return;
      }

      const query = this.searchQuery.toLowerCase().trim();
      this.filteredRecipes = this.recipes.filter((recipe) =>
        recipe.tenCongThuc.toLowerCase().includes(query)
      );
    },
  },
};
</script>

<style scoped>
.recipe-grid-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.grid-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #333;
  text-align: center;
}

/* Search box */
.search-container {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

.search-box {
  width: 100%;
  max-width: 500px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 30px;
  font-size: 16px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>');
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 18px;
  padding-right: 45px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

/* Grid layout */
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.recipe-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
}

.recipe-image-container {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

.recipe-info {
  padding: 16px;
}

.recipe-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  height: 42px;
}

.recipe-date {
  font-size: 12px;
  color: #888;
  margin: 0;
}

/* Phân trang */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-btn {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  color: #4a90e2;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #e9ecef;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-number {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: all 0.2s ease;
}

.page-number:hover {
  background-color: #e9ecef;
}

.page-number.active {
  background-color: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.pagination-size {
  margin-left: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #6c757d;
}

.page-size-select {
  padding: 5px 8px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  background-color: #fff;
  font-size: 14px;
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4a90e2;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Empty state */
.no-data {
  text-align: center;
  padding: 60px 0;
  color: #666;
}

/* Responsive design */
@media (max-width: 768px) {
  .recipe-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }

  .recipe-image-container {
    height: 150px;
  }

  .pagination-size {
    margin-left: 0;
    margin-top: 10px;
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 576px) {
  .recipe-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
  }

  .recipe-image-container {
    height: 120px;
  }

  .recipe-info {
    padding: 12px;
  }

  .recipe-title {
    font-size: 14px;
    height: 38px;
  }

  .page-numbers {
    display: none;
  }

  .pagination-container {
    margin-top: 20px;
  }
}
</style>