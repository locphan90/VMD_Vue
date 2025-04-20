<template>
  <div class="product-detail-container" v-if="product">
    <div class="content-wrapper">
      <button class="back-button" @click="$router.back()">
        <i class="fas fa-arrow-left"></i> Quay lại
      </button>
      
      <div class="product-detail-wrapper">
        <div class="product-image-container">
          <img :src="product.fileFTP" :alt="product.tenSP" class="product-image" />
        </div>
        
        <div class="product-info">
          <h1 class="product-title">{{ product.tenSP }}</h1>
          
          <div class="product-price">
            <span class="price-label">Giá tham khảo:</span>
            <span class="price-value" v-if="product.giaThamKhao">
              {{ product.giaThamKhao.toLocaleString() }}<sup>đ</sup>
            </span>
            <span class="price-value" v-else>Chưa cập nhật</span>
          </div>
          
          <div class="product-details">
            <div class="detail-item">
              <span class="detail-label">Loại:</span>
              <span class="detail-value">{{ product.loai }}</span>
            </div>
            
            <div class="detail-item">
              <span class="detail-label">Thương hiệu:</span>
              <span class="detail-value">{{ product.thuongHieu || 'Chưa cập nhật' }}</span>
            </div>
            
            <div class="detail-item">
              <span class="detail-label">Mô tả:</span>
              <span class="detail-value">{{ product.mota }}</span>
            </div>
          </div>
          
          <div class="product-description">
            <h3 class="description-title">Chi tiết sản phẩm</h3>
            <p class="description-content">{{ product.chiTietSP || 'Chưa có chi tiết' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from "@/utils/axios";
import getFullFtpUrl from '@/utils/pathHelper';

const product = ref(null);
const route = useRoute();

onMounted(async () => {
  const id = route.params.id;
  try {
    const res = await axios.get(`/api/sanpham/${id}`);
    if (res.data && res.data.status === "OK") {
      res.data.fileFTP = getFullFtpUrl(res.data.fileFTP);
      product.value = res.data;
    }
  } catch (err) {
    console.error("Lỗi khi tải chi tiết sản phẩm:", err);
  }
});
</script>


<style scoped>
.product-detail-container {
  min-height: 100vh;
  padding: 40px 20px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.back-button {
  display: inline-flex;
  align-items: center;
  margin-bottom: 30px;
  background-color: transparent;
  border: none;
  font-size: 16px;
  color: #3498db;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 10px 0;
}

.back-button:hover {
  color: #2980b9;
}

.back-button i {
  margin-right: 8px;
}

.product-detail-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  padding: 30px;
}

.product-image-container {
  flex: 1;
  min-width: 320px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.product-image {
  width: 100%;
  max-width: 500px;
  height: auto;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.product-info {
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin: 0;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.product-price {
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
}

.price-label {
  font-size: 16px;
  color: #666;
  margin-right: 10px;
}

.price-value {
  color: #e74c3c;
  font-size: 24px;
  font-weight: 600;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  line-height: 1.6;
}

.detail-label {
  font-weight: 600;
  color: #555;
  width: 120px;
  flex-shrink: 0;
}

.detail-value {
  color: #666;
}

.product-description {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.description-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.description-content {
  line-height: 1.7;
  color: #555;
}

@media (max-width: 768px) {
  .product-detail-wrapper {
    flex-direction: column;
    padding: 20px;
  }
  
  .product-title {
    font-size: 24px;
  }
  
  .detail-item {
    flex-direction: column;
  }
  
  .detail-label {
    width: auto;
    margin-bottom: 4px;
  }
}
</style>