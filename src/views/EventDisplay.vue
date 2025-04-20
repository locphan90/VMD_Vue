<template>
  <div class="product-detail-container" v-if="product">
    <button class="back-button" @click="$router.back()">← Quay lại</button>
    <div class="product-detail-wrapper">
      <div class="product-image">
        <img :src="product.fileFTP" :alt="product.tenSP" />
      </div>
      <div class="product-info">
        <h1 class="product-title">{{ product.tenSP }}</h1>
        <p class="product-price">
          Giá tham khảo:
          <span v-if="product.giaThamKhao">
            {{ product.giaThamKhao.toLocaleString() }}<sup>đ</sup>
          </span>
          <span v-else>Chưa cập nhật</span>
        </p>
        <p class="product-meta">Loại: {{ product.loai }}</p>
        <p class="product-meta">Thương hiệu: {{ product.thuongHieu || 'Chưa cập nhật' }}</p>
        <p class="product-meta">Mô tả: {{ product.mota }}</p>
        <div class="product-description">
          <strong>Chi tiết sản phẩm:</strong>
          <p>{{ product.chiTietSP || 'Chưa có chi tiết' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  name: "ProductDetail",
  data() {
    return {
      product: null,
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    try {
      const res = await axios.get(`/api/sanpham/${id}`);
      if (res.data && res.data.status === "OK") {
        this.product = res.data;
      }
    } catch (err) {
      console.error("Lỗi khi tải chi tiết sản phẩm:", err);
    }
  },
};
</script>

<style scoped>
.product-detail-container {
  padding: 20px;
}

.back-button {
  margin-bottom: 20px;
  background-color: transparent;
  border: none;
  font-size: 16px;
  color: #007bff;
  cursor: pointer;
}

.product-detail-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.product-image img {
  width: 400px;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex: 1;
  min-width: 280px;
}

.product-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.product-price {
  color: red;
  font-size: 18px;
  margin-bottom: 10px;
  opacity: 0.8;
}

.product-meta {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.product-description {
  margin-top: 16px;
  font-size: 14px;
  color: #444;
}
</style>
