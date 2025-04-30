<template>
  <div class="product-detail-container" v-if="product">
    <div class="content-wrapper">
      <button class="back-button" @click="$router.back()">
        <i class="fas fa-arrow-left"></i> Quay lại
      </button>

      <div class="product-detail-wrapper">
        <div class="product-gallery">
          <div class="main-image-container">
            <img
              :src="selectedImage || product.fileFTP"
              :alt="product.tenSP"
              class="main-image"
            />
          </div>

          <div class="thumbnail-container">
            <!-- Hiển thị hình ảnh chính đầu tiên -->
            <div
              class="thumbnail"
              :class="{
                active: selectedImage === product.fileFTP || !selectedImage,
              }"
              @click="selectedImage = product.fileFTP"
            >
              <img :src="product.fileFTP" :alt="product.tenSP" />
            </div>

            <!-- Hiển thị các hình ảnh phụ khác -->
            <div
              v-for="image in productImages"
              :key="image.id"
              class="thumbnail"
              :class="{
                active: selectedImage === getFullFtpUrl(image.linkHinhAnh),
              }"
              @click="selectedImage = getFullFtpUrl(image.linkHinhAnh)"
            >
              <img
                :src="getFullFtpUrl(image.linkHinhAnh)"
                :alt="product.tenSP"
              />
            </div>
          </div>
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
              <span class="detail-value">{{
                product.thuongHieu || "Chưa cập nhật"
              }}</span>
            </div>

            <div class="detail-item">
              <span class="detail-label">Mô tả:</span>
              <span class="detail-value">{{ product.mota }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Product description moved below the image section -->
      <div class="product-description">
        <h3 class="description-title">Chi tiết sản phẩm</h3>
        <div
          class="description-content"
          v-html="product.chiTietSP || 'Chưa có chi tiết'"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "/src/utils/axios";
import getFullFtpUrl from "/src/utils/pathHelper";

const product = ref(null);
const productImages = ref([]);
const selectedImage = ref(null);
const route = useRoute();

// Tạo hàm cập nhật meta tags
const updateMetaTags = () => {
  if (!product.value) return;
  
  // Lấy đường dẫn đầy đủ của trang web
  const baseUrl = window.location.origin;
  const currentUrl = window.location.href;
  
  // Lấy thông tin sản phẩm
  const productName = product.value.tenSP || '';
  const productDescription = product.value.mota || 'Chi tiết sản phẩm';
  const productImage = selectedImage.value || product.value.fileFTP || '';
  
  // Cập nhật meta tags
  document.title = productName;
  
  // Xóa các meta OG cũ nếu có
  document.querySelectorAll('meta[property^="og:"]').forEach(el => el.remove());
  document.querySelectorAll('meta[name^="twitter:"]').forEach(el => el.remove());
  
  // Thêm meta tags mới
  const metaTags = [
    { property: 'og:title', content: productName },
    { property: 'og:description', content: productDescription },
    { property: 'og:image', content: productImage },
    { property: 'og:url', content: currentUrl },
    { property: 'og:type', content: 'product' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: productName },
    { name: 'twitter:description', content: productDescription },
    { name: 'twitter:image', content: productImage }
  ];
  
  // Thêm các meta tags vào head
  metaTags.forEach(tag => {
    const meta = document.createElement('meta');
    const key = Object.keys(tag).find(k => k !== 'content');
    meta.setAttribute(key, tag[key]);
    meta.setAttribute('content', tag.content);
    document.head.appendChild(meta);
  });
};

onMounted(async () => {
  // Scroll to top khi component được mount
  window.scrollTo(0, 0);
  
  const id = route.params.id;
  try {
    // Fetch product details
    const productRes = await axios.get(`/api/sanpham/${id}`);
    
    // Kiểm tra và xử lý cấu trúc dữ liệu trả về từ API
    if (productRes.data) {
      let productData;
      
      // Kiểm tra xem dữ liệu trả về có cấu trúc { status: "OK", sanPham: {...} } hay không
      if (productRes.data.status === "OK" && productRes.data.sanPham) {
        productData = productRes.data.sanPham;
      } else {
        // Nếu không, giả sử dữ liệu trả về trực tiếp là sản phẩm
        productData = productRes.data;
      }
      
      // Đảm bảo đường dẫn hình ảnh đầy đủ
      if (productData.fileFTP && !productData.fileFTP.startsWith('http')) {
        productData.fileFTP = getFullFtpUrl(productData.fileFTP);
      }
      
      product.value = productData;

      // Mặc định, hiển thị hình ảnh chính
      selectedImage.value = product.value.fileFTP;

      // Fetch product images
      const imagesRes = await axios.get(`/api/HinhAnhSanPham/sanpham/${id}`);
      if (imagesRes.data && Array.isArray(imagesRes.data)) {
        productImages.value = imagesRes.data;
      }
      
      // Cập nhật meta tags sau khi có dữ liệu sản phẩm
      updateMetaTags();
      
      // Đảm bảo scroll lên đầu sau khi dữ liệu đã được tải xong
      nextTick(() => {
        window.scrollTo(0, 0);
      });
    }
  } catch (err) {
    console.error("Lỗi khi tải dữ liệu sản phẩm:", err);
  }
});

// Theo dõi thay đổi của selectedImage để cập nhật lại meta tag image
watch(selectedImage, () => {
  updateMetaTags();
});
</script>

<style scoped>
.product-detail-container {
  min-height: 100vh;
  padding: 20px;
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
  margin-bottom: 20px;
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
  gap: 30px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  padding: 20px;
  margin-bottom: 20px;
}

.product-gallery {
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.main-image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.main-image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.thumbnail-container {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 0;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
  scrollbar-width: thin;
  scrollbar-color: #ddd #f5f5f5;
}

.thumbnail-container::-webkit-scrollbar {
  height: 6px;
}

.thumbnail-container::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 10px;
}

.thumbnail-container::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 10px;
}

.thumbnail {
  min-width: 70px;
  width: 70px;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.thumbnail.active {
  border-color: #3498db;
}

.thumbnail:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.product-title {
  font-size: 26px;
  font-weight: 700;
  color: #333;
  margin: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
  line-height: 1.3;
  word-break: break-word;
}

.product-price {
  display: flex;
  align-items: baseline;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.price-label {
  font-size: 16px;
  color: #666;
  margin-right: 10px;
}

.price-value {
  color: #e74c3c;
  font-size: 22px;
  font-weight: 600;
}

.product-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item {
  display: flex;
  line-height: 1.6;
}

.detail-label {
  font-weight: 600;
  color: #555;
  width: 110px;
  flex-shrink: 0;
}

.detail-value {
  color: #666;
  word-break: break-word;
}

.product-description {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  padding: 20px;
  width: 100%;
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
  word-break: break-word;
  overflow-wrap: break-word;
}

/* Make product description images responsive */
.description-content img {
  max-width: 100%;
  height: auto;
}

/* Make embedded tables responsive */
.description-content table {
  max-width: 100%;
  overflow-x: auto;
  display: block;
}

@media (max-width: 1200px) {
  .product-detail-wrapper {
    flex-direction: column;
  }
  
  .product-gallery {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .product-detail-container {
    padding: 15px;
  }
  
  .product-detail-wrapper {
    padding: 15px;
    gap: 20px;
  }

  .product-title {
    font-size: 22px;
    padding-bottom: 10px;
  }
  
  .price-value {
    font-size: 20px;
  }

  .detail-item {
    flex-direction: column;
  }

  .detail-label {
    width: auto;
    margin-bottom: 2px;
  }
  
  .product-description {
    padding: 15px;
  }
  
  .description-title {
    font-size: 16px;
    margin-bottom: 10px;
  }
  
  .main-image {
    max-height: 300px;
  }
  
  .thumbnail {
    width: 60px;
    height: 60px;
    min-width: 60px;
  }
}

@media (max-width: 480px) {
  .product-detail-container {
    padding: 10px;
  }
  
  .product-detail-wrapper {
    padding: 12px;
    margin-bottom: 15px;
  }
  
  .main-image {
    max-height: 250px;
  }
  
  .product-title {
    font-size: 20px;
  }
  
  .thumbnail {
    width: 50px;
    height: 50px;
    min-width: 50px;
  }
  
  .back-button {
    margin-bottom: 15px;
  }
}
</style>