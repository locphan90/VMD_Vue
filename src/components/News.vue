// News.vue
<template>
  <section class="news">
    <h2 class="section-title">THÔNG TIN & SỰ KIỆN</h2>
    <div class="news-grid">
      <div class="news-card" v-for="(item, index) in newsItems" :key="index">
        <div class="news-image">
          <img :src="item.image" :alt="item.title">
        </div>
        <div class="news-content">
          <h3 class="news-title">{{ item.title }}</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'News',
  data() {
    return {
      newsItems: [
        {
          title: 'Khai trương cửa hàng tại Thủ Đức',
          image: '/api/placeholder/280/150'
        },
        {
          title: 'Ký kết hợp tác phân phối với công ty ABC Miền Trung',
          image: '/api/placeholder/280/150'
        },
        {
          title: 'Chương trình khuyến mãi ra mắt sản phẩm',
          image: '/api/placeholder/280/150'
        },
        {
          title: 'Đại hội nhà phân phối toàn quốc năm 2025',
          image: '/api/placeholder/280/150'
        }
      ]
    }
  }
}
</script>

<style scoped>
.news {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 15px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.news-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.news-image {
  height: 150px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-content {
  padding: 15px;
  flex-grow: 1;
}

.news-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .news-grid {
    grid-template-columns: 1fr;
  }
}
</style>