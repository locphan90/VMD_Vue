<template>
  <div class="news-detail" v-if="news">
    <h1 class="news-title">{{ news.tieuDe }}</h1>
    <div class="news-content" v-html="news.noiDung"></div>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  name: "NewsDetail",
  data() {
    return {
      news: null,
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    try {
      const res = await axios.get(`/api/THONGTINSUKIEN/${id}`);
      if (res.data && res.data.status === "OK") {
        this.news = res.data;
      }
    } catch (err) {
      console.error("Lỗi khi tải chi tiết sự kiện:", err);
    }
  },
};
</script>

<style scoped>
.news-detail {
  max-width: 1200px;
  margin: 40px auto;
  padding: 135px 15px 40px; /* 👈 Thêm padding-top = chiều cao header */
  scroll-margin-top: 135px;
}

.news-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

.news-content {
  font-size: 16px;
  line-height: 1.8;
  color: #444;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Responsive */
@media (max-width: 768px) {
  .news-title {
    font-size: 22px;
  }

  .news-content {
    font-size: 15px;
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .news-title {
    font-size: 20px;
  }

  .news-content {
    font-size: 14px;
    padding: 12px;
  }
}

</style>
