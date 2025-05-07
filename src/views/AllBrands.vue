<template>
  <div class="brands-container">
    <h2 class="brands-title">Nhãn Hiệu</h2>

    <div v-if="loading" class="loading">
      <p>Đang tải dữ liệu...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    <div v-else class="brands-grid">
      <div v-for="brand in brands" :key="brand.id" class="brand-item">
        <router-link :to="`/nhanhieu/${brand.val}`">
          <div class="brand-logo-container">
            <img
              :src="getImageUrl(brand.vaL2)"
              :alt="brand.val"
              class="brand-logo"
              @error="handleImageError($event, brand.val)"
            />
          </div>
        </router-link>

        <div class="brand-name">{{ brand.val }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "/src/utils/axios";
import getFullFtpUrl from "/src/utils/pathHelper";

const brands = ref([]);
const loading = ref(true);
const error = ref(null);
const baseImageUrl = ""; // Đặt URL base nếu cần

const fetchBrands = async () => {
  try {
    loading.value = true;
    const response = await axios.get("api/MISC", {
      params: { cat: "THUONGHIEU" },
    });

    brands.value = response.data.filter((brand) => brand.status === "OK");
  } catch (err) {
    error.value = "Không thể tải dữ liệu nhãn hiệu: " + err.message;
    console.error("Error fetching brands:", err);
  } finally {
    loading.value = false;
  }
};

const getImageUrl = (imagePath) => {
  //   return imagePath.startsWith('http') ? imagePath : baseImageUrl + imagePath
  return getFullFtpUrl(imagePath);
};

const handleImageError = (event, brandName) => {
  event.target.src =
    "https://via.placeholder.com/150?text=" + encodeURIComponent(brandName);
};

onMounted(fetchBrands);
</script>

<style scoped>
.brands-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.brands-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.loading,
.error {
  text-align: center;
  padding: 20px;
}

.error {
  color: #e53935;
}

.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.brand-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.brand-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.brand-logo-container {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 10px;
}

.brand-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.brand-name {
  text-align: center;
  font-weight: 500;
  margin-top: 10px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .brands-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .brands-grid {
    grid-template-columns: 1fr;
  }
}
</style>