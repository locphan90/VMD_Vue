<!-- ContentDisplay.vue -->
<template>
  <div class="content-container">
    <div v-if="loading" class="loading">
      <p>Đang tải dữ liệu...</p>
    </div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    <div v-else class="content-wrapper">
      <div class="content-header">
        <h1>{{ title }}</h1>
      </div>
      <div class="content-body tinymce-content" v-html="content"></div>
    </div>
    <Categories />
    <Products title="SẢN PHẨM NỔI BẬT" type="NOIBAT" />
  </div>
</template>

<script setup>
import Categories from "../components/Categories.vue";
import Products from "../components/Products.vue";
import { ref, watch, onMounted } from 'vue';
import axios from "/src/utils/axios";

// nhận props từ ngoài vào
const props = defineProps({
  category: {
    type: String,
    required: true
  }
});

// khai báo các biến reactive
const title = ref('');
const content = ref('');
const loading = ref(true);
const error = ref(null);

// Hàm xử lý nội dung từ TinyMCE trước khi hiển thị
function processContent(htmlContent) {
  if (!htmlContent) return '';
  
  // Đảm bảo các đường dẫn tương đối được xử lý đúng nếu cần
  // Xử lý các ký tự đặc biệt nếu cần
  let processedContent = htmlContent
    .replace(/&nbsp;/g, ' ');
    
  return processedContent;
}

// hàm lấy nội dung
async function fetchContent(category) {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(`/api/misc?cat=${category}`);
    const items = response.data; // API trả ra là mảng

    console.log('API trả về:', items);

    if (Array.isArray(items) && items.length > 0 && items[0].status === "OK") {
      const item = items[0]; // lấy phần tử đầu tiên
      title.value = item.val;
      // Xử lý nội dung trước khi gán vào content
      content.value = processContent(item.vaL3); // Nội dung TinyMCE
      
      // Cập nhật document.title với giá trị title mới
      document.title = `VMD - ${title.value}`;
    } else {
      error.value = "Không thể tải nội dung";
    }
  } catch (err) {
    error.value = "Đã xảy ra lỗi khi tải dữ liệu";
    console.error("Error fetching content:", err);
  } finally {
    loading.value = false;
  }
}

// theo dõi props.category để tự động fetch khi thay đổi
watch(
  () => props.category,
  (newCategory) => {
    if (newCategory) {
      fetchContent(newCategory);
    }
  },
  { immediate: true } // chạy luôn lần đầu
);

// Theo dõi sự thay đổi của title để cập nhật document.title
watch(
  () => title.value,
  (newTitle) => {
    if (newTitle) {
      document.title = `VMD - ${newTitle}`;
    }
  }
);

// Thiết lập mặc định cho document.title
onMounted(() => {
  document.title = "VMD - Đang tải...";
  // Nếu bạn có file CSS riêng cho TinyMCE, có thể load ở đây
  // Hoặc đã được import trong main.js/main.ts của ứng dụng
})
</script>

<style>
/* Sử dụng style không scoped để các quy tắc CSS 
   có thể áp dụng cho nội dung được render qua v-html */
.tinymce-content {
  /* Định dạng chung */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #333;
}

/* Định dạng cho hình ảnh */
.tinymce-content img {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
}

/* Định dạng cho bảng */
.tinymce-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 15px 0;
}

.tinymce-content table td,
.tinymce-content table th {
  border: 1px solid #ddd;
  padding: 8px;
}

.tinymce-content table th {
  background-color: #f2f2f2;
  text-align: left;
}

/* Định dạng cho danh sách */
.tinymce-content ul,
.tinymce-content ol {
  padding-left: 20px;
  margin: 10px 0;
}

/* Định dạng cho các phần tử văn bản */
.tinymce-content p {
  margin: 10px 0;
}

.tinymce-content h1,
.tinymce-content h2,
.tinymce-content h3,
.tinymce-content h4,
.tinymce-content h5,
.tinymce-content h6 {
  margin: 15px 0 10px 0;
  line-height: 1.3;
}

/* Định dạng cho các liên kết */
.tinymce-content a {
  color: #0066cc;
  text-decoration: underline;
}

.tinymce-content a:hover {
  color: #004080;
}

/* Định dạng cho các phần tử định dạng văn bản */
.tinymce-content strong, 
.tinymce-content b {
  font-weight: bold;
}

.tinymce-content em, 
.tinymce-content i {
  font-style: italic;
}

.tinymce-content blockquote {
  border-left: 3px solid #ccc;
  margin: 15px 0;
  padding: 5px 15px;
  color: #666;
}

/* Định dạng cho mã nguồn */
.tinymce-content pre,
.tinymce-content code {
  background-color: #f5f5f5;
  padding: 2px 5px;
  border-radius: 3px;
  font-family: monospace;
}
</style>

<style scoped>
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.content-header {
  /* margin-bottom: 10px; */
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 15px;
}

.content-header h1 {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.loading, .error {
  text-align: center;
  padding: 50px 0;
}

.error {
  color: #d9534f;
}
</style>