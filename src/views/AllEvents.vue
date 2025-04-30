<template>
  <div class="news-container">
    <h1 class="news-header">Tin Tức Mới Nhất</h1>

    <!-- Loading indicator -->
    <div v-if="loading" class="loading">
      <p>Đang tải dữ liệu...</p>
    </div>

    <!-- Error message -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <!-- News list -->
    <div v-if="!loading && !error" class="news-list">
      <div
        v-for="item in newsItems"
        :key="item.id"
        class="news-item"
        @click="goToDetail(item.id)"
      >
        <div class="news-image">
          <img :src="getImageUrl(item.linkAnh)" :alt="item.tieuDe" />
        </div>
        <div class="news-content">
          <h2 class="news-title">{{ item.tieuDe }}</h2>
          <p class="news-description" v-html="truncateContent(item.noiDung)"></p>
          <div class="news-meta">
            <span class="news-date">{{ formatDate(item.fstUpdate) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "/src/utils/axios";
import getFullFtpUrl from "/src/utils/pathHelper";

const newsItems = ref([]);
const loading = ref(true);
const error = ref(null);
const router = useRouter();

const fetchNews = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/ThongTinSuKien')
    const data = response.data

    // Lọc status = 'OK' và sort theo ngày mới nhất
    newsItems.value = (Array.isArray(data) ? data : [data])
      .filter(item => item.status === 'OK')
      .sort((a, b) => new Date(b.fstUpdate) - new Date(a.fstUpdate))
  } catch (err) {
    error.value = 'Đã xảy ra lỗi khi tải tin tức: ' + err.message
  } finally {
    loading.value = false
  }
}

const truncateContent = (content) => {
  if (content && content.length > 200) {
    return content.substring(0, 200) + "...";
  }
  return content;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getImageUrl = (url) => {
  if (url && url.startsWith("ftp://")) {
    return getFullFtpUrl(url);
  }
  return url || "/placeholder-image.jpg";
};

const goToDetail = (id) => {
  router.push(`/news/${id}`);
};

onMounted(fetchNews);
</script>


<style scoped>
.news-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Roboto", Arial, sans-serif;
}

.news-header {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 2rem;
}

.loading,
.error-message {
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

.news-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news-item {
  display: flex;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.news-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.news-image {
  flex: 0 0 25%;
  max-height: 200px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-content {
  flex: 1;
  padding: 15px;
}

.news-title {
  margin-top: 0;
  margin-bottom: 10px;
  color: #333;
  font-size: 1.5rem;
}

.news-description {
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
}

.news-meta {
  display: flex;
  justify-content: flex-end;
  color: #999;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .news-item {
    flex-direction: column;
  }

  .news-image {
    flex: 0 0 200px;
    max-height: none;
  }
}
</style>