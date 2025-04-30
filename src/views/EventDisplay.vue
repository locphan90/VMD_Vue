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
      
      <div class="news-content">
        <p v-html="formatContent(newsItem.noiDung)"></p>
      </div>
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

const formatContent = (content) => {
  return content ? content.replace(/\n/g, '<br>') : ''
}

const goBack = () => {
  router.go(-1)
}

onMounted(fetchNewsDetail)
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