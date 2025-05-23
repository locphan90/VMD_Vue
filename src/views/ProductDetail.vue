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

          <div class="thumbnail-container" v-if="hasImages">
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
              <span class="detail-label">Tình trạng:</span>
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
            <div class="detail-item">
              <span class="detail-label">Danh mục SP:</span>
              <span class="detail-value">{{ product.danhMucSP }}</span>
            </div>
          </div>

          <!-- Phần chia sẻ mạng xã hội -->
          <div class="social-share">
            <p class="share-label">Chia sẻ sản phẩm:</p>
            <div class="social-buttons">
              <a
                :href="getFacebookShareUrl()"
                target="_blank"
                class="social-button facebook"
                aria-label="Chia sẻ qua Facebook"
              >
                <i class="fab fa-facebook-f"></i>
              </a>
              <a
                :href="getZaloShareUrl()"
                target="_blank"
                class="social-button zalo"
                aria-label="Chia sẻ qua Zalo"
              >
                <span class="zalo-icon">Z</span>
              </a>
              <a
                :href="getMessengerShareUrl()"
                target="_blank"
                class="social-button messenger"
                aria-label="Chia sẻ qua Messenger"
              >
                <i class="fab fa-facebook-messenger"></i>
              </a>
              <a
                :href="getViberShareUrl()"
                target="_blank"
                class="social-button viber"
                aria-label="Chia sẻ qua Viber"
              >
                <i class="fab fa-viber"></i>
              </a>
              <button
                @click="copyProductLink()"
                class="social-button copy-link"
                aria-label="Sao chép đường dẫn"
              >
                <i class="fas fa-link"></i>
              </button>
            </div>
            <span v-if="linkCopied" class="copy-notification"
              >Đã sao chép đường dẫn!</span
            >
          </div>
        </div>
      </div>

      <!-- Tabs for Product Description and Usage Guide -->
      <div class="product-tabs">
        <div class="tabs-header">
          <button
            class="tab-button"
            :class="{ active: activeTab === 'description' }"
            @click="activeTab = 'description'"
          >
            Chi tiết sản phẩm
          </button>
          <button
            class="tab-button"
            :class="{ active: activeTab === 'guide' }"
            @click="activeTab = 'guide'"
          >
            Hướng dẫn sử dụng
          </button>
        </div>

        <div class="tabs-content">
          <!-- Product Description Tab -->
          <div v-if="activeTab === 'description'" class="tab-pane">
            <div
              class="description-content tinymce-content"
              v-html="product.chiTietSP || 'Chưa có chi tiết'"
            ></div>
          </div>

          <!-- Usage Guide Tab -->
          <div v-if="activeTab === 'guide'" class="tab-pane">
            <div
              class="guide-content tinymce-content"
              v-html="product.huongDanSD || 'Chưa có hướng dẫn sử dụng'"
            ></div>
          </div>
        </div>
      </div>
      
      <!-- Đặt component sản phẩm liên quan ở đây, dưới cùng của content-wrapper -->
      <RelatedProductsSection :currentProduct="product" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import axios from "@/utils/axios";
import getFullFtpUrl from "@/utils/pathHelper";
import RelatedProductsSection from './RelatedProductsSection.vue';

const product = ref(null);
const productImages = ref([]);
const selectedImage = ref(null);
const route = useRoute();
const activeTab = ref("description"); // Mặc định hiển thị tab chi tiết sản phẩm
const linkCopied = ref(false);
const facebookAppId = ref("YOUR_FACEBOOK_APP_ID"); // Thay thế bằng App ID thực tế của bạn

// Computed property để kiểm tra xem có hình ảnh nào để hiển thị không
const hasImages = computed(() => {
  return (
    product.value && (product.value.fileFTP || productImages.value.length > 0)
  );
});

// Computed property cho structured data
const structuredData = computed(() => {
  if (!product.value) return null;
  
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.value.tenSP,
    "image": [
      selectedImage.value || product.value.fileFTP,
      ...productImages.value.map(img => getFullFtpUrl(img.linkHinhAnh))
    ],
    "description": product.value.mota || "",
    "brand": {
      "@type": "Brand",
      "name": product.value.thuongHieu || "VMD JSC"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "VND",
      "price": product.value.giaThamKhao || 0,
      "availability": "https://schema.org/InStock"
    }
  };
});


// Các hàm xử lý chia sẻ mạng xã hội
const getProductUrl = () => {
  return window.location.href.replace('vmdjsc.com','preview.vmdjsc.com');
};

const getProductTitle = () => {
  return product.value ? product.value.tenSP : "";
};

// Chia sẻ Facebook
const getFacebookShareUrl = () => {
  const url = encodeURIComponent(getProductUrl());
  const title = encodeURIComponent(getProductTitle());
  const description = encodeURIComponent(product.value?.mota || "");
  const image = encodeURIComponent(selectedImage.value || product.value?.fileFTP || "");
  
  return `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`;
};

// Chia sẻ Zalo
const getZaloShareUrl = () => {
  const url = encodeURIComponent(getProductUrl());
  const title = encodeURIComponent(getProductTitle());
  
  return `https://zalo.me/share?u=${url}&t=${title}`;
};

// Chia sẻ Messenger
const getMessengerShareUrl = () => {
  const url = encodeURIComponent(getProductUrl());
  const redirectUri = encodeURIComponent(getProductUrl());
  
  return `https://www.facebook.com/dialog/send?link=${url}&app_id=${facebookAppId.value}&redirect_uri=${redirectUri}`;
};

// Chia sẻ Viber
const getViberShareUrl = () => {
  const text = encodeURIComponent(getProductTitle() + " " + getProductUrl());
  
  return `viber://forward?text=${text}`;
};

// Sao chép link sản phẩm
const copyProductLink = () => {
  navigator.clipboard.writeText(getProductUrl()).then(() => {
    linkCopied.value = true;
    setTimeout(() => {
      linkCopied.value = false;
    }, 3000);
  });
};

// Tạo hàm cập nhật meta tags
const updateMetaTags = () => {
  if (!product.value) return;

  // Lấy đường dẫn đầy đủ của trang web
  const baseUrl = window.location.origin;
  const currentUrl = window.location.href;

  // Lấy thông tin sản phẩm
  const productName = product.value.tenSP || "";
  const productDescription = product.value.mota || "Chi tiết sản phẩm";
  const productImage = selectedImage.value || product.value.fileFTP || "";
  const productPrice = product.value.giaThamKhao ? 
    `${product.value.giaThamKhao.toLocaleString()}đ` : 
    "Liên hệ";
  const productBrand = product.value.thuongHieu || "VMD JSC";

  // Cập nhật title và meta description
  document.title = `${productName} - ${productBrand}`;
  
  // Tìm hoặc tạo meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', productDescription);

  // Xóa các meta OG cũ nếu có
  document
    .querySelectorAll('meta[property^="og:"], meta[name^="twitter:"], meta[property^="product:"]')
    .forEach((el) => el.remove());

  // Thêm meta tags mới
  const metaTags = [
    // Open Graph tags cơ bản
    { property: "og:title", content: productName },
    { property: "og:description", content: productDescription },
    { property: "og:image", content: productImage },
    { property: "og:image:alt", content: productName },
    { property: "og:url", content: currentUrl },
    { property: "og:type", content: "product" },
    { property: "og:site_name", content: "VMD JSC" },
    
    // Open Graph tags cho sản phẩm
    { property: "product:price:amount", content: product.value.giaThamKhao?.toString() || "" },
    { property: "product:price:currency", content: "VND" },
    { property: "product:brand", content: productBrand },
    { property: "product:availability", content: "in stock" },
    
    // Twitter Card tags
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: productName },
    { name: "twitter:description", content: productDescription },
    { name: "twitter:image", content: productImage },
    
    // Canonical URL
    { rel: "canonical", href: currentUrl, tag: "link" }
  ];

  // Thêm các meta tags vào head
  metaTags.forEach((tag) => {
    let meta;
    if (tag.tag === "link") {
      meta = document.createElement("link");
      meta.setAttribute("rel", tag.rel);
      meta.setAttribute("href", tag.href);
    } else {
      meta = document.createElement("meta");
      const key = Object.keys(tag).find((k) => k !== "content" && k !== "tag");
      meta.setAttribute(key, tag[key]);
      meta.setAttribute("content", tag.content);
    }
    document.head.appendChild(meta);
  });

  // Thêm JSON-LD structured data
  updateStructuredData();
};

// Thêm structured data vào head
const updateStructuredData = () => {
  // Xóa structured data cũ nếu có
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  if (!product.value) return;

  // Tạo script element mới
  const script = document.createElement('script');
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(structuredData.value);
  document.head.appendChild(script);
};

// Hàm tải dữ liệu sản phẩm
const fetchProductData = async (slug) => {
  try {
    // Reset state trước khi tải dữ liệu mới
    product.value = null;
    productImages.value = [];
    selectedImage.value = null;
    
    // Fetch product details
    const productRes = await axios.get(`/api/sanpham/${slug}`);

    // Kiểm tra và xử lý cấu trúc dữ liệu trả về từ API
    if (productRes.data) {
      let productData = null;

      // Kiểm tra xem dữ liệu trả về có cấu trúc { status: "OK", sanPham: {...} } hay không
      if (productRes.data.status === "OK" && productRes.data.sanPham) {
        productData = productRes.data.sanPham;
      } else {
        // Nếu không, giả sử dữ liệu trả về trực tiếp là sản phẩm
        productData = productRes.data;
      }
      
      console.log("Đã tải sản phẩm:", productData.tenSP);
      
      // Đảm bảo đường dẫn hình ảnh đầy đủ
      if (productData.fileFTP && !productData.fileFTP.startsWith("http")) {
        productData.fileFTP = getFullFtpUrl(productData.fileFTP);
      }

      product.value = productData;
      
      // Mặc định, hiển thị hình ảnh chính
      if (productData.fileFTP) {
        selectedImage.value = getFullFtpUrl(productData.fileFTP);
      }

      // Lấy ID sản phẩm từ dữ liệu trả về
      const productId = productData.id || productData.maSP;

      // Chỉ fetch hình ảnh phụ nếu có ID sản phẩm
      if (productId) {
        try {
          const imagesRes = await axios.get(
            `/api/HinhAnhSanPham/sanpham/${productId}`
          );
          if (
            imagesRes.data &&
            Array.isArray(imagesRes.data) &&
            imagesRes.data.length > 0
          ) {
            productImages.value = imagesRes.data;
          }
        } catch (imageErr) {
          console.error("Lỗi khi tải hình ảnh phụ:", imageErr);
        }
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
};

onMounted(() => {
  // Không cần gọi fetchProductData ở đây nữa vì đã có watch với immediate: true
  // Chỉ cần đảm bảo scroll lên đầu
  window.scrollTo(0, 0);
});

// Theo dõi thay đổi của selectedImage để cập nhật lại meta tag image
watch(selectedImage, () => {
  updateMetaTags();
});

watch(() => route.params.tensanpham, (newSlug, oldSlug) => {
  if (newSlug && newSlug !== oldSlug) {
    console.log("Slug thay đổi từ", oldSlug, "thành", newSlug);
    fetchProductData(newSlug);
  }
}, { immediate: true });

// Cleanup khi component unmount
onBeforeUnmount(() => {
  // Xóa structured data khi rời khỏi trang
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }
});
</script>

<style>
/* Styles for TinyMCE Content - IMPORTANT: This must be global, not scoped */
.tinymce-content {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  word-break: break-word;
}

/* Fix for bullet points - explicitly styling the list items */
.tinymce-content ul {
  list-style-type: disc !important;
  padding-left: 2em !important;
  margin: 1em 0 !important;
}

.tinymce-content ol {
  list-style-type: decimal !important;
  padding-left: 2em !important;
  margin: 1em 0 !important;
}

.tinymce-content ul li,
.tinymce-content ol li {
  display: list-item !important;
  margin-bottom: 0.5em !important;
}

/* Ensure proper nested lists */
.tinymce-content ul ul,
.tinymce-content ol ol,
.tinymce-content ul ol,
.tinymce-content ol ul {
  margin: 0.5em 0 !important;
}

.tinymce-content ul ul {
  list-style-type: circle !important;
}

.tinymce-content ul ul ul {
  list-style-type: square !important;
}

/* Fix for blockquotes */
.tinymce-content blockquote {
  border-left: 4px solid #3498db;
  padding: 0.8em 1.2em;
  margin: 1.2em 0;
  background-color: #f8f9fa;
  color: #455a64;
}

/* Fix for headings */
.tinymce-content h1,
.tinymce-content h2,
.tinymce-content h3,
.tinymce-content h4,
.tinymce-content h5,
.tinymce-content h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
  color: #2c3e50;
  line-height: 1.4;
}

/* Fix for images */
.tinymce-content img {
  max-width: 100%;
  height: auto;
  margin: 1em auto;
  display: block;
}

/* Fix for tables */
.tinymce-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 1.5em 0;
}

.tinymce-content table th,
.tinymce-content table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.tinymce-content table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #f5f7fa;
}
</style>

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
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 5px;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
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

/* Phần chia sẻ mạng xã hội */
.social-share {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.share-label {
  font-weight: 600;
  color: #555;
  margin-bottom: 10px;
}

.social-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.social-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 18px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.social-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
}

.social-button.facebook {
  background-color: #3b5998;
}

.social-button.zalo {
  background-color: #0068ff;
  font-weight: bold;
}

.social-button.messenger {
  background-color: #0084ff;
}

.social-button.viber {
  background-color: #7360f2;
}

.social-button.copy-link {
  background-color: #27ae60;
  border: none;
  cursor: pointer;
}

.zalo-icon {
  font-weight: bold;
  font-size: 20px;
}

.copy-notification {
  font-size: 14px;
  color: #27ae60;
  margin-top: 8px;
  display: inline-block;
}

/* Tabs styling */
.product-tabs {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
  overflow: hidden;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #eee;
}

.tab-button {
  padding: 15px 20px;
  background: transparent;
  border: none;
  font-size: 16px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.tab-button:hover {
  color: #3498db;
}

.tab-button.active {
  color: #3498db;
}

.tab-button.active:after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: #3498db;
}

.tabs-content {
  padding: 30px;
  background-color: #fff;
  border-radius: 0 0 12px 12px;
}

.tab-pane {
  line-height: 1.7;
  color: #555;
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  padding: 0.5em;
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

  .tabs-content {
    padding: 20px;
  }

  .tabs-header {
    flex-wrap: wrap;
  }

  .tab-button {
    padding: 12px 15px;
    font-size: 14px;
  }

  .main-image-container {
    height: 300px;
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

  .main-image-container {
    height: 250px;
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

  .social-button {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .tab-button {
    padding: 10px;
    font-size: 13px;
  }

  .tabs-content {
    padding: 15px;
  }
}
</style>
