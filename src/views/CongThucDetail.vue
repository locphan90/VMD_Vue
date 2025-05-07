<template>
  <div class="cong-thuc-container">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";

const route = useRoute();

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
  } catch (err) {
    error.value = err.response?.data?.message || err.message || "Đã xảy ra lỗi";
    console.error("Lỗi khi tải công thức:", err);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (filePath) => {
  if (filePath && filePath.startsWith("/httpdocs/")) {
    return getFullFtpUrl(filePath) ;
  }
  return filePath;
};

onMounted(() => {
  fetchCongThuc();
});
</script>


<style scoped>
.cong-thuc-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
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
</style>