<template>
  <div class="cong-thuc-container">
    <!-- Nút quay lại -->
    <div class="back-button-container">
      <button class="back-button" @click="goBack">
        <span class="back-icon">&#8592;</span> Quay lại
      </button>
    </div>

    <!-- Phần hiển thị hình ảnh và tên công thức -->
    <div class="header-section">
      <div class="image-container">
        <img
          v-if="congThuc.fileFTP"
          :src="getImageUrl(congThuc.fileFTP)"
          :alt="congThuc.tenCongThuc"
          class="recipe-image"
        />
        <div v-else class="image-placeholder">Không có hình ảnh</div>
      </div>
      <h1 class="recipe-title">{{ congThuc.tenCongThuc }}</h1>
    </div>

    <!-- Phần tab nguyên liệu và cách làm -->
    <div class="tabs-container">
      <div class="tabs-header">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'nguyen-lieu' }"
          @click="activeTab = 'nguyen-lieu'"
        >
          Nguyên liệu
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'cach-lam' }"
          @click="activeTab = 'cach-lam'"
        >
          Cách làm
        </button>
      </div>

      <div class="tab-content">
        <div v-if="activeTab === 'nguyen-lieu'" class="tab-pane">
          <div v-html="congThuc.nguyenLieu"></div>
        </div>
        <div v-if="activeTab === 'cach-lam'" class="tab-pane">
          <div v-html="congThuc.cachLam"></div>
        </div>
      </div>
    </div>

    <!-- Phần công thức liên quan -->
    <div class="related-recipes-section">
      <h2 class="related-title">Công thức khác bạn có thể thích</h2>
      <div class="related-recipes-container">
        <div v-if="loading" class="loading">Đang tải...</div>
        <div v-else-if="relatedRecipes.length === 0" class="no-recipes">
          Không có công thức liên quan
        </div>
        <div v-else class="related-recipes-grid">
          <router-link 
            v-for="recipe in relatedRecipes" 
            :key="recipe.id" 
            :to="`/congthuc/${recipe.slug || recipe.id}`"
            class="related-recipe-card"
          >
            <div class="related-image-container">
              <img
                v-if="recipe.fileFTP"
                :src="getImageUrl(recipe.fileFTP)"
                :alt="recipe.tenCongThuc"
                class="related-recipe-image"
              />
              <div v-else class="related-image-placeholder">Không có hình</div>
            </div>
            <h3 class="related-recipe-title">{{ recipe.tenCongThuc }}</h3>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

const route = useRoute();
const router = useRouter();

const congThuc = ref({
  id: 0,
  tenCongThuc: "",
  nguyenLieu: "",
  cachLam: "",
  fileFTP: "",
  status: "",
  fstUser: 0,
  fstUpdate: "",
});

const activeTab = ref("nguyen-lieu");
const loading = ref(true);
const error = ref(null);
const relatedRecipes = ref([]);

const fetchCongThuc = async () => {
  const slug = route.params.tencongthuc;

  if (!slug) {
    error.value = "Không tìm thấy slug công thức";
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const response = await axios.get(`api/CongThuc/${slug}`);
    congThuc.value = response.data;
    // Sau khi lấy công thức chính, gọi API lấy công thức liên quan
    fetchRelatedRecipes();
    // Cập nhật tiêu đề trang
    document.title = "CÔNG THỨC - " + slug;
  } catch (err) {
    error.value = err.response?.data?.message || err.message || "Đã xảy ra lỗi";
    console.error("Lỗi khi tải công thức:", err);
    loading.value = false;
  }
};

const fetchRelatedRecipes = async () => {
  try {
    // Gọi API lấy tất cả công thức
    const response = await axios.get('api/congthuc');
    
    // Lọc ra các công thức khác với công thức hiện tại
    const filteredRecipes = response.data.filter(recipe => recipe.id !== congThuc.value.id);
    
    // Nếu có ít hơn hoặc bằng 5 công thức, lấy tất cả
    if (filteredRecipes.length <= 5) {
      relatedRecipes.value = filteredRecipes;
    } else {
      // Nếu có nhiều hơn 5 công thức, lấy ngẫu nhiên 5 công thức
      relatedRecipes.value = getRandomRecipes(filteredRecipes, 5);
    }
  } catch (err) {
    console.error("Lỗi khi tải công thức liên quan:", err);
  } finally {
    loading.value = false;
  }
};

// Hàm lấy ngẫu nhiên n phần tử từ mảng
const getRandomRecipes = (array, n) => {
  // Tạo bản sao của mảng để không làm thay đổi mảng gốc
  const shuffled = [...array];
  
  // Thuật toán Fisher-Yates để xáo trộn mảng
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  // Trả về n phần tử đầu tiên của mảng đã xáo trộn
  return shuffled.slice(0, n);
};

const getImageUrl = (filePath) => {
  if (filePath && filePath.startsWith("/httpdocs/")) {
    return getFullFtpUrl(filePath);
  }
  return filePath;
};

const goBack = () => {
  router.back();
};

// Theo dõi thay đổi của route.params.tencongthuc
const newSlug = ref(route.params.tencongthuc);

watch(
  () => route.params.tencongthuc,
  (newSlugValue, oldSlugValue) => {
    newSlug.value = newSlugValue;
    if (newSlugValue !== oldSlugValue) {
      // Nếu slug thay đổi, tải lại dữ liệu
      fetchCongThuc();
      // Reset tab về mặc định
      activeTab.value = "nguyen-lieu";
      // Cuộn lên đầu trang
      window.scrollTo(0, 0);
    }
  },
  { immediate: false }
);

onMounted(() => {
  fetchCongThuc();
});
</script>


<style scoped>
.cong-thuc-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.back-button-container {
  margin-bottom: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: #f5f5f5;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.back-button:hover {
  background-color: #e0e0e0;
}

.back-icon {
  margin-right: 8px;
  font-size: 16px;
}

.header-section {
  margin-bottom: 30px;
  text-align: center;
}

.image-container {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;       /* Cắt hình sao cho vừa khung, không méo */
  object-position: center; /* Canh giữa hình */
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #999;
  font-size: 18px;
}

.recipe-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin: 20px 0;
}

.tabs-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 40px;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #e5e5e5;
}

.tab-button {
  flex: 1;
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.tab-button:hover {
  background-color: #f9f9f9;
}

.tab-button.active {
  color: #3498db;
  border-bottom: 3px solid #3498db;
}

.tab-content {
  padding: 20px;
}

.tab-pane {
  line-height: 1.6;
}

/* Styling cho nội dung HTML từ API */
.tab-pane :deep(p) {
  margin-bottom: 15px;
}

.tab-pane :deep(ul),
.tab-pane :deep(ol) {
  padding-left: 20px;
  margin-bottom: 15px;
}

.tab-pane :deep(li) {
  margin-bottom: 5px;
}

/* Phần style cho công thức liên quan */
.related-recipes-section {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e5e5e5;
}

.related-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.related-recipes-container {
  width: 100%;
}

.loading, .no-recipes {
  text-align: center;
  padding: 20px;
  color: #666;
}

.related-recipes-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.related-recipe-card {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.related-recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.related-image-container {
  width: 100%;
  height: 150px;
  overflow: hidden;
}

.related-recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.related-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  color: #999;
  font-size: 14px;
}

.related-recipe-title {
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  text-align: center;
  /* Giới hạn tiêu đề 2 dòng */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 50px;
}

/* Responsive cho màn hình nhỏ hơn */
@media (max-width: 1200px) {
  .related-recipes-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 992px) {
  .related-recipes-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .related-recipes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .related-recipes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
