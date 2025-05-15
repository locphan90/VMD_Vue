<template>
  <div class="news-detail-container">
    <!-- Nút quay lại -->
    <div class="back-button" @click="goBack">
      <i class="arrow-left"></i> Quay lại
    </div>
    
    <!-- Loading indicator -->
    <div v-if="loading" class="loading">
      <p>Đang tải dữ liệu...</p>
    </div>
    
    <!-- Error message -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>
    
    <!-- News detail -->
    <div v-if="!loading && !error && newsItem" class="news-detail">
      <h1 class="news-title">{{ newsItem.tieuDe }}</h1>
      <div class="news-meta">
        <span class="news-date">{{ formatDate(newsItem.fstUpdate) }}</span>
      </div>
      
      <div class="news-image">
        <img :src="getImageUrl(newsItem.linkAnh)" :alt="newsItem.tieuDe" />
      </div>
      
      <div class="news-content tinymce-content" v-html="processContent(newsItem.noiDung)"></div>
    </div>
    
    <!-- Not found message -->
    <div v-if="!loading && !error && !newsItem" class="not-found">
      <p>Không tìm thấy bài viết</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from "/src/utils/axios";
import getFullFtpUrl from "/src/utils/pathHelper";


const route = useRoute()
const router = useRouter()

const newsItem = ref(null)
const loading = ref(true)
const error = ref(null)

const fetchNewsDetail = async () => {
  try {
    loading.value = true
    const id = route.params.id

    const response = await axios.get(`/api/ThongTinSuKien/${id}`)
    newsItem.value = response.data
  } catch (err) {
    error.value = 'Đã xảy ra lỗi khi tải chi tiết tin tức: ' + err.message
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const getImageUrl = (url) => {
  if (url && url.startsWith('ftp://')) {
    return getFullFtpUrl(url);
  }
  return url || '/placeholder-image.jpg'
}

// Hàm xử lý nội dung TinyMCE
const processContent = (content) => {
  if (!content) return '';
  
  // Thay thế các ký tự đặc biệt nếu cần
  let processedContent = content
    .replace(/&nbsp;/g, ' ');
  
  // Không cần replace \n bằng <br> nữa vì TinyMCE đã
  // lưu nội dung dưới dạng HTML với thẻ <p>, <br> đầy đủ
  
  return processedContent;
}

const goBack = () => {
  router.go(-1)
}

onMounted(() => {
  document.title = "TIN TỨC";
  fetchNewsDetail();
})
</script>


<style scoped>
.news-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', Arial, sans-serif;
}

.back-button {
  display: inline-flex;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
  color: #2196f3;
  font-weight: 500;
}

.arrow-left {
  border: solid #2196f3;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  margin-right: 8px;
  transform: rotate(135deg);
}

.loading, .error-message, .not-found {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.error-message {
  color: #d32f2f;
  background-color: #ffebee;
}

.not-found {
  color: #ff9800;
  background-color: #fff3e0;
}

.news-detail {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.news-title {
  margin: 20px 20px 10px;
  color: #333;
  font-size: 2rem;
  line-height: 1.3;
}

.news-meta {
  margin: 0 20px 20px;
  color: #999;
  font-size: 0.9rem;
}

.news-image {
  width: 100%;
  max-height: 500px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.news-content {
  padding: 30px 20px;
  color: #333;
  line-height: 1.8;
  font-size: 1.1rem;
}
</style>

<style>
/* Style không scoped để áp dụng cho nội dung TinyMCE */
.tinymce-content {
  /* Định dạng chung */
  font-family: 'Roboto', Arial, sans-serif;
  line-height: 1.8;
  color: #333;
  font-size: 1.1rem;
}

/* Định dạng cho hình ảnh */
.tinymce-content img {
  max-width: 100%;
  height: auto;
  margin: 15px 0;
  border-radius: 4px;
}

/* Định dạng cho bảng */
.tinymce-content table {
  border-collapse: collapse;
  width: 100%;
  margin: 20px 0;
}

.tinymce-content table td,
.tinymce-content table th {
  border: 1px solid #ddd;
  padding: 10px;
}

.tinymce-content table th {
  background-color: #f5f5f5;
  color: #333;
  font-weight: 600;
  text-align: left;
}

.tinymce-content table tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Định dạng cho danh sách */
.tinymce-content ul,
.tinymce-content ol {
  padding-left: 25px;
  margin: 15px 0;
}

.tinymce-content li {
  margin-bottom: 8px;
}

/* Định dạng cho các phần tử văn bản */
.tinymce-content p {
  margin: 16px 0;
}

.tinymce-content h1,
.tinymce-content h2,
.tinymce-content h3,
.tinymce-content h4,
.tinymce-content h5,
.tinymce-content h6 {
  margin: 25px 0 15px 0;
  line-height: 1.4;
  color: #333;
}

.tinymce-content h1 {
  font-size: 2rem;
}

.tinymce-content h2 {
  font-size: 1.75rem;
}

.tinymce-content h3 {
  font-size: 1.5rem;
}

.tinymce-content h4 {
  font-size: 1.25rem;
}

/* Định dạng cho các liên kết */
.tinymce-content a {
  color: #2196f3;
  text-decoration: none;
  border-bottom: 1px solid #2196f3;
  transition: color 0.3s, border-color 0.3s;
}

.tinymce-content a:hover {
  color: #0d47a1;
  border-color: #0d47a1;
}

/* Định dạng cho các phần tử định dạng văn bản */
.tinymce-content strong, 
.tinymce-content b {
  font-weight: 700;
}

.tinymce-content em, 
.tinymce-content i {
  font-style: italic;
}

.tinymce-content blockquote {
  border-left: 4px solid #2196f3;
  margin: 20px 0;
  padding: 10px 20px;
  background-color: #e3f2fd;
  color: #555;
  font-style: italic;
}

/* Định dạng cho mã nguồn */
.tinymce-content pre,
.tinymce-content code {
  background-color: #f5f5f5;
  padding: 3px 6px;
  border-radius: 3px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.9em;
  color: #e91e63;
}

.tinymce-content pre {
  padding: 15px;
  overflow-x: auto;
  margin: 20px 0;
}

/* Định dạng cho các đường kẻ ngang */
.tinymce-content hr {
  border: 0;
  height: 1px;
  background-color: #eee;
  margin: 30px 0;
}

/* Đảm bảo các đoạn video nhúng hiển thị đúng */
.tinymce-content iframe {
  max-width: 100%;
  border: none;
  margin: 20px 0;
}

/* Canh chỉnh ảnh */
.tinymce-content img.align-left {
  float: left;
  margin-right: 20px;
  margin-bottom: 10px;
}

.tinymce-content img.align-right {
  float: right;
  margin-left: 20px;
  margin-bottom: 10px;
}

.tinymce-content img.align-center {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

/* Xử lý clearfix cho floating elements */
.tinymce-content:after {
  content: "";
  display: table;
  clear: both;
}
</style>